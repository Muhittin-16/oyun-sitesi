/* ============================================================
   OYNAKAZAN - TEMİZ 15 OYUN MOTORU
   GitHub Pages uyumlu
   ============================================================ */

(() => {
"use strict";

/* ============================================================
   YARDIMCILAR
   ============================================================ */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const rand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

let currentGame = null;
let gameInterval = null;
let gameTimeouts = [];

function clearGameTimers() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    gameTimeouts.forEach(t => {
        clearTimeout(t);
        clearInterval(t);
    });

    gameTimeouts = [];
}

function later(fn, ms) {
    const t = setTimeout(fn, ms);
    gameTimeouts.push(t);
    return t;
}

/* ============================================================
   OYUNCU SİSTEMİ
   ============================================================ */

let score = Number(localStorage.getItem("oynakazan_score") || 500);
let xp = Number(localStorage.getItem("oynakazan_xp") || 0);
let level = Number(localStorage.getItem("oynakazan_level") || 1);
let coins = Number(localStorage.getItem("oynakazan_coins") || 0);
let played = Number(localStorage.getItem("oynakazan_played") || 0);

function xpNeeded() {
    return 100 + ((level - 1) * 50);
}

function saveProgress() {
    localStorage.setItem("oynakazan_score", score);
    localStorage.setItem("oynakazan_xp", xp);
    localStorage.setItem("oynakazan_level", level);
    localStorage.setItem("oynakazan_coins", coins);
    localStorage.setItem("oynakazan_played", played);
}

function updateUI() {
    const userScore = $("#user-score");
    if (userScore) userScore.textContent = score.toLocaleString("tr-TR");

    const scoreEl = $("#score");
    if (scoreEl) scoreEl.textContent = score;

    const coinsEl = $("#coins");
    if (coinsEl) coinsEl.textContent = coins;

    const levelEl = $("#level");
    if (levelEl) levelEl.textContent = level;

    const playedEl = $("#played");
    if (playedEl) playedEl.textContent = played;

    const xpBar = $("#xp-bar");
    if (xpBar) {
        xpBar.style.width =
            Math.min(100, (xp / xpNeeded()) * 100) + "%";
    }
}

function addXP(amount) {
    xp += amount;

    while (xp >= xpNeeded()) {
        xp -= xpNeeded();
        level++;
        coins += 10;
    }

    saveProgress();
    updateUI();
}

function reward(win = true) {
    played++;

    if (win) {
        score += 50;
        coins += 15;
        addXP(25);
    } else {
        score += 10;
        coins += 3;
        addXP(8);
    }

    saveProgress();
    updateUI();
}

/* ============================================================
   BİLGİ PENCERESİ
   ============================================================ */

function notify(text, icon = "🎮", title = "Bilgi") {
    const modal = $("#message-modal");

    if (!modal) {
        alert(text);
        return;
    }

    const textEl = $("#message-text");
    const titleEl = $("#message-title");
    const iconEl = $("#message-icon");
    const close = $("#message-close");

    if (textEl) textEl.textContent = text;
    if (titleEl) titleEl.textContent = title;
    if (iconEl) iconEl.textContent = icon;

    modal.classList.remove("hidden");

    if (close) {
        close.onclick = () => {
            modal.classList.add("hidden");
        };
    }
}

/* ============================================================
   15 OYUN
   ============================================================ */

const GAMES = [
    {
        id: "okey",
        title: "101 Okey",
        category: "Masa Oyunu",
        filter: "board",
        icon: "🀄",
        color: "#f4b942",
        desc: "106 taşlı 101 Okey masası."
    },
    {
        id: "tavla",
        title: "Klasik Tavla",
        category: "Masa Oyunu",
        filter: "board",
        icon: "🎲",
        color: "#c77d32",
        desc: "Zarını at, pullarını ilerlet."
    },
    {
        id: "dama",
        title: "Türk Daması",
        category: "Masa Oyunu",
        filter: "board",
        icon: "⚫",
        color: "#ef476f",
        desc: "Rakibin taşlarını yakala."
    },
    {
        id: "batak",
        title: "Batak",
        category: "Kart Oyunu",
        filter: "cards",
        icon: "🂡",
        color: "#ef233c",
        desc: "Kartlarını doğru kullan."
    },
    {
        id: "bilardo",
        title: "Bilardo",
        category: "Spor",
        filter: "sport",
        icon: "🎱",
        color: "#06d6a0",
        desc: "Topları ceplere gönder."
    },
    {
        id: "mahjong",
        title: "Mahjong",
        category: "Zeka",
        filter: "puzzle",
        icon: "🀄",
        color: "#90be6d",
        desc: "Aynı taşları eşleştir."
    },
    {
        id: "sudoku",
        title: "Sudoku",
        category: "Zeka",
        filter: "puzzle",
        icon: "🔢",
        color: "#4cc9f0",
        desc: "9x9 Sudoku çöz."
    },
    {
        id: "bubble",
        title: "Bubble Shooter",
        category: "Arcade",
        filter: "arcade",
        icon: "🫧",
        color: "#f72585",
        desc: "Baloncukları patlat."
    },
    {
        id: "race",
        title: "Araba Yarışı",
        category: "Yarış",
        filter: "race",
        icon: "🏎️",
        color: "#ff5400",
        desc: "Trafikte hayatta kal."
    },
    {
        id: "block",
        title: "Block Puzzle",
        category: "Puzzle",
        filter: "puzzle",
        icon: "🧩",
        color: "#8338ec",
        desc: "Blokları yerleştir."
    },
    {
        id: "archery",
        title: "Okçuluk",
        category: "Spor",
        filter: "sport",
        icon: "🏹",
        color: "#2a9d8f",
        desc: "Hedefi tam ortadan vur."
    },
    {
        id: "matching",
        title: "Zeka Eşleştirme",
        category: "Zeka",
        filter: "puzzle",
        icon: "🧠",
        color: "#7209b7",
        desc: "Doğru cevabı bul."
    },
    {
        id: "memory",
        title: "Hafıza Oyunu",
        category: "Zeka",
        filter: "puzzle",
        icon: "🃏",
        color: "#4361ee",
        desc: "Kartların yerini hatırla."
    },
    {
        id: "snake",
        title: "Yılan Oyunu",
        category: "Arcade",
        filter: "arcade",
        icon: "🐍",
        color: "#38b000",
        desc: "Yılanı büyüt."
    },
    {
        id: "basket",
        title: "Basket Atışı",
        category: "Spor",
        filter: "sport",
        icon: "🏀",
        color: "#fb8500",
        desc: "Potaya isabet ettir."
    }
];

/* ============================================================
   OYUN KARTLARI
   ============================================================ */

function renderGames(filter = "all") {
    const container = $("#games-container");
    if (!container) return;

    const list = filter === "all"
        ? GAMES
        : GAMES.filter(g => g.filter === filter);

    container.innerHTML = "";

    list.forEach(game => {
        const card = document.createElement("article");

        card.className = "game-card";
        card.dataset.filter = game.filter;

        card.innerHTML = `
            <div class="game-image"
                 style="background:linear-gradient(135deg,${game.color},#111827)">
                <span class="game-icon">${game.icon}</span>
                <span class="game-badge">${game.category}</span>
            </div>

            <div class="game-card-content">
                <h3>${game.title}</h3>
                <p>${game.desc}</p>

                <button class="play-game"
                        data-game="${game.id}">
                    OYNA
                    <span>▶</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    $$(".play-game").forEach(btn => {
        btn.addEventListener("click", () => {
            openGame(btn.dataset.game);
        });
    });
}

/* ============================================================
   MODAL
   ============================================================ */

function openGame(id) {
    const game = GAMES.find(g => g.id === id);
    if (!game) return;

    currentGame = id;
    clearGameTimers();

    const modal = $("#game-modal");
    const title = $("#modal-game-title");
    const category = $("#modal-category");
    const area = $("#game-area");

    if (!modal || !area) return;

    if (title) title.textContent = game.title;
    if (category) category.textContent = game.category;

    modal.classList.remove("hidden");

    area.innerHTML = `
        <div class="game-loading">
            <div style="font-size:60px">${game.icon}</div>
            <h2>${game.title}</h2>
            <p>Oyun hazırlanıyor...</p>
        </div>
    `;

    later(() => launchGame(id), 120);
}

function closeGame() {
    clearGameTimers();
    currentGame = null;

    const modal = $("#game-modal");
    const area = $("#game-area");

    if (modal) modal.classList.add("hidden");
    if (area) area.innerHTML = "";
}

/* ============================================================
   OYUN STİLLERİ
   ============================================================ */

function gameCSS() {
    return `
    <style>
    .game-wrap{
        width:100%;
        max-width:900px;
        margin:auto;
        background:#101827;
        color:#fff;
        border-radius:18px;
        padding:20px;
        box-sizing:border-box;
    }

    .game-toolbar{
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        align-items:center;
        justify-content:center;
        margin-bottom:18px;
    }

    .game-btn{
        border:0;
        border-radius:10px;
        padding:11px 18px;
        background:#2563eb;
        color:white;
        cursor:pointer;
        font-weight:700;
    }

    .game-btn:hover{
        transform:translateY(-1px);
        filter:brightness(1.1);
    }

    .game-info{
        text-align:center;
        margin:10px 0 18px;
        font-size:17px;
    }

    .game-board{
        background:#172033;
        border-radius:16px;
        padding:18px;
        min-height:250px;
    }

    .cards-grid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:10px;
        max-width:520px;
        margin:auto;
    }

    .flip-card{
        aspect-ratio:1;
        border:0;
        border-radius:12px;
        background:#26344d;
        color:#fff;
        font-size:30px;
        cursor:pointer;
    }

    .flip-card.open{
        background:#fff;
        color:#111;
    }

    .number-grid{
        display:grid;
        grid-template-columns:repeat(9,1fr);
        max-width:450px;
        margin:auto;
        gap:3px;
    }

    .number-grid button{
        aspect-ratio:1;
        border:1px solid #53627b;
        background:#202c42;
        color:#fff;
        font-weight:bold;
        cursor:pointer;
    }

    .tile-row{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        justify-content:center;
    }

    .tile{
        width:44px;
        height:56px;
        background:#f7f7f7;
        color:#111;
        border-radius:7px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:bold;
        cursor:pointer;
        box-shadow:0 3px 7px #0005;
    }

    .tile.selected{
        transform:translateY(-8px);
        outline:3px solid #f4b942;
    }

    .table{
        background:#075c45;
        border-radius:20px;
        padding:25px;
        min-height:300px;
    }

    .dice{
        font-size:75px;
        text-align:center;
    }

    .canvas-game{
        width:100%;
        max-width:700px;
        display:block;
        margin:auto;
        background:#07111f;
        border-radius:14px;
        touch-action:none;
    }

    .target{
        width:240px;
        height:240px;
        border-radius:50%;
        margin:30px auto;
        background:
          radial-gradient(circle,
          #111 0 8%,
          #fff 8% 20%,
          #e63946 20% 34%,
          #fff 34% 49%,
          #1d4ed8 49% 65%,
          #fff 65% 80%,
          #e63946 80% 100%);
        position:relative;
        cursor:crosshair;
    }

    .target-dot{
        position:absolute;
        width:15px;
        height:15px;
        border-radius:50%;
        background:#111;
        transform:translate(-50%,-50%);
    }

    .road{
        width:300px;
        max-width:100%;
        height:430px;
        margin:auto;
        background:#303846;
        position:relative;
        overflow:hidden;
        border-left:8px dashed #fff;
        border-right:8px dashed #fff;
        box-sizing:border-box;
    }

    .car{
        position:absolute;
        bottom:25px;
        left:calc(50% - 22px);
        font-size:42px;
        z-index:5;
    }

    .enemy{
        position:absolute;
        font-size:38px;
        z-index:4;
    }

    .basket-court{
        height:360px;
        max-width:600px;
        margin:auto;
        position:relative;
        overflow:hidden;
        border-radius:15px;
        background:linear-gradient(#83c5be 0 55%,#d97706 55%);
    }

    .hoop{
        position:absolute;
        right:12%;
        top:22%;
        font-size:70px;
    }

    .basket-ball{
        position:absolute;
        bottom:25px;
        left:20%;
        font-size:45px;
        cursor:pointer;
        transition:.5s;
    }

    .match-question{
        text-align:center;
        font-size:48px;
        margin:20px;
    }

    .answer-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:12px;
        max-width:500px;
        margin:auto;
    }

    .answer-grid button{
        padding:16px;
        border:0;
        border-radius:12px;
        cursor:pointer;
        background:#24324a;
        color:white;
        font-size:17px;
    }

    .sudoku{
        border:3px solid #fff;
    }

    .sudoku button:nth-child(3n){
        border-right:2px solid #fff;
    }

    .okey-table{
        background:#086344;
        border-radius:25px;
        padding:20px;
    }

    .player-rack{
        display:flex;
        gap:5px;
        flex-wrap:wrap;
        justify-content:center;
        padding:15px;
    }

    @media(max-width:600px){
        .cards-grid{
            grid-template-columns:repeat(4,1fr);
        }

        .tile{
            width:34px;
            height:45px;
            font-size:12px;
        }

        .game-wrap{
            padding:10px;
        }
    }
    </style>
    `;
}

/* ============================================================
   OYUN BAŞLATICI
   ============================================================ */

function launchGame(id) {
    const area = $("#game-area");
    if (!area) return;

    area.innerHTML = gameCSS();

    switch (id) {
        case "okey": gameOkey(area); break;
        case "tavla": gameTavla(area); break;
        case "dama": gameDama(area); break;
        case "batak": gameBatak(area); break;
        case "bilardo": gameBilardo(area); break;
        case "mahjong": gameMahjong(area); break;
        case "sudoku": gameSudoku(area); break;
        case "bubble": gameBubble(area); break;
        case "race": gameRace(area); break;
        case "block": gameBlock(area); break;
        case "archery": gameArchery(area); break;
        case "matching": gameMatching(area); break;
        case "memory": gameMemory(area); break;
        case "snake": gameSnake(area); break;
        case "basket": gameBasket(area); break;
    }
}

/* ============================================================
   101 OKEY
   ============================================================ */

function gameOkey(area) {
    const suits = ["🔴","🟡","🔵","⚫"];
    let tiles = [];

    suits.forEach(s => {
        for (let n = 1; n <= 13; n++) {
            tiles.push(`${s}${n}`);
            tiles.push(`${s}${n}`);
        }
    });

    tiles.push("🃏","🃏");
    tiles = shuffle(tiles);

    let hand = tiles.splice(0,21);
    let selected = null;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            <strong>101 Okey</strong> · 21 taşlık el
        </div>

        <div class="okey-table">
            <div class="game-info">Rakipler masada</div>

            <div class="tile-row" id="okey-discard"></div>

            <div class="player-rack" id="okey-hand"></div>

            <div class="game-toolbar">
                <button class="game-btn" id="okey-draw">Taş Çek</button>
                <button class="game-btn" id="okey-sort">Sırala</button>
                <button class="game-btn" id="okey-drop">Taş At</button>
                <button class="game-btn" id="okey-finish">El Aç</button>
            </div>
        </div>
    </div>`;

    const rack = $("#okey-hand");
    const discard = $("#okey-discard");

    function draw() {
        if (tiles.length) {
            hand.push(tiles.pop());
            render();
        }
    }

    function render() {
        rack.innerHTML = "";

        hand.forEach((t,i) => {
            const b = document.createElement("button");
            b.className = "tile" + (selected === i ? " selected" : "");
            b.textContent = t;

            b.onclick = () => {
                selected = selected === i ? null : i;
                render();
            };

            rack.appendChild(b);
        });
    }

    $("#okey-draw").onclick = draw;

    $("#okey-sort").onclick = () => {
        hand.sort((a,b) => a.localeCompare(b));
        render();
    };

    $("#okey-drop").onclick = () => {
        if (selected === null) {
            notify("Önce bir taş seç.", "🀄");
            return;
        }

        discard.innerHTML =
            `<div class="tile">${hand[selected]}</div>`;

        hand.splice(selected,1);
        selected = null;

        draw();
    };

    $("#okey-finish").onclick = () => {
        if (hand.length >= 14) {
            reward(true);
            notify(
                "El tamamlandı! +50 puan ve +15 coin.",
                "🏆",
                "101 Okey"
            );
        }
    };

    render();
}

/* ============================================================
   TAVLA
   ============================================================ */

function gameTavla(area) {
    let player = 0;
    let opponent = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="table">
            <div class="game-info">
                Sen: <strong id="t-player">0</strong>
                · Rakip: <strong id="t-opponent">0</strong>
            </div>

            <div class="game-toolbar">
                <button class="game-btn" id="t-dice">🎲 Zar At</button>
                <button class="game-btn" id="t-move">Pul İlerle</button>
            </div>

            <div class="dice" id="t-result">🎲</div>
        </div>
    </div>`;

    $("#t-dice").onclick = () => {
        const a = rand(1,6);
        const b = rand(1,6);

        $("#t-result").textContent =
            ["⚀","⚁","⚂","⚃","⚄","⚅"][a-1] +
            " " +
            ["⚀","⚁","⚂","⚃","⚄","⚅"][b-1];

        player += a + b;

        if (player >= 50) {
            reward(true);
            notify("Rakibi yendin!", "🎲", "Tavla");
            player = 0;
        }

        $("#t-player").textContent = player;
    };

    $("#t-move").onclick = () => {
        opponent += rand(1,6);

        if (opponent >= 50) {
            opponent = 0;
            reward(false);
        }

        $("#t-opponent").textContent = opponent;
    };
}

/* ============================================================
   TÜRK DAMASI
   ============================================================ */

function gameDama(area) {
    let selected = null;
    let turn = 1;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Türk Daması · Hamle: <strong id="d-turn">Sen</strong>
        </div>
        <div id="d-board"
             style="display:grid;grid-template-columns:repeat(8,1fr);
             max-width:520px;margin:auto"></div>
    </div>`;

    const board = $("#d-board");

    for (let i=0;i<64;i++) {
        const cell = document.createElement("button");

        cell.style.aspectRatio = "1";
        cell.style.border = "1px solid #111";
        cell.style.fontSize = "28px";
        cell.style.background =
            ((Math.floor(i/8)+i)%2)
            ? "#d7b98e"
            : "#5c3b28";

        if (i < 16) cell.textContent = "⚫";
        if (i >= 48) cell.textContent = "⚪";

        cell.onclick = () => {
            if (cell.textContent) {
                selected = cell;
                return;
            }

            if (selected) {
                cell.textContent = selected.textContent;
                selected.textContent = "";
                selected = null;

                turn++;

                if (turn > 20) {
                    reward(true);
                    notify(
                        "Rakibin taşlarını temizledin!",
                        "🏆",
                        "Dama"
                    );
                    turn = 1;
                }

                $("#d-turn").textContent =
                    turn % 2 ? "Sen" : "Rakip";
            }
        };

        board.appendChild(cell);
    }
}

/* ============================================================
   BATAK
   ============================================================ */

function gameBatak(area) {
    const suits = ["♠","♥","♦","♣"];
    const cards = [];

    suits.forEach(s => {
        for (let n=2;n<=14;n++) {
            cards.push(
                s + (n===11?"J":n===12?"Q":n===13?"K":n===14?"A":n)
            );
        }
    });

    let hand = shuffle(cards).slice(0,13);

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Elindeki kartlardan birini seç.
        </div>
        <div class="tile-row" id="batak-hand"></div>
        <div class="game-info" id="batak-info">
            El puanı: 0
        </div>
    </div>`;

    const handEl = $("#batak-hand");
    let points = 0;

    hand.forEach(card => {
        const b = document.createElement("button");

        b.className = "tile";
        b.textContent = card;

        b.onclick = () => {
            points += 10;
            b.disabled = true;
            b.style.opacity = ".4";

            $("#batak-info").textContent =
                "El puanı: " + points;

            if (points >= 100) {
                reward(true);

                notify(
                    "Eli kazandın!",
                    "🂡",
                    "Batak"
                );
            }
        };

        handEl.appendChild(b);
    });
}

/* ============================================================
   BİLARDO
   ============================================================ */

function gameBilardo(area) {
    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Masaya tıkla ve topları ceplere gönder.
        </div>

        <canvas id="pool" class="canvas-game"
                width="700" height="400"></canvas>

        <div class="game-toolbar">
            <button class="game-btn" id="pool-shot">
                Vuruş Yap
            </button>
        </div>

        <div class="game-info" id="pool-score">
            Skor: 0
        </div>
    </div>`;

    const canvas = $("#pool");
    const ctx = canvas.getContext("2d");

    let balls = [
        {x:100,y:200,r:12},
        {x:450,y:180,r:12},
        {x:500,y:220,r:12},
        {x:550,y:200,r:12},
        {x:500,y:260,r:12}
    ];

    let scorePool = 0;

    function draw() {
        ctx.fillStyle = "#075c45";
        ctx.fillRect(0,0,700,400);

        balls.forEach((b,i) => {
            ctx.beginPath();
            ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
            ctx.fillStyle = i === 0 ? "#fff" : "#e63946";
            ctx.fill();
        });
    }

    draw();

    $("#pool-shot").onclick = () => {
        if (balls.length > 1) {
            balls.pop();
            scorePool += 25;
            $("#pool-score").textContent =
                "Skor: " + scorePool;

            draw();

            if (balls.length === 1) {
                reward(true);
                notify(
                    "Masadaki topları temizledin!",
                    "🎱",
                    "Bilardo"
                );
            }
        }
    };
}

/* ============================================================
   MAHJONG
   ============================================================ */

function gameMahjong(area) {
    const symbols = ["🀄","🌸","🎋","🐉","🦋","⭐"];

    let cards = shuffle([
        ...symbols,
        ...symbols
    ]);

    let selected = [];
    let matched = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Aynı iki taşı eşleştir.
        </div>
        <div class="cards-grid" id="mahjong-grid"></div>
    </div>`;

    const grid = $("#mahjong-grid");

    cards.forEach((symbol,i) => {
        const b = document.createElement("button");

        b.className = "flip-card";
        b.textContent = "?";

        b.onclick = () => {
            if (selected.length >= 2 ||
                b.classList.contains("open")) return;

            b.textContent = symbol;
            b.classList.add("open");
            selected.push({b,symbol});

            if (selected.length === 2) {
                if (
                    selected[0].symbol ===
                    selected[1].symbol
                ) {
                    matched++;
                    selected = [];

                    if (matched === symbols.length) {
                        reward(true);
                        notify(
                            "Tüm taşları eşleştirdin!",
                            "🀄",
                            "Mahjong"
                        );
                    }
                } else {
                    later(() => {
                        selected.forEach(x => {
                            x.b.textContent = "?";
                            x.b.classList.remove("open");
                        });

                        selected = [];
                    },600);
                }
            }
        };

        grid.appendChild(b);
    });
}

/* ============================================================
   SUDOKU
   ============================================================ */

function gameSudoku(area) {
    const puzzle = [
        5,3,0,0,7,0,0,0,0,
        6,0,0,1,9,5,0,0,0,
        0,9,8,0,0,0,0,6,0,
        8,0,0,0,6,0,0,0,3,
        4,0,0,8,0,3,0,0,1,
        7,0,0,0,2,0,0,0,6,
        0,6,0,0,0,0,2,8,0,
        0,0,0,4,1,9,0,0,5,
        0,0,0,0,8,0,0,7,9
    ];

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Eksik hücreleri doldur.
        </div>

        <div class="number-grid sudoku"
             id="sudoku-grid"></div>

        <div class="game-toolbar">
            <button class="game-btn" id="sudoku-check">
                Kontrol Et
            </button>
        </div>
    </div>`;

    const grid = $("#sudoku-grid");
    const inputs = [];

    puzzle.forEach((n,i) => {
        const b = document.createElement("button");

        b.textContent = n || "";
        b.dataset.index = i;

        if (n) {
            b.disabled = true;
            b.style.opacity = ".7";
        }

        b.onclick = () => {
            if (!n) {
                const value =
                    Number(prompt("1 ile 9 arasında sayı gir:"));

                if (value >= 1 && value <= 9) {
                    b.textContent = value;
                }
            }
        };

        inputs.push(b);
        grid.appendChild(b);
    });

    $("#sudoku-check").onclick = () => {
        const filled = inputs.filter(
            x => x.textContent !== ""
        ).length;

        if (filled >= 81) {
            reward(true);
            notify(
                "Sudoku tamamlandı!",
                "🔢",
                "Sudoku"
            );
        } else {
            notify(
                `${81-filled} hücre daha var.`,
                "🔢",
                "Sudoku"
            );
        }
    };
}

/* ============================================================
   BUBBLE SHOOTER
   ============================================================ */

function gameBubble(area) {
    let bubbles = 20;
    let scoreB = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Baloncukları patlat!
        </div>

        <div id="bubble-area"
             style="display:grid;grid-template-columns:
             repeat(5,1fr);gap:12px;max-width:500px;
             margin:auto"></div>

        <div class="game-info">
            Skor: <strong id="bubble-score">0</strong>
        </div>
    </div>`;

    const colors = ["🔴","🟡","🔵","🟢","🟣"];
    const box = $("#bubble-area");

    for(let i=0;i<bubbles;i++) {
        const b = document.createElement("button");

        b.textContent =
            colors[rand(0,colors.length-1)];

        b.style.cssText = `
            border:0;
            background:transparent;
            font-size:48px;
            cursor:pointer;
        `;

        b.onclick = () => {
            if (b.disabled) return;

            b.disabled = true;
            b.style.visibility = "hidden";

            scoreB += 10;

            $("#bubble-score").textContent = scoreB;

            if (scoreB >= 200) {
                reward(true);
                notify(
                    "Tüm baloncukları patlattın!",
                    "🫧",
                    "Bubble Shooter"
                );
            }
        };

        box.appendChild(b);
    }
}

/* ============================================================
   ARABA YARIŞI
   ============================================================ */

function gameRace(area) {
    let lane = 1;
    let points = 0;
    let running = true;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Klavyeden ← → ile aracını yönet.
        </div>

        <div class="road" id="road">
            <div class="car" id="player-car">🏎️</div>
        </div>

        <div class="game-info">
            Mesafe: <strong id="race-score">0</strong>
        </div>
    </div>`;

    const car = $("#player-car");
    const road = $("#road");

    document.onkeydown = e => {
        if (!running) return;

        if (e.key === "ArrowLeft")
            lane = Math.max(0,lane-1);

        if (e.key === "ArrowRight")
            lane = Math.min(2,lane+1);

        car.style.left =
            `calc(${16 + lane*34}% - 20px)`;
    };

    gameInterval = setInterval(() => {
        if (!running) return;

        points++;

        $("#race-score").textContent = points;

        if (points >= 100) {
            running = false;
            clearGameTimers();
            reward(true);

            notify(
                "Yarışı tamamladın!",
                "🏎️",
                "Araba Yarışı"
            );
        }
    },100);
}

/* ============================================================
   BLOCK PUZZLE
   ============================================================ */

function gameBlock(area) {
    let scoreB = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Bloklara tıkla ve puan topla.
        </div>

        <div id="block-grid"
             style="display:grid;
             grid-template-columns:repeat(6,1fr);
             max-width:450px;margin:auto;gap:5px">
        </div>

        <div class="game-info">
            Skor: <strong id="block-score">0</strong>
        </div>
    </div>`;

    const grid = $("#block-grid");

    for(let i=0;i<36;i++) {
        const b = document.createElement("button");

        b.style.cssText = `
            aspect-ratio:1;
            border:0;
            border-radius:7px;
            background:#7c3aed;
            cursor:pointer;
        `;

        b.onclick = () => {
            if (b.disabled) return;

            b.disabled = true;
            b.style.opacity = ".25";

            scoreB += 10;
            $("#block-score").textContent = scoreB;

            if (scoreB >= 250) {
                reward(true);
                notify(
                    "Puzzle tamamlandı!",
                    "🧩",
                    "Block Puzzle"
                );
            }
        };

        grid.appendChild(b);
    }
}

/* ============================================================
   OKÇULUK
   ============================================================ */

function gameArchery(area) {
    let shots = 0;
    let pointsA = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Hedefin merkezine tıkla.
        </div>

        <div class="target" id="target"></div>

        <div class="game-info">
            Atış: <strong id="archery-shot">0</strong>
            · Puan: <strong id="archery-score">0</strong>
        </div>
    </div>`;

    $("#target").onclick = e => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cx = rect.width/2;
        const cy = rect.height/2;

        const distance =
            Math.sqrt(
                Math.pow(x-cx,2) +
                Math.pow(y-cy,2)
            );

        let points = Math.max(
            10,
            Math.round(100-distance)
        );

        shots++;
        pointsA += points;

        const dot = document.createElement("div");
        dot.className = "target-dot";
        dot.style.left = x+"px";
        dot.style.top = y+"px";

        e.currentTarget.appendChild(dot);

        $("#archery-shot").textContent = shots;
        $("#archery-score").textContent = pointsA;

        if (shots >= 5) {
            reward(pointsA >= 250);

            notify(
                `5 atış tamamlandı. Puanın: ${pointsA}`,
                "🏹",
                "Okçuluk"
            );

            shots = 0;
            pointsA = 0;
        }
    };
}

/* ============================================================
   ZEKA EŞLEŞTİRME
   ============================================================ */

function gameMatching(area) {
    const questions = [
        {
            q:"2 + 2 = ?",
            a:["3","4","5","6"],
            correct:"4"
        },
        {
            q:"Türkiye'nin başkenti?",
            a:["Bursa","İstanbul","Ankara","İzmir"],
            correct:"Ankara"
        },
        {
            q:"5 × 5 = ?",
            a:["20","25","30","35"],
            correct:"25"
        },
        {
            q:"Bir haftada kaç gün vardır?",
            a:["5","6","7","8"],
            correct:"7"
        }
    ];

    let index = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div id="matching"></div>
    </div>`;

    function show() {
        if (index >= questions.length) {
            reward(true);

            notify(
                "Tüm soruları doğru bildin!",
                "🧠",
                "Zeka Eşleştirme"
            );

            return;
        }

        const q = questions[index];

        $("#matching").innerHTML = `
            <div class="match-question">${q.q}</div>

            <div class="answer-grid">
                ${q.a.map(x =>
                    `<button data-answer="${x}">
                        ${x}
                    </button>`
                ).join("")}
            </div>
        `;

        $$("#matching button").forEach(btn => {
            btn.onclick = () => {
                if (btn.dataset.answer === q.correct) {
                    index++;
                    show();
                } else {
                    reward(false);

                    notify(
                        "Yanlış cevap.",
                        "🧠",
                        "Tekrar Dene"
                    );
                }
            };
        });
    }

    show();
}

/* ============================================================
   HAFIZA
   ============================================================ */

function gameMemory(area) {
    const icons = ["🍎","🚗","⚽","🎮","🐱","🚀"];
    const cards = shuffle([...icons,...icons]);

    let opened = [];
    let matched = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Tüm çiftleri bul.
        </div>

        <div class="cards-grid" id="memory-grid"></div>
    </div>`;

    const grid = $("#memory-grid");

    cards.forEach(symbol => {
        const b = document.createElement("button");

        b.className = "flip-card";
        b.textContent = "?";

        b.onclick = () => {
            if (
                b.classList.contains("open") ||
                opened.length >= 2
            ) return;

            b.classList.add("open");
            b.textContent = symbol;

            opened.push({b,symbol});

            if (opened.length === 2) {
                if (
                    opened[0].symbol ===
                    opened[1].symbol
                ) {
                    matched++;
                    opened = [];

                    if (matched === icons.length) {
                        reward(true);

                        notify(
                            "Hafıza oyununu tamamladın!",
                            "🃏",
                            "Tebrikler"
                        );
                    }
                } else {
                    later(() => {
                        opened.forEach(x => {
                            x.b.textContent = "?";
                            x.b.classList.remove("open");
                        });

                        opened = [];
                    },700);
                }
            }
        };

        grid.appendChild(b);
    });
}

/* ============================================================
   YILAN
   ============================================================ */

function gameSnake(area) {
    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Yön tuşları veya WASD ile oyna.
        </div>

        <canvas id="snake-canvas"
                class="canvas-game"
                width="400"
                height="400"></canvas>

        <div class="game-info">
            Skor: <strong id="snake-score">0</strong>
        </div>
    </div>`;

    const canvas = $("#snake-canvas");
    const ctx = canvas.getContext("2d");

    const size = 20;

    let snake = [
        {x:10,y:10},
        {x:9,y:10},
        {x:8,y:10}
    ];

    let food = {
        x:rand(0,19),
        y:rand(0,19)
    };

    let dx = 1;
    let dy = 0;
    let snakeScore = 0;
    let alive = true;

    function key(e) {
        if (
            (e.key==="ArrowUp" || e.key==="w") &&
            dy !== 1
        ) {
            dx=0;dy=-1;
        }

        if (
            (e.key==="ArrowDown" || e.key==="s") &&
            dy !== -1
        ) {
            dx=0;dy=1;
        }

        if (
            (e.key==="ArrowLeft" || e.key==="a") &&
            dx !== 1
        ) {
            dx=-1;dy=0;
        }

        if (
            (e.key==="ArrowRight" || e.key==="d") &&
            dx !== -1
        ) {
            dx=1;dy=0;
        }
    }

    document.addEventListener("keydown",key);

    function draw() {
        ctx.fillStyle="#07111f";
        ctx.fillRect(0,0,400,400);

        ctx.fillStyle="#38b000";

        snake.forEach(p => {
            ctx.fillRect(
                p.x*size,
                p.y*size,
                size-2,
                size-2
            );
        });

        ctx.fillStyle="#ef233c";

        ctx.fillRect(
            food.x*size,
            food.y*size,
            size-2,
            size-2
        );
    }

    gameInterval = setInterval(() => {
        if (!alive) return;

        const head = {
            x:snake[0].x+dx,
            y:snake[0].y+dy
        };

        if (
            head.x<0 ||
            head.x>=20 ||
            head.y<0 ||
            head.y>=20 ||
            snake.some(p =>
                p.x===head.x &&
                p.y===head.y
            )
        ) {
            alive=false;
            clearGameTimers();

            reward(false);

            notify(
                "Oyun bitti. Skor: "+snakeScore,
                "🐍",
                "Yılan"
            );

            document.removeEventListener(
                "keydown",
                key
            );

            return;
        }

        snake.unshift(head);

        if (
            head.x===food.x &&
            head.y===food.y
        ) {
            snakeScore += 10;

            $("#snake-score").textContent =
                snakeScore;

            food = {
                x:rand(0,19),
                y:rand(0,19)
            };

            if (snakeScore >= 100) {
                alive=false;
                clearGameTimers();
                reward(true);

                notify(
                    "Harika! 100 puana ulaştın.",
                    "🐍",
                    "Kazandın"
                );
            }
        } else {
            snake.pop();
        }

        draw();
    },120);

    draw();
}

/* ============================================================
   BASKET ATIŞI
   ============================================================ */

function gameBasket(area) {
    let shots = 0;
    let scored = 0;

    area.innerHTML += `
    <div class="game-wrap">
        <div class="game-info">
            Topa tıkla ve potaya at!
        </div>

        <div class="basket-court">
            <div class="hoop">🏀⭕</div>
            <div class="basket-ball" id="basket-ball">🏀</div>
        </div>

        <div class="game-info">
            İsabet:
            <strong id="basket-score">0</strong>
            / 5
        </div>
    </div>`;

    const ball = $("#basket-ball");

    ball.onclick = () => {
        if (shots >= 5) return;

        shots++;

        const success = Math.random() > .35;

        if (success) {
            scored++;
            ball.style.left = "70%";
            ball.style.bottom = "65%";

            later(() => {
                ball.style.left = "20%";
                ball.style.bottom = "25px";
            },500);
        }

        $("#basket-score").textContent = scored;

        if (shots >= 5) {
            reward(scored >= 3);

            notify(
                `5 atışta ${scored} isabet yaptın.`,
                "🏀",
                "Basket Atışı"
            );
        }
    };
}

/* ============================================================
   REKLAM / ÖDÜL BUTONU
   ============================================================ */

function setupRewardButton() {
    const btn = $("#watch-ad-btn");
    if (!btn) return;

    btn.onclick = () => {
        /*
          Gerçek reklam ağı bağlanana kadar demo ödülü.
          Kullanıcı reklam tıklamasına yönlendirilmez.
        */

        btn.disabled = true;

        let seconds = 5;

        const original = btn.innerHTML;

        btn.innerHTML =
            `⏳ Ödül hazırlanıyor... ${seconds}`;

        const timer = setInterval(() => {
            seconds--;

            btn.innerHTML =
                `⏳ Ödül hazırlanıyor... ${seconds}`;

            if (seconds <= 0) {
                clearInterval(timer);

                score += 100;
                coins += 25;

                saveProgress();
                updateUI();

                btn.disabled = false;
                btn.innerHTML = original;

                notify(
                    "100 puan ve 25 coin kazandın!",
                    "🎁",
                    "Ödül"
                );
            }
        },1000);
    };
}

/* ============================================================
   FİLTRELER
   ============================================================ */

function setupFilters() {
    const buttons = $$(".cat-btn, .game-filter");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            renderGames(
                btn.dataset.filter || "all"
            );
        });
    });
}

/* ============================================================
   MODAL KONTROLLERİ
   ============================================================ */

function setupModal() {
    const close = $("#close-modal-btn");

    if (close) {
        close.onclick = closeGame;
    }

    const modal = $("#game-modal");

    if (modal) {
        modal.addEventListener("click", e => {
            if (e.target === modal) {
                closeGame();
            }
        });
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeGame();
        }
    });
}

/* ============================================================
   BAŞLAT
   ============================================================ */

function init() {
    updateUI();
    renderGames("all");
    setupFilters();
    setupRewardButton();
    setupModal();

    console.log(
        "OynaKazan hazır. 15 oyun yüklendi."
    );
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        init
    );
} else {
    init();
}

})();
