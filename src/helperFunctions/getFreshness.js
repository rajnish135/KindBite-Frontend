  export const getFreshness = (createdAt) => {

    const now = new Date();
    const donatedTime = new Date(createdAt);
    const diffHours = Math.floor((now - donatedTime) / (1000 * 60 * 60));

    if (diffHours < 1) 
    return '🟢 Fresh (less than 1 hour ago)';

    if (diffHours < 24) 
    return '🟡 A few hours old';
  
    return '🔴 Might be stale';
    
  }