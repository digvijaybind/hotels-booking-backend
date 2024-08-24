const mobileRegex = /^\+?[1-9]\d{1,14}$/;

const isValidMobileNumber = (text) => {
  // Ensure text is a string
  if (typeof text !== "string") {
    return false;
  }
  return mobileRegex.test(text);
};

module.exports = { isValidMobileNumber };

