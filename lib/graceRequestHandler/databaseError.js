module.exports = (options) => {
  // const err = options.error;
  // const response = options.response;
  const result = options.result;
  // const infos = options.infos;
  // const attempt = options.attempt;

  if (result && result.code === 10011) {
    return result.error_description;
  }
};
