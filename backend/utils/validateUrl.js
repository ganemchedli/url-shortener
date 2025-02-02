import validator from "validator";

// Utility function to validate URLs
const isValidUrl = (url) => {
  return validator.isURL(url, { require_protocol: false });
};

export default isValidUrl;
