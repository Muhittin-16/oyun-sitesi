/* =========================================================
   OYNAKAZAN
   15 OYUNLU TAM OYUN MOTORU
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

"use strict";

/* =========================================================
   AYARLAR
========================================================= */

const START_SCORE = 500;
const GAME_ENTRY_COST = 50;
const WIN_REWARD = 100;
const LOSS_REWARD = -50;
const AD_REWARD = 100;

const SCORE_KEY = "oynakazan_score";

let score = Number(localStorage.getItem(SCORE_KEY));

if (isNaN(score)) {
    score = START_SCORE;
    localStorage.setItem(SCORE_KEY, score);
}


/* =========================================================
   ELEMENTLER
========================================================= */

const gamesContainer = document.getElementById("games-container");
const gameModal = document.getElementById("game-modal");
const gameArea = document.getElementById("game-area");
const modalGameTitle = document.getElementById("modal-game-title");
const modalCategory = document.getElementById("modal-category");
const closeModalButton = document.getElementById("close-modal-btn");

const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageClose = document.getElementById("message-close");

const scoreElement = document.getElementById("user-score");
const watchAdButton = document.getElementById("watch-ad-btn");

if (scoreElement) {
    scoreElement.textContent = score;
}


/* =========================================================
   OYUN CSS
========================================================= */

const gameStyle = document.createElement("style");

gameStyle.textContent = `

*{
    box-sizing:border-box;
}

.game-area{
    width:100%;
    max-width:1200px;
    margin:auto;
    color:#fff;
}

.game-shell{
    width:100%;
    padding:12px;
}

.game-toolbar{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    align-items:center;
    justify-content:center;
    margin-bottom:14px;
}

.game-button{
    border:0;
    border-radius:10px;
    padding:10px 15px;
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
    opacity:.45;
    cursor:not-allowed;
    transform:none;
}

.game-info{
    text-align:center;
    padding:10px;
    margin:8px 0;
    border-radius:10px;
    background:rgba(255,255,255,.07);
}

.table-game{
    background:
      radial-gradient(circle at center,#176b42,#0b4329 65%,#062719);
    border:12px solid #633a1d;
    border-radius:28px;
    box-shadow:
      inset 0 0 40px rgba(0,0,0,.7),
      0 15px 45px rgba(0,0,0,.45);
    padding:18px;
    min-height:540px;
    position:relative;
}

.table-title{
    text-align:center;
    font-weight:900;
    font-size:22px;
    margin-bottom:12px;
    text-shadow:0 2px 4px #000;
}

.player-zone{
    background:rgba(0,0,0,.18);
    border-radius:14px;
    padding:10px;
    margin:8px 0;
}

.player-name{
    text-align:center;
    font-weight:800;
    margin-bottom:6px;
}

.okey-table{
    min-height:520px;
}

.okey-opponents{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
}

.okey-opponent{
    background:rgba(0,0,0,.25);
    border:1px solid rgba(255,255,255,.12);
    border-radius:12px;
    padding:10px;
    text-align:center;
}

.okey-avatar{
    font-size:30px;
}

.okey-hidden-tiles{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:3px;
    margin-top:6px;
}

.okey-back{
    width:25px;
    height:35px;
    border-radius:5px;
    background:linear-gradient(135deg,#9c1b36,#401020);
    border:2px solid #e9c46a;
}

.okey-center{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:20px;
    margin:15px 0;
    flex-wrap:wrap;
}

.okey-pile{
    width:75px;
    height:100px;
    border-radius:9px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:28px;
    font-weight:900;
    background:#f7f0d0;
    color:#222;
    border:4px solid #d5ad55;
    box-shadow:0 6px 12px rgba(0,0,0,.4);
}

.okey-rack{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    flex-wrap:wrap;
    gap:4px;
    min-height:100px;
    background:#75431e;
    border:6px solid #45230f;
    border-radius:14px;
    padding:10px;
}

.okey-tile{
    width:42px;
    height:58px;
    background:linear-gradient(#fffdf0,#e9dfb8);
    border:2px solid #bca66b;
    border-radius:6px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    color:#d22;
    font-size:21px;
    font-weight:900;
    box-shadow:0 3px 5px rgba(0,0,0,.4);
    transition:.18s;
}

.okey-tile:hover{
    transform:translateY(-8px);
}

.okey-tile.selected{
    transform:translateY(-15px);
    box-shadow:0 0 0 3px #ffd166,0 8px 14px rgba(0,0,0,.5);
}

.okey-tile.black{
    color:#222;
}

.okey-tile.blue{
    color:#1769aa;
}

.okey-tile.green{
    color:#16844a;
}

.okey-tile.joker{
    color:#7a35c5;
}

.okey-melds{
    min-height:70px;
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:7px;
    margin:10px;
}

.okey-meld{
    display:flex;
    gap:2px;
    padding:5px;
    background:rgba(0,0,0,.25);
    border-radius:8px;
}

.backgammon-board{
    display:grid !important;
    grid-template-columns:repeat(12,1fr) !important;
    gap:5px !important;
    background:#7b461f !important;
    border:12px solid #3b1c0c !important;
    border-radius:15px;
    padding:12px !important;
    min-height:470px !important;
}

.back-point{
    min-height:180px !important;
    position:relative;
    border-radius:5px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    padding-top:5px;
    cursor:pointer;
    overflow:hidden;
}

.back-point:nth-child(n){
    background:linear-gradient(90deg,#dcae62,#9e632f);
}

.back-point:nth-child(-n+12){
    justify-content:flex-start;
}

.back-point:nth-child(n+13){
    justify-content:flex-end;
    padding-top:0;
    padding-bottom:5px;
}

.point-number{
    position:absolute;
    font-size:11px;
    opacity:.8;
}

.back-point:nth-child(-n+12) .point-number{
    top:2px;
}

.back-point:nth-child(n+13) .point-number{
    bottom:2px;
}

.checker{
    width:38px;
    height:38px;
    border-radius:50%;
    border:3px solid rgba(0,0,0,.45);
    margin:1px;
    box-shadow:0 3px 5px rgba(0,0,0,.5);
    animation:checkerDrop .18s ease;
}

.checker.player{
    background:radial-gradient(circle at 30% 25%,#fff,#d8d8d8);
}

.checker.bot{
    background:radial-gradient(circle at 30% 25%,#555,#111);
}

@keyframes checkerDrop{
    from{transform:scale(.5);opacity:0}
    to{transform:scale(1);opacity:1}
}

.dice{
    display:flex;
    gap:12px;
    justify-content:center;
    margin:10px;
}

.die{
    width:55px;
    height:55px;
    background:#fff;
    color:#111;
    border-radius:10px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:30px;
    font-weight:900;
    box-shadow:0 5px 10px #0008;
}

.die.selected{
    outline:4px solid #ffd166;
}

.checkers-board{
    width:min(600px,100%);
    aspect-ratio:1;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(8,1fr);
    border:12px solid #5c3217;
    box-shadow:0 10px 30px #0008;
}

.checkers-cell{
    position:relative;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
}

.checkers-cell:nth-child(odd){
    background:#e4bd7b;
}

.checkers-cell:nth-child(even){
    background:#9b5c2e;
}

.dama-piece{
    width:72%;
    aspect-ratio:1;
    border-radius:50%;
    border:4px solid rgba(0,0,0,.45);
    box-shadow:0 5px 9px #0008;
    transition:.2s;
}

.dama-piece.white{
    background:radial-gradient(circle at 30% 25%,#fff,#aaa);
}

.dama-piece.black{
    background:radial-gradient(circle at 30% 25%,#555,#111);
}

.dama-piece.king:after{
    content:"♛";
    display:flex;
    justify-content:center;
    align-items:center;
    height:100%;
    color:#ffd166;
    font-size:28px;
}

.checkers-cell.selected{
    outline:5px solid #ffd166;
    outline-offset:-5px;
}

.checkers-cell.move-target{
    box-shadow:inset 0 0 0 5px #00d4ff;
}

.batak-table{
    background:
      radial-gradient(circle,#157344,#083c25);
    border:12px solid #593317;
    border-radius:30px;
    padding:15px;
    min-height:550px;
}

.batak-players{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:8px;
}

.batak-player{
    background:#0004;
    border-radius:12px;
    padding:8px;
    text-align:center;
}

.card-back{
    width:32px;
    height:45px;
    border-radius:5px;
    background:repeating-linear-gradient(
        45deg,#243c8f,#243c8f 4px,#16245b 4px,#16245b 8px
    );
    border:2px solid white;
    display:inline-block;
    margin:2px;
}

.batak-center{
    min-height:130px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:5px;
    margin:10px;
}

.playing-card{
    width:62px;
    height:88px;
    background:#fff;
    color:#111;
    border-radius:8px;
    border:2px solid #ddd;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-weight:900;
    font-size:21px;
    cursor:pointer;
    box-shadow:0 5px 9px #0008;
    transition:.18s;
}

.playing-card.red{
    color:#c62828;
}

.playing-card:hover{
    transform:translateY(-10px);
}

.playing-card.selected{
    transform:translateY(-15px);
    outline:3px solid #ffd166;
}

.card-hand{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:5px;
    padding:10px;
}

.batak-status{
    text-align:center;
    font-weight:800;
    padding:8px;
}

.select-box{
    padding:10px;
    border-radius:8px;
    background:#11182d;
    color:white;
    border:1px solid #6c63ff;
}

.memory-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:10px;
    max-width:500px;
    margin:auto;
}

.memory-card{
    aspect-ratio:1;
    border:0;
    border-radius:12px;
    background:#27346f;
    color:#fff;
    font-size:32px;
    cursor:pointer;
}

.memory-card.open{
    background:#fff;
    color:#111;
}

.sudoku-grid{
    display:grid;
    grid-template-columns:repeat(9,1fr);
    max-width:450px;
    margin:auto;
}

.sudoku-cell{
    aspect-ratio:1;
    border:1px solid #666;
    background:#fff;
    color:#111;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:800;
    cursor:pointer;
}

.sudoku-cell.fixed{
    background:#ddd;
}

.bubble-area{
    max-width:600px;
    margin:auto;
    background:#11182d;
    padding:15px;
    border-radius:15px;
}

.bubbles{
    display:grid;
    grid-template-columns:repeat(8,1fr);
    gap:8px;
}

.bubble{
    aspect-ratio:1;
    border-radius:50%;
    border:0;
    cursor:pointer;
    box-shadow:inset -4px -6px 10px #0005,0 3px 5px #0006;
}

.race-track{
    max-width:600px;
    height:420px;
    margin:auto;
    background:repeating-linear-gradient(
        90deg,#444 0,#444 48%,#555 48%,#555 52%
    );
    border:8px solid #222;
    position:relative;
    overflow:hidden;
}

.race-line{
    position:absolute;
    top:0;
    bottom:0;
    left:50%;
    width:5px;
    background:#fff;
    opacity:.7;
}

.car{
    position:absolute;
    width:50px;
    height:80px;
    border-radius:12px;
    background:#e53935;
    bottom:15px;
    left:45%;
    transition:left .1s;
}

.enemy-car{
    position:absolute;
    width:50px;
    height:80px;
    border-radius:12px;
    background:#2196f3;
    top:-90px;
}

.block-grid{
    width:min(420px,100%);
    margin:auto;
    display:grid;
    grid-template-columns:repeat(8,1fr);
    gap:4px;
}

.block-cell{
    aspect-ratio:1;
    border-radius:5px;
    background:#1a2442;
    border:1px solid #34416d;
}

.block-cell.filled{
    background:#6c63ff;
}

.target-area{
    max-width:600px;
    margin:auto;
    min-height:350px;
    background:#17213d;
    border-radius:15px;
    position:relative;
    overflow:hidden;
}

.target{
    position:absolute;
    width:70px;
    height:70px;
    border-radius:50%;
    background:radial-gradient(circle,#fff 0 10%,#e53935 11% 30%,#fff 31% 50%,#e53935 51% 70%,#fff 71%);
    cursor:pointer;
}

.snake-board{
    width:min(500px,100%);
    aspect-ratio:1;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(20,1fr);
    background:#11182d;
}

.snake-cell{
    border:1px solid #17213d;
}

.snake-cell.snake{
    background:#4caf50;
}

.snake-cell.food{
    background:#e53935;
    border-radius:50%;
}

.basket-area{
    max-width:600px;
    min-height:400px;
    margin:auto;
    background:linear-gradient(#87ceeb,#dff6ff);
    border-radius:15px;
    position:relative;
    overflow:hidden;
}

.hoop{
    position:absolute;
    top:70px;
    left:50%;
    transform:translateX(-50%);
    width:130px;
    height:90px;
    border:8px solid #e65100;
    border-top:0;
    border-radius:0 0 70px 70px;
}

.ball{
    position:absolute;
    bottom:30px;
    left:50%;
    width:35px;
    height:35px;
    border-radius:50%;
    background:#e87519;
    cursor:pointer;
}

.mahjong-grid{
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:7px;
    max-width:600px;
    margin:auto;
}

.mahjong-tile{
    min-height:70px;
    background:#f3e9c9;
    color:#222;
    border-radius:8px;
    border:3px solid #c1a96a;
    font-size:28px;
    font-weight:900;
    cursor:pointer;
}

.word-area{
    max-width:650px;
    margin:auto;
    text-align:center;
}

.word-input{
    width:100%;
    padding:13px;
    border-radius:10px;
    border:0;
    font-size:18px;
}

.reaction-button{
    width:220px;
    height:220px;
    border-radius:50%;
    border:0;
    background:#6c63ff;
    color:#fff;
    font-size:28px;
    font-weight:900;
    cursor:pointer;
}

@media(max-width:700px){

    .okey-opponents{
        grid-template-columns:1fr;
    }

    .backgammon-board{
        gap:2px !important;
        padding:5px !important;
        border-width:7px !important;
    }

    .back-point{
        min-height:130px !important;
    }

    .checker{
        width:27px;
        height:27px;
    }

    .playing-card{
        width:48px;
        height:70px;
        font-size:16px;
    }

    .okey-tile{
        width:31px;
        height:46px;
        font-size:16px;
    }

    .dama-piece{
        border-width:2px;
    }

    .memory-grid{
        gap:5px;
    }

}

`;

