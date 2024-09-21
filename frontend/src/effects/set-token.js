export const getToken = async () => {
  return await localStorage.getItem('token');
};
export const setToken = async (token) => {
  localStorage.setItem('token', token);
};
