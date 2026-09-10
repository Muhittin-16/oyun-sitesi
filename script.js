/* =========================================================
   OYUN DÜNYASI / OYNAKAZAN
   15 OYUN - GELİŞMİŞ ÇALIŞAN OYUN MOTORU
   SEVİYE 1-100
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
"use strict";

/* =========================================================
   AYARLAR
   ========================================================= */

const START_SCORE = 500;
const ENTRY_COST = 50;
const AD_REWARD = 100;

const SCORE_KEY = "oynakazan_score";
const XP_KEY = "oynakazan_xp";
const LEVEL_KEY = "oynakazan_level";
const PLAYED_KEY = "oynakazan_played";
const STATS_KEY = "oyunDunyasiStats";

/* =========================================================
   DOM
   ========================================================= */

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

let gamesContainer = $("#games-container");
let gameModal = $("#game-modal");
let gameArea = $("#game-area");
let modalTitle = $("#modal-game-title");
let modalCategory = $("#modal-category");
let closeModalBtn = $("#close-modal-btn");

let userScore = $("#user-score");

const messageModal = $("#message-modal");
const messageTitle = $("#message-title");
const messageText = $("#message-text");
const messageClose = $("#message-close");
const watchAdBtn = $("#watch-ad-btn");

/* =========================================================
   MODAL GARANTİSİ
   ========================================================= */

function ensureGameModal() {

    if (!gameModal) {
        gameModal = document.createElement("div");
        gameModal.id = "game-modal";
        gameModal.className = "game-modal hidden";

        gameModal.innerHTML = `
            <div class="game-modal-inner">
                <div class="game-modal-header">
                    <div>
                        <h2 id="modal-game-title"></h2>
                        <div id="modal-category"></div>
                    </div>
                    <button id="close-modal-btn" class="game-close-btn">✕</button>
                </div>
                <div id="game-area"></div>
            </div>
        `;

        document.body.appendChild(gameModal);

        gameArea = $("#game-area", gameModal);
        modalTitle = $("#modal-game-title", gameModal);
        modalCategory = $("#modal-category", gameModal);
        closeModalBtn = $("#close-modal-btn", gameModal);
    }

    if (!gameArea) {
        gameArea = document.createElement("div");
        gameArea.id = "game-area";
        gameModal.appendChild(gameArea);
    }

    if (!modalTitle) {
        modalTitle = document.createElement("h2");
        modalTitle.id = "modal-game-title";
        gameModal.prepend(modalTitle);
    }

    if (!modalCategory) {
        modalCategory = document.createElement("div");
        modalCategory.id = "modal-category";
        gameModal.prepend(modalCategory);
    }

    if (!closeModalBtn) {
        closeModalBtn = document.createElement("button");
        closeModalBtn.id = "close-modal-btn";
        closeModalBtn.textContent = "✕";
        gameModal.appendChild(closeModalBtn);
    }

    return gameModal;
}

ensureGameModal();

/* =========================================================
   OYUN CSS
   ========================================================= */

const style = document.createElement("style");

style.textContent = `
/* =====================================================
   MODAL
   ===================================================== */

#game-modal,
.game-modal{
    position:fixed !important;
    inset:0 !important;
    z-index:99999 !important;
    display:none !important;
    align-items:center !important;
    justify-content:center !important;
    padding:15px !important;
    background:rgba(0,0,0,.82) !important;
    overflow:auto !important;
}

#game-modal.active,
.game-modal.active{
    display:flex !important;
}

#game-modal.hidden,
.game-modal.hidden{
    display:none !important;
}

.game-modal-inner{
    width:min(1150px,100%);
    max-height:96vh;
    overflow:auto;
    background:#080d1d;
    border:1px solid rgba(255,255,255,.12);
    border-radius:22px;
    box-shadow:0 30px 90px rgba(0,0,0,.65);
    padding:18px;
    color:#fff;
}

.game-modal-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:15px;
    margin-bottom:12px;
}

.game-modal-header h2{
    margin:0;
    font-size:24px;
}

#modal-category{
    margin-top:4px;
    opacity:.7;
    font-size:13px;
}

.game-close-btn{
    border:0;
    background:#e74c3c;
    color:#fff;
    width:42px;
    height:42px;
    border-radius:50%;
    font-size:20px;
    cursor:pointer;
}

/* =====================================================
   GENEL
   ===================================================== */

.game-shell{
    width:100%;
    max-width:1100px;
    margin:auto;
    color:#fff;
    font-family:Arial,sans-serif;
}

.game-toolbar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
    background:rgba(255,255,255,.06);
    padding:12px;
    border-radius:16px;
    margin-bottom:15px;
}

.game-button{
    border:0;
    padding:10px 16px;
    border-radius:10px;
    background:#6c63ff;
    color:#fff;
    font-weight:700;
    cursor:pointer;
    transition:.2s;
}

.game-button:hover{
    transform:translateY(-2px);
    filter:brightness(1.15);
}

.game-button:disabled{
    opacity:.4;
    cursor:not-allowed;
    transform:none;
}

.game-info{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
}

.info-box{
    background:rgba(255,255,255,.08);
    border-radius:10px;
    padding:8px 12px;
}

.level-bar{
    width:100%;
    height:8px;
    background:#20263e;
    border-radius:20px;
    overflow:hidden;
}

.level-fill{
    height:100%;
    width:0%;
    background:linear-gradient(90deg,#6c63ff,#00d4ff);
    transition:.3s;
}

.board{
    position:relative;
    border-radius:22px;
    padding:20px;
    min-height:520px;
    box-shadow:0 15px 45px rgba(0,0,0,.35);
}

.table-title{
    text-align:center;
    font-size:22px;
    font-weight:800;
    margin-bottom:15px;
}

/* =====================================================
   OYUN KARTLARI
   ===================================================== */

.game-card{
    position:relative;
    overflow:hidden;
}

.game-card .game-card-content{
    position:relative;
    z-index:2;
}

.game-visual{
    width:100%;
    min-height:100px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:58px;
    border-radius:15px;
    margin-bottom:10px;
    background:
      radial-gradient(circle at 30% 20%,rgba(255,255,255,.15),transparent 35%),
      linear-gradient(135deg,#171d3b,#0d1329);
}

/* =====================================================
   OKEY
   ===================================================== */

.okey-table{
    background:
      radial-gradient(circle at center,#17844f,#07552f);
}

.okey-opponents{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    margin-bottom:15px;
}

.okey-player{
    background:rgba(0,0,0,.28);
    border-radius:12px;
    padding:10px;
    text-align:center;
    border:1px solid rgba(255,255,255,.08);
}

.okey-hand-count{
    font-size:13px;
    opacity:.8;
}

.okey-center{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:20px;
    flex-wrap:wrap;
    min-height:140px;
}

.okey-pile{
    width:72px;
    height:98px;
    border-radius:9px;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f2eadc;
    color:#222;
    font-size:24px;
    font-weight:800;
    box-shadow:0 5px 12px #0007;
}

.okey-pile small{
    display:block;
    font-size:11px;
}

.okey-rack{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    flex-wrap:wrap;
    gap:4px;
    background:#633d20;
    padding:15px;
    border-radius:12px;
    min-height:120px;
}

.okey-tile{
    width:40px;
    height:58px;
    border-radius:6px;
    background:#fff9ec;
    border:2px solid #d8cdb9;
    color:#222;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:17px;
    font-weight:800;
    cursor:pointer;
    box-shadow:0 3px 6px #0005;
    user-select:none;
    transition:.15s;
}

.okey-tile:hover{
    transform:translateY(-4px);
}

.okey-tile.selected{
    transform:translateY(-15px);
    border-color:#ffd166;
    box-shadow:0 8px 16px #0008;
}

.okey-red{color:#d92727}
.okey-blue{color:#174bb8}
.okey-black{color:#111}
.okey-green{color:#128a46}

.okey-melds{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    min-height:80px;
    padding:10px;
    margin-bottom:10px;
    background:rgba(0,0,0,.18);
    border-radius:12px;
}

.meld{
    display:flex;
    gap:2px;
    padding:5px;
    border-radius:8px;
    background:rgba(255,255,255,.08);
}

.meld .okey-tile{
    width:34px;
    height:48px;
    font-size:14px;
    cursor:default;
}

/* =====================================================
   TAVLA
   ===================================================== */

.backgammon{
    background:#613a1f;
}

.tavla-board{
    display:grid;
    grid-template-columns:1fr 72px 1fr;
    min-height:500px;
    background:#a46a35;
    border:10px solid #432512;
    border-radius:14px;
    padding:12px;
    gap:10px;
}

.tavla-half{
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:4px;
}

.tavla-point{
    position:relative;
    background:linear-gradient(180deg,#6b391c,#bd8248);
    min-height:210px;
    border-radius:4px;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    transition:.15s;
}

.tavla-point:nth-child(even){
    background:linear-gradient(180deg,#d2a166,#74431f);
}

.tavla-point.bottom{
    justify-content:flex-end;
}

.tavla-point.selected{
    outline:4px solid #ffd166;
}

.tavla-point.legal{
    box-shadow:inset 0 0 0 4px #00d4ff;
}

.point-number{
    position:absolute;
    top:3px;
    left:5px;
    font-size:10px;
    opacity:.7;
    color:#fff;
}

.tavla-point.bottom .point-number{
    top:auto;
    bottom:3px;
}

.checker{
    width:42px;
    height:42px;
    border-radius:50%;
    margin:1px;
    border:2px solid #222;
    box-shadow:0 3px 5px #0007;
    flex-shrink:0;
}

.checker.white{
    background:#f0ead8;
}

.checker.black{
    background:#242424;
}

.tavla-middle{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:10px;
}

.dice{
    font-size:38px;
    font-weight:900;
    background:#fff;
    color:#111;
    border-radius:10px;
    padding:8px 12px;
    text-align:center;
}

/* =====================================================
   DAMA
   ===================================================== */

.dama-board{
    width:min(90vw,560px);
    aspect-ratio:1;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(8,1fr);
    border:8px solid #4a2816;
}

.dama-cell{
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    position:relative;
}

.dama-cell.light{
    background:#e4c79a;
}

.dama-cell.dark{
    background:#6e4025;
}

.dama-cell.selected{
    outline:4px solid #ffd166;
    outline-offset:-4px;
}

.dama-cell.legal{
    box-shadow:inset 0 0 0 5px #00d4ff;
}

.dama-piece{
    width:72%;
    aspect-ratio:1;
    border-radius:50%;
    border:3px solid #111;
    box-shadow:0 4px 7px #0008;
}

.dama-piece.white{
    background:#f5eee0;
}

.dama-piece.black{
    background:#191919;
}

.dama-piece.king{
    border-color:#ffd166;
}

.dama-piece.king::after{
    content:"♛";
    font-size:22px;
    color:#ffd166;
}

/* =====================================================
   BATAK
   ===================================================== */

.batak-table{
    background:
      radial-gradient(circle,#167c4c,#06472b);
    min-height:550px;
}

.batak-seats{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    margin-bottom:15px;
}

.batak-seat{
    background:rgba(0,0,0,.25);
    border-radius:12px;
    padding:10px;
    text-align:center;
}

.batak-center{
    text-align:center;
    min-height:170px;
}

.batak-trick{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
    gap:8px;
    min-height:130px;
}

.playing-card{
    width:58px;
    height:82px;
    border-radius:7px;
    background:#fff;
    color:#111;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:900;
    font-size:18px;
    cursor:pointer;
    box-shadow:0 5px 10px #0007;
    user-select:none;
}

.playing-card.red{
    color:#c92727;
}

.playing-card.disabled{
    opacity:.3;
    cursor:not-allowed;
}

/* =====================================================
   BİLARDO
   ===================================================== */

.pool-wrap{
    width:min(96vw,950px);
    margin:auto;
}

.pool-canvas{
    width:100%;
    aspect-ratio:2/1;
    background:#08704c;
    border:18px solid #5b321b;
    border-radius:25px;
    box-shadow:inset 0 0 0 4px #d4a35e,0 12px 35px #0009;
    touch-action:none;
    display:block;
}

.pool-help{
    text-align:center;
    margin:10px;
    opacity:.85;
}

/* =====================================================
   DİĞER OYUNLAR
   ===================================================== */

.simple-game{
    min-height:500px;
    padding:20px;
    border-radius:18px;
    background:rgba(255,255,255,.05);
    text-align:center;
}

.game-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:8px;
    max-width:500px;
    margin:20px auto;
}

.grid-cell{
    aspect-ratio:1;
    background:#252c48;
    border-radius:10px;
    cursor:pointer;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:26px;
    user-select:none;
}

.memory-card{
    aspect-ratio:1;
    background:#292f4a;
    border-radius:12px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:30px;
    cursor:pointer;
    user-select:none;
}

.memory-card.open{
    background:#fff;
    color:#111;
}

.memory-card.done{
    opacity:.35;
}

.sudoku{
    display:grid;
    grid-template-columns:repeat(9,1fr);
    max-width:450px;
    margin:20px auto;
}

.sudoku input{
    width:100%;
    aspect-ratio:1;
    text-align:center;
    font-size:20px;
    border:1px solid #555;
    background:#fff;
    color:#111;
}

.snake-canvas,
.race-canvas,
.bubble-canvas{
    display:block;
    width:min(95vw,600px);
    height:auto;
    margin:20px auto;
    border-radius:15px;
    background:#11182d;
}

.target{
    width:100px;
    height:100px;
    border-radius:50%;
    background:
      radial-gradient(circle,#111 0 12%,#fff 13% 25%,#d33 26% 45%,#fff 46% 60%,#d33 61%);
    position:absolute;
    cursor:pointer;
}

.basket-hoop{
    width:170px;
    height:110px;
    border:10px solid #e33;
    border-top:0;
    margin:80px auto 20px;
    border-radius:0 0 90px 90px;
}

.basket-ball{
    width:45px;
    height:45px;
    border-radius:50%;
    background:#e87922;
    margin:auto;
    cursor:pointer;
}

.block-grid{
    display:grid;
    grid-template-columns:repeat(8,1fr);
    gap:4px;
    max-width:450px;
    margin:auto;
}

.block-cell{
    aspect-ratio:1;
    border-radius:4px;
    background:#222a42;
    cursor:pointer;
}

.block-cell.filled{
    background:#6c63ff;
}

@media(max-width:700px){

    .game-modal-inner{
        padding:10px;
        border-radius:15px;
    }

    .okey-tile{
        width:31px;
        height:45px;
        font-size:13px;
    }

    .tavla-board{
        grid-template-columns:1fr 45px 1fr;
        padding:5px;
        gap:4px;
    }

    .checker{
        width:28px;
        height:28px;
    }

    .dama-board{
        border-width:4px;
    }

    .playing-card{
        width:45px;
        height:64px;
        font-size:14px;
    }

    .game-button{
        padding:9px 11px;
        font-size:13px;
    }

    .game-modal-header h2{
        font-size:19px;
    }
}
`;

