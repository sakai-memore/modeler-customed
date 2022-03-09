export const loadState = (id) => {
  try {
    const serializedState = sessionStorage.getItem(id);
    return JSON.parse(serializedState);
  } catch(err) {
    return undefined;
  }
};

export const saveState = (id, state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem(id, serializedState);
  } catch(err) {
    //ignore
  }
};
