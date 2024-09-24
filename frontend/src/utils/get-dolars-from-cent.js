export const getDollarsFromCent = (cent) => {
  return cent ? Math.round(Number(cent) * 100) : "";
};
