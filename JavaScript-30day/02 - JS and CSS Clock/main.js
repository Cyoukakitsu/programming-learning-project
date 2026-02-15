// 获取三根指针
const secondHand = document.querySelector(".second-hand");
const minHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");

// 获取当前时间
function setDate() {
  //获取当前时间
  const now = new Date();
  const seconds = now.getSeconds();
  const mins = now.getMinutes();
  const hour = now.getHours();

  //计算指针对应角度
  //秒针转一圈60秒
  const secondDegrees = (seconds / 60) * 360;
  //分钟转一圈60分钟
  const minsDegrees = (mins / 60) * 360 + (seconds / 60 / 60) * 360;
  //时针转一圈12小时
  const hourDegrees =
    (hour / 12) * 360 + (mins / 60 / 12) * 360 + (seconds / 60 / 60 / 12) * 360;

  //将计算好的角度，赋值给对应的针
  secondHand.style.transform = ` rotate(${secondDegrees + 180}deg)`;
  minHand.style.transform = ` rotate(${minsDegrees + 180}deg)`;
  hourHand.style.transform = ` rotate(${hourDegrees + 180}deg)`;
}

setInterval(setDate, 1000);
setDate();
