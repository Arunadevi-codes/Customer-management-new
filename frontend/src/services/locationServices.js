export const fetchStates = async () => {
  const res = await fetch("http://localhost:5000/api/states");
  return res.json();
};

export const fetchCities = async (stateId) => {
  const res = await fetch(`http://localhost:5000/api/cities?stateId=${stateId}`);
  return res.json();
};