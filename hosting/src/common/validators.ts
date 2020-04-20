const checked = (value: any, options: any): string | void => { // eslint-disable-line
  if (value !== true) {
    return options.message || 'must be checked';
  }
};

export default {
  checked,
};
