export const getFreshness = (expiryAt) => {
  const now = new Date();
  const expiryDate = new Date(expiryAt); 
  
  return now < expiryDate ? '🟢 Fresh' : '🔴 Stale';

};
