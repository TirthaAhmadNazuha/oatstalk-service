const TryWarper = (func, ...args) => {
  try {
    return func(...args);
  } catch (error) {
    console.log('[TryWarper]:ERROR = ', error);
  }
};

export default TryWarper;
