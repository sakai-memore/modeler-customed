// fetch file data
export const fetchData = async (url) => {
  return fetch(url).then(response => response.text());
}
