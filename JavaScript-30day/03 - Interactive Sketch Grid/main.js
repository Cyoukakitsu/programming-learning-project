const container = document.querySelector("#container");
const resizeBtn = document.querySelector("#resizeBtn");
const containerSize = 960; //设定容器的大小（960像素），固定画布尺寸。
let gridSize = 16; //初始格子数量，16×16 的网格。

const darknessMap = new WeakMap(); //创建一个 WeakMap，保存每个格子的“暗度”数值（用于渐变效果)
const colorMap = new WeakMap(); //创建一个 WeakMap，保存每个格子的基础随机颜色（RGB数组）。

function createGrid(size) {
  container.innerHTML = ""; //清空容器内已有内容（删除旧的格子）
  const squareSize = containerSize / size; //计算每个格子的宽高（容器大小除以格子数），保证总尺寸不变。

  for (let i = 0; i < size * size; i++) {
    //循环创建每个格子，共 size×size 个。
    const square = document.createElement("div"); //创建一个新的 <div> 元素，作为单个格子。
    square.classList.add("square"); //给这个格子加上 square 类，用于样式控制。
    square.style.width = squareSize + "px"; // ⑬
    square.style.height = squareSize + "px"; // ⑭

    square.style.backgroundColor = "rgb(255,255,255)"; //初始背景色设为白色。
    darknessMap.set(square, 0); //初始化该格子的暗度为 0（完全亮）
    colorMap.set(square, null); //初始化该格子的基础颜色为 null（还没随机颜色）

    square.addEventListener("mouseenter", () => {
      //当鼠标进入格子时触发事件。
      if (!colorMap.get(square)) {
        //如果该格子还没颜色，生成随机颜色
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colorMap.set(square, [r, g, b]); //保存这个格子的随机颜色。
      }

      const [r, g, b] = colorMap.get(square); //取出格子的基础颜色
      let darkness = darknessMap.get(square); //取出当前格子的暗度
      if (darkness < 10) darkness++; //暗度最多加到 10（最多10次变黑）
      darknessMap.set(square, darkness); //更新暗度值

      const factor = 1 - 0.1 * darkness; //计算颜色变暗比例，暗度越大，颜色越深。
      const newR = Math.floor(r * factor); //计算变暗后的红色值。
      const newG = Math.floor(g * factor); //计算变暗后的绿色值。
      const newB = Math.floor(b * factor); //计算变暗后的蓝色值。

      square.style.backgroundColor = `rgb(${newR},${newG},${newB})`; // 更新格子的背景颜色。
    });

    container.appendChild(square); //把格子添加进容器里，显示在页面上
  }
}

createGrid(gridSize); //页面加载时，先生成默认大小的网格（16×16）。

resizeBtn.addEventListener("click", () => {
  // ㉟
  let userInput = prompt(
    "新しいグリッドの正方形の数を入力してください(最大100):",
    gridSize
  ); // 弹出提示，要求用户输入新格子数量
  if (userInput === null) return; //如果用户点击取消，直接返回，不改变网格。
  userInput = parseInt(userInput); //把输入的字符串转成整数。
  if (isNaN(userInput) || userInput < 1) {
    // ㊴
    alert("1以上の数字を入力してください。"); // ㊵
    return; // ㊶
  }
  if (userInput > 100) {
    // ㊷
    alert("最大は100までです。"); // ㊸
    return; // ㊹
  }
  gridSize = userInput; //把合法输入赋值给 gridSize
  createGrid(gridSize); //重新生成新的格子网格。
});
