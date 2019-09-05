const cghUtils = {
  isEmpty: v => {
    if (typeof v === "string") {
      return v.trim() === "";
    } else if (typeof v === "number") {
      return isNaN(v);
    } else {
      return v === null || v === undefined;
    }
  }
};

module.exports = cghUtils;
