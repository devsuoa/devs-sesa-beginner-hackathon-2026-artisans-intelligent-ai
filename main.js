// main.js 新增打字机逻辑

// 1. 定义要打印的全部文字
// 1. 定义升级版的剧本
// main.js 的剧本部分升级
const prologueScript = [
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "📡 Due to continuous environmental destruction by humans, Earth will collapse in a few hundred years, and humanity will no longer be able to survive."
    },
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "Forests have turned into deserts, sea levels are rising, food is becoming scarce, and disasters are approaching."
    },
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "Humans discover that on a distant planet, there exists a mysterious crystal that can save the world."
    },
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "We have decided to choose one creature as the captain to travel to an unknown planet, obtain the crystal, and save Earth."
    },
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "Hello. You have been selected as the captain."
    },
    { 
        // 标记：这是主角（你）！
        role: "player", 
        name: "You", 
        avatar: "assets/main.png", // 指向你设计的主角贴图
        text: "！！" 
    },
    { 
        // 标记：这是 NPC
        role: "npc", 
        name: "Ms Radio", 
        avatar: "assets/radio.png", 
        text: "You will soon travel to an unknown planet and complete a series of challenges to obtain the mysterious crystal."
    },
    { 
        role: "npc", 
        name: "Main Base Commander", 
        avatar: "assets/sample.png", 
        text: "Yes. You will have three chances. Your success or failure will lead to different outcomes." 
    },
    { 
        role: "npc", 
        name: "Main Base Commander", 
        avatar: "assets/sample.png", 
        text: "There are multiple planetary challenges. Once you complete a planet’s challenge, you cannot return to that planet again. So choose carefully."
    },
    { 
        role: "npc", 
        name: "Main Base Commander", 
        avatar: "assets/sample.png", 
        text: "Only when your progress reaches 100% will you successfully obtain the crystal."
    },
    { 
        // 标记：这是主角（你）！
        role: "player", 
        name: "You", 
        avatar: "assets/main.png", // 指向你设计的主角贴图
        text: "Alright. I will do my best to complete the challenges, obtain the crystal, and save the world!" 
    },
    { 
        role: "npc", 
        name: "Main Base Commander", 
        avatar: "assets/sample.png", 
        text: "Good luck! Believe in yourself!" 
    }
];

// 2. 升级后的打字机函数
// 全新的打字机函数：带瀑布流和历史保留功能
let isDialogueSkipped = false;
let typingIntervalId = null;
let nextLineTimeoutId = null;
let revealCurrentLine = null;

function isPrologueVisible() {
    const prologue = document.getElementById('screen-prologue');
    return !!prologue && !prologue.classList.contains('hidden');
}

function revealCurrentDialogueLine() {
    if (!isPrologueVisible()) return;
    if (typeof revealCurrentLine === 'function') {
        revealCurrentLine();
    }
}

function handlePrologueKeydown(event) {
    if (event.code !== 'Space') return;
    if (!isPrologueVisible()) return;

    event.preventDefault();
    revealCurrentDialogueLine();
}

function handlePrologueClick(event) {
    if (!isPrologueVisible()) return;

    const target = event.target;
    if (target instanceof HTMLElement) {
        if (target.closest('#skip-prologue-btn') || target.closest('#start-btn')) {
            return;
        }
    }

    revealCurrentDialogueLine();
}

