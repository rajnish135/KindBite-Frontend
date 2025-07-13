import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { socket } from './socket';
import { addDonation, updateDonation , deleteStaleDonationsByIds} from '../store/donationSlice.js';
import {addNotification} from '../store/notificationSlice.js';

const SocketListener = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    socket.on("donationAdded", (newDonation) => {
      console.log("Received donationAdded socket:", newDonation);
      dispatch(addDonation(newDonation));
    });

    socket.on("donationUpdated", (updatedDonation) => {
      console.log("Received donationUpdated socket:", updatedDonation);
      dispatch(updateDonation(updatedDonation));
    });

    socket.on("donationDeleted", (deletedIds) => {
    console.log("Deleted Donations Received:", deletedIds);
    dispatch(deleteStaleDonationsByIds(deletedIds));
    });

         //Handle real-time suspension
    socket.on("suspend-user", (data) => {
      console.log("Received suspend-user event:", data);

      if (data.suspended) {
        alert("⚠️ Your account has been suspended. Logging out...");
        localStorage.removeItem("token"); // or remove cookie if you're using cookies
        document.cookie = 'token=; Max-Age=0;'; 
        window.location.href = "/login"; // redirect to login
      }
    });


    socket.on("new_notification", (notification) => {
      dispatch(addNotification(notification));
    });



    return () => {
      socket.off("donationAdded");
      socket.off("donationUpdated");
      socket.off("donationDeleted");
      socket.off("suspend-user");
      socket.off("new_notification");
    };
  }, [dispatch]);

  return null;    
// return null; is used because SocketListener doesn’t render anything — it's only there to set up socket listeners.

};

export default SocketListener;
