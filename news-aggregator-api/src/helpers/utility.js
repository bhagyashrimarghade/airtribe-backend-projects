const constructUrl = (obj) => {
  let keys = Object.keys(obj);
  let str = "";
  keys.forEach((key) => {
    if (str != "") {
      str += "&";
    }
    if (!Array.isArray(obj[key])) {
      str += key + "=" + encodeURIComponent(obj[key]);
    } else {
      obj[key].forEach((element) => {
        str += key + "=" + encodeURIComponent(element);
        if (element !== obj[key][obj[key].length - 1]) str += "&";
      });
    }
  });
  return str;
};

const map = new Map();

module.exports = { constructUrl, map };
