function Test() {
  console.log('Test234');
}

Test.prototype.isObject = function () {
  console.log('isObject');
};

Test.prototype.isNumber = function () {
  console.log('isNumber');
};

module.exports = Test;
