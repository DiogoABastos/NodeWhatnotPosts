module.exports = {
  truncate: function (str, len) {
    if (str.length > len) {
      return str.substr(0, len) + '...';
    } else {
      return str;
    }
  }
}