document.head.appendChild(gameStyle);


/* =========================================================
   PUAN SİSTEMİ
========================================================= */

function updateScore() {

    if (score < 0) {
        score = 0;
    }

    localStorage.setItem(SCORE_KEY, score);

    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function changeScore(amount) {

    score += amount;
    updateScore();

}

function showMessage(icon, title, text) {

    if (!messageModal) return;

    messageIcon.textContent = icon;
    messageTitle.textContent = title;
    messageText.textContent = text;

    messageModal.classList.remove("hidden");
}

function hideMessage() {

    if (messageModal) {
        messageModal.classList.add("hidden");
    }

}

if (messageClose) {
    messageClose.addEventListener("click", hideMessage);
}

function gameWon(name, points = WIN_REWARD) {

    changeScore(points);

    showMessage(
        "🏆",
        "Tebrikler!",
        `${name} oyununu kazandın! +${points} puan kazandın.`
    );
}

function gameLost(name) {

    changeScore(LOSS_REWARD);

    showMessage(
        "😔",
        "Oyun Bitti",
        `${name} oyununu kaybettin. ${LOSS_REWARD} puan.`
    );
}


/* =========================================================
   YARDIMCI FONKSİYONLAR
========================================================= */

function randomBot() {

    const names = [
        "Ali",
        "Mehmet",
        "Ahmet",
        "Burak",
        "Murat",
        "Emre",
        "Can",
        "Kerem",
        "Hasan",
        "Hakan",
        "Efe",
        "Oğuz"
    ];

    return names[Math.floor(Math.random() * names.length)];

}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


/* =========================================================
   OYUN LİSTESİ
========================================================= */

const games = [

    {
        id:1,
        name:"101 Okey",
        icon:"🀄",
        category:"board",
        type:"okey",
        description:"106 taşlık gerçek 101 Okey masası."
    },

    {
        id:2,
        name:"Klasik Tavla",
        icon:"🎲",
        category:"board",
        type:"tavla",
        description:"15 pullu klasik tavla."
    },

    {
        id:3,
        name:"Türk Daması",
        icon:"⚫",
        category:"board",
        type:"dama",
        description:"16 taşlı Türk Daması."
    },

    {
        id:4,
        name:"Batak",
        icon:"🃏",
        category:"cards",
        type:"batak",
        description:"4 kişilik kozlu Batak."
    },

    {
        id:5,
        name:"Bilardo",
        icon:"🎱",
        category:"arcade",
        type:"bilardo",
        description:"Topları ceplere gönder."
    },

    {
        id:6,
        name:"Mahjong",
        icon:"🀄",
        category:"puzzle",
        type:"mahjong",
        description:"Aynı taşları eşleştir."
    },

    {
        id:7,
        name:"Sudoku",
        icon:"🔢",
        category:"puzzle",
        type:"sudoku",
        description:"9x9 Sudoku çöz."
    },

    {
        id:8,
        name:"Bubble Shooter",
        icon:"🫧",
        category:"arcade",
        type:"bubble",
        description:"Aynı renk baloncukları patlat."
    },

    {
        id:9,
        name:"Araba Yarışı",
        icon:"🏎️",
        category:"arcade",
        type:"race",
        description:"Rakiplerden kaç ve bitişe ulaş."
    },

    {
        id:10,
        name:"Block Puzzle",
        icon:"🧱",
        category:"puzzle",
        type:"block",
        description:"Blokları yerleştir."
    },

    {
        id:11,
        name:"Okçuluk",
        icon:"🏹",
        category:"arcade",
        type:"archery",
        description:"Hedefi tam ortadan vur."
    },

    {
        id:12,
        name:"Zeka Eşleştirme",
        icon:"🧠",
        category:"puzzle",
        type:"memory",
        description:"Kartların eşlerini bul."
    },

    {
        id:13,
        name:"Hafıza Oyunu",
        icon:"🃏",
        category:"puzzle",
        type:"memory2",
        description:"Hafızanı test et."
    },

    {
        id:14,
        name:"Yılan Oyunu",
        icon:"🐍",
        category:"arcade",
        type:"snake",
        description:"Yılanı büyüt."
    },

    {
        id:15,
        name:"Basket Atışı",
        icon:"🏀",
        category:"arcade",
        type:"basket",
        description:"Basketleri sayıya çevir."
    }

];


/* =========================================================
   OYUN KARTLARI
========================================================= */

function renderGames(filter = "all") {

    if (!gamesContainer) return;

    gamesContainer.innerHTML = "";

    const filtered = games.filter(game => {

        return filter === "all" ||
               game.category === filter;

    });

    filtered.forEach(game => {

        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `

            <div class="game-card-icon">
                ${game.icon}
            </div>

            <h3>
                ${game.name}
            </h3>

            <p>
                ${game.description}
            </p>

            <button
                class="game-card-btn"
                type="button">

                <i class="fa-solid fa-play"></i>
                Oyna

            </button>

        `;

        card.querySelector("button")
            .addEventListener("click", () => {

                openGame(game);

            });

        gamesContainer.appendChild(card);

    });

}

renderGames();


/* =========================================================
   KATEGORİLER
========================================================= */

document.querySelectorAll(".cat-btn")
    .forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".cat-btn")
                .forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

            renderGames(
                this.dataset.filter || "all"
            );

        });

    });


