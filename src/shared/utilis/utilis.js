export const conditionalObject = (condition, obj) => {
    return condition ? obj : {};
};

export const  capitalize = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  }