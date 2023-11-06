// 单六边形实例集合
let graphicalList = [];
// 缩放比例
let scalePub = 1;

let backgroundColor;
let targetBackgroundColor;
let transitionDuration = 3000; // 过渡时间（以毫秒为单位）
let startTime;

class Graphical {
  constructor(x = 0, y = 0) {
    this.W = 250;
    this.H = 290;
    this.x = x;
    this.y = y;
    this.color = {};
    this.frameOffset = random(100); // 随机帧偏移量
  }
  // 深
  getPart1Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50));
    }
    return this.color[index];
  }
  // 浅
  getPart2Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 12, random(80, 90));
    }
    return this.color[index];
  }
  // 深、高饱和
  getPart3Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50));
    }
    return this.color[index];
  }

  // 绘制中心区域深色最小圆组合
  createdCenterMiniEllipseGroup() {
    for (let i = 0; i < 9; i++) {
      fill(this.getPart2Color(i + 4));
      ellipse(0, 0, 140 - i * 10, 140 - i * 10);
    }
  }
  // 绘制中心区域浅色小圆组合
  createdCenterSmallEllipseGroup() {
    fill(this.getPart1Color(1));
    ellipse(0, 0, 54, 54);
    fill(this.getPart1Color(2));
    ellipse(0, 0, 36, 36);
    fill(this.getPart1Color(3));
    ellipse(0, 0, 24, 24);
  }
  // 绘制中心区域中等深色圆组合
  createdCnterMediumGroup() {
    fill(0, 0, 100);
    ellipse(0, 0, 240, 240);
    push();
    stroke(this.getPart3Color(13));
    strokeWeight(5);
    beginShape(POINTS);
    let rotation = (frameCount + this.frameOffset) * 0.05; // 使用帧偏移量
    rotate(rotation);
    for (let a = 0; a < 360; a += 10) {
      for (let b = 5; b > 0; b--) {
        let angle = radians(a);
        let radius = 124 - b * 10;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
  
        // 添加定时放大缩小的效果
        let scaleFactor = 0.8 + 0.2 * sin((frameCount + this.frameOffset) * 0.05); // 使用帧偏移量
        x *= scaleFactor;
        y *= scaleFactor;
  
        vertex(x, y);
      }
    }
    endShape();
    pop();
  }

  // 绘制最外面六边形顶点与边线
  createdVertex() {
    let vertexPoints = {
      top: {},
      topLeft: {},
      bottomLeft: {},
      bottom: {},
      bottomRight: {},
      topRight: {},
    };
    (vertexPoints.top.x = 0), (vertexPoints.top.y = -this.H / 2);
    (vertexPoints.bottom.x = 0), (vertexPoints.bottom.y = this.H / 2);
    (vertexPoints.topLeft.x = -this.W / 2),
      (vertexPoints.topLeft.y = -this.H / 2 + 71);
    (vertexPoints.topRight.x = this.W / 2),
      (vertexPoints.topRight.y = -this.H / 2 + 71);
    (vertexPoints.bottomLeft.x = -this.W / 2),
      (vertexPoints.bottomLeft.y = this.H / 2 - 71);
    (vertexPoints.bottomRight.x = this.W / 2),
      (vertexPoints.bottomRight.y = this.H / 2 - 71);
    strokeWeight(4);
    stroke(27, 80, 91);
    noFill();
    beginShape();
    Object.values(vertexPoints).forEach(({ x, y }) => {
      vertex(x, y);
      push();
      noStroke();
      fill(256, 87, 52);
      ellipse(x, y, 28, 28);
      fill(0, 74, 70);
      ellipse(x, y, 18, 18);
      fill(227, 62, 26);
      ellipse(x, y, 12, 12);
      pop();
    });
    endShape(CLOSE);
    Object.values(vertexPoints).forEach(({ x, y }) => {
      push();
      noStroke();
      fill(256, 87, 52);
      ellipse(x, y, 28, 28);
      fill(0, 74, 70);
      ellipse(x, y, 18, 18);
      fill(227, 62, 26);
      ellipse(x, y, 12, 12);
      pop();
    });
  }
  display() {
    push();
    translate(this.x + this.W / 2 + 28, this.y + this.H / 2 + 28 + 11);
    noStroke();
    this.createdCnterMediumGroup();
    this.createdCenterMiniEllipseGroup();
    this.createdCenterSmallEllipseGroup();
    this.createdVertex();
    pop();
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  updateGraphicalList();

  // 初始化背景颜色
  backgroundColor = color(random(360), 90, random(20, 50));
  targetBackgroundColor = color(random(360), 90, random(20, 50));
  startTime = millis();
}

function draw() {
  scale(scalePub);
  // 计算过渡进度
  let currentTime = millis();
  let elapsedTime = currentTime - startTime;
  let progress = constrain(elapsedTime / transitionDuration, 0, 1);

  // 使用 lerpColor 获取平滑过渡的颜色
  let currentBackgroundColor = lerpColor(
    backgroundColor,
    targetBackgroundColor,
    progress
  );

  background(currentBackgroundColor);
  // 渲染所有六边形
  graphicalList.forEach((item) => {
    item.display();
  });
  // 如果过渡完成，更新目标颜色和开始时间
  if (progress === 1) {
    backgroundColor = targetBackgroundColor; // 更新背景颜色
    targetBackgroundColor = color(random(360), 90, random(20, 50));
    startTime = currentTime;
  }
}
function windowResized() {
  updateGraphicalList();
  resizeCanvas(windowWidth, windowHeight);
}

function updateGraphicalList() {
  // 计算缩放比例
  scalePub = map(windowWidth, 0, 1920, 0, 1);
  // 重置集合
  graphicalList = [];
  // 计算当前页面高度下应该显示多少行六边形
  let rowNum = ceil(windowHeight / 200 / scalePub);
  // 计算应显示多少列多少行六边形
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < rowNum; j++) {
      graphicalList.push(
        new Graphical(j % 2 ? i * 250 - 224 : i * 250 - 100, j * 220 - 100)
      );
    }
  }
}
