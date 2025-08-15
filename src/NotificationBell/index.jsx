import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setNotifications,
  markAllAsRead,
} from '../../store/notificationSlice.js';
import './style.css';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown and mark all as read
  const toggleDropdown = async () => {
    setOpen(!open);
    if (!open) {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/mark-read/${userId}`);
      dispatch(markAllAsRead());
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications from DB on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${userId}`).then((res) => {
      dispatch(setNotifications(res.data));
    });
  }, [dispatch, userId]);

  return (
    <div className="notification-bell-wrapper" ref={dropdownRef}>
      <button className="notification-bell" onClick={toggleDropdown}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <span className="unread-count">{unreadCount} Unread</span>}
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n._id} className="notification-item">
                  {n.message}
                </div>
              ))
            ) : (
              <div className="empty-notifications">No notifications yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

