// main.js 新增打字机逻辑

// 1. 定义要打印的全部文字
// 1. 定义升级版的剧本
// main.js 的剧本部分升级
const prologueScript = [
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "通讯器", 
        avatar: "assets/radio.png", 
        text: "📡 收到加密通讯请求..." 
    },
    { 
        role: "npc", 
        name: "基地指挥官", 
        avatar: "assets/sample.png", 
        text: "“舰长！地球生态系统即将崩溃... 核心能量已经见底。”" 
    },
    { 
        // 标记：这是主角（你）！
        role: "player", 
        name: "主角 (你)", 
        avatar: "assets/player.png", // 指向你设计的主角贴图
        text: "“收到，这里是星际巡航号。地球目前的情况严重吗？”" 
    },
    { 
        role: "npc", 
        name: "基地指挥官", 
        avatar: "assets/sample.png", 
        text: "“唯有提取纯净的星爆能量才能拯救我们！全人类的希望都寄托在你身上了，立刻启程！”" 
    },
    { 
        role: "player", 
        name: "主角 (你)", 
        avatar: "assets/player.png", 
        text: "“明白。引擎全开，目标：未知星系。出发！”" 
    }
];

// 2. 升级后的打字机函数
// 全新的打字机函数：带瀑布流和历史保留功能
function startDialogue(scriptArray) {
    let currentLine = 0;
    const historyContainer = document.getElementById("dialogue-history");
    historyContainer.innerHTML = ""; // 每次开始前清空历史

    function typeNextLine() {
        // 如果剧本播完了
        if (currentLine >= scriptArray.length) {
            document.getElementById("start-btn").classList.remove("hidden");
            return;
        }

        const line = scriptArray[currentLine];
        
        // === 1. 用 JS 动态搭建一行的 HTML 结构 ===
        // 创建包裹这一行的大盒子
        const rowDiv = document.createElement("div");
        rowDiv.className = "dialogue-row " + (line.role === "player" ? "row-player" : "");

        // 创建头像框和图片
        const avatarBox = document.createElement("div");
        avatarBox.className = "avatar-box"; 
        const avatarImg = document.createElement("img");
        avatarImg.src = line.avatar;
        avatarImg.className = "talking"; // 一出来就开始抖动
        // 修正像素图片模糊的属性
        avatarImg.style.imageRendering = "pixelated"; 
        avatarImg.style.maxWidth = "100%";
        avatarBox.appendChild(avatarImg);

        // 创建文字内容大盒子
        const contentBox = document.createElement("div");
        contentBox.className = "dialogue-content-box";
        
        // 创建名字标签
        const nameEl = document.createElement("div");
        nameEl.className = "dialogue-name";
        nameEl.innerText = line.name;

        // 创建打字的目标 P 标签
        const textEl = document.createElement("p");
        textEl.className = "dialogue-text";

        // 把名字和文字放进内容盒子里
        contentBox.appendChild(nameEl);
        contentBox.appendChild(textEl);
        
        // 把头像和内容盒子组合到这一行，并塞进网页中！
        rowDiv.appendChild(avatarBox);
        rowDiv.appendChild(contentBox);
        historyContainer.appendChild(rowDiv);

        // 🌟 自动滚屏魔法：每新增一行，自动往下滚动到底部
        historyContainer.scrollTop = historyContainer.scrollHeight;

        // === 2. 开始在这一个新的 P 标签里打字 ===
        let charIndex = 0;
        const timer = setInterval(() => {
            if (charIndex < line.text.length) {
                textEl.innerHTML += line.text.charAt(charIndex);
                charIndex++;
            } else {
                // 这行字打完了
                clearInterval(timer);
                avatarImg.classList.remove("talking"); // 停止抖动
                
                currentLine++;
                setTimeout(typeNextLine, 1000); // 停顿 1 秒后开始下一句
            }
        }, 50); // 打字速度：50毫秒/字
    }

    // 启动第一行
    typeNextLine();
}
// 页面加载后启动
window.onload = function() {
    // 如果有这个函数，就执行跳转（确保你在序章界面）
    if (typeof showScreen === "function") showScreen('screen-prologue');
    
    // 启动对话
    startDialogue(prologueScript);
};
let gameState = {
    currentPlanetIndex:0,
    currentQuestionIndex:0,
    totalPlanet:galaxyData.length,
    completedPlanets:0,
    shield: 3 // 新增：初始 3 点护盾
};

