export const retrieveLinklyData = (params) => {
  let linklyData = localStorage.getItem("linklydata");
  if (linklyData) {
    return JSON.parse(linklyData);
  } else return null;
};

export const storeLinklyData = (linklyData) => {
  localStorage.setItem("linklydata", JSON.stringify(linklyData));
};
