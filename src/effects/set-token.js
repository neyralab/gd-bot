export default function (token) {
  localStorage.setItem("token", token);
}

export const getToken = () => {
  return localStorage.getItem("token");
};
