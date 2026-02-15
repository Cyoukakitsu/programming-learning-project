(function () {
  const list = document.querySelector(".list");

  // 1. 克隆第一个元素到末尾（保持无缝循环）
  list.appendChild(list.firstElementChild.cloneNode(true));

  let curIndex = 0; // 当前展示的项索引
  const duration = 2000; // 每次滚动停留的间隔时间（毫秒）
  const animTime = 500; // 每次滚动动画的时长（毫秒）
  const itemHeight = list.firstElementChild.offsetHeight; // 自动获取每一项的高度

  // 2. 定义滚动到下一项的函数
  function moveNext() {
    const from = curIndex * itemHeight; // 起始位置
    curIndex++;
    const to = curIndex * itemHeight; // 目标位置

    let start = null; // 记录动画开始的时间戳

    // 3. 定义动画函数
    function animate(timestamp) {
      if (!start) start = timestamp; // 第一次调用时，保存开始时间
      const progress = Math.min((timestamp - start) / animTime, 1);
      // progress ∈ [0,1]，表示动画进度

      list.scrollTop = from + (to - from) * progress;
      // 根据进度计算当前位置

      if (progress < 1) {
        requestAnimationFrame(animate);
        // 动画还没结束 → 下一帧继续执行
      } else {
        // 动画结束时
        if (curIndex === list.children.length - 1) {
          list.scrollTop = 0; // 瞬间回到开头
          curIndex = 0; // 重置索引
        }
      }
    }

    requestAnimationFrame(animate); // 启动动画
  }

  // 4. 每隔 duration 毫秒执行一次 moveNext
  setInterval(moveNext, duration);
})();
