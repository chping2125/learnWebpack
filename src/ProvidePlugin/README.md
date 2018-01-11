# externals 配置

## webpack 配置
```js
new webpack.ProvidePlugin({
  utils: 'utilsTest'
})
```
utilsTest 文件是我手动写的，模拟一个包，因为打包一个其他工具包，不利用看代码结构

## index.js
```js
import file from './business'; // business 没有特殊含义，就是模拟业务中使用
import file2 from './business2'; // business 没有特殊含义，就是模拟业务中使用

console.log('入口文件');
file();
file2();
```

## business.js
```js
export default function fileJS() {
  const a = new utils();
  console.log('我是 ProvidePlugin 测试:', a.isObject());
}

```

## business2.js
这个不引用，用于对比
```js
export default function fileJS() {
  const a = 123;
  console.log('我是 ProvidePlugin 测试:', a);
}

```

## 分析
此时执行打包命令 `npm run providePlugin`，打包成功看看打包出来的内容

### 打包后文件
```js
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["moment"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("moment")) : factory(root["moment"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
  // ....(省略)
})
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _business = __webpack_require__(1);

var _business2 = _interopRequireDefault(_business);

var _business3 = __webpack_require__(3);

var _business4 = _interopRequireDefault(_business3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('入口文件');
(0, _business2.default)();
(0, _business4.default)();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fileJS;
function fileJS() {
  var a = new utils();
  console.log('我是 ProvidePlugin 测试:', a.isObject());
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function Test() {
  console.log('Test');
}

Test.prototype.isObject = function () {
  console.log('isObject');
};

Test.prototype.isNumber = function () {
  console.log('isNumber');
};

module.exports = Test;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fileJS;
function fileJS() {
  var a = 123;
  console.log('我是 ProvidePlugin 测试:', a);
}

/***/ })
/******/ ]);
});
```

我们发现，打包出来的文件中，`business.js` 中多了点东西：
> 我们的 `business.js` 文件相比较正常的打包，被封装了一层 IIFE ，然后手动将我们的 `utilsTest` 当做参数传了进去，这样就巧妙的实现了，给每个引用 `utils` 的文件里面传入 `utilsTest`。