/* =========================================================
   MODAL
========================================================= */

function openGame(game) {

    if (!gameModal || !gameArea) return;

    if (
        ["okey","tavla","dama","batak"].includes(game.type)
        && score < GAME_ENTRY_COST
    ) {

        showMessage(
            "🪙",
            "Yetersiz Puan",
            `Bu masa oyununa girmek için ${GAME_ENTRY_COST} puan gerekiyor.`
        );

        return;
    }

    if (
        ["okey","tavla","dama","batak"].includes(game.type)
    ) {

        changeScore(-GAME_ENTRY_COST);

    }

    modalGameTitle.textContent = game.name;
    modalCategory.textContent = game.category.toUpperCase();

    gameArea.innerHTML = "";

    gameModal.classList.remove("hidden");
    gameModal.setAttribute("aria-hidden","false");

    switch(game.type) {

        case "okey":
            createOkeyGame();
            break;

        case "tavla":
            createTavlaGame();
            break;

        case "dama":
            createDamaGame();
            break;

        case "batak":
            createBatakGame();
            break;

        case "bilardo":
            createBilliardsGame();
            break;

        case "mahjong":
            createMahjongGame();
            break;

        case "sudoku":
            createSudokuGame();
            break;

        case "bubble":
            createBubbleGame();
            break;

        case "race":
            createRaceGame();
            break;

        case "block":
            createBlockGame();
            break;

        case "archery":
            createArcheryGame();
            break;

        case "memory":
            createMemoryGame();
            break;

        case "memory2":
            createMemory2Game();
            break;

        case "snake":
            createSnakeGame();
            break;

        case "basket":
            createBasketGame();
            break;

    }

}

if (closeModalButton) {

    closeModalButton.addEventListener("click", function () {

        gameModal.classList.add("hidden");
        gameModal.setAttribute("aria-hidden","true");

        gameArea.innerHTML = "";

    });

}


/* =========================================================
   1 - 101 OKEY
   106 TAŞ
   OYUNCU 21
   BAŞLAYAN OYUNCU 22
========================================================= */

function createOkeyGame() {

    let finished = false;

    const colors = [
        {
            id:"red",
            name:"Kırmızı",
            symbol:"●"
        },
        {
            id:"black",
            name:"Siyah",
            symbol:"●"
        },
        {
            id:"blue",
            name:"Mavi",
            symbol:"●"
        },
        {
            id:"green",
            name:"Yeşil",
            symbol:"●"
        }
    ];

    const bots = [
        {
            name:randomBot(),
            hand:[],
            opened:false,
            melds:[]
        },
        {
            name:randomBot(),
            hand:[],
            opened:false,
            melds:[]
        },
        {
            name:randomBot(),
            hand:[],
            opened:false,
            melds:[]
        }
    ];

    let deck = [];
    let playerHand = [];
    let discard = [];
    let selected = [];
    let opened = false;
    let playerMelds = [];
    let hasDrawn = false;

    /* -------------------------
       106 TAŞ
    ------------------------- */

    colors.forEach(color => {

        for(let copy=0; copy<2; copy++) {

            for(let value=1; value<=13; value++) {

                deck.push({
                    color:color.id,
                    colorName:color.name,
                    value:value,
                    wild:false,
                    id:`${color.id}-${value}-${copy}`
                });

            }

        }

    });

    deck.push({
        color:"joker",
        colorName:"Sahte Okey",
        value:0,
        wild:true,
        id:"joker-1"
    });

    deck.push({
        color:"joker",
        colorName:"Sahte Okey",
        value:0,
        wild:true,
        id:"joker-2"
    });

    shuffle(deck);

    const indicatorIndex = deck.findIndex(t => !t.wild);

    const indicator = deck.splice(indicatorIndex,1)[0];

    const okeyValue =
        indicator.value === 13
            ? 1
            : indicator.value + 1;

    deck.forEach(tile => {

        if (
            !tile.wild &&
            tile.color === indicator.color &&
            tile.value === okeyValue
        ) {

            tile.wild = true;

        }

    });

    /* -------------------------
       DAĞITIM
       BAŞLAYAN OYUNCU 22
    ------------------------- */

    for(let i=0;i<22;i++) {

        playerHand.push(deck.pop());

    }

    bots.forEach(bot => {

        for(let i=0;i<21;i++) {

            bot.hand.push(deck.pop());

        }

    });

    function tileValue(tile) {

        if(tile.wild) {
            return 11;
        }

        return tile.value;

    }

    function tileText(tile) {

        if(tile.color === "joker") {
            return "★";
        }

        return tile.value;

    }

    function tileClass(tile) {

        if(tile.color === "red") return "red";
        if(tile.color === "black") return "black";
        if(tile.color === "blue") return "blue";
        if(tile.color === "green") return "green";
        return "joker";

    }

    function isMeld(tiles) {

        if(tiles.length < 3) return false;

        const wilds =
            tiles.filter(t => t.wild);

        const normal =
            tiles.filter(t => !t.wild);

        /* AYNI SAYI */

        if(normal.length > 0) {

            const sameValue =
                normal.every(
                    t => t.value === normal[0].value
                );

            const colorsUsed =
                new Set(normal.map(t => t.color));

            if(
                sameValue &&
                colorsUsed.size === normal.length &&
                tiles.length <= 4
            ) {

                return true;

            }

        }

        /* SERİ */

        if(normal.length > 0) {

            const sameColor =
                normal.every(
                    t => t.color === normal[0].color
                );

            const values =
                normal.map(t => t.value)
                      .sort((a,b)=>a-b);

            const unique =
                new Set(values);

            if(sameColor && unique.size === values.length) {

                const min = values[0];
                const max = values[values.length-1];

                const missing =
                    max - min + 1 - values.length;

                if(
                    missing <= wilds.length &&
                    max - min + 1 === tiles.length
                ) {

                    return true;

                }

            }

        }

        return false;

    }

    function selectedValue() {

        return selected.reduce(
            (sum,index) =>
                sum + tileValue(playerHand[index]),
            0
        );

    }

    function removeSelected() {

        const indexes =
            [...selected]
                .sort((a,b)=>b-a);

        const removed = [];

        indexes.forEach(index => {

            removed.push(
                playerHand.splice(index,1)[0]
            );

        });

        return removed.reverse();

    }

    function drawTile() {

        if(finished) return;

        if(deck.length === 0 && discard.length > 1) {

            const top =
                discard.pop();

            deck = shuffle(discard);
            discard = [top];

        }

        if(deck.length === 0) {

            showMessage(
                "🀄",
                "Taş Bitti",
                "Destede taş kalmadı."
            );

            return;

        }

        playerHand.push(deck.pop());
        hasDrawn = true;

        render();

    }

    function discardTile() {

        if(finished) return;

        if(selected.length !== 1) {

            showMessage(
                "🀄",
                "Taş Seç",
                "Atmak için bir taş seçmelisin."
            );

            return;

        }

        const removed =
            removeSelected()[0];

        discard.push(removed);

        selected = [];
        hasDrawn = false;

        render();

        botTurn(0);

    }

    function openMeld() {

        if(finished) return;

        if(selected.length < 3) {

            showMessage(
                "🀄",
                "Per Seç",
                "En az 3 taş seçmelisin."
            );

            return;

        }

        const tiles =
            selected.map(i => playerHand[i]);

        const value =
            tiles.reduce(
                (sum,t) => sum + tileValue(t),
                0
            );

        if(!opened && value < 101) {

            showMessage(
                "🀄",
                "101 Eksik",
                `Seçtiğin perlerin toplamı ${value}. Açmak için en az 101 gerekiyor.`
            );

            return;

        }

        if(!isMeld(tiles)) {

            showMessage(
                "🀄",
                "Geçersiz Per",
                "Seçtiğin taşlar geçerli bir seri veya grup oluşturmuyor."
            );

            return;

        }

        const meld =
            removeSelected();

        playerMelds.push(meld);
        opened = true;
        selected = [];

        if(playerHand.length === 0) {

            finished = true;

            setTimeout(() => {

                gameWon("101 Okey");

            },300);

            return;

        }

        render();

    }

    function botTurn(index) {

        if(finished) return;

        if(index >= bots.length) {

            startPlayerTurn();
            return;

        }

        const bot = bots[index];

        if(bot.hand.length === 0) {

            finished = true;
            gameLost("101 Okey");
            return;

        }

        setTimeout(() => {

            if(finished) return;

            if(deck.length > 0) {

                bot.hand.push(deck.pop());

            }

            /* Basit bot açılışı */

            if(!bot.opened && bot.hand.length >= 21) {

                let total = bot.hand
                    .reduce(
                        (s,t)=>s+tileValue(t),
                        0
                    );

                if(total >= 101) {

                    bot.opened = true;

                    const take =
                        bot.hand
                            .filter(t => t.wild)
                            .slice(0,1);

                    if(take.length) {

                        bot.hand.splice(
                            bot.hand.indexOf(take[0]),
                            1
                        );

                        bot.melds.push(take);

                    }

                }

            }

            if(bot.hand.length > 1) {

                let highIndex = 0;

                for(let i=1;i<bot.hand.length;i++) {

                    if(
                        tileValue(bot.hand[i]) >
                        tileValue(bot.hand[highIndex])
                    ) {

                        highIndex = i;

                    }

                }

                bot.hand.splice(highIndex,1);

            }

            render();

            botTurn(index+1);

        },500);

    }

    function startPlayerTurn() {

        if(finished) return;

        hasDrawn = false;

        render();

    }

    function render() {

        if(finished) return;

        gameArea.innerHTML = `

            <div class="game-shell">

                <div class="table-game okey-table">

                    <div class="table-title">
                        🀄 101 OKEY MASASI
                    </div>

                    <div class="okey-info game-info">
                        Gösterge:
                        <strong>
                            ${tileText(indicator)}
                            ${indicator.colorName}
                        </strong>
                        &nbsp; | &nbsp;
                        Okey:
                        <strong>
                            ${okeyValue}
                        </strong>
                        &nbsp; | &nbsp;
                        Senin taşın:
                        <strong>
                            ${playerHand.length}
                        </strong>
                    </div>

                    <div class="okey-opponents">

                        ${bots.map(bot => `

                            <div class="okey-opponent">

                                <div class="okey-avatar">
                                    👤
                                </div>

                                <strong>
                                    ${bot.name}
                                </strong>

                                <div>
                                    ${bot.hand.length} taş
                                </div>

                                <div class="okey-hidden-tiles">

                                    ${bot.hand
                                        .slice(0,Math.min(12,bot.hand.length))
                                        .map(() => `
                                            <span class="okey-back"></span>
                                        `)
                                        .join("")}

                                </div>

                            </div>

                        `).join("")}

                    </div>

                    <div class="okey-center">

                        <div>
                            <small>Çekilecek Taş</small>

                            <div
                                class="okey-pile"
                                id="okey-draw">

                                🀄

                            </div>
                        </div>

                        <div>
                            <small>Son Atılan</small>

                            <div class="okey-pile">

                                ${
                                    discard.length
                                    ? tileText(discard[discard.length-1])
                                    : "—"
                                }

                            </div>

                        </div>

                    </div>

                    <div class="okey-melds">

                        ${playerMelds.map(meld => `

                            <div class="okey-meld">

                                ${meld.map(tile => `

                                    <span
                                        class="okey-tile ${tileClass(tile)}">

                                        ${tileText(tile)}

                                    </span>

                                `).join("")}

                            </div>

                        `).join("")}

                    </div>

                    <div class="player-zone">

                        <div class="player-name">
                            🎮 SEN
                        </div>

                        <div class="okey-rack">

                            ${playerHand.map((tile,index) => `

                                <div
                                    class="okey-tile ${tileClass(tile)}
                                    ${selected.includes(index) ? "selected" : ""}"
                                    data-index="${index}">

                                    ${
                                        tile.wild
                                        ? "★"
                                        : tileText(tile)
                                    }

                                </div>

                            `).join("")}

                        </div>

                    </div>

                    <div class="game-toolbar">

                        <button
                            class="game-button"
                            id="okey-draw-btn">

                            🀄 Taş Çek

                        </button>

                        <button
                            class="game-button"
                            id="okey-open-btn">

                            ${
                                opened
                                ? "➕ Per Aç"
                                : "🔓 101 Aç"
                            }

                        </button>

                        <button
                            class="game-button"
                            id="okey-discard-btn">

                            🗑️ Taş At

                        </button>

                    </div>

                    <div class="game-info">

                        ${
                            opened
                            ? "Elini açtın. Yeni perler oluşturabilir ve taş atabilirsin."
                            : "İlk oyuncu 22 taşla başlar. 101'i açmak için geçerli perlerin toplamı en az 101 olmalı."
                        }

                    </div>

                </div>

            </div>

        `;

        gameArea
            .querySelectorAll(".okey-tile[data-index]")
            .forEach(tile => {

                tile.addEventListener("click",function(){

                    const index =
                        Number(this.dataset.index);

                    if(selected.includes(index)) {

                        selected =
                            selected.filter(
                                i => i !== index
                            );

                    } else {

                        selected.push(index);

                    }

                    render();

                });

            });

        document
            .getElementById("okey-draw-btn")
            ?.addEventListener(
                "click",
                drawTile
            );

        document
            .getElementById("okey-open-btn")
            ?.addEventListener(
                "click",
                openMeld
            );

        document
            .getElementById("okey-discard-btn")
            ?.addEventListener(
                "click",
                discardTile
            );

    }

    render();

}


