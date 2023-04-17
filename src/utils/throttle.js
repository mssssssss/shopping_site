// 让事件在一段时间内只执行一次
// 默认设置为3000ms
export default function throttle(func, delay = 3000) {
  var lastTime = 0; // 事件上次触发的时间
  return function () {
    // 如果间隔时间大于delay
    var nowTime = Date.now();
    if (nowTime - lastTime > delay) {
      // 修改this指向
      func.apply(this, arguments); // 也可以直接执行fn()就好了
      // 更新lastTime
      lastTime = nowTime;
    }
  };
}