function startDialogue(scriptArray) {
    let currentLine = 0;
    const historyContainer = document.getElementById("dialogue-history");
    historyContainer.innerHTML = ""; // 每次开始前清空历史
    document.getElementById("start-btn")?.classList.add("hidden");
    isDialogueSkipped = false;
    revealCurrentLine = null;

    if (typingIntervalId) {
        clearInterval(typingIntervalId);
        typingIntervalId = null;
    }
    if (nextLineTimeoutId) {
        clearTimeout(nextLineTimeoutId);
        nextLineTimeoutId = null;
    }

    function typeNextLine() {
        if (isDialogueSkipped) return;

        // 如果剧本播完了
        if (currentLine >= scriptArray.length) {
            revealCurrentLine = null;
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
        let lineFinished = false;

        revealCurrentLine = function() {
            if (lineFinished || !typingIntervalId || isDialogueSkipped) return;

            clearInterval(typingIntervalId);
            typingIntervalId = null;
            textEl.textContent = line.text;
            charIndex = line.text.length;
            lineFinished = true;
            avatarImg.classList.remove("talking");

            currentLine++;
            nextLineTimeoutId = setTimeout(typeNextLine, 1000);
        };

        typingIntervalId = setInterval(() => {
            if (isDialogueSkipped) {
                clearInterval(typingIntervalId);
                typingIntervalId = null;
                return;
            }

            if (charIndex < line.text.length) {
                textEl.textContent += line.text.charAt(charIndex);
                charIndex++;
            } else {
                // 这行字打完了
                clearInterval(typingIntervalId);
                typingIntervalId = null;
                lineFinished = true;
                avatarImg.classList.remove("talking"); // 停止抖动
                
                currentLine++;
                nextLineTimeoutId = setTimeout(typeNextLine, 1000); // 停顿 1 秒后开始下一句
            }
        }, 50); // 打字速度：50毫秒/字
    }

    // 启动第一行
    typeNextLine();
}

function skipPrologue() {
    isDialogueSkipped = true;
    revealCurrentLine = null;

    if (typingIntervalId) {
        clearInterval(typingIntervalId);
        typingIntervalId = null;
    }
    if (nextLineTimeoutId) {
        clearTimeout(nextLineTimeoutId);
        nextLineTimeoutId = null;
    }

    startGame();
}

// 页面加载后启动
window.onload = function() {
    // 如果有这个函数，就执行跳转（确保你在序章界面）
    if (typeof showScreen === "function") showScreen('screen-prologue');

    document.removeEventListener('keydown', handlePrologueKeydown);
    document.removeEventListener('click', handlePrologueClick);
    document.addEventListener('keydown', handlePrologueKeydown);
    document.addEventListener('click', handlePrologueClick);
    
    // 启动对话
    startDialogue(prologueScript);
};
let gameState = {
    currentPlanetIndex:0,
    currentQuestionIndex:0,
    currentPlanetQuestions: [],
    correctStreak: 0,
    wrongAnswers: 0,
    totalPlanet:galaxyData.length,
    completedPlanets:0,
    unlockedAchievements: {},
    shield: 3 // 新增：初始 3 点护盾
};

const ACHIEVEMENTS = {
    streak3: {
        id: 'streak3',
        name: 'THREE IN A ROW!',
        description: 'Three correct answers in a row.'
    },
    perfectRun: {
        id: 'perfectRun',
        name: 'U ACTUALLY GENIUS!',
        description: 'correctly answer all the questions'
    },
    williamFollower: {
        id: 'williamFollower',
        name: "William's follower",
        description: 'Nothing stopping u'
    },
    firstPlanet: {
        id: 'firstPlanet',
        name: 'First Contact',
        description: 'Complete your first planet.'
    },
    triExplorer: {
        id: 'triExplorer',
        name: 'Tri Explorer',
        description: 'Complete any 3 planets.'
    },
    allPlanets: {
        id: 'allPlanets',
        name: 'Galaxy Surveyor',
        description: 'Complete all planets.'
    }
};

const ENDING_CONFIG = {
    good: {
        background: 'assets/he.png',
        title: 'Good Ending: Earth Reborn',
        lines: [
            'The final crystal has been activated.',
            'Oceans calm down, and ruined forests begin to breathe again.',
            'Across the horizon, cities light up one by one.',
            'You completed the mission and gave Earth another future.'
        ]
    },
    bad: {
        background: 'assets/be.png',
        title: 'Bad Ending: Signal Lost',
        lines: [
            'The shield is gone, and the ship falls silent.',
            'The rescue route collapses before the final transfer.',
            'Earth waits in darkness as the signal fades away.',
            'This chapter ends here, but another attempt can still change fate.'
        ]
    }
};

function showEnding(type) {
    const endingScreen = document.getElementById('screen-ending');
    const endingTitle = document.getElementById('ending-title');
    const endingText = document.getElementById('ending-text');
    const config = ENDING_CONFIG[type] || ENDING_CONFIG.bad;

    if (!endingScreen || !endingTitle || !endingText) return;

    endingTitle.innerText = config.title;
    endingText.innerHTML = config.lines.map((line) => `<p>${line}</p>`).join('');
    endingScreen.style.backgroundImage = `url("${config.background}")`;

    const statusBar = document.getElementById('status-bar');
    if (statusBar) statusBar.classList.add('hidden');

    showScreen('screen-ending');
}

function openAchievementScreen() {
    const unlockedBox = document.getElementById('achievements-unlocked');
    const lockedBox = document.getElementById('achievements-locked');
    if (!unlockedBox || !lockedBox) return;

    unlockedBox.innerHTML = '';
    lockedBox.innerHTML = '';

    const achievementList = Object.values(ACHIEVEMENTS);
    achievementList.forEach((achievement) => {
        const unlocked = !!gameState.unlockedAchievements[achievement.id];
        const targetBox = unlocked ? unlockedBox : lockedBox;

        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;

        const name = document.createElement('p');
        name.className = 'achievement-item-name';
        name.innerText = unlocked ? achievement.name : '???';

        const desc = document.createElement('p');
        desc.className = 'achievement-item-desc';
        desc.innerText = unlocked ? achievement.description : 'Unlock this achievement to reveal details.';

        item.appendChild(name);
        item.appendChild(desc);
        targetBox.appendChild(item);
    });

    showScreen('screen-achievements');
}

function showScreen(screenId){
    document.querySelectorAll('.screen').forEach(el=>el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function showGameAlert(message, duration = 1400) {
    let overlay = document.getElementById('game-alert-overlay');
    let textEl = document.getElementById('game-alert-text');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'game-alert-overlay';
        overlay.className = 'game-alert-overlay hidden';

        const box = document.createElement('div');
        box.className = 'game-alert-box';

        textEl = document.createElement('p');
        textEl.id = 'game-alert-text';

        box.appendChild(textEl);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    textEl.innerText = message;
    overlay.classList.remove('hidden');

    return new Promise((resolve) => {
        setTimeout(() => {
            overlay.classList.add('hidden');
            resolve();
        }, duration);
    });
}

function playAchievementSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const start = audioCtx.currentTime + index * 0.14;
        const end = start + 0.12;

        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, end);

        osc.start(start);
        osc.stop(end);
    });

    setTimeout(() => {
        audioCtx.close();
    }, 900);
}

