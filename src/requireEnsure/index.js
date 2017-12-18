const p = document.querySelector('.p');
const btn = document.querySelector('.btn');

btn.addEventListener('click', function() {
  // 只有触发事件才回家再对应的js 也就是异步加载
  require.ensure([], function() {
    const data = require('./business');
    p.innerHTML = data;
  });
});

const btn2 = document.querySelector('.btn2');

btn2.addEventListener('click', function() {
  // 只有触发事件才回家再对应的js 也就是异步加载
  require.ensure([], function() {
    const data = require('./business2');
    p.innerHTML = data;
  });
});
