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
        avatar: "assets/main.png", // 指向你设计的主角贴图
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
        avatar: "assets/main.png", 
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
   
    if (!mapContainer) return;

    mapContainer.innerHTML = '<h2>星系地图</h2><div id="ship" class="pixel-ship">🚀</div>';

    galaxyData.forEach((planet, index) => {
        if (!planet || !planet.position) return;

        const planetEl = document.createElement('div');
        planetEl.className = 'planet-icon';
        
        // 🌟 核心改动：检查星球是否已完成
        if (planet.isCompleted) {
            planetEl.classList.add('locked'); // 加入锁定样式（红光）
            // 如果已完成，不绑定 startPlanet，或者绑定一个“已锁定”的提示
            planetEl.onclick = (e) => {
                e.stopPropagation();
                console.log("该星球能量已回收，坐标锁定中。");
            };
        } else {
            // 未完成时，正常绑定点击事件
            planetEl.onclick = (e) => {
                e.stopPropagation();
                startPlanet(index);
            };
        }

        planetEl.innerHTML = `
            <img src="${planet.image}" alt="${planet.name}">
            <span class="planet-label">${planet.name}</span>
        `;

        planetEl.style.left = planet.position.x + "%";
        planetEl.style.top = planet.position.y + "%";

        mapContainer.appendChild(planetEl);
    });
    // 3. 渲染地球 (保持你之前的代码)
    const earthEl = document.createElement('div');
    earthEl.className = 'planet-icon earth-icon';
    earthEl.innerHTML = `<img src="assets/earth.png" alt="地球">`;
    earthEl.onclick = (e) => {
        e.stopPropagation();
        if (typeof updateEarthStatus === "function") updateEarthStatus();
        showScreen('screen-earth-status');
    };
    mapContainer.appendChild(earthEl);
}