/* =========================================================
   2 - KLASİK TAVLA
   15 PUL
========================================================= */

function createTavlaGame() {

    let finished = false;

    const botName = randomBot();

    const points = Array(24).fill(0);

    let playerBar = 0;
    let botBar = 0;

    let playerOff = 0;
    let botOff = 0;

    let dice = [];
    let selectedDie = null;
    let selectedFrom = null;
    let playerTurn = true;

    /* Standart başlangıç */

    points[0] = 2;
    points[11] = 5;
    points[16] = 3;
    points[18] = 5;

    points[23] = -2;
    points[12] = -5;
    points[7] = -3;
    points[5] = -5;

    function rollDice() {

        if(finished || !playerTurn || dice.length) return;

        const d1 = randomInt(1,6);
        const d2 = randomInt(1,6);

        if(d1 === d2) {

            dice = [d1,d1,d1,d1];

        } else {

            dice = [d1,d2];

        }

        selectedDie = null;
        selectedFrom = null;

        if(!hasAnyMove(1)) {

            render();

            setTimeout(() => {

                botTurn();

            },800);

            return;

        }

        render();

    }

    function allInHome(player) {

        if(player === 1) {

            if(playerBar > 0) return false;

            for(let i=0;i<18;i++) {

                if(points[i] > 0) return false;

            }

        } else {

            if(botBar > 0) return false;

            for(let i=6;i<24;i++) {

                if(points[i] < 0) return false;

            }

        }

        return true;

    }

    function canBearOff(player, from, die) {

        if(!allInHome(player)) return false;

        if(player === 1) {

            const target = from + die;

            if(target >= 24) {

                for(let i=from+1;i<24;i++) {

                    if(points[i] > 0) return false;

                }

                return true;

            }

        } else {

            const target = from - die;

            if(target < 0) {

                for(let i=0;i<from;i++) {

                    if(points[i] < 0) return false;

                }

                return true;

            }

        }

        return false;

    }

    function legalMove(player, from, die) {

        if(player === 1) {

            if(playerBar > 0 && from !== -1) {
                return null;
            }

            if(from === -1) {

                const target = die - 1;

                if(target < 0 || target > 23) return null;

                if(points[target] < -1) return null;

                return target;

            }

            if(points[from] <= 0) return null;

            const target = from + die;

            if(target >= 24) {

                return canBearOff(
                    player,
                    from,
                    die
                ) ? 24 : null;

            }

            if(points[target] < -1) return null;

            return target;

        }

        if(botBar > 0 && from !== -1) {
            return null;
        }

        if(from === -1) {

            const target = 24 - die;

            if(target < 0 || target > 23) return null;

            if(points[target] > 1) return null;

            return target;

        }

        if(points[from] >= 0) return null;

        const target = from - die;

        if(target < 0) {

            return canBearOff(
                player,
                from,
                die
            ) ? -1 : null;

        }

        if(points[target] > 1) return null;

        return target;

    }

    function hasAnyMove(player) {

        for(const die of dice) {

            if(player === 1 && playerBar > 0) {

                if(legalMove(1,-1,die) !== null) {
                    return true;
                }

            } else if(player === -1 && botBar > 0) {

                if(legalMove(-1,-1,die) !== null) {
                    return true;
                }

            } else {

                for(let i=0;i<24;i++) {

                    if(
                        legalMove(player,i,die) !== null
                    ) {

                        return true;

                    }

                }

            }

        }

        return false;

    }

    function executeMove(player,from,to,die) {

        if(player === 1) {

            if(from === -1) {

                playerBar--;

            } else {

                points[from]--;

            }

            if(to === 24) {

                playerOff++;
                return;

            }

            if(points[to] === -1) {

                points[to] = 1;
                botBar++;

            } else {

                points[to]++;

            }

        } else {

            if(from === -1) {

                botBar--;

            } else {

                points[from]++;

            }

            if(to === -1) {

                botOff++;
                return;

            }

            if(points[to] === 1) {

                points[to] = -1;
                playerBar++;

            } else {

                points[to]--;

            }

        }

    }

    function playerPointClick(index) {

        if(finished || !playerTurn) return;

        if(selectedDie === null) {

            if(playerBar > 0) {

                selectedFrom = -1;

                render();

                return;

            }

            if(points[index] > 0) {

                selectedFrom = index;

                render();

            }

            return;

        }

        if(selectedFrom === null) {

            if(points[index] > 0) {

                selectedFrom = index;
                render();

            }

            return;

        }

        const target =
            legalMove(
                1,
                selectedFrom,
                selectedDie
            );

        if(target === null) {

            showMessage(
                "🎲",
                "Geçersiz Hamle",
                "Bu zarla bu pulu oynayamazsın."
            );

            selectedFrom = null;
            render();
            return;

        }

        if(target !== index && target !== 24) {

            showMessage(
                "🎲",
                "Hedef Yanlış",
                "Bu pul için gösterilen hedefe gitmelisin."
            );

            return;

        }

        executeMove(
            1,
            selectedFrom,
            target,
            selectedDie
        );

        dice.splice(
            dice.indexOf(selectedDie),
            1
        );

        selectedDie = null;
        selectedFrom = null;

        if(playerOff >= 15) {

            finished = true;
            gameWon("Klasik Tavla");
            return;

        }

        if(dice.length === 0) {

            playerTurn = false;
            render();

            setTimeout(
                botTurn,
                600
            );

        } else {

            render();

        }

    }

    function botTurn() {

        if(finished) return;

        playerTurn = false;

        let botDice = dice.length
            ? [...dice]
            : [
                randomInt(1,6),
                randomInt(1,6)
            ];

        if(botDice[0] === botDice[1]) {

            botDice = [
                botDice[0],
                botDice[0],
                botDice[0],
                botDice[0]
            ];

        }

        dice = botDice;

        function doBotMove() {

            if(finished || dice.length === 0) {

                playerTurn = true;
                dice = [];
                render();

                return;

            }

            let chosen = null;

            for(const die of dice) {

                if(botBar > 0) {

                    const target =
                        legalMove(-1,-1,die);

                    if(target !== null) {

                        chosen = {
                            from:-1,
                            to:target,
                            die:die
                        };

                        break;

                    }

                } else {

                    for(let i=23;i>=0;i--) {

                        const target =
                            legalMove(-1,i,die);

                        if(target !== null) {

                            chosen = {
                                from:i,
                                to:target,
                                die:die
                            };

                            break;

                        }

                    }

                }

                if(chosen) break;

            }

            if(!chosen) {

                dice = [];
                playerTurn = true;
                render();
                return;

            }

            executeMove(
                -1,
                chosen.from,
                chosen.to,
                chosen.die
            );

            dice.splice(
                dice.indexOf(chosen.die),
                1
            );

            if(botOff >= 15) {

                finished = true;
                gameLost("Klasik Tavla");
                return;

            }

            render();

            setTimeout(
                doBotMove,
                350
            );

        }

        doBotMove();

    }

    function render() {

        if(finished) return;

        const order = [];

        for(let i=23;i>=12;i--) {
            order.push(i);
        }

        for(let i=0;i<12;i++) {
            order.push(i);
        }

        gameArea.innerHTML = `

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        🎲 KLASİK TAVLA
                    </div>

                    <div class="game-info">

                        Sen: 15 pul |
                        Toplanan: ${playerOff}

                        &nbsp;&nbsp; • &nbsp;&nbsp;

                        ${botName}: 15 pul |
                        Toplanan: ${botOff}

                    </div>

                    <div class="dice">

                        ${
                            dice.map((d,i)=>`

                                <button
                                    class="die ${
                                        selectedDie === d
                                        ? "selected"
                                        : ""
                                    }"
                                    data-die="${d}"
                                    data-die-index="${i}">

                                    ${d}

                                </button>

                            `).join("")
                        }

                    </div>

                    <div
                        class="backgammon-board"
                        id="tavla-board">

                        ${order.map((index,position)=>{

                            const count =
                                Math.abs(points[index]);

                            const player =
                                points[index] > 0;

                            return `

                                <div
                                    class="back-point"
                                    data-point="${index}">

                                    <span class="point-number">
                                        ${index+1}
                                    </span>

                                    ${
                                        Array.from(
                                            {length:Math.min(count,7)}
                                        ).map(() => `

                                            <span class="checker ${
                                                player
                                                ? "player"
                                                : "bot"
                                            }"></span>

                                        `).join("")
                                    }

                                </div>

                            `;

                        }).join("")}

                    </div>

                    <div class="game-info">

                        ${
                            playerTurn
                            ? (
                                selectedDie === null
                                ? "Önce zar seç, sonra puluna tıkla."
                                : "Şimdi oynatmak istediğin pula tıkla."
                            )
                            : `${botName} oynuyor...`
                        }

                    </div>

                    <div class="game-toolbar">

                        <button
                            class="game-button"
                            id="tavla-roll"
                            ${!playerTurn || dice.length ? "disabled":""}>

                            🎲 Zar At

                        </button>

                        <button
                            class="game-button"
                            id="tavla-pass"
                            ${!playerTurn ? "disabled":""}>

                            Hamleyi Geç

                        </button>

                    </div>

                </div>

            </div>

        `;

        document
            .querySelectorAll(".die")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function(){

                        selectedDie =
                            Number(this.dataset.die);

                        selectedFrom = null;

                        render();

                    }
                );

            });

        document
            .querySelectorAll(".back-point")
            .forEach(point => {

                point.addEventListener(
                    "click",
                    function(){

                        playerPointClick(
                            Number(this.dataset.point)
                        );

                    }
                );

            });

        document
            .getElementById("tavla-roll")
            ?.addEventListener(
                "click",
                rollDice
            );

        document
            .getElementById("tavla-pass")
            ?.addEventListener(
                "click",
                function(){

                    if(!hasAnyMove(1)) {

                        dice = [];
                        playerTurn = false;

                        render();

                        setTimeout(
                            botTurn,
                            500
                        );

                    }

                }
            );

    }

    render();

}