function showAchievementPopup(achievement, duration = 2200) {
    let overlay = document.getElementById('achievement-overlay');
    let nameEl = document.getElementById('achievement-name');
    let descEl = document.getElementById('achievement-popup-desc');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'achievement-overlay';
        overlay.className = 'achievement-overlay hidden';

        const card = document.createElement('div');
        card.className = 'achievement-card';

        const badge = document.createElement('p');
        badge.className = 'achievement-badge';
        badge.innerText = 'Achievement Unlocked';

        nameEl = document.createElement('h3');
        nameEl.id = 'achievement-name';

        const desc = document.createElement('p');
        desc.className = 'achievement-desc';
        desc.id = 'achievement-popup-desc';
        desc.innerText = '';

        card.appendChild(badge);
        card.appendChild(nameEl);
        card.appendChild(desc);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }

    nameEl.innerText = achievement.name;
    if (descEl) {
        descEl.innerText = achievement.description;
    }
    overlay.classList.remove('hidden');
    playAchievementSound();

    return new Promise((resolve) => {
        setTimeout(() => {
            overlay.classList.add('hidden');
            resolve();
        }, duration);
    });
}

async function unlockAchievement(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;
    if (gameState.unlockedAchievements[achievementId]) return;

    gameState.unlockedAchievements[achievementId] = true;
    await showAchievementPopup(achievement);
}
function renderMap() {
    const mapContainer = document.getElementById('screen-map');
   
    if (!mapContainer) return;

    mapContainer.innerHTML = '<h2>SPACE MAP</h2><div id="ship" class="pixel-ship">🚀</div>';

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
    earthEl.innerHTML = `<img src="assets/earth.png" alt="Earth">`;
    earthEl.innerHTML += `<span class="planet-label">Earth</span>`;
    earthEl.style.left = "50%";
    earthEl.style.top = "50%";
    earthEl.onclick = (e) => {
        e.stopPropagation();
        console.log('[Earth Button Click] Calling updateEarthStatus()');
        if (typeof updateEarthStatus === "function") updateEarthStatus();
        showScreen('screen-earth-status');
    };
    mapContainer.appendChild(earthEl);
}