function showScreen(screenId){
    document.querySelectorAll('.screen').forEach(el=>el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}
function renderMap() {
  const mapContainer = document.getElementById('screen-map');
  const ship = document.getElementById('ship');

  // 清理旧的星球（防止重复生成）
  document.querySelectorAll('.pixel-planet').forEach(el => el.remove());

  galaxyData.forEach((planet, index) => {
    let planetDiv = document.createElement('div');
    planetDiv.className = `pixel-planet ${planet.isCompleted ? 'completed' : ''}`;
    planetDiv.style.left = `${planet.position.x}%`;
    planetDiv.style.top = `${planet.position.y}%`;
    
    planetDiv.onclick = () => {
      if (!planet.isCompleted) {
        ship.style.left = `${planet.position.x}%`;
        ship.style.top = `${planet.position.y}%`;
        setTimeout(() => startPlanetQuiz(index), 1000); // 飞船飞1秒后出题
      }
    };
    mapContainer.appendChild(planetDiv);
  });
}

// 开始答题
function startPlanetQuiz(planetIndex) {
  gameState.currentPlanetIndex = planetIndex;
  gameState.currentQuestionIndex = 0;
  showScreen('screen-quiz');
  loadQuestion();
}

function loadQuestion() {
  const planet = galaxyData[gameState.currentPlanetIndex];
  const questionData = planet.questions[gameState.currentQuestionIndex];

  document.getElementById('question-text').innerText = questionData.q;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = ''; 
  
  questionData.options.forEach((optionText, index) => {
    let btn = document.createElement('button');
    btn.innerText = optionText;
    btn.style.margin = "10px";
    btn.onclick = () => checkAnswer(index, questionData.answer);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedIndex, correctIndex) {
  if (selectedIndex === correctIndex) {
    // ... 答对的逻辑保持原样 ...
    gameState.currentQuestionIndex++;
    const planet = galaxyData[gameState.currentPlanetIndex];
    if (gameState.currentQuestionIndex < planet.questions.length) {
      loadQuestion();
    } else {
      finishPlanet();
    }
 // ...前面的代码
  } else {
    // 答错了的逻辑
    gameState.shield--; 
    
    // 更新屏幕上的红心显示
    let hearts = "";
    for(let i = 0; i < gameState.shield; i++) hearts += "❤️";
    document.getElementById('shield-display').innerText = hearts;

    // === 判断失败跳转 ===
    if (gameState.shield <= 0) {
      // 护盾归零，隐藏血条，跳转到失败结局
      document.getElementById('status-bar').classList.add('hidden');
      showScreen('screen-lose'); 
    } else {
      // 还没死，弹个提示继续答题
      alert(`答案错误！护盾受损，还剩 ${gameState.shield} 次机会！`);
    }
  }
}
// ...后面的代码

function finishPlanet() {
  galaxyData[gameState.currentPlanetIndex].isCompleted = true;
  gameState.completedPlanets++;
  // ...前面的代码
  let progressPercentage = Math.floor((gameState.completedPlanets / galaxyData.length) * 100);
  
  if (progressPercentage >= 100) {
    // === 判断通关跳转 ===
    document.getElementById('status-bar').classList.add('hidden'); // 隐藏血条
    showScreen('screen-win'); // 跳转到成功结局界面
  } else {
    // 没通关，显示当前进度弹窗
    document.getElementById('progress-text').innerText = `${progressPercentage}%`;
    document.getElementById('modal-progress').classList.remove('hidden');
  }
// ...后面的代码
}

function returnToMap() {
  document.getElementById('modal-progress').classList.add('hidden');
  renderMap(); 
  showScreen('screen-map');
}
// main.js 里原本就该有的 startGame 函数
function startGame() {
    // 隐藏状态栏（如果你加了护盾机制）
    const statusBar = document.getElementById('status-bar');
    if (statusBar) statusBar.classList.add('hidden'); // 序章不显示血条
    
    // 跳转到地图界面
    showScreen('screen-map');
    statusBar.classList.remove('hidden'); // 进入地图界面时显示血条
    // 渲染地图
    renderMap();
}
// 页面加载完毕后，立刻渲染地图
//window.onload = startGame;

function finishPlanet() {
  galaxyData[gameState.currentPlanetIndex].isCompleted = true;
  gameState.completedPlanets++;
  let progressPercentage = Math.floor((gameState.completedPlanets / galaxyData.length) * 100);
  
  if (progressPercentage >= 100) {
    // === 判断通关跳转 ===
    document.getElementById('status-bar').classList.add('hidden'); // 隐藏血条
    showScreen('screen-win'); // 跳转到成功结局界面
  } else {
    // === 没通关，显示当前进度弹窗 ===
    // 1. 更新弹窗里的百分比数字
    document.getElementById('progress-text').innerText = `${progressPercentage}%`;
    // 2. 显示弹窗
    document.getElementById('modal-progress').classList.remove('hidden');
    
    // ⛔⛔⛔ 绝对不能有 showScreen(''); 这一行！如果有，一定要删掉！⛔⛔⛔
  }
  
}