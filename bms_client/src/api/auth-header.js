export const authHeader = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token) {
    return { 
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
  } else if (user && user.accessToken) {
    return { 
      'Authorization': 'Bearer ' + user.accessToken,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
};