document.head.appendChild(style);

/* =========================================================
   OYUNCU SİSTEMİ
   ========================================================= */

let score = Number(localStorage.getItem(SCORE_KEY));

if (!Number.isFinite(score) || score < 0) {
    score = START_SCORE;
}

let xp = Number(localStorage.getItem(XP_KEY)) || 0;
let level = Number(localStorage.getItem(LEVEL_KEY)) || 1;
let played = Number(localStorage.getItem(PLAYED_KEY)) || 0;

level = Math.max(1, Math.min(100, level));

function xpNeeded(lv) {
    return 100 + ((lv - 1) * 25);
}

function updateLevel() {

    while (level < 100 && xp >= xpNeeded(level)) {
        xp -= xpNeeded(level);
        level++;
    }

    if (level >= 100) {
        level = 100;
        xp = Math.min(xp, xpNeeded(100) - 1);
    }

    localStorage.setItem(XP_KEY, xp);
    localStorage.setItem(LEVEL_KEY, level);
}

function addXP(amount) {

    if (!Number.isFinite(amount) || amount <= 0)
        return;

    xp += amount;
    updateLevel();
    updateScoreUI();
}

function updateScoreUI() {

    if (userScore)
        userScore.textContent = score;

    $$("[data-score]").forEach(elm => {
        elm.textContent = score;
    });

    $$("[data-level]").forEach(elm => {
        elm.textContent = level;
    });

    $$("[data-xp]").forEach(elm => {
        elm.textContent = xp;
    });

    localStorage.setItem(SCORE_KEY, score);
    localStorage.setItem(XP_KEY, xp);
    localStorage.setItem(LEVEL_KEY, level);
    localStorage.setItem(PLAYED_KEY, played);

    let stat = {};

    try {
        stat = JSON.parse(
            localStorage.getItem(STATS_KEY) || "{}"
        );
    } catch (e) {
        stat = {};
    }

    stat.best = Math.max(stat.best || 0, score);
    stat.played = played;
    stat.coins = score;
    stat.xp = xp;
    stat.level = level;

    localStorage.setItem(
        STATS_KEY,
        JSON.stringify(stat)
    );
}

function changeScore(amount) {

    score += amount;

    if (score < 0)
        score = 0;

    updateScoreUI();
}

function startPaidGame(game) {

    const paidTypes = [
        "okey",
        "tavla",
        "dama",
        "batak",
        "bilardo"
    ];

    if (!paidTypes.includes(game.type))
        return true;

    if (score < ENTRY_COST) {

        showMessage(
            "Yetersiz Puan",
            "Bu masa oyununa girmek için " +
            ENTRY_COST +
            " puan gerekiyor."
        );

        return false;
    }

    changeScore(-ENTRY_COST);
    return true;
}

/* =========================================================
   OYUN SONUCU
   ========================================================= */

let resultAlreadyGiven = false;

function winGame(points = 100) {

    if (resultAlreadyGiven)
        return;

    resultAlreadyGiven = true;

    changeScore(points);
    addXP(50);
    played++;

    updateScoreUI();

    showMessage(
        "🏆 Kazandın!",
        "+" + points +
        " puan ve +50 XP kazandın."
    );
}

function loseGame() {

    if (resultAlreadyGiven)
        return;

    resultAlreadyGiven = true;

    addXP(15);
    played++;

    updateScoreUI();

    showMessage(
        "Oyun Bitti",
        "+15 XP kazandın. Tekrar deneyebilirsin."
    );
}

/* =========================================================
   MESAJ
   ========================================================= */

function showMessage(title, text) {

    if (messageTitle)
        messageTitle.textContent = title;

    if (messageText)
        messageText.textContent = text;

    if (messageModal) {
        messageModal.classList.remove("hidden");
        messageModal.classList.add("active");
    } else {
        alert(title + "\n\n" + text);
    }
}

function hideMessage() {

    if (messageModal) {
        messageModal.classList.remove("active");
        messageModal.classList.add("hidden");
    }
}

if (messageClose)
    messageClose.addEventListener("click", hideMessage);

/* =========================================================
   YARDIMCILAR
   ========================================================= */

function rand(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}

function botName(i) {

    const names = [
        "Ahmet",
        "Mehmet",
        "Ayşe",
        "Zeynep",
        "Can",
        "Emre",
        "Mert",
        "Deniz"
    ];

    return names[i % names.length];
}

function el(tag, className, text) {

    const e = document.createElement(tag);

    if (className)
        e.className = className;

    if (text !== undefined)
        e.textContent = text;

    return e;
}

/* =========================================================
   OYUNLAR
   ========================================================= */

const games = [

    {
        id:1,
        title:"101 Okey",
        type:"okey",
        category:"Masa Oyunları",
        icon:"🀄",
        description:"4 kişilik 101 Okey masası"
    },

    {
        id:2,
        title:"Klasik Tavla",
        type:"tavla",
        category:"Masa Oyunları",
        icon:"🎲",
        description:"Zarlı klasik tavla"
    },

    {
        id:3,
        title:"Türk Daması",
        type:"dama",
        category:"Masa Oyunları",
        icon:"⚫",
        description:"Zorunlu alma kurallı dama"
    },

    {
        id:4,
        title:"Batak",
        type:"batak",
        category:"Kart Oyunları",
        icon:"🃏",
        description:"4 kişilik kozlu Batak"
    },

    {
        id:5,
        title:"Bilardo",
        type:"bilardo",
        category:"Spor",
        icon:"🎱",
        description:"Fizikli bilardo masası"
    },

    {
        id:6,
        title:"Mahjong",
        type:"mahjong",
        category:"Zeka Oyunları",
        icon:"🀄",
        description:"Taş eşleştirme"
    },

    {
        id:7,
        title:"Sudoku",
        type:"sudoku",
        category:"Zeka Oyunları",
        icon:"🔢",
        description:"9x9 Sudoku"
    },

    {
        id:8,
        title:"Bubble Shooter",
        type:"bubble",
        category:"Eğlence",
        icon:"🔵",
        description:"Baloncuk patlat"
    },

    {
        id:9,
        title:"Araba Yarışı",
        type:"race",
        category:"Yarış",
        icon:"🏎️",
        description:"Engellerden kaç"
    },

    {
        id:10,
        title:"Block Puzzle",
        type:"block",
        category:"Zeka Oyunları",
        icon:"🧱",
        description:"Satırları tamamla"
    },

    {
        id:11,
        title:"Okçuluk",
        type:"archery",
        category:"Beceri",
        icon:"🏹",
        description:"Hedefi vur"
    },

    {
        id:12,
        title:"Zeka Eşleştirme",
        type:"memory",
        category:"Zeka Oyunları",
        icon:"🧠",
        description:"Kartları eşleştir"
    },

    {
        id:13,
        title:"Hafıza Oyunu",
        type:"memory2",
        category:"Zeka Oyunları",
        icon:"🧩",
        description:"Zor hafıza modu"
    },

    {
        id:14,
        title:"Yılan Oyunu",
        type:"snake",
        category:"Arcade",
        icon:"🐍",
        description:"Klasik yılan"
    },

    {
        id:15,
        title:"Basket Atışı",
        type:"basket",
        category:"Spor",
        icon:"🏀",
        description:"10 atışta en yüksek skor"
    }

];

/* =========================================================
   KATEGORİ NORMALİZASYONU
   ========================================================= */

function normalizeFilter(value) {

    if (!value)
        return "Tümü";

    const v = String(value).trim().toLowerCase();

    if (
        v === "all" ||
        v === "tümü" ||
        v === "tum" ||
        v === "tüm oyunlar" ||
        v === "tum oyunlar"
    )
        return "Tümü";

    return String(value).trim();
}

/* =========================================================
   OYUN KARTLARI
   ========================================================= */

