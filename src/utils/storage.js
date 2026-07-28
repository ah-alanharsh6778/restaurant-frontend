const TOKEN_KEY = 'restaurantos_token';
const REFRESH_TOKEN_KEY = 'restaurantos_refresh_token';
const USER_KEY = 'restaurantos_user';

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null' || token === '') {
    return null;
  }
  return token;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null' || token === '') {
    return null;
  }
  return token;
};

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem('token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  try {
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
