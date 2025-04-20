// check name name must be contain only a-z and A-Z , no number , special character
export const checkName = (name) => {
    const regex = /^[A-Za-z ]+$/;
    return regex.test(name.trim());
  };
  