async function completePlanet() {
    const planet = galaxyData[gameState.currentPlanetIndex];
    planet.isCompleted = true; // 1. 标记完成

    gameState.completedPlanets++;
    console.log(`[completePlanet] Planet "${planet.name}" completed. Total completed: ${gameState.completedPlanets}/${gameState.totalPlanet}`);
    
    await showGameAlert(`✨ Success! ${planet.name} energy has been collected.`);

    if (gameState.completedPlanets === 1) {
        await unlockAchievement('firstPlanet');
    }
    if (gameState.completedPlanets >= 3) {
        await unlockAchievement('triExplorer');
    }
    if (planet.id === 1) {
        await unlockAchievement('williamFollower');
    }

    renderMap(); // 2. 🌟 重新渲染地图，这会触发上面 renderMap 里的 if(planet.isCompleted) 判断
    showScreen('screen-map'); // 3. 返回地图
    if (gameState.completedPlanets >= galaxyData.length) {
        await unlockAchievement('allPlanets');
        if (gameState.wrongAnswers === 0) {
            await unlockAchievement('perfectRun');
        }
        showEnding('good');
    } else {
        await showGameAlert(`${planet.name} energy has been collected!`);
        showScreen('screen-map');
    }
}

async function checkAnswer(selectedIndex) {
    const planet = galaxyData[gameState.currentPlanetIndex];
    const activeQuestions = gameState.currentPlanetQuestions.length > 0
        ? gameState.currentPlanetQuestions
        : planet.questions;
    const currentQ = activeQuestions[gameState.currentQuestionIndex];

    // 🌟 核心逻辑：将玩家点击的索引 (selectedIndex) 与数据里的正确索引 (currentQ.answer) 进行对比
    if (selectedIndex === currentQ.answer) {
        // --- 情况 A: 答对了 ---
        gameState.correctStreak++;

        if (gameState.correctStreak >= 3) {
            await unlockAchievement('streak3');
        }

        await showGameAlert("🎉 Correct! Energy is being collected...");
        
        // 增加题目索引，准备下一题
        gameState.currentQuestionIndex++;

        // 检查是否该星球所有题都答完了
        if (gameState.currentQuestionIndex >= activeQuestions.length) {
            await completePlanet(); // 调用通关函数
        } else {
            showQuestion(); // 显示下一题
        }
    } else {
        // --- 情况 B: 答错了 ---
        // --- 情况 B: 答错了 ---
        console.log("Answer incorrect, current shield value:", gameState.shield);
        
        // 1. 扣除生命值/护盾
        gameState.shield--;
        gameState.correctStreak = 0;
        gameState.wrongAnswers++;

        // 2. 立即更新左上角的 UI 显示（确保心形图标减少）
        if (typeof updateStatusBar === "function") {
            updateStatusBar();
        }

        // 3. 检查是否死亡
        if (gameState.shield <= 0) {
            console.log("Shield depleted, transitioning to failure screen");
            showEnding('bad');
        } else {
            // 如果还没死，弹个窗提醒一下
            await showGameAlert("Warning: Energy parsing error! Shield damaged.");
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

    if (statusBar) {
        statusBar.classList.remove('hidden'); // 进入地图界面时显示血条
    }

    // 渲染地图
    renderMap();
}

// 页面加载完毕后，立刻渲染地图
//window.onload = startGame;

function updateEarthStatus() {
    // 1. 获取当前修复进度
    let completed = 0;
    let totalPlanets = 5;
    
    if (typeof gameState !== 'undefined') {
        completed = gameState.completedPlanets;
        totalPlanets = gameState.totalPlanet || galaxyData.length || 5;
    }
    
    // 计算进度百分比
    let progress = Math.floor((completed / totalPlanets) * 100);
    console.log(`[updateEarthStatus] Completed: ${completed}, Total: ${totalPlanets}, Progress: ${progress}%`);
    
    // 2. 找到页面上的元素并更新
    const earthVal = document.getElementById('earth-progress-val');
    const earthDesc = document.getElementById('earth-description');
    const earthImg = document.getElementById('earth-large-img');

    console.log(`[updateEarthStatus] Found elements - Val: ${!!earthVal}, Desc: ${!!earthDesc}, Img: ${!!earthImg}`);

    if (earthVal) {
        earthVal.innerText = progress + "%";
    }

    // 3. 根据进度改变描述和贴图
    if (earthDesc && earthImg) {
        if (progress === 0) {
            earthDesc.innerText = "Earth is on the brink of collapse, but hope is not lost. Let's start the journey to save our home!";
            earthImg.src = "assets/earth-level1.png";
        } else if (progress < 100) {
            earthDesc.innerText = "Energy is gathering, and the ecosystem is showing signs of recovery!";
            earthImg.src = "assets/earth-level2.png";
        } else {
            earthDesc.innerText = "Miraculously, Earth has been fully repaired! The sun shines again, and life flourishes. Thank you, brave navigator!";
            earthImg.src = "assets/earth-level3.png";
        }
        console.log(`[updateEarthStatus] Setting earth image to level (progress=${progress}%)`);
    } else {
        console.warn(`[updateEarthStatus] Missing elements: earthDesc=${!!earthDesc}, earthImg=${!!earthImg}`);
    }
}
// 这个函数负责：点击星球 -> 切换到答题页面
function startPlanet(index) {
    console.log("正在启动星球关卡，索引：", index);

    // 1. 设置当前正在挑战的星球数据
    gameState.currentPlanetIndex = index;
    const planet = galaxyData[index];

    // 2. 更新答题界面的文字和图片
    const nameEl = document.getElementById('planet-name');
    const bigImgEl = document.getElementById('planet-big-img');

    if (nameEl) nameEl.innerText = planet.name;
    if (bigImgEl) bigImgEl.src = planet.image;

    // 3. 重置题目进度
    gameState.currentQuestionIndex = 0;

    // 从题库中随机选出两个不同索引的题目
    const questionCount = planet.questions.length;
    if (questionCount >= 2) {
        const randomIndex1 = Math.floor(Math.random() * questionCount);
        let randomIndex2 = Math.floor(Math.random() * questionCount);
        // 确保第二个索引和第一个不同
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * questionCount);
        }
        gameState.currentPlanetQuestions = [
            planet.questions[randomIndex1],
            planet.questions[randomIndex2]
        ];
    } else {
        // 题库少于 2 题时，直接用所有题目
        gameState.currentPlanetQuestions = [...planet.questions];
    }

    // 4. 显示第一道题
    if (typeof showQuestion === "function") {
        showQuestion();
    }

    // 5. 切换屏幕
    showScreen('screen-quiz');
}

