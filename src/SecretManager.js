export const retrieveLinklyData = (key) => {
  let data = localStorage.getItem(key);
  if (data) {
    console.log("data, key :>> ", data, key);
    return JSON.parse(data);
  } else return null;
};

export const storeLinklyData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