// 开始答题
function startPlanet(index) {
    gameState.currentPlanetIndex = index;
    const planet = galaxyData[index];

    document.getElementById('planet-name').innerText = planet.name;
    
    // 🌟 重点检查这一行！
    // 你的数据里并没有 'description' 字段，如果你写了这一行，页面就会显示 undefined
    // 如果你想显示描述，需要在 data.js 里给每个星球加上 description: "xxx"
    const descEl = document.getElementById('planet-desc');
    if (descEl) {
        descEl.innerText = planet.description || "正在通过远程通讯频道扫描星球详细信息...";
    }

    gameState.currentQuestionIndex = 0;
    showQuestion();
    showScreen('screen-quiz');
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
function completePlanet() {
    const planet = galaxyData[gameState.currentPlanetIndex];
    planet.isCompleted = true; // 1. 标记完成

    gameState.completedPlanets++;
    alert(`✨ 成功！${planet.name} 的能量已回收。`);

    renderMap(); // 2. 🌟 重新渲染地图，这会触发上面 renderMap 里的 if(planet.isCompleted) 判断
    showScreen('screen-map'); // 3. 返回地图
    if (gameState.completedPlanets >= galaxyData.length) {
        showScreen('screen-win'); // 切换到结局屏
        playEndingCutscene();        // 播放结局动画
    } else {
        alert(`${planet.name} 的能量已收集完毕！`);
        showScreen('screen-map');
    }
}
function playEndingCutscene() {
    const endingScreen = document.getElementById('screen-ending');
    if (!endingScreen) return;

    // 清空内容，准备播放动画
    endingScreen.innerHTML = '<div class="ending-content"></div>';
    const container = endingScreen.querySelector('.ending-content');

    const lines = [
        "2026年，最后一颗能量核心归位。",
        "大气层的尘埃开始散去...",
        "久违的阳光重新穿透云层，洒向荒芜的海床。",
        "指挥官，你看。",
        "那一抹绿色，是生命重新萌芽的信号。",
        "感谢你，孤独的领航者。",
        "地球，复苏了。"
    ];

    let lineIndex = 0;

    function showNextLine() {
        if (lineIndex < lines.length) {
            const p = document.createElement('p');
            p.className = 'ending-line';
            p.innerText = lines[lineIndex];
            container.appendChild(p);
            
            // 自动滚动到底部
            endingScreen.scrollTop = endingScreen.scrollHeight;

            lineIndex++;
            setTimeout(showNextLine, 2000); // 每2秒出一行
        } else {
            // 全部播完后，显示“回到标题”或者“重新开始”按钮
            const btn = document.createElement('button');
            btn.className = 'restart-btn';
            btn.innerText = "✨ 开启新篇章";
            btn.onclick = () => location.reload(); // 刷新网页重置游戏
            container.appendChild(btn);
        }
    }

    showNextLine();
}
function checkAnswer(selectedIndex) {
    const planet = galaxyData[gameState.currentPlanetIndex];
    const currentQ = planet.questions[gameState.currentQuestionIndex];

    // 🌟 核心逻辑：将玩家点击的索引 (selectedIndex) 与数据里的正确索引 (currentQ.answer) 进行对比
    if (selectedIndex === currentQ.answer) {
        // --- 情况 A: 答对了 ---
        alert("🎉 正确！能量正在回收...");
        
        // 增加题目索引，准备下一题
        gameState.currentQuestionIndex++;

        // 检查是否该星球所有题都答完了
        if (gameState.currentQuestionIndex >= planet.questions.length) {
            completePlanet(); // 调用通关函数
        } else {
            showQuestion(); // 显示下一题
        }
    } else {
        // --- 情况 B: 答错了 ---
        // --- 情况 B: 答错了 ---
        console.log("回答错误，当前护盾值:", gameState.shield);
        
        // 1. 扣除生命值/护盾
        gameState.shield--; 

        // 2. 立即更新左上角的 UI 显示（确保心形图标减少）
        if (typeof updateStatusBar === "function") {
            updateStatusBar();
        }

        // 3. 检查是否死亡
        if (gameState.shield <= 0) {
            console.log("护盾归零，进入失败界面");
            // 跳转到失败界面
            showScreen('screen-lose'); 
        } else {
            // 如果还没死，弹个窗提醒一下
            alert("警告：能量解析错误！护盾受损。");
        }
    }
}
function updateStatusBar() {
    const shieldEl = document.getElementById('shield-display'); // 假设你的血条 ID 是这个
    if (!shieldEl) return;

    // 用循环根据剩余血量生成爱心
    let hearts = "";
    for (let i = 0; i < 3; i++) {
        hearts += i < gameState.shield ? "❤️" : "🖤"; // 没血了变黑心或空心
    }
    shieldEl.innerText = ` ${hearts}`;
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
  // main.js 渲染地图的部分逻辑参考

// --- 补上这个函数 ---

}
function updateEarthStatus() {
    // 1. 获取当前修复进度
    // 这里的进度逻辑要和你游戏里的变量名一致，比如 gameState.completedPlanets
    let completed = 0;
    if (typeof gameState !== 'undefined') {
        completed = gameState.completedPlanets;
    }
    
    // 假设你有 5 个星球
    let progress = Math.floor((completed / 5) * 100); 
    
    // 2. 找到页面上的元素并更新
    const earthVal = document.getElementById('earth-progress-val');
    const earthDesc = document.getElementById('earth-description');
    const earthImg = document.getElementById('earth-large-img');

    if (earthVal) earthVal.innerText = progress + "%";

    // 3. 根据进度改变描述和贴图
    if (earthDesc && earthImg) {
        if (progress === 0) {
            earthDesc.innerText = "“地球目前一片死寂，只有微弱的求救信号...”";
            earthImg.src = "assets/earth-level1.png"; 
        } else if (progress < 100) {
            earthDesc.innerText = "“能量正在汇聚，生态系统显示出复苏的迹象！”";
            earthImg.src = "assets/earth-level2.png"; 
        } else {
            earthDesc.innerText = "“奇迹发生了！地球重新焕发了蓝色生机！”";
            earthImg.src = "assets/earth-level3.png"; 
        }
    }
}
// 这个函数负责：点击星球 -> 切换到答题页面
function startPlanet(index) {
    console.log("正在启动星球关卡，索引：", index);
    
    // 1. 设置当前正在挑战的星球数据
    gameState.currentPlanetIndex = index;
    const planet = galaxyData[index];

    // 2. 更新答题界面的文字和图片
    const nameEl = document.getElementById('planet-name').innerText = planet.name;
    /*const descEl = document.getElementById('planet-desc');*/
    const bigImgEl = document.getElementById('planet-big-img').src = planet.image;

    if (nameEl) nameEl.innerText = planet.name;
    /*if (descEl) descEl.innerText = planet.description;*/
    if (bigImgEl) bigImgEl.src = planet.image;

    // 3. 重置题目进度
    gameState.currentQuestionIndex = 0;
    
    // 4. 显示第一道题
    if (typeof showQuestion === "function") {
        showQuestion();
    }
    
    // 5. 切换屏幕
    showScreen('screen-quiz');
}
function showQuestion() {
    const planet = galaxyData[gameState.currentPlanetIndex];
    const currentQ = planet.questions[gameState.currentQuestionIndex];

    // 1. 获取元素
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // 🛡️ 安全检查：如果页面上没有这个 ID，就在控制台报错，而不是让程序崩溃
    if (!questionTextEl) {
        console.error("错误：在 HTML 中找不到 ID 为 'question-text' 的元素！");
        return; 
    }
    if (!optionsContainer) {
        console.error("错误：在 HTML 中找不到 ID 为 'options-container' 的元素！");
        return;
    }

    if (currentQ) {
        questionTextEl.innerText = currentQ.question;
        optionsContainer.innerHTML = '';
        currentQ.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = option;
            btn.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(btn);
        });
    }
}