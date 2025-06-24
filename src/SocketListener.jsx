import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from './socket';
import { addDonation, updateDonation , deleteStaleDonationsByIds} from '../store/donationSlice.js';

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


    return () => {
      socket.off("donationAdded");
      socket.off("donationUpdated");
      socket.off("donationDeleted");
    };
  }, [dispatch]);

  return null;    
// return null; is used because SocketListener doesn’t render anything — it's only there to set up socket listeners.

};

export default SocketListener;
