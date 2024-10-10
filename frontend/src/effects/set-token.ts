export const getToken = async () => {
  return await localStorage.getItem('token');
};
export const setToken = async (token: string) => {
  localStorage.setItem('token', token);
};