/* =========================================================
   3 - TÜRK DAMASI
   16 TAŞ
========================================================= */

function createDamaGame() {

    let finished = false;

    const board = Array(64).fill(null);

    let selected = null;
    let playerTurn = true;

    /*
       Türk Daması:
       Her tarafta 16 taş.
       Taşlar yatay/dikey hareket eder.
    */

    for(let r=1;r<=2;r++) {

        for(let c=0;c<8;c++) {

            board[r*8+c] = {
                side:"bot",
                king:false
            };

        }

    }

    for(let r=5;r<=6;r++) {

        for(let c=0;c<8;c++) {

            board[r*8+c] = {
                side:"player",
                king:false
            };

        }

    }

    function rc(index) {

        return {
            r:Math.floor(index/8),
            c:index%8
        };

    }

    function idx(r,c) {

        return r*8+c;

    }

    function inside(r,c) {

        return r>=0 && r<8 && c>=0 && c<8;

    }

    const dirs = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    function getMoves(index, capturesOnly=false) {

        const piece = board[index];

        if(!piece) return [];

        const {r,c} = rc(index);

        const moves = [];

        if(piece.king) {

            dirs.forEach(([dr,dc]) => {

                let nr=r+dr;
                let nc=c+dc;
                let enemyFound=false;
                let enemyIndex=-1;

                while(inside(nr,nc)) {

                    const target =
                        board[idx(nr,nc)];

                    if(!target) {

                        if(!capturesOnly || enemyFound) {

                            moves.push({
                                to:idx(nr,nc),
                                capture:enemyFound
                                    ? enemyIndex
                                    : null
                            });

                        }

                    } else {

                        if(target.side === piece.side) {
                            break;
                        }

                        if(enemyFound) {
                            break;
                        }

                        enemyFound=true;
                        enemyIndex=idx(nr,nc);

                    }

                    nr+=dr;
                    nc+=dc;

                }

            });

            return moves;

        }

        /* NORMAL TAŞ */

        if(!capturesOnly) {

            const forward =
                piece.side === "player"
                ? -1
                : 1;

            [
                [forward,0],
                [0,-1],
                [0,1]
            ].forEach(([dr,dc]) => {

                const nr=r+dr;
                const nc=c+dc;

                if(!inside(nr,nc)) return;

                if(!board[idx(nr,nc)]) {

                    moves.push({
                        to:idx(nr,nc),
                        capture:null
                    });

                }

            });

        }

        /* ALMA */

        dirs.forEach(([dr,dc]) => {

            const mr=r+dr;
            const mc=c+dc;

            const lr=r+dr*2;
            const lc=c+dc*2;

            if(
                !inside(mr,mc) ||
                !inside(lr,lc)
            ) return;

            const middle =
                board[idx(mr,mc)];

            const landing =
                board[idx(lr,lc)];

            if(
                middle &&
                middle.side !== piece.side &&
                !landing
            ) {

                moves.push({
                    to:idx(lr,lc),
                    capture:idx(mr,mc)
                });

            }

        });

        return moves;

    }

    function playerHasCapture() {

        for(let i=0;i<64;i++) {

            if(
                board[i] &&
                board[i].side === "player" &&
                getMoves(i,true).length
            ) {

                return true;

            }

        }

        return false;

    }

    function botHasCapture() {

        for(let i=0;i<64;i++) {

            if(
                board[i] &&
                board[i].side === "bot" &&
                getMoves(i,true).length
            ) {

                return true;

            }

        }

        return false;

    }

    function makeMove(from,move) {

        const piece = board[from];

        board[move.to] = piece;
        board[from] = null;

        if(move.capture !== null) {

            board[move.capture] = null;

        }

        const {r} = rc(move.to);

        if(
            piece.side === "player" &&
            r === 0
        ) {

            piece.king = true;

        }

        if(
            piece.side === "bot" &&
            r === 7
        ) {

            piece.king = true;

        }

    }

    function checkEnd() {

        const playerPieces =
            board.filter(
                p => p && p.side === "player"
            ).length;

        const botPieces =
            board.filter(
                p => p && p.side === "bot"
            ).length;

        if(playerPieces === 0) {

            finished=true;
            gameLost("Türk Daması");
            return true;

        }

        if(botPieces === 0) {

            finished=true;
            gameWon("Türk Daması");
            return true;

        }

        if(
            !playerTurn &&
            !botHasCapture() &&
            !board.some(
                (p,i) =>
                    p &&
                    p.side==="bot" &&
                    getMoves(i).length
            )
        ) {

            finished=true;
            gameWon("Türk Daması");
            return true;

        }

        if(
            playerTurn &&
            !playerHasCapture() &&
            !board.some(
                (p,i) =>
                    p &&
                    p.side==="player" &&
                    getMoves(i).length
            )
        ) {

            finished=true;
            gameLost("Türk Daması");
            return true;

        }

        return false;

    }

    function clickCell(index) {

        if(finished || !playerTurn) return;

        const piece = board[index];

        if(selected === null) {

            if(
                piece &&
                piece.side === "player"
            ) {

                if(
                    playerHasCapture() &&
                    getMoves(index,true).length === 0
                ) {

                    showMessage(
                        "⚫",
                        "Zorunlu Alma",
                        "Taş alma hakkı olan başka bir taş var."
                    );

                    return;

                }

                selected=index;
                render();

            }

            return;

        }

        const captureOnly =
            playerHasCapture();

        const moves =
            getMoves(
                selected,
                captureOnly
            );

        const move =
            moves.find(
                m => m.to === index
            );

        if(!move) {

            if(
                piece &&
                piece.side === "player"
            ) {

                selected=index;
                render();

            }

            return;

        }

        makeMove(
            selected,
            move
        );

        if(
            move.capture !== null
        ) {

            const more =
                getMoves(
                    move.to,
                    true
                );

            if(more.length) {

                selected=move.to;
                render();
                return;

            }

        }

        selected=null;
        playerTurn=false;

        if(checkEnd()) return;

        render();

        setTimeout(
            botTurn,
            600
        );

    }

    function botTurn() {

        if(finished) return;

        const captures = [];

        for(let i=0;i<64;i++) {

            if(
                board[i] &&
                board[i].side==="bot"
            ) {

                getMoves(i,true)
                    .forEach(move => {

                        captures.push({
                            from:i,
                            move:move
                        });

                    });

            }

        }

        let choice;

        if(captures.length) {

            choice =
                captures[
                    randomInt(0,captures.length-1)
                ];

        } else {

            const moves=[];

            for(let i=0;i<64;i++) {

                if(
                    board[i] &&
                    board[i].side==="bot"
                ) {

                    getMoves(i)
                        .forEach(move => {

                            moves.push({
                                from:i,
                                move:move
                            });

                        });

                }

            }

            if(!moves.length) {

                finished=true;
                gameWon("Türk Daması");
                return;

            }

            choice =
                moves[
                    randomInt(0,moves.length-1)
                ];

        }

        makeMove(
            choice.from,
            choice.move
        );

        if(
            choice.move.capture !== null
        ) {

            const more =
                getMoves(
                    choice.move.to,
                    true
                );

            if(more.length) {

                setTimeout(
                    () => {

                        botTurn();

                    },
                    400
                );

                render();
                return;

            }

        }

        playerTurn=true;

        if(checkEnd()) return;

        render();

    }

    function render() {

        if(finished) return;

        gameArea.innerHTML = `

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        ⚫ TÜRK DAMASI
                    </div>

                    <div class="game-info">

                        Sen: 16 taş &nbsp; | &nbsp;
                        Rakip: 16 taş

                    </div>

                    <div
                        class="checkers-board"
                        id="dama-board">

                        ${board.map((piece,index)=>`

                            <div
                                class="checkers-cell
                                ${selected===index ? "selected":""}"
                                data-index="${index}">

                                ${
                                    piece
                                    ? `
                                        <div class="dama-piece
                                            ${
                                                piece.side==="player"
                                                ? "white"
                                                : "black"
                                            }
                                            ${
                                                piece.king
                                                ? "king"
                                                : ""
                                            }">
                                        </div>
                                    `
                                    : ""
                                }

                            </div>

                        `).join("")}

                    </div>

                    <div class="game-info">

                        ${
                            playerTurn
                            ? "Taşını seç ve hedef kareye dokun."
                            : "Rakip düşünüyor..."
                        }

                        ${
                            playerHasCapture()
                            ? " • ALMA VAR!"
                            : ""
                        }

                    </div>

                </div>

            </div>

        `;

        document
            .querySelectorAll(".checkers-cell")
            .forEach(cell => {

                cell.addEventListener(
                    "click",
                    function(){

                        clickCell(
                            Number(this.dataset.index)
                        );

                    }
                );

            });

    }

    render();

}


