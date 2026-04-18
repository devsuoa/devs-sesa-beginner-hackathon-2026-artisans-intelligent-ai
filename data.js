// 这里存放所有的天文题库和星球坐标
const galaxyData = [
  {
    id: 1,
    name: "冰核星",
    position: { x: 10, y: 80 }, // 星球在地图上的位置 (百分比)
    isCompleted: false,
    image: "assets/planet1.png",
    questions: [
      { question: "太阳系中体积最大的行星是哪一颗？", options: ["地球", "木星", "火星"], answer: 1 },
      { question: "距离地球最近的恒星是？", options: ["比邻星", "太阳", "天狼星"], answer: 1 },
      { question: "银河系中心的超大质量黑洞叫什么名字？", options: ["人马座A*", "天鹅座X-1", "猎户座A"], answer: 0 },
      { question: "宇宙中最常见的元素是什么？", options: ["氢", "氦", "氧"], answer: 0 },
      { question: "地球的卫星叫什么名字？", options: ["月球", "火星", "金星"], answer: 0 }
    ]
  },
  {
    id: 2,
    name: "熔岩星",
    position: { x: 70, y: 20 }, 
    isCompleted: false,
    image: "assets/planet2.png",
    questions: [
      { question: "光年是一个什么单位？", options: ["时间单位", "速度单位", "长度单位"], answer: 2 },
      { question: "太阳系中最热的行星是哪一颗？", options: ["金星", "水星", "火星"], answer: 0 },
      { question: "地球上最大的火山是什么？", options: ["夏威夷的冒纳凯亚火山", "意大利的埃特纳火山", "智利的奥索尔诺火山"], answer: 0 },
      { question: "地球上最大的火山是什么？", options: ["夏威夷的冒纳凯亚火山", "意大利的埃特纳火山", "智利的奥索尔诺火山"], answer: 0 },
      { question: "太阳系中最热的行星是哪一颗？", options: ["金星", "水星", "火星"], answer: 0 }
    ]
  },
  {
    id: 3,  
    name: "风暴星",
    position: { x: 90, y: 50 },
    isCompleted: false,
    image: "assets/planet3.png",
    questions: [
      { question: "地球上最大的风暴是什么？", options: ["台风", "龙卷风", "飓风"], answer: 0 },
      { question: "太阳系中风暴最频繁的行星是哪一颗？", options: ["木星", "土星", "海王星"], answer: 0 },
      { question: "地球上最大的风暴是什么？", options: ["台风", "龙卷风", "飓风"], answer: 0 },
      { question: "太阳系中风暴最频繁的行星是哪一颗？", options: ["木星", "土星", "海王星"], answer: 0 },
      { question: "地球上最大的风暴是什么？", options: ["台风", "龙卷风", "飓风"], answer: 0 }
    ]
  },
  {
    id: 4,
    name: "星爆星",
    position: { x: 30, y: 30 }, 
    isCompleted: false,
    image: "assets/planet4.png",
    questions: [
      { question: "宇宙中最亮的天体是什么？", options: ["超新星", "类星体", "星爆星"], answer: 2 },
      { question: "星爆星是由什么引起的？", options: ["恒星碰撞", "超新星爆炸", "黑洞吞噬"], answer: 1 },
      { question: "宇宙中最亮的天体是什么？", options: ["超新星", "类星体", "星爆星"], answer: 2 },
      { question: "星爆星是由什么引起的？", options: ["恒星碰撞", "超新星爆炸", "黑洞吞噬"], answer: 1 },
      { question: "宇宙中最亮的天体是什么？", options: ["超新星", "类星体", "星爆星"], answer: 2 }
    ]
  },
  {
    id: 5,
    name: "暗物质星",
    position: { x: 80, y: 70 },
    isCompleted: false,
    image: "assets/planet5.png",
    questions: [
      { question: "暗物质占宇宙总质量的百分比大约是多少？", options: ["5%", "27%", "68%"], answer: 1 },
      { question: "暗物质的存在是通过什么现象推断出来的？", options: ["引力透镜效应", "宇宙微波背景辐射", "星系旋转曲线"], answer: 2 },
      { question: "暗物质占宇宙总质量的百分比大约是多少？", options: ["5%", "27%", "68%"], answer: 1 },
      { question: "暗物质的存在是通过什么现象推断出来的？", options: ["引力透镜效应", "宇宙微波背景辐射", "星系旋转曲线"], answer: 2 },
      { question: "暗物质占宇宙总质量的百分比大约是多少？", options: ["5%", "27%", "68%"], answer: 1 }
    ]
  }
];