function showQuestion() {
    const planet = galaxyData[gameState.currentPlanetIndex];
    const activeQuestions = gameState.currentPlanetQuestions.length > 0
        ? gameState.currentPlanetQuestions
        : planet.questions;
    const currentQ = activeQuestions[gameState.currentQuestionIndex];

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
let isMusicPlaying = false;
const bgm = document.getElementById('game-bgm');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {
    const bgm = document.getElementById('game-bgm');
    const musicIcon = document.getElementById('music-icon');

    if (!bgm) {
        console.error("找不到音频元素！");
        return;
    }

    // 🌟 关键点：直接使用 bgm.paused 属性
    // 如果音乐是暂停状态，就播放它
    if (bgm.paused) {
        bgm.play()
            .then(() => {
                musicIcon.innerText = "🔊"; // 切换图标
            })
            .catch(err => {
                console.warn("播放请求被浏览器拦截:", err);
            });
    } else {
        // 如果音乐正在播放，就暂停它
        bgm.pause();
        musicIcon.innerText = "🔇"; // 切换回静音图标
    }
}
// 在你的开始按钮点击事件里加上这一行
document.getElementById('start-btn').addEventListener('click', () => {
    bgm.play(); // 只要用户点过屏幕，音乐就能播了
    isMusicPlaying = true;
    musicIcon.innerText = "🔊";
    showScreen('screen-map');
});