function renderGames(filter = "Tümü") {

    if (!gamesContainer)
        return;

    filter = normalizeFilter(filter);

    gamesContainer.innerHTML = "";

    const list =
        filter === "Tümü"
            ? games
            : games.filter(
                g =>
                    g.category.toLowerCase() ===
                    filter.toLowerCase()
            );

    list.forEach(game => {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <div class="game-visual">
                ${game.icon}
            </div>

            <div class="game-card-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <small>${game.category} • Seviye 1-100</small>

                <br><br>

                <button
                    class="game-button play-game"
                    data-id="${game.id}">
                    🎮 Oyna
                </button>
            </div>
        `;

        gamesContainer.appendChild(card);
    });

    $$(".play-game", gamesContainer)
        .forEach(btn => {

            btn.addEventListener(
                "click",
                function () {

                    const game =
                        games.find(
                            g =>
                                g.id ===
                                Number(btn.dataset.id)
                        );

                    if (game)
                        openGame(game);
                }
            );
        });
}

/*
   Mevcut HTML'deki oyun kartlarını kullanmak
   yerine motorun 15 oyunu garanti etmesi.
*/

renderGames();

/* =========================================================
   KATEGORİ BUTONLARI
   ========================================================= */

$$(".cat-btn")
.forEach(btn => {

    btn.addEventListener(
        "click",
        function () {

            $$(".cat-btn")
                .forEach(x =>
                    x.classList.remove("active")
                );

            btn.classList.add("active");

            renderGames(
                btn.dataset.filter ||
                btn.textContent.trim()
            );
        }
    );
});

/* =========================================================
   OYUN AÇMA
   ========================================================= */

let currentCleanup = null;

function openGame(game) {

    if (!startPaidGame(game))
        return;

    if (currentCleanup) {
        try {
            currentCleanup();
        } catch (e) {}
        currentCleanup = null;
    }

    resultAlreadyGiven = false;

    ensureGameModal();

    if (gameArea)
        gameArea.innerHTML = "";

    if (modalTitle)
        modalTitle.textContent = game.title;

    if (modalCategory)
        modalCategory.textContent =
            game.category +
            " • Seviye " +
            level +
            "/100";

    /*
       KRİTİK DÜZELTME:
       hidden sınıfını kaldırıyoruz.
    */

    gameModal.classList.remove("hidden");
    gameModal.classList.add("active");
    gameModal.style.setProperty(
        "display",
        "flex",
        "important"
    );

    document.body.style.overflow = "hidden";

    switch (game.type) {

        case "okey":
            currentCleanup = createOkey();
            break;

        case "tavla":
            currentCleanup = createTavla();
            break;

        case "dama":
            currentCleanup = createDama();
            break;

        case "batak":
            currentCleanup = createBatak();
            break;

        case "bilardo":
            currentCleanup = createBilardo();
            break;

        case "mahjong":
            currentCleanup = createMahjong();
            break;

        case "sudoku":
            currentCleanup = createSudoku();
            break;

        case "bubble":
            currentCleanup = createBubble();
            break;

        case "race":
            currentCleanup = createRace();
            break;

        case "block":
            currentCleanup = createBlock();
            break;

        case "archery":
            currentCleanup = createArchery();
            break;

        case "memory":
            currentCleanup = createMemory(false);
            break;

        case "memory2":
            currentCleanup = createMemory(true);
            break;

        case "snake":
            currentCleanup = createSnake();
            break;

        case "basket":
            currentCleanup = createBasket();
            break;
    }
}

function closeGame() {

    if (currentCleanup) {

        try {
            currentCleanup();
        } catch (e) {}

        currentCleanup = null;
    }

    if (gameArea)
        gameArea.innerHTML = "";

    if (gameModal) {

        gameModal.classList.remove("active");
        gameModal.classList.add("hidden");

        gameModal.style.setProperty(
            "display",
            "none",
            "important"
        );
    }

    document.body.style.overflow = "";
}

if (closeModalBtn)
    closeModalBtn.addEventListener(
        "click",
        closeGame
    );

/* =========================================================
   101 OKEY
   ========================================================= */

function createOkey() {

    let stopped = false;
    let turn = 0;
    let botTimer = null;

    const root = el("div","game-shell");
    const board = el("div","board okey-table");

    root.appendChild(board);
    gameArea.appendChild(root);

    const toolbar = el(
        "div",
        "game-toolbar"
    );

    const status = el(
        "div",
        "game-info"
    );

    const levelBox = el(
        "div",
        "info-box",
        "Seviye " + level + "/100"
    );

    const xpBox = el(
        "div",
        "info-box",
        "XP " + xp
    );

    const turnBox = el(
        "div",
        "info-box",
        "Sıra: Sen"
    );

    status.append(
        levelBox,
        xpBox,
        turnBox
    );

    const newBtn = el(
        "button",
        "game-button",
        "Yeni El"
    );

    toolbar.append(status,newBtn);
    root.insertBefore(toolbar,board);

    const title = el(
        "div",
        "table-title",
        "🀄 101 Okey • 4 Kişilik Masa"
    );

    board.appendChild(title);

    const opponents =
        el("div","okey-opponents");

    const opponentEls = [];

    for (let i=0;i<3;i++) {

        const p = el(
            "div",
            "okey-player"
        );

        p.innerHTML = `
            <strong>🤖 ${botName(i)}</strong>
            <div class="okey-hand-count">
                21 taş
            </div>
        `;

        opponentEls.push(p);
        opponents.appendChild(p);
    }

    board.appendChild(opponents);

    const center = el(
        "div",
        "okey-center"
    );

    const deckEl = el(
        "div",
        "okey-pile",
        "🀄"
    );

    const indicatorEl = el(
        "div",
        "okey-pile"
    );

    const discardEl = el(
        "div",
        "okey-pile",
        "—"
    );

    center.append(
        deckEl,
        indicatorEl,
        discardEl
    );

    board.appendChild(center);

    const labels = el(
        "div",
        "game-info"
    );

    labels.style.justifyContent = "center";
    labels.innerHTML = `
        <div class="info-box">Deste</div>
        <div class="info-box">Gösterge</div>
        <div class="info-box">Atılan</div>
    `;

    board.appendChild(labels);

    const meldTitle = el(
        "div",
        "",
        "Açılmış Perler"
    );

    board.appendChild(meldTitle);

    const meldsEl =
        el("div","okey-melds");

    board.appendChild(meldsEl);

    const rack =
        el("div","okey-rack");

    board.appendChild(rack);

    const controls =
        el("div","game-toolbar");

    const drawBtn = el(
        "button",
        "game-button",
        "🀄 Taş Çek"
    );

    const takeBtn = el(
        "button",
        "game-button",
        "📥 Yerden Al"
    );

    const discardBtn = el(
        "button",
        "game-button",
        "📤 Taş At"
    );

    const openBtn = el(
        "button",
        "game-button",
        "101 Aç"
    );

    const sortBtn = el(
        "button",
        "game-button",
        "↕ Sırala"
    );

    controls.append(
        drawBtn,
        takeBtn,
        openBtn,
        discardBtn,
        sortBtn
    );

    root.appendChild(controls);

    let deck = [];
    let hand = [];
    let bots = [[],[],[]];

    let discard = [];
    let tableMelds = [];

    let selected = new Set();

    let hasOpened = false;
    let drawnThisTurn = false;
    let gameOver = false;

    let indicator = null;
    let okeyNumber = null;

    /* -----------------------------------------------------
       DESTE
       ----------------------------------------------------- */

    function makeDeck() {

        const d = [];

        const colors = [
            {name:"red",symbol:"♥"},
            {name:"blue",symbol:"◆"},
            {name:"black",symbol:"♠"},
            {name:"green",symbol:"♣"}
        ];

        for (const color of colors) {

            for (let copy=0;copy<2;copy++) {

                for (let value=1;value<=13;value++) {

                    d.push({
                        color:color.name,
                        symbol:color.symbol,
                        value:value,
                        id:
                            color.name +
                            "-" +
                            value +
                            "-" +
                            copy
                    });
                }
            }
        }

        d.push(
            {
                fake:true,
                id:"fake1"
            },
            {
                fake:true,
                id:"fake2"
            }
        );

        return shuffle(d);
    }

    function tileText(tile) {

        if (tile.fake)
            return "★";

        if (tile.value === okeyNumber)
            return tile.symbol + tile.value + "★";

        return tile.symbol + tile.value;
    }

    function tilePoint(tile) {

        if (tile.fake)
            return okeyNumber || 1;

        return tile.value;
    }

    function sortHand() {

        hand.sort((a,b) => {

            if (a.fake && !b.fake)
                return 1;

            if (!a.fake && b.fake)
                return -1;

            if ((a.color || "") !== (b.color || ""))
                return (a.color || "")
                    .localeCompare(b.color || "");

            return (a.value || 0) -
                   (b.value || 0);
        });
    }

    /* -----------------------------------------------------
       PER KONTROLÜ
       ----------------------------------------------------- */

    function validSet(tiles) {

        if (tiles.length < 3 ||
            tiles.length > 4)
            return false;

        const normal =
            tiles.filter(t => !t.fake);

        const jokers =
            tiles.length - normal.length;

        if (!normal.length)
            return true;

        const value = normal[0].value;

        if (
            normal.some(
                t => t.value !== value
            )
        )
            return false;

        const colors =
            new Set(
                normal.map(t => t.color)
            );

        return colors.size === normal.length &&
               normal.length + jokers <= 4;
    }

    function validRun(tiles) {

        if (tiles.length < 3)
            return false;

        const normal =
            tiles
                .filter(t => !t.fake)
                .slice()
                .sort(
                    (a,b) =>
                        a.value-b.value
                );

        const jokers =
            tiles.length-normal.length;

        if (!normal.length)
            return true;

        const color =
            normal[0].color;

        if (
            normal.some(
                t => t.color !== color
            )
        )
            return false;

        let needed = 0;

        for (
            let i=1;
            i<normal.length;
            i++
        ) {

            const diff =
                normal[i].value -
                normal[i-1].value;

            if (diff <= 0)
                return false;

            needed += diff - 1;
        }

        return needed <= jokers;
    }

    function validMeld(tiles) {

        return (
            validSet(tiles) ||
            validRun(tiles)
        );
    }

    /*
       Seçili taşları birden fazla per'e
       ayırabilmek için DFS.
    */

    function partitionMelds(tiles) {

        if (!tiles.length)
            return [];

        const candidates = [];

        function combinations(
            start,
            current
        ) {

            if (
                current.length >= 3 &&
                validMeld(current)
            ) {
                candidates.push(
                    current.slice()
                );
            }

            if (current.length >= 4)
                return;

            for (
                let i=start;
                i<tiles.length;
                i++
            ) {

                current.push(tiles[i]);

                combinations(
                    i+1,
                    current
                );

                current.pop();
            }
        }

        combinations(0,[]);

        /*
           Büyük perleri önce dene.
        */

        candidates.sort(
            (a,b)=>b.length-a.length
        );

        function dfs(
            remaining,
            groups
        ) {

            if (!remaining.length)
                return groups;

            const first =
                remaining[0];

            for (const candidate of candidates) {

                if (
                    !candidate.includes(first)
                )
                    continue;

                const next =
                    remaining.filter(
                        x => !candidate.includes(x)
                    );

                if (
                    next.length ===
                    remaining.length
                )
                    continue;

                const result =
                    dfs(
                        next,
                        groups.concat([
                            candidate
                        ])
                    );

                if (result)
                    return result;
            }

            return null;
        }

        return dfs(
            tiles.slice(),
            []
        );
    }

    function selectedTiles() {

        return [...selected]
            .sort((a,b)=>a-b)
            .map(i=>hand[i]);
    }

    /* -----------------------------------------------------
       RENDER
       ----------------------------------------------------- */

    function render() {

        rack.innerHTML = "";

        sortHand();

        hand.forEach(
            (tile,index) => {

                const t =
                    el(
                        "div",
                        "okey-tile okey-" +
                        (tile.color || "black"),
                        tileText(tile)
                    );

                if (
                    selected.has(index)
                )
                    t.classList.add(
                        "selected"
                    );

                t.addEventListener(
                    "click",
                    function () {

                        if (
                            gameOver ||
                            turn !== 0
                        )
                            return;

                        if (
                            selected.has(index)
                        )
                            selected.delete(index);
                        else
                            selected.add(index);

                        render();
                    }
                );

                rack.appendChild(t);
            }
        );

        indicatorEl.innerHTML =
            indicator
                ? `
                    ${tileText(indicator)}
                    <small>Gösterge</small>
                  `
                : "—";

        discardEl.innerHTML =
            discard.length
                ? `
                    ${tileText(
                        discard[
                            discard.length-1
                        ]
                    )}
                    <small>Atılan</small>
                  `
                : "—";

        deckEl.innerHTML = `
            🀄
            <small>${deck.length} taş</small>
        `;

        opponentEls.forEach(
            (p,i) => {

                p.querySelector(
                    ".okey-hand-count"
                ).textContent =
                    bots[i].length +
                    " taş";
            }
        );

        meldsEl.innerHTML = "";

        tableMelds.forEach(
            meld => {

                const m =
                    el("div","meld");

                meld.forEach(tile => {

                    m.appendChild(
                        el(
                            "div",
                            "okey-tile okey-" +
                            (tile.color || "black"),
                            tileText(tile)
                        )
                    );
                });

                meldsEl.appendChild(m);
            }
        );

        turnBox.textContent =
            turn === 0
                ? "Sıra: Sen"
                : "Sıra: Rakip";

        drawBtn.disabled =
            gameOver ||
            turn !== 0 ||
            drawnThisTurn;

        takeBtn.disabled =
            gameOver ||
            turn !== 0 ||
            drawnThisTurn ||
            !discard.length;

        openBtn.disabled =
            gameOver ||
            turn !== 0 ||
            !drawnThisTurn ||
            selected.size < 3;

        discardBtn.disabled =
            gameOver ||
            turn !== 0 ||
            !drawnThisTurn ||
            selected.size !== 1;

        xpBox.textContent =
            "XP " + xp;
    }

    /* -----------------------------------------------------
       TAŞ ÇEK
       ----------------------------------------------------- */

    function drawTile() {

        if (
            gameOver ||
            turn !== 0 ||
            drawnThisTurn
        )
            return;

        if (!deck.length) {

            endGame(false);
            return;
        }

        hand.push(deck.pop());

        drawnThisTurn = true;

        render();
    }

    /* -----------------------------------------------------
       YERDEN AL
       ----------------------------------------------------- */

    function takeDiscard() {

        if (
            gameOver ||
            turn !== 0 ||
            drawnThisTurn ||
            !discard.length
        )
            return;

        hand.push(discard.pop());

        drawnThisTurn = true;

        render();
    }

    /* -----------------------------------------------------
       AÇ
       ----------------------------------------------------- */

    function openSelected() {

        if (
            gameOver ||
            turn !== 0 ||
            !drawnThisTurn ||
            selected.size < 3
        )
            return;

        const tiles =
            selectedTiles();

        const groups =
            partitionMelds(tiles);

        if (!groups) {

            showMessage(
                "Geçersiz Per",
                "Seçtiğin taşlar geçerli seri veya grup oluşturmuyor."
            );

            return;
        }

        const total =
            tiles.reduce(
                (sum,t)=>
                    sum + tilePoint(t),
                0
            );

        if (!hasOpened && total < 101) {

            showMessage(
                "101 Açılmadı",
                "İlk açılışta seçtiğin perlerin toplamı en az 101 olmalı."
            );

            return;
        }

        /*
           Taşları gruplardan çıkar.
        */

        const indexes =
            [...selected]
                .sort((a,b)=>b-a);

        const selectedObjects =
            indexes.map(i=>hand[i]);

        indexes.forEach(
            i=>hand.splice(i,1)
        );

        /*
           Gerçek grupları masaya koy.
        */

        groups.forEach(group => {

            tableMelds.push(group);
        });

        /*
           Eğer partition referansları aynı nesneleri
           kullanıyorsa sorun yok; selectedObjects
           yalnızca güvenlik amacıyla tutuldu.
        */

        void selectedObjects;

        selected.clear();
        hasOpened = true;

        render();

        if (!hand.length) {

            endGame(true);
            return;
        }
    }

    /* -----------------------------------------------------
       TAŞ AT
       ----------------------------------------------------- */

    function discardSelected() {

        if (
            gameOver ||
            turn !== 0 ||
            !drawnThisTurn ||
            selected.size !== 1
        )
            return;

        const index =
            [...selected][0];

        const tile =
            hand.splice(index,1)[0];

        discard.push(tile);

        selected.clear();
        drawnThisTurn = false;

        render();

        botTurns();
    }

    /* -----------------------------------------------------
       BOT
       ----------------------------------------------------- */

    function botCanOpen(botHand) {

        /*
           Basit ama gerçek per arama.
        */

        const candidates = [];

        for (
            let i=0;
            i<botHand.length;
            i++
        ) {

            for (
                let j=i+1;
                j<botHand.length;
                j++
            ) {

                for (
                    let k=j+1;
                    k<botHand.length;
                    k++
                ) {

                    const group = [
                        botHand[i],
                        botHand[j],
                        botHand[k]
                    ];

                    if (
                        validMeld(group)
                    )
                        candidates.push(group);
                }
            }
        }

        let total = 0;

        candidates.forEach(
            group => {

                total +=
                    group.reduce(
                        (s,t)=>
                            s + tilePoint(t),
                        0
                    );
            }
        );

        return total >= 101;
    }

    function botChooseDiscard(botHand) {

        if (!botHand.length)
            return null;

        /*
           Önce düşük değerli taşı at.
        */

        let bestIndex = 0;
        let bestValue = Infinity;

        botHand.forEach(
            (tile,i) => {

                const value =
                    tilePoint(tile);

                if (value < bestValue) {

                    bestValue = value;
                    bestIndex = i;
                }
            }
        );

        return botHand.splice(
            bestIndex,
            1
        )[0];
    }

    function botTurns() {

        if (
            stopped ||
            gameOver
        )
            return;

        turn = 1;
        render();

        let botIndex = 0;

        function nextBot() {

            if (
                stopped ||
                gameOver
            ) {
                turn = 0;
                render();
                return;
            }

            if (botIndex >= 3) {

                turn = 0;
                drawnThisTurn = false;
                render();
                return;
            }

            const bot =
                bots[botIndex];

            if (deck.length)
                bot.push(deck.pop());

            /*
               Rakip yaklaşık 101'e ulaştıysa
               el açmış kabul ediyoruz.
            */

            if (
                !bot._opened &&
                botCanOpen(bot)
            ) {
                bot._opened = true;
            }

            const thrown =
                botChooseDiscard(bot);

            if (thrown)
                discard.push(thrown);

            if (bot.length === 0) {

                endGame(false);
                return;
            }

            botIndex++;

            botTimer =
                setTimeout(
                    nextBot,
                    350
                );
        }

        nextBot();
    }

    /* -----------------------------------------------------
       YENİ EL
       ----------------------------------------------------- */

    function newGame() {

        if (botTimer)
            clearTimeout(botTimer);

        gameOver = false;
        turn = 0;
        hasOpened = false;
        drawnThisTurn = false;

        selected.clear();

        tableMelds = [];
        discard = [];

        deck = makeDeck();

        hand = [];
        bots = [[],[],[]];

        indicator = deck.pop();

        /*
           Gösterge sahte taşsa yeni taş çek.
        */

        while (
            indicator &&
            indicator.fake
        ) {
            deck.unshift(indicator);
            indicator = deck.pop();
        }

        okeyNumber =
            indicator.value === 13
                ? 1
                : indicator.value + 1;

        /*
           Oyuncu 22 taş.
        */

        for (let i=0;i<22;i++)
            hand.push(deck.pop());

        /*
           Rakipler 21.
        */

        for (let b=0;b<3;b++) {

            for (let i=0;i<21;i++)
                bots[b].push(deck.pop());

            bots[b]._opened = false;
        }

        /*
           İlk atılan taş.
        */

        if (deck.length)
            discard.push(deck.pop());

        render();
    }

    function endGame(playerWon) {

        if (gameOver)
            return;

        gameOver = true;

        if (playerWon)
            winGame(300);
        else
            loseGame();

        render();
    }

    drawBtn.addEventListener(
        "click",
        drawTile
    );

    takeBtn.addEventListener(
        "click",
        takeDiscard
    );

    openBtn.addEventListener(
        "click",
        openSelected
    );

    discardBtn.addEventListener(
        "click",
        discardSelected
    );

    sortBtn.addEventListener(
        "click",
        function () {
            sortHand();
            render();
        }
    );

    newBtn.addEventListener(
        "click",
        function () {

            hand = [];
            newGame();
        }
    );

    newGame();

    return function () {

        stopped = true;

        if (botTimer)
            clearTimeout(botTimer);
    };
}

/* =========================================================
   TAVLA
   ========================================================= */

function createTavla() {

    let stopped = false;
    let botTimer = null;

    const root = el(
        "div",
        "game-shell"
    );

    const toolbar = el(
        "div",
        "game-toolbar"
    );

    const info = el(
        "div",
        "game-info"
    );

    const status = el(
        "div",
        "info-box",
        "🎲 Zar at"
    );

    const diceBox = el(
        "div",
        "info-box",
        "Zarlar: —"
    );

    const borneBox = el(
        "div",
        "info-box",
        "Sen: 0 • Rakip: 0"
    );

    info.append(
        status,
        diceBox,
        borneBox
    );

    const rollBtn = el(
        "button",
        "game-button",
        "🎲 Zar At"
    );

    const endBtn = el(
        "button",
        "game-button",
        "Sırayı Bitir"
    );

    toolbar.append(
        info,
        rollBtn,
        endBtn
    );

    root.appendChild(toolbar);

    const board = el(
        "div",
        "tavla-board backgammon"
    );

    const left =
        el("div","tavla-half");

    const middle =
        el("div","tavla-middle");

    const right =
        el("div","tavla-half");

    board.append(
        left,
        middle,
        right
    );

    root.appendChild(board);
    gameArea.appendChild(root);

    const dice = el(
        "div",
        "dice",
        "—"
    );

    middle.appendChild(dice);

    const barWhite = el(
        "div",
        "info-box",
        "Bara: 0"
    );

    const barBlack = el(
        "div",
        "info-box",
        "Rakip Bara: 0"
    );

    middle.append(
        barWhite,
        barBlack
    );

    /*
       Pozitif = oyuncu
       Negatif = bot

       Oyuncu 23 -> 0 yönünde ilerler.
       Bot 0 -> 23.
    */

    const points = Array(24).fill(0);

    points[23] = 2;
    points[12] = 5;
    points[7] = 3;
    points[5] = 5;

    points[0] = -2;
    points[11] = -5;
    points[16] = -3;
    points[18] = -5;

    let barPlayer = 0;
    let barBot = 0;

    let bornePlayer = 0;
    let borneBot = 0;

    let diceValues = [];
    let rolled = false;
    let selectedFrom = null;
    let gameOver = false;

    function renderPoint(point,index) {

        point.innerHTML = "";

        const number =
            el(
                "span",
                "point-number",
                String(index + 1)
            );

        point.appendChild(number);

        const count =
            Math.abs(points[index]);

        const isPlayer =
            points[index] > 0;

        for (
            let i=0;
            i<count;
            i++
        ) {

            point.appendChild(
                el(
                    "div",
                    "checker " +
                    (
                        isPlayer
                            ? "white"
                            : "black"
                    )
                )
            );
        }
    }

    function render() {

        left.innerHTML = "";
        right.innerHTML = "";

        /*
           Üst sıra: 12 -> 7
        */

        for (
            let i=11;
            i>=6;
            i--
        ) {

            const p =
                el(
                    "div",
                    "tavla-point"
                );

            renderPoint(p,i);

            if (selectedFrom === i)
                p.classList.add(
                    "selected"
                );

            if (
                selectedFrom !== null &&
                getLegalDestinations(
                    selectedFrom
                ).includes(i)
            )
                p.classList.add(
                    "legal"
                );

            p.addEventListener(
                "click",
                () => clickPoint(i)
            );

            left.appendChild(p);
        }

        /*
           Alt sıra: 6 -> 1
        */

        for (
            let i=5;
            i>=0;
            i--
        ) {

            const p =
                el(
                    "div",
                    "tavla-point bottom"
                );

            renderPoint(p,i);

            if (selectedFrom === i)
                p.classList.add(
                    "selected"
                );

            if (
                selectedFrom !== null &&
                getLegalDestinations(
                    selectedFrom
                ).includes(i)
            )
                p.classList.add(
                    "legal"
                );

            p.addEventListener(
                "click",
                () => clickPoint(i)
            );

            right.appendChild(p);
        }

        diceBox.textContent =
            "Zarlar: " +
            (
                diceValues.length
                    ? diceValues.join(" • ")
                    : "—"
            );

        barWhite.textContent =
            "Senin Bara: " +
            barPlayer;

        barBlack.textContent =
            "Rakip Bara: " +
            barBot;

        borneBox.textContent =
            "Toplanan: Sen " +
            bornePlayer +
            " • Rakip " +
            borneBot;

        endBtn.disabled =
            !rolled ||
            gameOver;
    }

    function allPlayerHome() {

        if (barPlayer > 0)
            return false;

        for (
            let i=6;
            i<24;
            i++
        ) {

            if (points[i] > 0)
                return false;
        }

        return true;
    }

    function allBotHome() {

        if (barBot > 0)
            return false;

        for (
            let i=0;
            i<18;
            i++
        ) {

            if (points[i] < 0)
                return false;
        }

        return true;
    }

    function canBearOff(from,die) {

        if (!allPlayerHome())
            return false;

        const distance =
            from + 1;

        if (die === distance)
            return true;

        if (die > distance) {

            /*
               Daha yüksek noktada taş varsa
               büyük zarla buradan çıkamaz.
            */

            for (
                let i=from+1;
                i<6;
                i++
            ) {

                if (points[i] > 0)
                    return false;
            }

            return true;
        }

        return false;
    }

    function legalPlayerMove(
        from,
        to,
        die
    ) {

        if (points[from] <= 0)
            return false;

        if (barPlayer > 0)
            return false;

        /*
           Toplama.
        */

        if (to < 0)
            return canBearOff(
                from,
                die
            );

        if (to >= 24)
            return false;

        if (from - die !== to)
            return false;

        /*
           Rakip iki veya daha fazla taşla
           kapatmışsa gidemez.
        */

        if (points[to] < -1)
            return false;

        return true;
    }

    function legalEntry(die) {

        /*
           Oyuncu 23 yönünden girer.
        */

        const target =
            24 - die;

        if (target < 18)
            return false;

        return points[target] >= -1;
    }

    function getLegalDestinations(from) {

        if (
            !rolled ||
            gameOver ||
            from === null
        )
            return [];

        const result = [];

        for (
            const die of diceValues
        ) {

            const to =
                from - die;

            if (
                to >= 0 &&
                legalPlayerMove(
                    from,
                    to,
                    die
                )
            ) {

                if (!result.includes(to))
                    result.push(to);
            }

            if (
                to < 0 &&
                canBearOff(from,die)
            ) {

                result.push(-1);
            }
        }

        return result;
    }

    function hasAnyPlayerMove() {

        if (barPlayer > 0) {

            return diceValues.some(
                die => legalEntry(die)
            );
        }

        for (
            let i=0;
            i<24;
            i++
        ) {

            if (points[i] > 0) {

                if (
                    getLegalDestinations(i)
                        .length
                )
                    return true;
            }
        }

        return false;
    }

    function clickPoint(index) {

        if (
            gameOver ||
            !rolled
        )
            return;

        /*
           Bardaki taş varsa
           önce giriş yapılmalı.
        */

        if (barPlayer > 0) {

            status.textContent =
                "Önce bardaki taşı oyuna sok.";

            return;
        }

        if (selectedFrom === null) {

            if (points[index] <= 0)
                return;

            const moves =
                getLegalDestinations(
                    index
                );

            if (!moves.length) {

                status.textContent =
                    "Bu taş şu anda oynayamıyor.";

                return;
            }

            selectedFrom = index;

            status.textContent =
                "Mavi noktaya tıkla.";

            render();

            return;
        }

        const from = selectedFrom;

        const possible =
            getLegalDestinations(from);

        let chosenDie = null;

        for (
            const die of diceValues
        ) {

            if (
                from - die === index &&
                possible.includes(index)
            ) {
                chosenDie = die;
                break;
            }
        }

        if (chosenDie === null) {

            /*
               Başka taşı seç.
            */

            if (points[index] > 0) {

                selectedFrom = index;
                render();
                return;
            }

            status.textContent =
                "Geçersiz hamle.";

            return;
        }

        movePlayer(
            from,
            index,
            chosenDie
        );
    }

    function movePlayer(
        from,
        to,
        die
    ) {

        points[from]--;

        if (points[to] === -1) {

            points[to] = 1;
            barBot++;

        } else {

            points[to]++;
        }

        consumeDie(die);

        selectedFrom = null;

        checkWin();

        if (gameOver)
            return;

        if (!diceValues.length) {

            rolled = false;
            botTurn();

        } else if (!hasAnyPlayerMove()) {

            status.textContent =
                "Başka hamle yok. Sırayı bitirebilirsin.";

        } else {

            status.textContent =
                "Bir zar daha kullan.";
        }

        render();
    }

    function bearOff(from,die) {

        if (!canBearOff(from,die))
            return false;

        points[from]--;

        bornePlayer++;

        consumeDie(die);

        selectedFrom = null;

        checkWin();

        return true;
    }

    function consumeDie(die) {

        const index =
            diceValues.indexOf(die);

        if (index >= 0)
            diceValues.splice(
                index,
                1
            );
    }

    function roll() {

        if (
            rolled ||
            gameOver
        )
            return;

        const a = rand(1,6);
        const b = rand(1,6);

        diceValues =
            a === b
                ? [a,a,a,a]
                : [a,b];

        rolled = true;
        selectedFrom = null;

        dice.textContent =
            a + " • " + b;

        if (barPlayer > 0) {

            status.textContent =
                "Bardaki taşı içeri sok.";

        } else if (!hasAnyPlayerMove()) {

            status.textContent =
                "Bu zarlarla hamle yok. Sırayı bitir.";

        } else {

            status.textContent =
                "Taşını seç.";
        }

        render();
    }

    function endTurn() {

        if (
            !rolled ||
            gameOver
        )
            return;

        rolled = false;
        diceValues = [];
        selectedFrom = null;

        status.textContent =
            "Rakip düşünüyor...";

        render();

        botTurn();
    }

    function botCanMove(from,die) {

        const to =
            from + die;

        if (to >= 24)
            return allBotHome();

        return points[to] >= -1;
    }

    function botMove(
        from,
        to,
        die
    ) {

        points[from]++;

        if (to >= 24) {

            borneBot++;

        } else if (
            points[to] === 1
        ) {

            points[to] = -1;
            barPlayer++;

        } else {

            points[to]--;
        }
    }

    function botTurn() {

        if (
            stopped ||
            gameOver
        )
            return;

        status.textContent =
            "🤖 Rakip oynuyor...";

        botTimer =
            setTimeout(
                function () {

                    if (
                        stopped ||
                        gameOver
                    )
                        return;

                    /*
                       Bot zar atar.
                    */

                    const a = rand(1,6);
                    const b = rand(1,6);

                    let botDice =
                        a === b
                            ? [a,a,a,a]
                            : [a,b];

                    /*
                       Bardaki bot taşı.
                    */

                    while (
                        botDice.length &&
                        barBot > 0
                    ) {

                        let moved = false;

                        for (
                            let i=0;
                            i<botDice.length;
                            i++
                        ) {

                            const die =
                                botDice[i];

                            const target =
                                die - 1;

                            if (
                                target >= 0 &&
                                target < 6 &&
                                points[target] >= -1
                            ) {

                                if (
                                    points[target] === 1
                                ) {

                                    points[target] = -1;
                                    barPlayer++;

                                } else {

                                    points[target]--;
                                }

                                barBot--;

                                botDice.splice(i,1);

                                moved = true;
                                break;
                            }
                        }

                        if (!moved)
                            break;
                    }

                    /*
                       Normal bot hamleleri.
                    */

                    for (
                        const die of botDice.slice()
                    ) {

                        let moved = false;

                        /*
                           Taşları karıştırarak
                           biraz daha doğal AI.
                        */

                        const candidates = [];

                        for (
                            let i=0;
                            i<24;
                            i++
                        ) {

                            if (points[i] < 0)
                                candidates.push(i);
                        }

                        shuffle(candidates);

                        for (
                            const from of candidates
                        ) {

                            if (
                                botCanMove(
                                    from,
                                    die
                                )
                            ) {

                                botMove(
                                    from,
                                    from + die,
                                    die
                                );

                                moved = true;
                                break;
                            }
                        }

                        if (!moved) {

                            /*
                               Toplama mümkünse.
                            */

                            if (allBotHome()) {

                                for (
                                    let from=0;
                                    from<6;
                                    from++
                                ) {

                                    if (
                                        points[from] < 0
                                    ) {

                                        const distance =
                                            24 - from;

                                        if (
                                            die >= distance
                                        ) {

                                            points[from]++;
                                            borneBot++;
                                            moved = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    checkWin();

                    if (gameOver)
                        return;

                    status.textContent =
                        "Senin sıran. Zar at.";

                    render();

                },
                700
            );
    }

    function checkWin() {

        if (bornePlayer >= 15) {

            gameOver = true;
            rolled = false;

            winGame(350);
            return;
        }

        if (borneBot >= 15) {

            gameOver = true;
            rolled = false;

            loseGame();
        }
    }

    rollBtn.addEventListener(
        "click",
        roll
    );

    endBtn.addEventListener(
        "click",
        endTurn
    );

    render();

    return function () {

        stopped = true;

        if (botTimer)
            clearTimeout(botTimer);
    };
}

/* =========================================================
   TÜRK DAMASI
   ========================================================= */

function createDama() {

    let stopped = false;
    let botTimer = null;

    const root =
        el("div","game-shell");

    const toolbar =
        el("div","game-toolbar");

    const status =
        el(
            "div",
            "info-box",
            "Senin sıran"
        );

    const info =
        el(
            "div",
            "info-box",
            "Zorunlu alma aktif"
        );

    const newBtn =
        el(
            "button",
            "game-button",
            "Yeni Oyun"
        );

    toolbar.append(
        status,
        info,
        newBtn
    );

    root.appendChild(toolbar);

    const board =
        el("div","dama-board");

    root.appendChild(board);
    gameArea.appendChild(root);

    let cells = [];
    let selected = null;
    let mustContinue = false;
    let gameOver = false;

    function initial() {

        cells =
            Array.from(
                {length:8},
                () =>
                    Array(8).fill(null)
            );

        /*
           Türk Daması başlangıç düzeni.
        */

        for (
            let r=0;
            r<2;
            r++
        ) {

            for (
                let c=0;
                c<8;
                c++
            ) {

                cells[r][c] = {
                    player:"bot",
                    king:false
                };
            }
        }

        for (
            let r=6;
            r<8;
            r++
        ) {

            for (
                let c=0;
                c<8;
                c++
            ) {

                cells[r][c] = {
                    player:"human",
                    king:false
                };
            }
        }

        /*
           Ortada boş iki sıra.
        */

        selected = null;
        mustContinue = false;
        gameOver = false;

        status.textContent =
            "Senin sıran";

        render();
    }

    function inside(r,c) {

        return (
            r>=0 &&
            r<8 &&
            c>=0 &&
            c<8
        );
    }

    function directions() {

        return [
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        ];
    }

    function capturesFor(r,c) {

        const piece =
            cells[r][c];

        if (!piece)
            return [];

        const result = [];

        /*
           Taş alma dört yönde.
        */

        for (
            const [dr,dc]
            of directions()
        ) {

            let nr = r + dr;
            let nc = c + dc;

            /*
               Normal taş için bir rakip
               üzerinden iki kare atlama.
            */

            if (!piece.king) {

                const tr = r + dr * 2;
                const tc = c + dc * 2;

                if (
                    inside(nr,nc) &&
                    inside(tr,tc) &&
                    cells[nr][nc] &&
                    cells[nr][nc].player !==
                        piece.player &&
                    !cells[tr][tc]
                ) {

                    result.push({
                        from:[r,c],
                        over:[nr,nc],
                        to:[tr,tc]
                    });
                }

            } else {

                /*
                   Dama taşı uzun mesafede
                   rakip üzerinden alabilir.
                */

                let enemy = null;

                while (
                    inside(nr,nc)
                ) {

                    if (!cells[nr][nc]) {

                        nr += dr;
                        nc += dc;
                        continue;
                    }

                    if (
                        cells[nr][nc].player ===
                        piece.player
                    )
                        break;

                    if (enemy)
                        break;

                    enemy = [nr,nc];

                    nr += dr;
                    nc += dc;

                    while (
                        inside(nr,nc)
                    ) {

                        if (!cells[nr][nc]) {

                            result.push({
                                from:[r,c],
                                over:enemy,
                                to:[nr,nc]
                            });

                            nr += dr;
                            nc += dc;

                        } else {

                            break;
                        }
                    }

                    break;
                }
            }
        }

        return result;
    }

    function hasAnyCapture(player) {

        for (
            let r=0;
            r<8;
            r++
        ) {

            for (
                let c=0;
                c<8;
                c++
            ) {

                if (
                    cells[r][c] &&
                    cells[r][c].player ===
                        player &&
                    capturesFor(r,c).length
                )
                    return true;
            }
        }

        return false;
    }

    function legalMoves(r,c) {

        const piece =
            cells[r][c];

        if (!piece)
            return [];

        const captures =
            capturesFor(r,c);

        if (captures.length)
            return captures;

        if (
            hasAnyCapture(
                piece.player
            )
        )
            return [];

        const result = [];

        if (piece.king) {

            for (
                const [dr,dc]
                of directions()
            ) {

                let nr = r + dr;
                let nc = c + dc;

                while (
                    inside(nr,nc) &&
                    !cells[nr][nc]
                ) {

                    result.push({
                        from:[r,c],
                        to:[nr,nc]
                    });

                    nr += dr;
                    nc += dc;
                }
            }

        } else {

            /*
               İnsan yukarı gider.
               Rakip aşağı gider.
            */

            const forward =
                piece.player === "human"
                    ? -1
                    : 1;

            const dirs = [
                [forward,0],
                [0,-1],
                [0,1]
            ];

            for (
                const [dr,dc]
                of dirs
            ) {

                const nr = r + dr;
                const nc = c + dc;

                if (
                    inside(nr,nc) &&
                    !cells[nr][nc]
                ) {

                    result.push({
                        from:[r,c],
                        to:[nr,nc]
                    });
                }
            }
        }

        return result;
    }

    function render() {

        board.innerHTML = "";

        for (
            let r=0;
            r<8;
            r++
        ) {

            for (
                let c=0;
                c<8;
                c++
            ) {

                const cell =
                    el(
                        "div",
                        "dama-cell " +
                        (
                            (r+c)%2
                                ? "dark"
                                : "light"
                        )
                    );

                const piece =
                    cells[r][c];

                if (piece) {

                    const p =
                        el(
                            "div",
                            "dama-piece " +
                            (
                                piece.player ===
                                    "human"
                                    ? "white"
                                    : "black"
                            )
                        );

                    if (piece.king)
                        p.classList.add(
                            "king"
                        );

                    cell.appendChild(p);
                }

                if (
                    selected &&
                    selected[0] === r &&
                    selected[1] === c
                )
                    cell.classList.add(
                        "selected"
                    );

                if (
                    selected
                ) {

                    const moves =
                        legalMoves(
                            selected[0],
                            selected[1]
                        );

                    if (
                        moves.some(
                            m =>
                                m.to[0] === r &&
                                m.to[1] === c
                        )
                    )
                        cell.classList.add(
                            "legal"
                        );
                }

                cell.addEventListener(
                    "click",
                    () =>
                        clickCell(r,c)
                );

                board.appendChild(cell);
            }
        }
    }

    function executeMove(m) {

        const [fr,fc] = m.from;
        const [tr,tc] = m.to;

        const piece =
            cells[fr][fc];

        cells[fr][fc] = null;

        if (m.over) {

            const [or,oc] =
                m.over;

            cells[or][oc] = null;
        }

        cells[tr][tc] = piece;

        if (
            piece.player === "human" &&
            tr === 0
        )
            piece.king = true;

        if (
            piece.player === "bot" &&
            tr === 7
        )
            piece.king = true;

        return piece;
    }

    function playerMove(m) {

        const piece =
            executeMove(m);

        render();

        const more =
            Boolean(m.over) &&
            capturesFor(
                m.to[0],
                m.to[1]
            ).length > 0;

        if (more) {

            selected = [
                m.to[0],
                m.to[1]
            ];

            mustContinue = true;

            status.textContent =
                "⚔️ Devam eden alma";

            render();
            return;
        }

        selected = null;
        mustContinue = false;

        if (!piece)
            return;

        checkEnd();

        if (!gameOver)
            botTurn();
    }

    function clickCell(r,c) {

        if (gameOver)
            return;

        if (selected) {

            const moves =
                legalMoves(
                    selected[0],
                    selected[1]
                );

            const found =
                moves.find(
                    m =>
                        m.to[0] === r &&
                        m.to[1] === c
                );

            if (found) {

                playerMove(found);
                return;
            }
        }

        const piece =
            cells[r][c];

        if (
            piece &&
            piece.player === "human"
        ) {

            if (
                mustContinue &&
                (
                    !selected ||
                    selected[0] !== r ||
                    selected[1] !== c
                )
            )
                return;

            const moves =
                legalMoves(r,c);

            if (!moves.length) {

                status.textContent =
                    "Bu taş oynayamıyor.";

                return;
            }

            selected = [r,c];

            status.textContent =
                "Mavi bölgeye tıkla.";

            render();
        }
    }

    function botTurn() {

        if (
            stopped ||
            gameOver
        )
            return;

        status.textContent =
            "🤖 Rakip düşünüyor...";

        botTimer =
            setTimeout(
                function () {

                    if (
                        stopped ||
                        gameOver
                    )
                        return;

                    let moves = [];

                    /*
                       Zorunlu alma.
                    */

                    for (
                        let r=0;
                        r<8;
                        r++
                    ) {

                        for (
                            let c=0;
                            c<8;
                            c++
                        ) {

                            if (
                                cells[r][c] &&
                                cells[r][c].player ===
                                    "bot"
                            ) {

                                moves.push(
                                    ...capturesFor(
                                        r,c
                                    )
                                );
                            }
                        }
                    }

                    if (!moves.length) {

                        for (
                            let r=0;
                            r<8;
                            r++
                        ) {

                            for (
                                let c=0;
                                c<8;
                                c++
                            ) {

                                if (
                                    cells[r][c] &&
                                    cells[r][c].player ===
                                        "bot"
                                ) {

                                    moves.push(
                                        ...legalMoves(
                                            r,c
                                        )
                                    );
                                }
                            }
                        }
                    }

                    if (!moves.length) {

                        finish(true);
                        return;
                    }

                    const chosen =
                        moves[
                            rand(
                                0,
                                moves.length-1
                            )
                        ];

                    executeMove(chosen);

                    /*
                       Bot çoklu alma.
                    */

                    let current =
                        chosen.to;

                    while (
                        chosen.over &&
                        capturesFor(
                            current[0],
                            current[1]
                        ).length
                    ) {

                        const next =
                            capturesFor(
                                current[0],
                                current[1]
                            );

                        const selectedMove =
                            next[
                                rand(
                                    0,
                                    next.length-1
                                )
                            ];

                        executeMove(
                            selectedMove
                        );

                        current =
                            selectedMove.to;
                    }

                    render();
                    checkEnd();

                    if (!gameOver) {

                        status.textContent =
                            "Senin sıran";
                    }

                },
                600
            );
    }

    function checkEnd() {

        let human = 0;
        let bot = 0;

        for (
            const row of cells
        ) {

            for (
                const p of row
            ) {

                if (!p)
                    continue;

                if (
                    p.player === "human"
                )
                    human++;
                else
                    bot++;
            }
        }

        if (!human) {

            finish(false);

        } else if (!bot) {

            finish(true);

        } else {

            /*
               Hamle kalmadı mı?
            */

            if (
                !hasLegalPiece("human")
            )
                finish(false);

            else if (
                !hasLegalPiece("bot")
            )
                finish(true);
        }
    }

    function hasLegalPiece(player) {

        for (
            let r=0;
            r<8;
            r++
        ) {

            for (
                let c=0;
                c<8;
                c++
            ) {

                if (
                    cells[r][c] &&
                    cells[r][c].player ===
                        player &&
                    legalMoves(r,c).length
                )
                    return true;
            }
        }

        return false;
    }

    function finish(win) {

        if (gameOver)
            return;

        gameOver = true;

        if (win)
            winGame(300);
        else
            loseGame();
    }

    newBtn.addEventListener(
        "click",
        initial
    );

    initial();

    return function () {

        stopped = true;

        if (botTimer)
            clearTimeout(botTimer);
    };
}

/* =========================================================
   BATAK
   ========================================================= */

function createBatak() {

    let stopped = false;
    let botTimer = null;

    const root =
        el("div","game-shell");

    const toolbar =
        el("div","game-toolbar");

    const info =
        el("div","game-info");

    const status =
        el(
            "div",
            "info-box",
            "Koz seç"
        );

    const scoreBox =
        el(
            "div",
            "info-box",
            "El: 0"
        );

    info.append(
        status,
        scoreBox
    );

    const newBtn =
        el(
            "button",
            "game-button",
            "Yeni El"
        );

    toolbar.append(
        info,
        newBtn
    );

    root.appendChild(toolbar);

    const board =
        el(
            "div",
            "board batak-table"
        );

    root.appendChild(board);

    const seats =
        el(
            "div",
            "batak-seats"
        );

    const seatEls = [];

    for (
        let i=0;
        i<4;
        i++
    ) {

        const s =
            el(
                "div",
                "batak-seat"
            );

        s.textContent =
            i === 0
                ? "👤 Sen"
                : "🤖 " + botName(i);

        seatEls.push(s);
        seats.appendChild(s);
    }

    board.appendChild(seats);

    const center =
        el(
            "div",
            "batak-center"
        );

    const trumpBox =
        el(
            "div",
            "info-box",
            "Koz: —"
        );

    const trick =
        el(
            "div",
            "batak-trick"
        );

    center.append(
        trumpBox,
        trick
    );

    board.appendChild(center);

    const handEl =
        el(
            "div",
            "card-hand"
        );

    board.appendChild(handEl);

    const trumpControls =
        el(
            "div",
            "game-toolbar"
        );

    ["♠","♥","♦","♣"]
    .forEach(
        suit => {

            const b =
                el(
                    "button",
                    "game-button",
                    "Koz " + suit
                );

            b.addEventListener(
                "click",
                () => start(suit)
            );

            trumpControls.appendChild(b);
        }
    );

    root.appendChild(
        trumpControls
    );

    const values = [
        "2","3","4","5","6","7",
        "8","9","10","J","Q","K","A"
    ];

    let players = [];
    let trump = null;
    let current = 0;
    let trickCards = [];
    let tricks = [0,0,0,0];

    let started = false;
    let gameOver = false;

    function makeDeck() {

        const d = [];

        ["♠","♥","♦","♣"]
        .forEach(
            suit => {

                values.forEach(
                    value => {

                        d.push({
                            suit,
                            value,
                            rank:
                                values.indexOf(
                                    value
                                ) + 2
                        });
                    }
                );
            }
        );

        return shuffle(d);
    }

    function cardText(card) {

        return (
            card.value +
            card.suit
        );
    }

    function cardPower(card) {

        let power = card.rank;

        if (card.suit === trump)
            power += 100;

        return power;
    }

    function legalCard(
        card,
        playerIndex
    ) {

        if (!trickCards.length)
            return true;

        const lead =
            trickCards[0].card.suit;

        const hand =
            players[playerIndex];

        const hasLead =
            hand.some(
                c =>
                    c.suit === lead
            );

        if (hasLead)
            return card.suit === lead;

        return true;
    }

    function render() {

        handEl.innerHTML = "";

        if (!players.length)
            return;

        players[0].sort(
            (a,b) => {

                if (
                    a.suit !== b.suit
                )
                    return a.suit.localeCompare(
                        b.suit
                    );

                return a.rank-b.rank;
            }
        );

        players[0].forEach(
            (card,index) => {

                const c =
                    el(
                        "div",
                        "playing-card " +
                        (
                            card.suit === "♥" ||
                            card.suit === "♦"
                                ? "red"
                                : ""
                        ),
                        cardText(card)
                    );

                if (
                    !legalCard(
                        card,
                        0
                    )
                )
                    c.classList.add(
                        "disabled"
                    );

                c.addEventListener(
                    "click",
                    () => {

                        if (
                            !started ||
                            gameOver ||
                            current !== 0 ||
                            !legalCard(
                                card,
                                0
                            )
                        )
                            return;

                        playCard(
                            0,
                            index
                        );
                    }
                );

                handEl.appendChild(c);
            }
        );

        trick.innerHTML = "";

        trickCards.forEach(
            item => {

                const c =
                    el(
                        "div",
                        "playing-card " +
                        (
                            item.card.suit === "♥" ||
                            item.card.suit === "♦"
                                ? "red"
                                : ""
                        ),
                        cardText(
                            item.card
                        )
                    );

                trick.appendChild(c);
            }
        );

        trumpBox.textContent =
            "Koz: " +
            (trump || "—");

        scoreBox.textContent =
            "Senin elin: " +
            tricks[0];

        seatEls.forEach(
            (seat,i) => {

                seat.innerHTML =
                    i === 0
                        ? "👤 Sen<br>El: " +
                          tricks[0]
                        : "🤖 " +
                          botName(i) +
                          "<br>El: " +
                          tricks[i];
            }
        );
    }

    function start(chosenTrump) {

        if (started)
            return;

        trump = chosenTrump;

        const d = makeDeck();

        players = [
            d.splice(0,13),
            d.splice(0,13),
            d.splice(0,13),
            d.splice(0,13)
        ];

        started = true;
        gameOver = false;

        current = 0;
        trickCards = [];
        tricks = [0,0,0,0];

        status.textContent =
            "Koz " +
            trump +
            " • Oyun başladı";

        render();
    }

    function playCard(
        player,
        index
    ) {

        if (
            gameOver ||
            !players[player]
        )
            return;

        const card =
            players[player][index];

        if (
            player === 0 &&
            !legalCard(
                card,
                player
            )
        )
            return;

        players[player].splice(
            index,
            1
        );

        trickCards.push({
            player,
            card
        });

        current =
            (current + 1) % 4;

        render();

        if (
            trickCards.length === 4
        ) {

            resolveTrick();

        } else if (
            current === 0
        ) {

            status.textContent =
                "Senin sıran";

            render();

        } else {

            botPlay();
        }
    }

    function botPlay() {

        if (
            stopped ||
            gameOver
        )
            return;

        botTimer =
            setTimeout(
                function () {

                    if (
                        stopped ||
                        gameOver
                    )
                        return;

                    const hand =
                        players[current];

                    const legal =
                        hand.filter(
                            card =>
                                legalCard(
                                    card,
                                    current
                                )
                        );

                    if (!legal.length)
                        return;

                    /*
                       Bot düşük kartı oynar,
                       fakat eli kazanabilecek
                       bir koz varsa kullanabilir.
                    */

                    legal.sort(
                        (a,b) =>
                            cardPower(a) -
                            cardPower(b)
                    );

                    let chosen =
                        legal[0];

                    if (trickCards.length) {

                        const lead =
                            trickCards[0].card.suit;

                        const winning =
                            legal.filter(
                                card =>
                                    (
                                        card.suit === trump &&
                                        trickCards.some(
                                            x =>
                                                x.card.suit !== trump
                                        )
                                    ) ||
                                    (
                                        card.suit === lead &&
                                        trickCards.every(
                                            x =>
                                                x.card.suit !== trump
                                        )
                                    )
                            );

                        if (winning.length)
                            chosen =
                                winning[
                                    winning.length-1
                                ];
                    }

                    const index =
                        hand.indexOf(
                            chosen
                        );

                    playCard(
                        current,
                        index
                    );

                },
                450
            );
    }

    function resolveTrick() {

        const lead =
            trickCards[0].card.suit;

        let winner =
            trickCards[0];

        for (
            const item of
            trickCards.slice(1)
        ) {

            const a =
                winner.card;

            const b =
                item.card;

            if (
                b.suit === trump &&
                a.suit !== trump
            ) {

                winner = item;
                continue;
            }

            if (
                b.suit === a.suit &&
                cardPower(b) >
                    cardPower(a)
            ) {

                winner = item;
                continue;
            }

            if (
                a.suit !== trump &&
                b.suit === lead &&
                a.suit !== lead
            ) {

                winner = item;
            }
        }

        tricks[
            winner.player
        ]++;

        current =
            winner.player;

        trickCards = [];

        if (
            players[0].length === 0
        ) {

            endGame();
            return;
        }

        status.textContent =
            winner.player === 0
                ? "🏆 Eli sen aldın."
                : "🤖 " +
                  botName(
                      winner.player
                  ) +
                  " eli aldı.";

        render();

        if (
            current !== 0
        )
            botPlay();
    }

    function endGame() {

        gameOver = true;
        started = false;

        if (tricks[0] >= 7)
            winGame(300);
        else
            loseGame();

        render();
    }

    newBtn.addEventListener(
        "click",
        function () {

            if (botTimer)
                clearTimeout(botTimer);

            started = false;
            gameOver = false;
            players = [];
            trump = null;
            trickCards = [];
            tricks = [0,0,0,0];
            current = 0;

            status.textContent =
                "Koz seç";

            render();
        }
    );

    render();

    return function () {

        stopped = true;

        if (botTimer)
            clearTimeout(botTimer);
    };
}

/* =========================================================
   BİLARDO
   ========================================================= */

function createBilardo() {

    let stopped = false;
    let animation = 0;
    let shotInProgress = false;

    const root =
        el("div","game-shell");

    const toolbar =
        el("div","game-toolbar");

    const status =
        el(
            "div",
            "info-box",
            "Beyaz topu hedefle"
        );

    const scoreBox =
        el(
            "div",
            "info-box",
            "Toplanan: 0/15"
        );

    const reset =
        el(
            "button",
            "game-button",
            "Yeni Oyun"
        );

    toolbar.append(
        status,
        scoreBox,
        reset
    );

    root.appendChild(toolbar);

    const wrap =
        el("div","pool-wrap");

    const canvas =
        el(
            "canvas",
            "pool-canvas"
        );

    canvas.width = 1000;
    canvas.height = 500;

    wrap.appendChild(canvas);

    wrap.appendChild(
        el(
            "div",
            "pool-help",
            "Beyaz topa yakın yerde basılı tut, geriye doğru çek ve bırak."
        )
    );

    root.appendChild(wrap);
    gameArea.appendChild(root);

    const ctx =
        canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    const pockets = [
        [22,22],
        [W/2,14],
        [W-22,22],
        [22,H-22],
        [W/2,H-14],
        [W-22,H-22]
    ];

    let balls = [];
    let aiming = false;
    let aimX = 0;
    let aimY = 0;
    let scoreLocal = 0;
    let gameOver = false;

    const colors = [
        "#f00",
        "#00aaff",
        "#ff0",
        "#f80",
        "#0c5",
        "#a0f",
        "#f69",
        "#333",
        "#08f",
        "#fa0",
        "#0aa",
        "#f44",
        "#9f0",
        "#80f",
        "#ff6"
    ];

    function makeBalls() {

        balls = [];

        balls.push({
            x:230,
            y:H/2,
            vx:0,
            vy:0,
            r:13,
            color:"#fff",
            cue:true,
            active:true
        });

        /*
           15 top üçgen dizilim.
        */

        let index = 0;

        for (
            let row=0;
            row<5;
            row++
        ) {

            for (
                let col=0;
                col<=row;
                col++
            ) {

                balls.push({
                    x:
                        665 +
                        row * 27,
                    y:
                        H/2 +
                        (col -
                         row/2) * 28,
                    vx:0,
                    vy:0,
                    r:13,
                    color:
                        colors[
                            index %
                            colors.length
                        ],
                    number:index+1,
                    active:true
                });

                index++;
            }
        }

        scoreLocal = 0;
        gameOver = false;
        shotInProgress = false;

        scoreBox.textContent =
            "Toplanan: 0/15";

        status.textContent =
            "Beyaz topu hedefle";
    }

    function moving() {

        return balls.some(
            b =>
                b.active &&
                (
                    Math.abs(b.vx) > .03 ||
                    Math.abs(b.vy) > .03
                )
        );
    }

    function drawTable() {

        ctx.clearRect(
            0,
            0,
            W,
            H
        );

        ctx.fillStyle = "#08704c";
        ctx.fillRect(
            0,
            0,
            W,
            H
        );

        /*
           Masa iç çizgileri.
        */

        ctx.strokeStyle =
            "rgba(255,255,255,.12)";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            20,
            20,
            W-40,
            H-40
        );

        pockets.forEach(
            ([x,y]) => {

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    25,
                    0,
                    Math.PI*2
                );

                ctx.fillStyle = "#111";
                ctx.fill();

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    17,
                    0,
                    Math.PI*2
                );

                ctx.fillStyle = "#000";
                ctx.fill();
            }
        );

        balls.forEach(
            b => {

                if (!b.active)
                    return;

                ctx.beginPath();

                ctx.arc(
                    b.x,
                    b.y,
                    b.r,
                    0,
                    Math.PI*2
                );

                ctx.fillStyle =
                    b.color;

                ctx.fill();

                ctx.strokeStyle =
                    "#222";

                ctx.lineWidth = 2;
                ctx.stroke();

                if (!b.cue) {

                    ctx.fillStyle =
                        "rgba(255,255,255,.75)";

                    ctx.font = "10px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    ctx.fillText(
                        b.number,
                        b.x,
                        b.y
                    );
                }
            }
        );

        if (aiming) {

            const cue =
                balls.find(
                    b =>
                        b.cue &&
                        b.active
                );

            if (cue) {

                const dx =
                    cue.x - aimX;

                const dy =
                    cue.y - aimY;

                const len =
                    Math.hypot(
                        dx,
                        dy
                    );

                if (len > 0) {

                    const max =
                        Math.min(
                            len,
                            300
                        );

                    const ux = dx / len;
                    const uy = dy / len;

                    ctx.beginPath();

                    ctx.moveTo(
                        cue.x,
                        cue.y
                    );

                    ctx.lineTo(
                        cue.x +
                        ux * max,
                        cue.y +
                        uy * max
                    );

                    ctx.strokeStyle =
                        "#fff";

                    ctx.lineWidth = 2;

                    ctx.setLineDash([
                        8,
                        8
                    ]);

                    ctx.stroke();

                    ctx.setLineDash([]);
                }
            }
        }
    }

    function physics() {

        balls.forEach(
            b => {

                if (!b.active)
                    return;

                b.x += b.vx;
                b.y += b.vy;

                b.vx *= .992;
                b.vy *= .992;

                if (
                    Math.abs(b.vx) < .02
                )
                    b.vx = 0;

                if (
                    Math.abs(b.vy) < .02
                )
                    b.vy = 0;

                /*
                   Duvarlar.
                */

                if (
                    b.x-b.r < 20 ||
                    b.x+b.r > W-20
                ) {

                    b.vx *= -.88;

                    b.x =
                        Math.max(
                            b.r+20,
                            Math.min(
                                W-b.r-20,
                                b.x
                            )
                        );
                }

                if (
                    b.y-b.r < 20 ||
                    b.y+b.r > H-20
                ) {

                    b.vy *= -.88;

                    b.y =
                        Math.max(
                            b.r+20,
                            Math.min(
                                H-b.r-20,
                                b.y
                            )
                        );
                }
            }
        );

        /*
           Top-top çarpışması.
        */

        for (
            let i=0;
            i<balls.length;
            i++
        ) {

            for (
                let j=i+1;
                j<balls.length;
                j++
            ) {

                const a = balls[i];
                const b = balls[j];

                if (
                    !a.active ||
                    !b.active
                )
                    continue;

                const dx =
                    b.x-a.x;

                const dy =
                    b.y-a.y;

                const dist =
                    Math.hypot(
                        dx,
                        dy
                    );

                const minDist =
                    a.r+b.r;

                if (
                    dist > 0 &&
                    dist < minDist
                ) {

                    const nx =
                        dx/dist;

                    const ny =
                        dy/dist;

                    const rvx =
                        b.vx-a.vx;

                    const rvy =
                        b.vy-a.vy;

                    const velocityAlong =
                        rvx*nx +
                        rvy*ny;

                    if (
                        velocityAlong > 0
                    )
                        continue;

                    const impulse =
                        -velocityAlong;

                    a.vx -=
                        impulse*nx;

                    a.vy -=
                        impulse*ny;

                    b.vx +=
                        impulse*nx;

                    b.vy +=
                        impulse*ny;

                    const overlap =
                        minDist-dist;

                    a.x -=
                        nx*overlap/2;

                    a.y -=
                        ny*overlap/2;

                    b.x +=
                        nx*overlap/2;

                    b.y +=
                        ny*overlap/2;
                }
            }
        }

        /*
           Cepler.
        */

        balls.forEach(
            b => {

                if (!b.active)
                    return;

                for (
                    const [px,py]
                    of pockets
                ) {

                    if (
                        Math.hypot(
                            b.x-px,
                            b.y-py
                        ) < 24
                    ) {

                        b.active = false;
                        b.vx = 0;
                        b.vy = 0;

                        if (b.cue) {

                            /*
                               Beyaz top tekrar
                               oyuna alınır.
                            */

                            setTimeout(
                                () => {

                                    if (
                                        !stopped &&
                                        !gameOver
                                    ) {

                                        b.active = true;
                                        b.x = 230;
                                        b.y = H/2;
                                    }

                                },
                                700
                            );

                        } else {

                            scoreLocal++;

                            scoreBox.textContent =
                                "Toplanan: " +
                                scoreLocal +
                                "/15";

                            addXP(3);

                            if (
                                scoreLocal >= 15
                            ) {

                                gameOver = true;

                                winGame(400);
                            }
                        }

                        break;
                    }
                }
            }
        );
    }

    function loop() {

        if (stopped)
            return;

        physics();
        drawTable();

        animation =
            requestAnimationFrame(
                loop
            );
    }

    function pointer(e) {

        const rect =
            canvas.getBoundingClientRect();

        const source =
            e.touches
                ? e.touches[0]
                : e;

        return {
            x:
                (source.clientX -
                 rect.left) *
                (W/rect.width),

            y:
                (source.clientY -
                 rect.top) *
                (H/rect.height)
        };
    }

    function down(e) {

        if (
            gameOver ||
            shotInProgress ||
            moving()
        )
            return;

        e.preventDefault();

        const p =
            pointer(e);

        const cue =
            balls.find(
                b =>
                    b.cue &&
                    b.active
            );

        if (!cue)
            return;

        if (
            Math.hypot(
                p.x-cue.x,
                p.y-cue.y
            ) < 150
        ) {

            aiming = true;

            aimX = p.x;
            aimY = p.y;
        }
    }

    function movePointer(e) {

        if (!aiming)
            return;

        e.preventDefault();

        const p =
            pointer(e);

        aimX = p.x;
        aimY = p.y;

        drawTable();
    }

    function shoot() {

        if (!aiming)
            return;

        const cue =
            balls.find(
                b =>
                    b.cue &&
                    b.active
            );

        if (!cue) {
            aiming = false;
            return;
        }

        const dx =
            cue.x-aimX;

        const dy =
            cue.y-aimY;

        const dist =
            Math.min(
                Math.hypot(
                    dx,
                    dy
                ),
                300
            );

        if (dist < 10) {

            aiming = false;
            return;
        }

        const len =
            Math.hypot(
                dx,
                dy
            );

        const power =
            Math.min(
                dist/24,
                12
            );

        cue.vx =
            dx/len*power;

        cue.vy =
            dy/len*power;

        aiming = false;
        shotInProgress = true;

        status.textContent =
            "🎱 Toplar hareket ediyor...";

        const wait =
            setInterval(
                () => {

                    if (
                        !moving()
                    ) {

                        clearInterval(
                            wait
                        );

                        shotInProgress =
                            false;

                        if (!gameOver)
                            status.textContent =
                                "Beyaz topu hedefle";
                    }

                },
                100
            );
    }

    canvas.addEventListener(
        "mousedown",
        down
    );

    canvas.addEventListener(
        "mousemove",
        movePointer
    );

    canvas.addEventListener(
        "mouseup",
        shoot
    );

    canvas.addEventListener(
        "touchstart",
        down,
        {passive:false}
    );

    canvas.addEventListener(
        "touchmove",
        movePointer,
        {passive:false}
    );

    canvas.addEventListener(
        "touchend",
        shoot,
        {passive:false}
    );

    reset.addEventListener(
        "click",
        makeBalls
    );

    makeBalls();
    loop();

    return function () {

        stopped = true;

        cancelAnimationFrame(
            animation
        );
    };
}

/* =========================================================
   MAHJONG
   ========================================================= */

function createMahjong() {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🀄 Mahjong • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Çift: 0/8"
        );

    const grid =
        el("div","game-grid");

    const symbols = [
        "🀄",
        "🐉",
        "🌸",
        "🎋",
        "☀️",
        "🌙",
        "⭐",
        "🪙"
    ];

    let pairs = 0;

    let cards =
        shuffle([
            ...symbols,
            ...symbols
        ]);

    let selected = [];

    cards.forEach(
        (symbol) => {

            const c =
                el(
                    "div",
                    "memory-card",
                    "?"
                );

            c.addEventListener(
                "click",
                () => {

                    if (
                        selected.length >= 2 ||
                        c.classList.contains(
                            "open"
                        ) ||
                        c.classList.contains(
                            "done"
                        )
                    )
                        return;

                    c.textContent = symbol;
                    c.classList.add(
                        "open"
                    );

                    selected.push({
                        el:c,
                        symbol
                    });

                    if (
                        selected.length === 2
                    ) {

                        const a =
                            selected[0];

                        const b =
                            selected[1];

                        if (
                            a.symbol ===
                            b.symbol
                        ) {

                            a.el.classList.add(
                                "done"
                            );

                            b.el.classList.add(
                                "done"
                            );

                            pairs++;

                            addXP(15);

                            scoreEl.textContent =
                                "Çift: " +
                                pairs +
                                "/8";

                            selected = [];

                            if (
                                pairs === 8
                            )
                                winGame(150);

                        } else {

                            const pair =
                                selected;

                            selected = [];

                            setTimeout(
                                () => {

                                    pair.forEach(
                                        x => {

                                            x.el.classList.remove(
                                                "open"
                                            );

                                            x.el.textContent =
                                                "?";
                                        }
                                    );

                                },
                                650
                            );
                        }
                    }
                }
            );

            grid.appendChild(c);
        }
    );

    shell.append(
        title,
        scoreEl,
        grid
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return function () {};
}

/* =========================================================
   SUDOKU
   ========================================================= */

function createSudoku() {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🔢 Sudoku • Seviye " +
            level +
            "/100"
        );

    const solved = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
    ];

    const puzzle =
        solved.map(
            row => row.slice()
        );

    const removeCount =
        Math.min(
            60,
            35 +
            Math.floor(level/3)
        );

    let removed = 0;

    while (
        removed < removeCount
    ) {

        const r = rand(0,8);
        const c = rand(0,8);

        if (
            puzzle[r][c] !== 0
        ) {

            puzzle[r][c] = 0;
            removed++;
        }
    }

    const grid =
        el("div","sudoku");

    for (
        let r=0;
        r<9;
        r++
    ) {

        for (
            let c=0;
            c<9;
            c++
        ) {

            const input =
                document.createElement(
                    "input"
                );

            input.maxLength = 1;
            input.inputMode =
                "numeric";

            if (puzzle[r][c]) {

                input.value =
                    puzzle[r][c];

                input.disabled = true;

            } else {

                input.addEventListener(
                    "input",
                    () => {

                        input.value =
                            input.value
                                .replace(
                                    /[^1-9]/g,
                                    ""
                                );
                    }
                );
            }

            input.dataset.r = r;
            input.dataset.c = c;

            grid.appendChild(input);
        }
    }

    const check =
        el(
            "button",
            "game-button",
            "Kontrol Et"
        );

    check.addEventListener(
        "click",
        () => {

            let correct = true;
            let complete = true;

            $$(
                "input",
                grid
            ).forEach(
                input => {

                    const r =
                        Number(
                            input.dataset.r
                        );

                    const c =
                        Number(
                            input.dataset.c
                        );

                    if (
                        !input.value
                    ) {

                        complete = false;
                        return;
                    }

                    if (
                        Number(
                            input.value
                        ) !==
                        solved[r][c]
                    )
                        correct = false;
                }
            );

            if (
                complete &&
                correct
            ) {

                winGame(200);

            } else if (!correct) {

                showMessage(
                    "Hatalı",
                    "Bazı rakamlar yanlış."
                );

            } else {

                showMessage(
                    "Devam Et",
                    "Tüm hücreleri doldur."
                );
            }
        }
    );

    shell.append(
        title,
        grid,
        check
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return function () {};
}

/* =========================================================
   BUBBLE SHOOTER
   ========================================================= */

function createBubble() {

    let scoreLocal = 0;
    let gameOver = false;

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🔵 Bubble Shooter • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Skor: 0"
        );

    const grid =
        el("div","game-grid");

    const colors = [
        "🔴",
        "🟢",
        "🔵",
        "🟡",
        "🟣"
    ];

    function refill() {

        grid.innerHTML = "";

        for (
            let i=0;
            i<48;
            i++
        ) {

            const cell =
                el(
                    "div",
                    "grid-cell",
                    colors[
                        rand(
                            0,
                            colors.length-1
                        )
                    ]
                );

            cell.addEventListener(
                "click",
                () => {

                    if (gameOver)
                        return;

                    const current =
                        cell.textContent;

                    const all =
                        $$(".grid-cell",grid);

                    const same =
                        all.filter(
                            x =>
                                x.textContent ===
                                current
                        );

                    if (
                        same.length >= 3
                    ) {

                        /*
                           Tıklanan renkten
                           bir grup temizle.
                        */

                        const remove =
                            same.slice(
                                0,
                                Math.min(
                                    5,
                                    same.length
                                )
                            );

                        remove.forEach(
                            x =>
                                x.textContent =
                                    ""
                        );

                        scoreLocal +=
                            remove.length *
                            10;

                        addXP(5);

                    } else {

                        scoreLocal += 2;
                    }

                    scoreEl.textContent =
                        "Skor: " +
                        scoreLocal;

                    if (
                        scoreLocal >=
                        300 +
                        level * 5
                    ) {

                        gameOver = true;
                        winGame(150);
                    }
                }
            );

            grid.appendChild(cell);
        }
    }

    shell.append(
        title,
        scoreEl,
        grid
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    refill();

    return function () {
        gameOver = true;
    };
}

/* =========================================================
   ARABA YARIŞI
   ========================================================= */

function createRace() {

    let stopped = false;
    let frame = 0;

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🏎️ Araba Yarışı • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Geçilen: 0/15"
        );

    const canvas =
        el(
            "canvas",
            "race-canvas"
        );

    canvas.width = 600;
    canvas.height = 500;

    const ctx =
        canvas.getContext("2d");

    shell.append(
        title,
        scoreEl,
        canvas
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    let x = 300;

    let enemies = [];

    let scoreLocal = 0;

    for (
        let i=0;
        i<4;
        i++
    ) {

        enemies.push({
            x:rand(160,440),
            y:-i*150
        });
    }

    function draw() {

        if (stopped)
            return;

        ctx.fillStyle = "#171717";
        ctx.fillRect(
            0,
            0,
            600,
            500
        );

        ctx.fillStyle = "#454545";
        ctx.fillRect(
            120,
            0,
            360,
            500
        );

        ctx.strokeStyle = "#fff";
        ctx.setLineDash([
            30,
            25
        ]);
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(300,0);
        ctx.lineTo(300,500);
        ctx.stroke();

        ctx.setLineDash([]);

        /*
           Oyuncu.
        */

        ctx.fillStyle = "#3498db";

        ctx.fillRect(
            x-20,
            420,
            40,
            60
        );

        enemies.forEach(
            enemy => {

                ctx.fillStyle =
                    "#e74c3c";

                ctx.fillRect(
                    enemy.x-20,
                    enemy.y-30,
                    40,
                    60
                );

                enemy.y +=
                    3 +
                    level*.08;

                if (
                    enemy.y > 540
                ) {

                    scoreLocal++;

                    enemy.y = -60;
                    enemy.x =
                        rand(
                            150,
                            450
                        );

                    scoreEl.textContent =
                        "Geçilen: " +
                        scoreLocal +
                        "/15";

                    addXP(3);
                }

                if (
                    Math.abs(
                        enemy.x-x
                    ) < 38 &&
                    Math.abs(
                        enemy.y-450
                    ) < 60
                ) {

                    stopped = true;
                    loseGame();
                }
            }
        );

        if (
            scoreLocal >= 15
        ) {

            stopped = true;
            winGame(200);
        }

        frame =
            requestAnimationFrame(
                draw
            );
    }

    function key(e) {

        if (
            e.key === "ArrowLeft"
        )
            x -= 30;

        if (
            e.key === "ArrowRight"
        )
            x += 30;

        x =
            Math.max(
                145,
                Math.min(
                    455,
                    x
                )
            );
    }

    function touchMove(e) {

        const rect =
            canvas.getBoundingClientRect();

        const source =
            e.touches
                ? e.touches[0]
                : e;

        const pos =
            (
                source.clientX -
                rect.left
            ) /
            rect.width;

        x =
            145 +
            pos * 310;

        x =
            Math.max(
                145,
                Math.min(
                    455,
                    x
                )
            );
    }

    window.addEventListener(
        "keydown",
        key
    );

    canvas.addEventListener(
        "touchmove",
        touchMove,
        {passive:true}
    );

    draw();

    return function () {

        stopped = true;

        cancelAnimationFrame(
            frame
        );

        window.removeEventListener(
            "keydown",
            key
        );
    };
}

/* =========================================================
   BLOCK PUZZLE
   ========================================================= */

function createBlock() {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🧱 Block Puzzle • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Skor: 0"
        );

    const grid =
        el("div","block-grid");

    let scoreLocal = 0;
    let finished = false;

    for (
        let i=0;
        i<64;
        i++
    ) {

        const c =
            el(
                "div",
                "block-cell"
            );

        c.addEventListener(
            "click",
            () => {

                if (finished)
                    return;

                if (
                    !c.classList.contains(
                        "filled"
                    )
                ) {

                    c.classList.add(
                        "filled"
                    );

                    scoreLocal += 5;

                    addXP(2);

                    checkRows();

                    scoreEl.textContent =
                        "Skor: " +
                        scoreLocal;
                }
            }
        );

        grid.appendChild(c);
    }

    function checkRows() {

        const cells =
            [...grid.children];

        for (
            let r=0;
            r<8;
            r++
        ) {

            const row =
                cells.slice(
                    r*8,
                    r*8+8
                );

            if (
                row.every(
                    c =>
                        c.classList.contains(
                            "filled"
                        )
                )
            ) {

                row.forEach(
                    c =>
                        c.classList.remove(
                            "filled"
                        )
                );

                scoreLocal += 80;

                addXP(10);
            }
        }

        if (
            scoreLocal >= 500
        ) {

            finished = true;
            winGame(200);
        }
    }

    shell.append(
        title,
        scoreEl,
        grid
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return function () {
        finished = true;
    };
}

/* =========================================================
   OKÇULUK
   ========================================================= */

function createArchery() {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🏹 Okçuluk • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Skor: 0 • Atış: 0/15"
        );

    const area =
        el(
            "div",
            "simple-game"
        );

    area.style.position =
        "relative";

    area.style.height =
        "420px";

    area.style.overflow =
        "hidden";

    let scoreLocal = 0;
    let shots = 0;
    let finished = false;

    function newTarget() {

        area.querySelectorAll(
            ".target"
        ).forEach(
            x => x.remove()
        );

        if (finished)
            return;

        const target =
            el(
                "div",
                "target"
            );

        target.style.left =
            rand(5,82) + "%";

        target.style.top =
            rand(10,70) + "%";

        target.addEventListener(
            "click",
            function () {

                if (finished)
                    return;

                scoreLocal += 100;
                shots++;

                addXP(8);

                target.remove();

                scoreEl.textContent =
                    "Skor: " +
                    scoreLocal +
                    " • Atış: " +
                    shots +
                    "/15";

                if (
                    scoreLocal >=
                    1000 +
                    level*10
                ) {

                    finished = true;
                    winGame(200);

                } else if (
                    shots >= 15
                ) {

                    finished = true;
                    loseGame();

                } else {

                    newTarget();
                }
            }
        );

        area.appendChild(target);
    }

    shell.append(
        title,
        scoreEl,
        area
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    newTarget();

    return function () {
        finished = true;
    };
}

/* =========================================================
   MEMORY
   ========================================================= */

function createMemory(hard) {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const count =
        hard ? 12 : 8;

    const title =
        el(
            "h2",
            "",
            "🧠 " +
            (
                hard
                    ? "Hafıza Oyunu"
                    : "Zeka Eşleştirme"
            ) +
            " • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Eşleşme: 0/" + count
        );

    const grid =
        el(
            "div",
            "game-grid"
        );

    if (hard)
        grid.style.gridTemplateColumns =
            "repeat(6,1fr)";

    const symbols = [
        "🍎",
        "🍌",
        "🍇",
        "🍒",
        "🍉",
        "🥝",
        "🍓",
        "🍊",
        "🥭",
        "🍋",
        "🥥",
        "🍑"
    ].slice(
        0,
        count
    );

    const cards =
        shuffle([
            ...symbols,
            ...symbols
        ]);

    let selected = [];
    let matched = 0;
    let finished = false;

    cards.forEach(
        symbol => {

            const card =
                el(
                    "div",
                    "memory-card",
                    "?"
                );

            card.addEventListener(
                "click",
                () => {

                    if (
                        finished ||
                        selected.length >= 2 ||
                        card.classList.contains(
                            "done"
                        ) ||
                        card.classList.contains(
                            "open"
                        )
                    )
                        return;

                    card.textContent =
                        symbol;

                    card.classList.add(
                        "open"
                    );

                    selected.push({
                        card,
                        symbol
                    });

                    if (
                        selected.length === 2
                    ) {

                        const a =
                            selected[0];

                        const b =
                            selected[1];

                        if (
                            a.symbol ===
                            b.symbol
                        ) {

                            a.card.classList.add(
                                "done"
                            );

                            b.card.classList.add(
                                "done"
                            );

                            matched++;

                            addXP(10);

                            selected = [];

                            scoreEl.textContent =
                                "Eşleşme: " +
                                matched +
                                "/" +
                                count;

                            if (
                                matched === count
                            ) {

                                finished = true;
                                winGame(200);
                            }

                        } else {

                            const pair =
                                selected;

                            selected = [];

                            setTimeout(
                                () => {

                                    if (finished)
                                        return;

                                    pair.forEach(
                                        x => {

                                            x.card.classList.remove(
                                                "open"
                                            );

                                            x.card.textContent =
                                                "?";
                                        }
                                    );

                                },
                                700
                            );
                        }
                    }
                }
            );

            grid.appendChild(card);
        }
    );

    shell.append(
        title,
        scoreEl,
        grid
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return function () {
        finished = true;
    };
}

/* =========================================================
   YILAN
   ========================================================= */

function createSnake() {

    let stopped = false;
    let timer = null;

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🐍 Yılan Oyunu • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "Skor: 0"
        );

    const canvas =
        el(
            "canvas",
            "snake-canvas"
        );

    canvas.width = 500;
    canvas.height = 500;

    shell.append(
        title,
        scoreEl,
        canvas
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    const ctx =
        canvas.getContext("2d");

    const size = 25;

    let snake = [
        {x:10,y:10},
        {x:9,y:10},
        {x:8,y:10}
    ];

    let dir = {
        x:1,
        y:0
    };

    let nextDir = {
        x:1,
        y:0
    };

    let food = {
        x:rand(0,19),
        y:rand(0,19)
    };

    let scoreLocal = 0;

    function draw() {

        ctx.fillStyle =
            "#101629";

        ctx.fillRect(
            0,
            0,
            500,
            500
        );

        ctx.strokeStyle =
            "rgba(255,255,255,.04)";

        for (
            let i=0;
            i<=20;
            i++
        ) {

            ctx.beginPath();
            ctx.moveTo(
                i*size,
                0
            );
            ctx.lineTo(
                i*size,
                500
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(
                0,
                i*size
            );
            ctx.lineTo(
                500,
                i*size
            );
            ctx.stroke();
        }

        ctx.fillStyle =
            "#6c63ff";

        snake.forEach(
            p => {

                ctx.fillRect(
                    p.x*size,
                    p.y*size,
                    size-2,
                    size-2
                );
            }
        );

        ctx.fillStyle =
            "#e74c3c";

        ctx.beginPath();

        ctx.arc(
            food.x*size+12,
            food.y*size+12,
            10,
            0,
            Math.PI*2
        );

        ctx.fill();

        scoreEl.textContent =
            "Skor: " +
            scoreLocal;
    }

    function newFood() {

        let valid = false;

        while (!valid) {

            food = {
                x:rand(0,19),
                y:rand(0,19)
            };

            valid =
                !snake.some(
                    p =>
                        p.x === food.x &&
                        p.y === food.y
                );
        }
    }

    function tick() {

        if (stopped)
            return;

        dir = nextDir;

        const head = {
            x:
                snake[0].x +
                dir.x,

            y:
                snake[0].y +
                dir.y
        };

        if (
            head.x < 0 ||
            head.x >= 20 ||
            head.y < 0 ||
            head.y >= 20
        ) {

            stopped = true;
            loseGame();
            return;
        }

        /*
           Kuyruğun son hücresine
           girebilmek için onu
           büyüme yoksa çarpışmadan
           çıkarıyoruz.
        */

        const willEat =
            head.x === food.x &&
            head.y === food.y;

        const body =
            willEat
                ? snake
                : snake.slice(
                    0,
                    -1
                );

        if (
            body.some(
                p =>
                    p.x === head.x &&
                    p.y === head.y
            )
        ) {

            stopped = true;
            loseGame();
            return;
        }

        snake.unshift(head);

        if (willEat) {

            scoreLocal += 10;

            addXP(5);

            newFood();

            if (
                scoreLocal >=
                200 +
                level*2
            ) {

                stopped = true;
                winGame(200);
                return;
            }

        } else {

            snake.pop();
        }

        draw();
    }

    function key(e) {

        if (
            e.key === "ArrowUp" &&
            dir.y !== 1
        )
            nextDir = {
                x:0,
                y:-1
            };

        if (
            e.key === "ArrowDown" &&
            dir.y !== -1
        )
            nextDir = {
                x:0,
                y:1
            };

        if (
            e.key === "ArrowLeft" &&
            dir.x !== 1
        )
            nextDir = {
                x:-1,
                y:0
            };

        if (
            e.key === "ArrowRight" &&
            dir.x !== -1
        )
            nextDir = {
                x:1,
                y:0
            };
    }

    window.addEventListener(
        "keydown",
        key
    );

    draw();

    timer =
        setInterval(
            tick,
            Math.max(
                70,
                150-level
            )
        );

    return function () {

        stopped = true;

        clearInterval(timer);

        window.removeEventListener(
            "keydown",
            key
        );
    };
}

/* =========================================================
   BASKET
   ========================================================= */

function createBasket() {

    const root =
        el("div","game-shell");

    const shell =
        el("div","simple-game");

    const title =
        el(
            "h2",
            "",
            "🏀 Basket Atışı • Seviye " +
            level +
            "/100"
        );

    const scoreEl =
        el(
            "div",
            "info-box",
            "İsabet: 0/10"
        );

    const hoop =
        el(
            "div",
            "basket-hoop"
        );

    const ball =
        el(
            "div",
            "basket-ball"
        );

    const help =
        el(
            "p",
            "",
            "Topa tıkla ve atış yap."
        );

    let scoreLocal = 0;
    let attempts = 0;
    let finished = false;

    ball.addEventListener(
        "click",
        () => {

            if (
                finished ||
                attempts >= 10
            )
                return;

            attempts++;

            /*
               Seviye arttıkça
               isabet biraz zorlaşır.
            */

            const chance =
                Math.max(
                    .35,
                    .75 -
                    level*.003
                );

            const hit =
                Math.random() <
                chance;

            if (hit) {

                scoreLocal++;

                addXP(8);

                ball.animate(
                    [
                        {
                            transform:
                                "translateY(0)"
                        },
                        {
                            transform:
                                "translateY(-180px)"
                        },
                        {
                            transform:
                                "translateY(0)"
                        }
                    ],
                    {
                        duration:700
                    }
                );
            } else {

                ball.animate(
                    [
                        {
                            transform:
                                "translateX(0)"
                        },
                        {
                            transform:
                                "translateX(80px)"
                        },
                        {
                            transform:
                                "translateX(0)"
                        }
                    ],
                    {
                        duration:500
                    }
                );
            }

            scoreEl.textContent =
                "İsabet: " +
                scoreLocal +
                "/10";

            if (
                scoreLocal >= 7
            ) {

                finished = true;
                winGame(200);

            } else if (
                attempts >= 10
            ) {

                finished = true;
                loseGame();
            }
        }
    );

    shell.append(
        title,
        scoreEl,
        hoop,
        ball,
        help
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return function () {
        finished = true;
    };
}

/* =========================================================
   DEMO REKLAM
   ========================================================= */

if (watchAdBtn) {

    watchAdBtn.addEventListener(
        "click",
        () => {

            showMessage(
                "📺 Reklam Alanı",
                "Bu şu anda deneme reklamıdır. " +
                "AdSense onayından sonra gerçek reklam kodu " +
                "buraya bağlanabilir."
            );

            setTimeout(
                () => {

                    /*
                       Gerçek reklam geliri değildir.
                       Sadece geliştirme testidir.
                    */

                    changeScore(
                        AD_REWARD
                    );

                    addXP(10);

                    showMessage(
                        "🎁 Demo Bonus",
                        "+" +
                        AD_REWARD +
                        " test puanı ve +10 XP eklendi."
                    );

                },
                1200
            );
        }
    );
}

/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape"
        ) {

            hideMessage();
            closeGame();
        }
    }
);

/* =========================================================
   BAŞLANGIÇ
   ========================================================= */

updateScoreUI();

});