/* =========================================================
   4 - BATAK
   4 KİŞİ
   52 KART
   13 KART
========================================================= */

function createBatakGame() {

    let finished = false;

    const suits = [
        {
            symbol:"♠",
            name:"Maça",
            color:"black"
        },
        {
            symbol:"♥",
            name:"Kupa",
            color:"red"
        },
        {
            symbol:"♦",
            name:"Karo",
            color:"red"
        },
        {
            symbol:"♣",
            name:"Sinek",
            color:"black"
        }
    ];

    const ranks = [
        {value:2,text:"2"},
        {value:3,text:"3"},
        {value:4,text:"4"},
        {value:5,text:"5"},
        {value:6,text:"6"},
        {value:7,text:"7"},
        {value:8,text:"8"},
        {value:9,text:"9"},
        {value:10,text:"10"},
        {value:11,text:"J"},
        {value:12,text:"Q"},
        {value:13,text:"K"},
        {value:14,text:"A"}
    ];

    const bots = [
        {
            name:randomBot(),
            hand:[],
            tricks:0
        },
        {
            name:randomBot(),
            hand:[],
            tricks:0
        },
        {
            name:randomBot(),
            hand:[],
            tricks:0
        }
    ];

    let deck=[];
    let playerHand=[];
    let trump=null;
    let target=5;
    let playerTricks=0;
    let round=0;
    let trick=[];
    let locked=false;

    suits.forEach(suit => {

        ranks.forEach(rank => {

            deck.push({
                suit:suit.symbol,
                suitName:suit.name,
                color:suit.color,
                value:rank.value,
                text:rank.text
            });

        });

    });

    shuffle(deck);

    playerHand =
        deck.splice(0,13);

    bots.forEach(bot => {

        bot.hand =
            deck.splice(0,13);

    });

    function cardHTML(card,index) {

        return `

            <div
                class="playing-card ${card.color}"
                data-index="${index}">

                <div>
                    ${card.text}
                </div>

                <div>
                    ${card.suit}
                </div>

            </div>

        `;

    }

    function legalCards() {

        if(!trick.length) {

            return playerHand;

        }

        const lead =
            trick[0].card.suit;

        const same =
            playerHand.filter(
                card => card.suit === lead
            );

        return same.length
            ? same
            : playerHand;

    }

    function playPlayerCard(index) {

        if(finished || locked) return;

        const card =
            playerHand[index];

        if(!card) return;

        const legal =
            legalCards();

        if(!legal.includes(card)) {

            showMessage(
                "🃏",
                "Kural İhlali",
                "Elinde aynı renkten kart varsa o renkten oynamalısın."
            );

            return;

        }

        locked=true;

        playerHand.splice(index,1);

        trick.push({
            player:0,
            card:card
        });

        render();

        setTimeout(
            botPlay,
            400
        );

    }

    function botPlay() {

        if(finished) return;

        for(let b=0;b<3;b++) {

            const bot = bots[b];

            const lead =
                trick.length
                ? trick[0].card.suit
                : null;

            let legal;

            if(lead) {

                const follow =
                    bot.hand.filter(
                        c => c.suit===lead
                    );

                legal =
                    follow.length
                    ? follow
                    : bot.hand;

            } else {

                legal=bot.hand;

            }

            let card;

            /*
               Basit ama kurallı bot:
               mümkünse düşük kart oynar.
            */

            legal.sort(
                (a,b)=>a.value-b.value
            );

            card=legal[0];

            bot.hand.splice(
                bot.hand.indexOf(card),
                1
            );

            trick.push({
                player:b+1,
                card:card
            });

            render();

        }

        setTimeout(
            finishTrick,
            700
        );

    }

    function finishTrick() {

        if(finished) return;

        const lead =
            trick[0].card.suit;

        let winner=trick[0];

        trick.forEach(play => {

            const card=play.card;

            const current=winner.card;

            if(
                trump &&
                card.suit===trump.symbol &&
                current.suit!==trump.symbol
            ) {

                winner=play;
                return;

            }

            if(
                card.suit===current.suit &&
                card.value>current.value
            ) {

                winner=play;

            }

        });

        if(winner.player===0) {

            playerTricks++;

        } else {

            bots[winner.player-1].tricks++;

        }

        round++;
        trick=[];

        if(round>=13) {

            finished=true;

            setTimeout(() => {

                if(playerTricks >= target) {

                    gameWon("Batak");

                } else {

                    gameLost("Batak");

                }

            },500);

            return;

        }

        locked=false;

        render();

    }

    function startGame() {

        trump =
            suits[
                Number(
                    document.getElementById(
                        "batak-trump"
                    ).value
                )
            ];

        target =
            Number(
                document.getElementById(
                    "batak-target"
                ).value
            );

        document
            .getElementById("batak-start")
            .remove();

        render();

    }

    function render() {

        if(finished) return;

        if(!trump) {

            gameArea.innerHTML = `

                <div class="game-shell">

                    <div class="table-game batak-table">

                        <div class="table-title">
                            🃏 BATAK MASASI
                        </div>

                        <div class="game-info">
                            4 kişilik masa • 52 kart • 13 el
                        </div>

                        <div class="game-toolbar">

                            <label>
                                Koz:
                                <select
                                    class="select-box"
                                    id="batak-trump">

                                    ${suits.map((s,i)=>`

                                        <option value="${i}">
                                            ${s.symbol} ${s.name}
                                        </option>

                                    `).join("")}

                                </select>
                            </label>

                            <label>
                                Hedef:
                                <select
                                    class="select-box"
                                    id="batak-target">

                                    ${Array.from(
                                        {length:11},
                                        (_,i)=>`
                                            <option value="${i+3}">
                                                ${i+3}
                                            </option>
                                        `
                                    ).join("")}

                                </select>
                            </label>

                            <button
                                class="game-button"
                                id="batak-start">

                                🃏 Oyunu Başlat

                            </button>

                        </div>

                    </div>

                </div>

            `;

            document
                .getElementById("batak-start")
                .addEventListener(
                    "click",
                    startGame
                );

            return;

        }

        gameArea.innerHTML = `

            <div class="game-shell">

                <div class="batak-table">

                    <div class="table-title">
                        🃏 BATAK
                    </div>

                    <div class="batak-status">

                        Koz:
                        <strong>
                            ${trump.symbol} ${trump.name}
                        </strong>

                        &nbsp; | &nbsp;

                        Hedef:
                        <strong>${target}</strong>

                        &nbsp; | &nbsp;

                        El:
                        <strong>${round}/13</strong>

                    </div>

                    <div class="batak-players">

                        ${bots.map(bot=>`

                            <div class="batak-player">

                                👤
                                <strong>
                                    ${bot.name}
                                </strong>

                                <div>
                                    ${bot.hand.length} kart
                                </div>

                                <div>

                                    ${Array.from(
                                        {length:bot.hand.length}
                                    ).map(() => `
                                        <span class="card-back"></span>
                                    `).join("")}

                                </div>

                                <small>
                                    Aldığı el: ${bot.tricks}
                                </small>

                            </div>

                        `).join("")}

                    </div>

                    <div class="batak-center">

                        ${trick.map(play=>`

                            <div>

                                <small>
                                    ${
                                        play.player===0
                                        ? "Sen"
                                        : bots[play.player-1].name
                                    }
                                </small>

                                <div class="playing-card ${
                                    play.card.color
                                }">

                                    ${play.card.text}
                                    ${play.card.suit}

                                </div>

                            </div>

                        `).join("")}

                    </div>

                    <div class="game-info">

                        Senin aldığın el:
                        <strong>${playerTricks}</strong>

                    </div>

                    <div class="card-hand">

                        ${playerHand.map(
                            (card,index)=>
                                cardHTML(card,index)
                        ).join("")}

                    </div>

                    <div class="game-info">

                        Kartına tıklayarak oyna.
                        Renk takip zorunludur.

                    </div>

                </div>

            </div>

        `;

        document
            .querySelectorAll(".playing-card[data-index]")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    function(){

                        playPlayerCard(
                            Number(this.dataset.index)
                        );

                    }
                );

            });

    }

    render();

}


