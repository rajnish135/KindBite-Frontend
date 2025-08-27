export const getFreshness = (expiryAt) => {
  const now = new Date();
  const expiryDate = new Date(expiryAt); // <- ensures it's a Date object
  
  return now < expiryDate ? '🟢 Fresh' : '🔴 Stale';

};
