# externals 配置

## webpack 配置
```js
externals: {
  moment: 'moment'
}
```

## index.js
```js
import file from './business'; // business 没有特殊含义，就是模拟业务中使用

file();
```

## business.js
```js
import moment from 'moment';

export default function jqFileJS() {
  console.log('我是 externals 测试:', moment());
}
```

## 分析
此时执行打包命令 `npm run externals`，打包成功看看打包出来的内容

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _business2.default)();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jqFileJS;

var _moment = __webpack_require__(2);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jqFileJS() {
  console.log('我是 jq js 测试:', (0, _moment2.default)());
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
```

我们发现，打包出来的文件中，多了点东西：
  1. 模块处理地方多了对 moment 的引用
  2. 多了一个模块 2

### 模块处理地方多了对 moment 的引用
```js
if(typeof exports === 'object' && typeof module === 'object')
  module.exports = factory(require("moment"));
else if(typeof define === 'function' && define.amd)
  define(["moment"], factory);
else {
  var a = typeof exports === 'object' ? factory(require("moment")) : factory(root["moment"]);
  for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
}
```

由此我们可以知道，通过 externals 配置之后，webpack 将这个配置的 moment 通过模块初始化的时候传进去（比如：浏览器环境下，直接将window.moment 传递进去。这也就是为什么要需要在 index.html 中通过 script 引入 moment的原因了），然后内部再做处理；

看到这里，同时引入了一个新问题，其中模块打包中的引入的名称，如：commonjs2 的`require("moment")`、AMD 的 `define(["moment"], factory)`、commonjs的`require("moment")`或者直接全局`root["moment"]` 这些当中的 moment 应该解释对应的 externals 对象配置中的 `commonjs2`、`amd`、`root`, `commonjs`吧，那我们将 webpack 配置改一下，试试：
```js
// 配置没有意义，只是为了测试
externals: {
  moment: {
    root: 'root',
    amd: 'amd',
    commonjs: 'commonjs',
    commonjs2: 'commonjs2'
  }
},
```

然后打包，看看输出
```js
if(typeof exports === 'object' && typeof module === 'object')
  module.exports = factory(require("commonjs2"));
else if(typeof define === 'function' && define.amd)
  define(["amd"], factory);
else {
  var a = typeof exports === 'object' ? factory(require("commonjs")) : factory(root["root"]);
  for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
}
```
果然如此（不用解释了）。

### 多了一个模块 2
```js
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
```
多的这一部分，我们发现，就是讲 1 中传进来的 moment 赋值给一个 webpack 内部的新模块了。然后依赖 moment 的地方在 webpack 内部进行引用这个内部 moment 新模块。


## 彩蛋
在测试打包过程中，发现了一个新问题，在 1 中 “模块处理地方多了对 moment 的引用” 多了的引用时什么条件放进去的呢？

最初认为是在 webpack 中配置的 externals 项就会加入引用，但是我在刚开始打包过程中，当发现代码中忘记添加 ‘import moment from 'moment';’引用时（即没有显示引用时），不会添加 moment 的引用，反之则有，就怀疑 webpack 中 externals 配置项并不是导致 “模块处理地方多了对 moment 的引用” 的唯一条件。

于是创建了 `business.js`, 然后经过测试发现，确实是这样（这种东西感觉应该去看源码，因为还没有看过 webpack 的源码，目前只能这样测试，但结论不一定完全正确）。