/* =========================================================
   5 - BİLARDO
========================================================= */

function createBilliardsGame() {

    let score=0;
    let shots=0;
    let finished=false;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="table-game">

                <div class="table-title">
                    🎱 BİLARDO
                </div>

                <div class="game-info">
                    Toplara tıklayarak ceplere gönder.
                </div>

                <div
                    id="billiard-table"
                    style="
                        max-width:800px;
                        height:400px;
                        margin:auto;
                        background:#075b39;
                        border:18px solid #633818;
                        border-radius:25px;
                        position:relative;
                        overflow:hidden;
                    ">

                    ${Array.from({length:6},(_,i)=>`

                        <div
                            class="pool-hole"
                            style="
                                position:absolute;
                                width:55px;
                                height:55px;
                                border-radius:50%;
                                background:#111;
                                ${
                                    i<3
                                    ? `top:-20px;left:${i*50}%`
                                    : `bottom:-20px;left:${(i-3)*50}%`
                                }
                                transform:translateX(-50%);
                            ">
                        </div>

                    `).join("")}

                    ${Array.from({length:8},(_,i)=>`

                        <button
                            class="pool-ball"
                            data-ball="${i}"
                            style="
                                position:absolute;
                                width:35px;
                                height:35px;
                                border-radius:50%;
                                border:2px solid #fff;
                                background:hsl(${i*45},75%,50%);
                                left:${15+(i%4)*20}%;
                                top:${25+Math.floor(i/4)*35}%;
                                cursor:pointer;
                                box-shadow:0 4px 6px #0008;
                            ">
                        </button>

                    `).join("")}

                </div>

                <div class="game-info">
                    İsabet: <strong id="pool-score">0</strong>
                    &nbsp; | &nbsp;
                    Vuruş: <strong id="pool-shots">0</strong>
                </div>

            </div>

        </div>

    `;

    document
        .querySelectorAll(".pool-ball")
        .forEach(ball => {

            ball.addEventListener(
                "click",
                function(){

                    if(finished) return;

                    shots++;

                    const success =
                        Math.random() > .35;

                    if(success) {

                        score++;

                        this.style.display="none";

                    }

                    document.getElementById(
                        "pool-score"
                    ).textContent=score;

                    document.getElementById(
                        "pool-shots"
                    ).textContent=shots;

                    if(score>=8) {

                        finished=true;

                        gameWon(
                            "Bilardo"
                        );

                    }

                }
            );

        });

}


/* =========================================================
   6 - MAHJONG
========================================================= */

function createMahjongGame() {

    const symbols = [
        "🀄","🌸","🎋","🐉",
        "🍀","⭐","🔴","🔵",
        "🟢","🟡","🟣","🐼"
    ];

    let tiles =
        [...symbols,...symbols];

    shuffle(tiles);

    let selected=[];
    let removed=0;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                🀄 Aynı iki taşı bul.
            </div>

            <div
                class="mahjong-grid"
                id="mahjong-grid">

            </div>

        </div>

    `;

    const grid =
        document.getElementById("mahjong-grid");

    function render() {

        grid.innerHTML="";

        tiles.forEach((tile,index)=>{

            if(tile===null) {

                grid.innerHTML += `
                    <div></div>
                `;

                return;

            }

            const button =
                document.createElement("button");

            button.className="mahjong-tile";
            button.textContent=tile;

            button.addEventListener(
                "click",
                ()=>{

                    if(selected.includes(index)) return;

                    selected.push(index);

                    if(selected.length===2) {

                        const [a,b]=selected;

                        if(tiles[a]===tiles[b]) {

                            tiles[a]=null;
                            tiles[b]=null;
                            removed+=2;

                        }

                        selected=[];

                        render();

                        if(removed===tiles.length) {

                            gameWon("Mahjong");

                        }

                    }

                }
            );

            grid.appendChild(button);

        });

    }

    render();

}


/* =========================================================
   7 - SUDOKU
========================================================= */

function createSudokuGame() {

    const solved = [

        5,3,4,6,7,8,9,1,2,
        6,7,2,1,9,5,3,4,8,
        1,9,8,3,4,2,5,6,7,
        8,5,9,7,6,1,4,2,3,
        4,2,6,8,5,3,7,9,1,
        7,1,3,9,2,4,8,5,6,
        9,6,1,5,3,7,2,8,4,
        2,8,7,4,1,9,6,3,5,
        3,4,5,2,8,6,1,7,9

    ];

    const puzzle=[...solved];

    for(let i=0;i<45;i++) {

        puzzle[
            randomInt(0,80)
        ]=0;

    }

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Boş hücreleri 1-9 arası sayılarla doldur.
            </div>

            <div
                class="sudoku-grid"
                id="sudoku-grid">

            </div>

            <div class="game-toolbar">

                <button
                    class="game-button"
                    id="sudoku-check">

                    Kontrol Et

                </button>

            </div>

        </div>

    `;

    const grid =
        document.getElementById("sudoku-grid");

    puzzle.forEach((value,index)=>{

        const cell =
            document.createElement("div");

        cell.className="sudoku-cell";

        if(value!==0) {

            cell.textContent=value;
            cell.classList.add("fixed");

        } else {

            cell.contentEditable="true";
            cell.dataset.index=index;

        }

        grid.appendChild(cell);

    });

    document
        .getElementById("sudoku-check")
        .addEventListener(
            "click",
            ()=>{

                const cells =
                    [...grid.children];

                const values =
                    cells.map(cell=>{

                        if(cell.classList.contains("fixed")) {

                            return Number(
                                cell.textContent
                            );

                        }

                        return Number(
                            cell.textContent
                        );

                    });

                if(values.every(
                    (v,i)=>v===solved[i]
                )) {

                    gameWon("Sudoku");

                } else {

                    showMessage(
                        "🔢",
                        "Henüz Değil",
                        "Bazı hücrelerde hata var."
                    );

                }

            }
        );

}


/* =========================================================
   8 - BUBBLE SHOOTER
========================================================= */

function createBubbleGame() {

    const colors = [
        "red",
        "blue",
        "green",
        "gold",
        "purple"
    ];

    let points=0;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Aynı renkten baloncukları patlat.
                10 puan = kazanırsın.
            </div>

            <div class="bubble-area">

                <div
                    class="bubbles"
                    id="bubble-grid">

                </div>

            </div>

        </div>

    `;

    const grid =
        document.getElementById("bubble-grid");

    function render() {

        grid.innerHTML="";

        for(let i=0;i<40;i++) {

            const button =
                document.createElement("button");

            button.className="bubble";

            button.style.background =
                colors[
                    randomInt(
                        0,
                        colors.length-1
                    )
                ];

            button.addEventListener(
                "click",
                function(){

                    points++;

                    this.style.visibility="hidden";

                    if(points>=10) {

                        gameWon(
                            "Bubble Shooter"
                        );

                    }

                }
            );

            grid.appendChild(button);

        }

    }

    render();

}


/* =========================================================
   9 - ARABA YARIŞI
========================================================= */

function createRaceGame() {

    let playerX=45;
    let enemyY=-90;
    let finished=false;
    let score=0;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Sağ-sol tuşlarıyla veya butonlarla arabayı yönet.
            </div>

            <div class="race-track">

                <div class="race-line"></div>

                <div
                    id="player-car"
                    class="car">

                </div>

                <div
                    id="enemy-car"
                    class="enemy-car">

                </div>

            </div>

            <div class="game-toolbar">

                <button
                    class="game-button"
                    id="race-left">
                    ◀
                </button>

                <button
                    class="game-button"
                    id="race-right">
                    ▶
                </button>

            </div>

        </div>

    `;

    const player =
        document.getElementById("player-car");

    const enemy =
        document.getElementById("enemy-car");

    function move(amount) {

        playerX += amount;

        playerX =
            Math.max(
                5,
                Math.min(85,playerX)
            );

        player.style.left =
            playerX+"%";

    }

    document
        .getElementById("race-left")
        .addEventListener(
            "click",
            ()=>move(-5)
        );

    document
        .getElementById("race-right")
        .addEventListener(
            "click",
            ()=>move(5)
        );

    const timer =
        setInterval(()=>{

            if(finished) {

                clearInterval(timer);
                return;

            }

            enemyY+=4;

            enemy.style.top=
                enemyY+"px";

            if(enemyY>420) {

                enemyY=-90;
                enemy.style.left=
                    randomInt(10,80)+"%";

                score++;

            }

            if(score>=20) {

                finished=true;
                clearInterval(timer);

                gameWon(
                    "Araba Yarışı"
                );

            }

        },80);

}


/* =========================================================
   10 - BLOCK PUZZLE
========================================================= */

function createBlockGame() {

    const cells =
        Array(64).fill(false);

    let score=0;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Satırları doldurarak temizle.
            </div>

            <div
                class="block-grid"
                id="block-grid">

            </div>

            <div class="game-toolbar">

                <button
                    class="game-button"
                    id="block-random">

                    🧱 Blok Yerleştir

                </button>

            </div>

        </div>

    `;

    const grid =
        document.getElementById("block-grid");

    function render() {

        grid.innerHTML="";

        cells.forEach((filled,index)=>{

            const cell =
                document.createElement("div");

            cell.className =
                "block-cell"+
                (filled ? " filled":"");

            grid.appendChild(cell);

        });

    }

    document
        .getElementById("block-random")
        .addEventListener(
            "click",
            ()=>{

                const free =
                    cells
                        .map(
                            (v,i)=>v?null:i
                        )
                        .filter(
                            v=>v!==null
                        );

                if(!free.length) return;

                const count =
                    Math.min(
                        4,
                        free.length
                    );

                for(let i=0;i<count;i++) {

                    const index =
                        free[
                            randomInt(
                                0,
                                free.length-1
                            )
                        ];

                    cells[index]=true;

                }

                for(let r=0;r<8;r++) {

                    const full =
                        cells
                            .slice(r*8,r*8+8)
                            .every(Boolean);

                    if(full) {

                        for(
                            let c=0;
                            c<8;
                            c++
                        ) {

                            cells[
                                r*8+c
                            ]=false;

                        }

                        score++;

                    }

                }

                render();

                if(score>=5) {

                    gameWon(
                        "Block Puzzle"
                    );

                }

            }
        );

    render();

}


/* =========================================================
   11 - OKÇULUK
========================================================= */

function createArcheryGame() {

    let score=0;
    let shots=0;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Hareket eden hedefi yakala.
            </div>

            <div
                class="target-area"
                id="target-area">

                <button
                    class="target"
                    id="target">

                </button>

            </div>

        </div>

    `;

    const target =
        document.getElementById("target");

    function moveTarget() {

        target.style.left =
            randomInt(5,85)+"%";

        target.style.top =
            randomInt(5,75)+"%";

    }

    target.addEventListener(
        "click",
        ()=>{

            shots++;

            const distance =
                Math.random();

            if(distance < .45) {

                score+=10;

            } else {

                score+=5;

            }

            moveTarget();

            if(score>=50) {

                gameWon(
                    "Okçuluk"
                );

            }

        }
    );

    moveTarget();

}


/* =========================================================
   12 - ZEKA EŞLEŞTİRME
========================================================= */

function createMemoryGame() {

    createMemoryCore(
        "Zeka Eşleştirme",
        [
            "🍎","🍎",
            "🍌","🍌",
            "🍇","🍇",
            "🍉","🍉",
            "🍓","🍓",
            "🥝","🥝",
            "🍒","🍒",
            "🥥","🥥"
        ]
    );

}


/* =========================================================
   13 - HAFIZA OYUNU
========================================================= */

function createMemory2Game() {

    createMemoryCore(
        "Hafıza Oyunu",
        [
            "🚗","🚗",
            "✈️","✈️",
            "🚀","🚀",
            "🚲","🚲",
            "🏀","🏀",
            "⚽","⚽",
            "🎯","🎯",
            "🎮","🎮"
        ]
    );

}


/* =========================================================
   HAFIZA MOTORU
========================================================= */

function createMemoryCore(title,values) {

    const cards =
        shuffle([...values]);

    let open=[];
    let matched=[];
    let locked=false;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                🧠 Tüm çiftleri bul.
            </div>

            <div
                class="memory-grid"
                id="memory-grid">

            </div>

        </div>

    `;

    const grid =
        document.getElementById("memory-grid");

    function render() {

        grid.innerHTML="";

        cards.forEach((value,index)=>{

            const button =
                document.createElement("button");

            button.className="memory-card";

            if(
                open.includes(index) ||
                matched.includes(index)
            ) {

                button.classList.add("open");
                button.textContent=value;

            } else {

                button.textContent="?";

            }

            button.addEventListener(
                "click",
                ()=>{

                    if(
                        locked ||
                        matched.includes(index) ||
                        open.includes(index)
                    ) return;

                    open.push(index);

                    render();

                    if(open.length===2) {

                        locked=true;

                        setTimeout(()=>{

                            if(
                                cards[open[0]]===
                                cards[open[1]]
                            ) {

                                matched.push(
                                    open[0],
                                    open[1]
                                );

                            }

                            open=[];
                            locked=false;

                            render();

                            if(
                                matched.length===
                                cards.length
                            ) {

                                gameWon(title);

                            }

                        },600);

                    }

                }
            );

            grid.appendChild(button);

        });

    }

    render();

}


/* =========================================================
   14 - YILAN
========================================================= */

function createSnakeGame() {

    const size=20;

    let snake=[
        210,
        211,
        212
    ];

    let direction=-1;
    let food=100;
    let score=0;
    let running=true;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Yılanı ok tuşlarıyla yönet.
                Skor: <strong id="snake-score">0</strong>
            </div>

            <div
                class="snake-board"
                id="snake-board">

            </div>

        </div>

    `;

    const board =
        document.getElementById("snake-board");

    function render() {

        board.innerHTML="";

        for(let i=0;i<400;i++) {

            const cell =
                document.createElement("div");

            cell.className="snake-cell";

            if(snake.includes(i)) {

                cell.classList.add("snake");

            }

            if(i===food) {

                cell.classList.add("food");

            }

            board.appendChild(cell);

        }

        document.getElementById(
            "snake-score"
        ).textContent=score;

    }

    function newFood() {

        let position;

        do {

            position =
                randomInt(0,399);

        } while(
            snake.includes(position)
        );

        food=position;

    }

    document.addEventListener(
        "keydown",
        function(e){

            if(!running) return;

            if(
                e.key==="ArrowUp" &&
                direction!==size
            ) {

                direction=-size;

            }

            if(
                e.key==="ArrowDown" &&
                direction!==-size
            ) {

                direction=size;

            }

            if(
                e.key==="ArrowLeft" &&
                direction!==1
            ) {

                direction=-1;

            }

            if(
                e.key==="ArrowRight" &&
                direction!==-1
            ) {

                direction=1;

            }

        }
    );

    const timer =
        setInterval(()=>{

            if(!running) {

                clearInterval(timer);
                return;

            }

            const head =
                snake[snake.length-1];

            let next =
                head+direction;

            const row =
                Math.floor(head/size);

            const nextRow =
                Math.floor(next/size);

            if(
                next<0 ||
                next>=400 ||
                (
                    direction===1 &&
                    nextRow!==row
                ) ||
                (
                    direction===-1 &&
                    nextRow!==row
                ) ||
                snake.includes(next)
            ) {

                running=false;

                gameLost(
                    "Yılan Oyunu"
                );

                return;

            }

            snake.push(next);

            if(next===food) {

                score++;

                newFood();

                if(score>=10) {

                    running=false;

                    gameWon(
                        "Yılan Oyunu"
                    );

                }

            } else {

                snake.shift();

            }

            render();

        },130);

    render();

}


/* =========================================================
   15 - BASKET ATIŞI
========================================================= */

function createBasketGame() {

    let score=0;
    let attempts=0;
    let finished=false;

    gameArea.innerHTML = `

        <div class="game-shell">

            <div class="game-info">
                Topa tıklayarak atış yap.
                Basket için doğru zamanı yakala.
            </div>

            <div class="basket-area">

                <div class="hoop"></div>

                <button
                    class="ball"
                    id="basket-ball">

                </button>

            </div>

            <div class="game-info">

                Basket:
                <strong id="basket-score">0</strong>
                &nbsp; | &nbsp;
                Atış:
                <strong id="basket-attempts">0</strong>

            </div>

        </div>

    `;

    const ball =
        document.getElementById("basket-ball");

    ball.addEventListener(
        "click",
        ()=>{

            if(finished) return;

            attempts++;

            const success =
                Math.random()>.4;

            if(success) {

                score++;

                ball.style.transform=
                    "translateY(-180px)";

                setTimeout(()=>{

                    ball.style.transform="";

                },400);

            }

            document.getElementById(
                "basket-score"
            ).textContent=score;

            document.getElementById(
                "basket-attempts"
            ).textContent=attempts;

            if(score>=5) {

                finished=true;

                gameWon(
                    "Basket Atışı"
                );

            }

            if(
                attempts>=10 &&
                score<5
            ) {

                finished=true;

                gameLost(
                    "Basket Atışı"
                );

            }

        }
    );

}


/* =========================================================
   REKLAM / PUAN
========================================================= */

if(watchAdButton) {

    watchAdButton.addEventListener(
        "click",
        function(){

            showMessage(
                "📺",
                "Reklam",
                "Reklam alanı AdSense onayından sonra gerçek reklam sistemiyle bağlanabilir. Deneme bonusu olarak +100 puan verildi."
            );

            changeScore(
                AD_REWARD
            );

        }
    );

}


/* =========================================================
   ESC İLE MODAL KAPAT
========================================================= */

document.addEventListener(
    "keydown",
    function(e){

        if(e.key==="Escape") {

            if(
                gameModal &&
                !gameModal.classList.contains("hidden")
            ) {

                gameModal.classList.add("hidden");

                if(gameArea) {
                    gameArea.innerHTML="";
                }

            }

            if(
                messageModal &&
                !messageModal.classList.contains("hidden")
            ) {

                hideMessage();

            }

        }

    }
);


/* =========================================================
   BAŞLANGIÇ
========================================================= */

updateScore();

});
