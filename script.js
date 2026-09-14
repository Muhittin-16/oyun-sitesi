/* =========================================================
   OYNAKAZAN - 15 OYUN
   TAM OYUN MOTORU
   MASA OYUNLARI GELİŞTİRİLMİŞ SÜRÜM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
"use strict";

/* =========================================================
   AYARLAR
========================================================= */

const START_SCORE = 500;
const ENTRY_COST = 50;
const WIN_REWARD = 100;
const LOSS_REWARD = -50;
const AD_REWARD = 100;

const SCORE_KEY = "oynakazan_score";

let score = Number(localStorage.getItem(SCORE_KEY));

if (!Number.isFinite(score)) {
    score = START_SCORE;
    localStorage.setItem(SCORE_KEY, score);
}

/* =========================================================
   ELEMENTLER
========================================================= */

const gamesContainer = document.getElementById("games-container");
const gameModal = document.getElementById("game-modal");
const gameArea = document.getElementById("game-area");
const modalTitle = document.getElementById("modal-game-title");
const modalCategory = document.getElementById("modal-category");
const closeBtn = document.getElementById("close-modal-btn");

const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageClose = document.getElementById("message-close");

const scoreElement = document.getElementById("user-score");
const adButton = document.getElementById("watch-ad-btn");

/* =========================================================
   OYUN EKRANI GARANTİ CSS
========================================================= */

const style = document.createElement("style");

style.textContent = `
html,body{
    width:100%;
    min-height:100%;
    overflow-x:hidden!important;
}

body{
    overflow-y:auto!important;
}

#game-modal{
    position:fixed!important;
    inset:0!important;
    width:100vw!important;
    height:100dvh!important;
    min-height:100dvh!important;
    max-height:none!important;
    padding:12px!important;
    display:flex!important;
    align-items:flex-start!important;
    justify-content:center!important;
    overflow-y:auto!important;
    overflow-x:hidden!important;
    z-index:99999!important;
}

#game-modal.hidden{
    display:none!important;
}

#game-modal .modal-content{
    width:min(1250px,96vw)!important;
    max-width:1250px!important;
    height:auto!important;
    max-height:none!important;
    min-height:0!important;
    margin:0 auto 20px!important;
    overflow:visible!important;
}

#game-modal .game-area{
    width:100%!important;
    max-width:100%!important;
    height:auto!important;
    min-height:0!important;
    max-height:none!important;
    overflow:visible!important;
}

.game-shell{
    width:100%;
    max-width:1200px;
    margin:auto;
    padding:8px;
}

.game-toolbar{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
    gap:10px;
    margin:14px 0;
}

.game-button{
    border:0;
    border-radius:12px;
    padding:11px 18px;
    background:linear-gradient(135deg,#6c63ff,#00a9d6);
    color:white;
    font-weight:800;
    cursor:pointer;
    box-shadow:0 4px 12px #0005;
}

.game-button:hover{
    transform:translateY(-2px);
    filter:brightness(1.12);
}

.game-button:disabled{
    opacity:.45;
    cursor:not-allowed;
}

.game-info{
    background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.08);
    border-radius:12px;
    padding:10px;
    margin:9px 0;
    text-align:center;
    color:#e7ebff;
}

.table-game,
.batak-table{
    position:relative;
    width:100%;
    min-height:520px;
    padding:18px;
    border:12px solid #553015;
    border-radius:28px;
    background:
        radial-gradient(circle at center,#197b49,#0a452c 65%,#05291a);
    box-shadow:
        inset 0 0 50px #0009,
        0 20px 50px #0008;
}

.table-title{
    text-align:center;
    color:#fff;
    font-size:24px;
    font-weight:900;
    margin-bottom:12px;
    text-shadow:0 3px 5px #000;
}

/* =========================================================
   KARTLAR
========================================================= */

.game-card{
    display:flex!important;
    flex-direction:column!important;
    align-items:center!important;
    min-height:245px;
    padding:22px 16px!important;
    border-radius:20px!important;
    background:linear-gradient(145deg,#151d38,#0c1225)!important;
    border:1px solid rgba(255,255,255,.12)!important;
    color:#fff!important;
    text-align:center;
    box-shadow:0 10px 30px #0005;
}

.game-card-icon{
    width:78px;
    height:78px;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    border-radius:22px;
    background:linear-gradient(145deg,#6c63ff,#4239c7);
    font-size:42px;
    margin-bottom:12px;
}

.game-card h3{
    color:#fff!important;
    margin:4px 0 8px!important;
}

.game-card p{
    color:#b9c2dd!important;
    min-height:42px;
}

.game-card-btn{
    margin-top:auto;
    width:100%;
    border:0;
    border-radius:12px;
    padding:12px;
    background:linear-gradient(135deg,#6c63ff,#00a9d6);
    color:#fff;
    font-weight:800;
    cursor:pointer;
}

/* =========================================================
   OKEY
========================================================= */

.okey-table{
    background:
        radial-gradient(circle at center,#16804b,#0b492d 65%,#05291b);
}

.okey-opponents{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:12px;
}

.okey-opponent{
    padding:10px;
    background:#0005;
    border:1px solid #ffffff18;
    border-radius:14px;
    text-align:center;
}

.okey-avatar{
    font-size:30px;
}

.okey-hidden{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:3px;
    margin-top:7px;
}

.okey-back{
    width:21px;
    height:31px;
    border-radius:5px;
    border:2px solid #e7c765;
    background:
        repeating-linear-gradient(
            45deg,
            #9c1736 0,
            #9c1736 4px,
            #4b1020 4px,
            #4b1020 8px
        );
}

.okey-center{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:25px;
    flex-wrap:wrap;
    margin:18px 0;
}

.okey-pile{
    width:76px;
    height:100px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:9px;
    border:4px solid #c69d4e;
    background:#f8f0d2;
    color:#222;
    font-size:27px;
    font-weight:900;
    box-shadow:0 6px 14px #0008;
}

.okey-rack{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    flex-wrap:wrap;
    gap:4px;
    padding:14px 9px;
    min-height:105px;
    background:#704019;
    border:6px solid #42200d;
    border-radius:15px;
    box-shadow:inset 0 0 20px #0008;
}

.okey-tile{
    width:38px;
    height:57px;
    border-radius:6px;
    border:2px solid #bba468;
    background:linear-gradient(#fffdf2,#e6dab2);
    display:flex;
    align-items:center;
    justify-content:center;
    color:#222;
    font-weight:900;
    font-size:20px;
    cursor:pointer;
    box-shadow:0 3px 6px #0007;
    transition:.15s;
    user-select:none;
}

.okey-tile.red{color:#d12636}
.okey-tile.black{color:#222}
.okey-tile.blue{color:#1769aa}
.okey-tile.green{color:#16844a}
.okey-tile.joker{color:#7c35c8}

.okey-tile:hover{
    transform:translateY(-5px);
}

.okey-tile.selected{
    transform:translateY(-13px);
    outline:3px solid #ffd166;
}

.player-name{
    text-align:center;
    color:#ffd166;
    font-weight:900;
    margin:8px;
}

/* =========================================================
   TAVLA
========================================================= */

.tavla-board{
    width:min(100%,980px);
    margin:auto;
    padding:12px;
    border:12px solid #351708;
    border-radius:18px;
    background:
        linear-gradient(90deg,#7b431d,#ad672d,#7b431d);
    display:grid;
    grid-template-columns:repeat(12,1fr);
    gap:5px;
    box-shadow:inset 0 0 30px #0008,0 15px 35px #0008;
}

.tavla-point{
    min-height:205px;
    position:relative;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding-top:8px;
    border-radius:5px;
    background:linear-gradient(90deg,#d7a658,#925628);
    cursor:pointer;
}

.tavla-point:nth-child(3n){
    background:linear-gradient(90deg,#e4bb70,#a96732);
}

.tavla-point:hover{
    filter:brightness(1.12);
}

.tavla-number{
    position:absolute;
    top:3px;
    font-size:10px;
    opacity:.7;
}

.tavla-checker{
    width:38px;
    height:38px;
    flex:none;
    border-radius:50%;
    border:3px solid #333;
    margin:1px;
    box-shadow:0 3px 6px #0008;
}

.tavla-checker.white{
    background:radial-gradient(circle at 30% 25%,#fff,#aaa);
}

.tavla-checker.black{
    background:radial-gradient(circle at 30% 25%,#555,#111);
}

.tavla-checker.moving{
    animation:pulseChecker .5s;
}

@keyframes pulseChecker{
    50%{transform:scale(1.12)}
}

.dice-row{
    display:flex;
    justify-content:center;
    gap:12px;
    margin:12px;
}

.die{
    width:58px;
    height:58px;
    border:0;
    border-radius:12px;
    background:#fff;
    color:#111;
    font-size:30px;
    font-weight:900;
    cursor:pointer;
    box-shadow:0 5px 12px #0008;
}

.die.selected{
    outline:4px solid #ffd166;
    transform:translateY(-4px);
}

/* =========================================================
   DAMA
========================================================= */

.dama-board{
    width:min(650px,100%);
    margin:auto;
    aspect-ratio:1;
    display:grid;
    grid-template-columns:repeat(8,1fr);
    border:10px solid #522b12;
    box-shadow:0 12px 30px #0008;
}

.dama-cell{
    display:flex;
    align-items:center;
    justify-content:center;
    position:relative;
    cursor:pointer;
}

.dama-cell:nth-child(odd){
    background:#e1bb77;
}

.dama-cell:nth-child(even){
    background:#94572c;
}

.dama-piece{
    width:74%;
    aspect-ratio:1;
    border-radius:50%;
    border:4px solid #444;
    box-shadow:0 5px 9px #0009;
}

.dama-piece.white{
    background:radial-gradient(circle at 30% 25%,#fff,#aaa);
}

.dama-piece.black{
    background:radial-gradient(circle at 30% 25%,#555,#111);
}

.dama-piece.king{
    box-shadow:
        0 0 0 4px #ffd166,
        0 5px 10px #0009;
}

.dama-piece.king::after{
    content:"♛";
    color:#ffd166;
    font-size:25px;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100%;
}

.dama-cell.selected{
    outline:5px solid #ffd166;
    outline-offset:-5px;
}

.dama-cell.target{
    box-shadow:inset 0 0 0 5px #00d4ff;
}

/* =========================================================
   BATAK
========================================================= */

.batak-table{
    min-height:620px;
}

.batak-seats{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
}

.batak-seat{
    padding:10px;
    border-radius:13px;
    background:#0005;
    text-align:center;
}

.card-back{
    width:22px;
    height:34px;
    display:inline-block;
    margin:2px;
    border:2px solid #fff;
    border-radius:5px;
    background:
        repeating-linear-gradient(
            45deg,
            #293e96 0,
            #293e96 4px,
            #15235c 4px,
            #15235c 8px
        );
}

.batak-center{
    min-height:190px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
}

.playing-card{
    width:60px;
    height:88px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background:linear-gradient(#fff,#e8e8e8);
    color:#111;
    border-radius:8px;
    border:2px solid #ddd;
    box-shadow:0 5px 10px #0009;
    font-size:19px;
    font-weight:900;
    cursor:pointer;
    transition:.15s;
}

.playing-card.red{
    color:#c62828;
}

.playing-card:hover{
    transform:translateY(-8px);
}

.card-hand{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:6px;
}

/* =========================================================
   BİLARDO
========================================================= */

.pool-table{
    width:min(950px,100%);
    aspect-ratio:2/1;
    margin:15px auto;
    position:relative;
    border:22px solid #6c401e;
    border-radius:28px;
    background:
        radial-gradient(ellipse at center,#087747,#075d39 70%);
    box-shadow:
        inset 0 0 35px #0009,
        0 15px 35px #0008;
    overflow:hidden;
}

.pool-pocket{
    position:absolute;
    width:52px;
    height:52px;
    border-radius:50%;
    background:#050505;
    box-shadow:inset 0 0 12px #000;
    z-index:2;
}

.pool-ball{
    position:absolute;
    width:31px;
    height:31px;
    border:2px solid #fff;
    border-radius:50%;
    cursor:pointer;
    box-shadow:0 4px 7px #0009;
    z-index:5;
    transition:.3s;
}

.pool-ball.hit{
    animation:ballHit .5s ease forwards;
}

@keyframes ballHit{
    0%{transform:scale(1)}
    35%{transform:scale(1.3)}
    100%{transform:scale(.1);opacity:0}
}

/* =========================================================
   DİĞER OYUNLAR
========================================================= */

.simple-area{
    max-width:650px;
    margin:auto;
}

.memory-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:8px;
    max-width:500px;
    margin:auto;
}

.memory-card{
    aspect-ratio:1;
    border:0;
    border-radius:12px;
    background:#29366f;
    color:#fff;
    font-size:32px;
    cursor:pointer;
}

.memory-card.open{
    background:#fff;
    color:#111;
}

.sudoku{
    width:min(450px,100%);
    margin:auto;
    display:grid;
    grid-template-columns:repeat(9,1fr);
}

.sudoku-cell{
    aspect-ratio:1;
    display:flex;
    align-items:center;
    justify-content:center;
    border:1px solid #555;
    background:#fff;
    color:#111;
    font-weight:800;
    cursor:pointer;
}

.sudoku-cell.fixed{
    background:#ddd;
}

.bubbles{
    display:grid;
    grid-template-columns:repeat(8,1fr);
    gap:7px;
    max-width:600px;
    margin:auto;
}

.bubble{
    aspect-ratio:1;
    border:0;
    border-radius:50%;
    cursor:pointer;
}

.race{
    width:min(500px,100%);
    height:420px;
    margin:auto;
    position:relative;
    overflow:hidden;
    background:
        repeating-linear-gradient(
            90deg,
            #343434 0,
            #343434 47%,
            #555 47%,
            #555 53%
        );
    border:8px solid #202020;
}

.race-car,
.race-enemy{
    position:absolute;
    width:45px;
    height:72px;
    border-radius:12px;
}

.race-car{
    bottom:15px;
    background:#e53935;
}

.race-enemy{
    background:#2196f3;
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
    background:#1a2442;
    border-radius:5px;
}

.block-cell.filled{
    background:#6c63ff;
}

.target-area{
    width:min(650px,100%);
    height:350px;
    margin:auto;
    position:relative;
    background:#18233f;
    border-radius:15px;
    overflow:hidden;
}

.target{
    position:absolute;
    width:70px;
    height:70px;
    border:0;
    border-radius:50%;
    background:
        radial-gradient(
            circle,
            #fff 0 10%,
            #e53935 11% 30%,
            #fff 31% 50%,
            #e53935 51% 70%,
            #fff 71%
        );
    cursor:pointer;
}

.snake-board{
    width:min(500px,100%);
    aspect-ratio:1;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(20,1fr);
    background:#10172b;
    border:8px solid #2f3d69;
}

.snake-cell{
    aspect-ratio:1;
}

.snake-body{
    background:#39d353;
}

.snake-head{
    background:#8aff80;
    border-radius:4px;
}

.snake-food{
    background:#ff5252;
    border-radius:50%;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media(max-width:900px){

    .tavla-point{
        min-height:170px;
    }

    .tavla-checker{
        width:31px;
        height:31px;
    }

    .pool-table{
        border-width:16px;
    }

    .pool-pocket{
        width:42px;
        height:42px;
    }

    .pool-ball{
        width:27px;
        height:27px;
    }
}

@media(max-width:650px){

    .okey-opponents{
        grid-template-columns:1fr;
    }

    .batak-seats{
        grid-template-columns:1fr;
    }

    .tavla-board{
        gap:2px;
        padding:7px;
        border-width:7px;
    }

    .tavla-point{
        min-height:130px;
    }

    .tavla-checker{
        width:25px;
        height:25px;
        border-width:2px;
    }

    .dama-board{
        border-width:6px;
    }

    .dama-piece{
        border-width:2px;
    }
}

@media(max-width:420px){

    .okey-tile{
        width:25px;
        height:38px;
        font-size:13px;
    }

    .tavla-point{
        min-height:100px;
    }

    .tavla-checker{
        width:20px;
        height:20px;
    }
}
`;

document.head.appendChild(style);

/* =========================================================
   PUAN
========================================================= */

function updateScore(){
    score=Math.max(0,Number(score)||0);
    localStorage.setItem(SCORE_KEY,score);

    if(scoreElement){
        scoreElement.textContent=score;
    }
}

function changeScore(amount){
    score+=Number(amount)||0;
    updateScore();
}

function showMessage(icon,title,text){
    if(!messageModal)return;

    messageIcon.textContent=icon;
    messageTitle.textContent=title;
    messageText.textContent=text;
    messageModal.classList.remove("hidden");
}

function hideMessage(){
    messageModal?.classList.add("hidden");
}

messageClose?.addEventListener("click",hideMessage);

function win(name,points=WIN_REWARD){
    changeScore(points);

    showMessage(
        "🏆",
        "Tebrikler!",
        `${name} oyununu kazandın! +${points} puan.`
    );
}

function lose(name){
    changeScore(LOSS_REWARD);

    showMessage(
        "😔",
        "Oyun Bitti",
        `${name} oyununu kaybettin. ${LOSS_REWARD} puan.`
    );
}

/* =========================================================
   YARDIMCILAR
========================================================= */

const botNames=[
    "Ali","Mehmet","Ahmet","Burak",
    "Murat","Emre","Can","Kerem",
    "Hasan","Hakan","Efe","Oğuz"
];

function botName(){
    return botNames[
        Math.floor(Math.random()*botNames.length)
    ];
}

function rand(min,max){
    return Math.floor(
        Math.random()*(max-min+1)
    )+min;
}

function shuffle(arr){

    for(let i=arr.length-1;i>0;i--){

        const j=Math.floor(
            Math.random()*(i+1)
        );

        [arr[i],arr[j]]=[
            arr[j],arr[i]
        ];
    }

    return arr;
}

/* =========================================================
   15 OYUN
========================================================= */

const games=[

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
        name:"Kelime Oyunu",
        icon:"🔤",
        category:"puzzle",
        type:"word",
        description:"Karışık harflerden kelimeyi bul."
    }
];

/* =========================================================
   OYUN KARTLARINI OLUŞTUR
========================================================= */

function renderGames(){

    if(!gamesContainer)return;

    gamesContainer.innerHTML=games.map(game=>`

        <div
            class="game-card"
            data-game="${game.type}"
        >

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
                data-open-game="${game.type}"
            >
                🎮 Oyunu Aç
            </button>

        </div>

    `).join("");

    gamesContainer
        .querySelectorAll("[data-open-game]")
        .forEach(button=>{

            button.addEventListener(
                "click",
                ()=>openGame(button.dataset.openGame)
            );

        });
}

/* =========================================================
   MODAL
========================================================= */

function openModal(){

    if(gameModal){
        gameModal.classList.remove("hidden");
    }

    document.body.classList.add("modal-open");
}

function closeModal(){

    if(gameModal){
        gameModal.classList.add("hidden");
    }

    document.body.classList.remove("modal-open");

    if(gameArea){
        gameArea.innerHTML="";
    }
}

closeBtn?.addEventListener(
    "click",
    closeModal
);

gameModal?.addEventListener(
    "click",
    event=>{

        if(event.target===gameModal){
            closeModal();
        }

    }
);

/* =========================================================
   OYUN BAŞLAT
========================================================= */

function openGame(type){

    const game=games.find(
        item=>item.type===type
    );

    if(!game)return;

    if(score<ENTRY_COST){

        showMessage(
            "💰",
            "Yetersiz Puan",
            `Oyuna girmek için ${ENTRY_COST} puan gerekiyor.`
        );

        return;
    }

    changeScore(-ENTRY_COST);

    if(modalTitle){
        modalTitle.textContent=game.name;
    }

    if(modalCategory){
        modalCategory.textContent=
            game.category;
    }

    openModal();

    if(!gameArea)return;

    gameArea.innerHTML="";

    switch(type){

        case "okey":
            createOkey();
            break;

        case "tavla":
            createTavla();
            break;

        case "dama":
            createDama();
            break;

        case "batak":
            createBatak();
            break;

        case "bilardo":
            createBilardo();
            break;

        case "mahjong":
            createMahjong();
            break;

        case "sudoku":
            createSudoku();
            break;

        case "bubble":
            createBubble();
            break;

        case "race":
            createRace();
            break;

        case "block":
            createBlock();
            break;

        case "archery":
            createArchery();
            break;

        case "memory":
            createMemory();
            break;

        case "memory2":
            createMemory2();
            break;

        case "snake":
            createSnake();
            break;

        case "word":
            createWord();
            break;

        default:
            gameArea.innerHTML=`
                <div class="game-info">
                    Oyun hazırlanıyor...
                </div>
            `;
    }
}

/* =========================================================
   REKLAM ÖDÜLÜ
========================================================= */

adButton?.addEventListener(
    "click",
    ()=>{

        changeScore(AD_REWARD);

        showMessage(
            "🎁",
            "Ödül Kazandın",
            `Reklam ödülü olarak +${AD_REWARD} puan kazandın.`
        );

        if(adButton){
            adButton.disabled=true;

            setTimeout(()=>{
                adButton.disabled=false;
            },30000);
        }

    }
);

/* =========================================================
   101 OKEY
========================================================= */

function createOkey(){

    let finished=false;
    let turn=true;
    let selected=[];
    let discard=[];
    let deck=[];
    let player=[];
    let bots=[
        [],
        [],
        []
    ];

    const colors=[
        {
            name:"red",
            symbol:"🔴"
        },
        {
            name:"blue",
            symbol:"🔵"
        },
        {
            name:"black",
            symbol:"⚫"
        },
        {
            name:"green",
            symbol:"🟢"
        }
    ];

    function createDeck(){

        const result=[];

        let id=0;

        colors.forEach(color=>{

            for(let n=1;n<=13;n++){

                for(let copy=0;copy<2;copy++){

                    result.push({
                        id:id++,
                        number:n,
                        color:color.name,
                        symbol:color.symbol
                    });

                }

            }
        });

        result.push({
            id:id++,
            number:0,
            color:"joker",
            symbol:"⭐",
            joker:true
        });

        result.push({
            id:id++,
            number:0,
            color:"joker",
            symbol:"⭐",
            joker:true
        });

        return shuffle(result);
    }

    function tileHTML(tile,index){

        if(tile.joker){

            return `
                <button
                    class="okey-tile joker ${
                        selected.includes(index)
                        ?"selected"
                        :""
                    }"
                    data-tile="${index}"
                >
                    ${tile.symbol}
                </button>
            `;
        }

        return `
            <button
                class="okey-tile ${tile.color} ${
                    selected.includes(index)
                    ?"selected"
                    :""
                }"
                data-tile="${index}"
            >
                ${tile.number}
            </button>
        `;
    }

    function start(){

        deck=createDeck();

        player=deck.splice(0,14);

        bots.forEach(bot=>{
            for(let i=0;i<14;i++){
                bot.push(deck.shift());
            }
        });

        discard.push(deck.shift());

        render();
    }

    function drawTile(){

        if(finished||!turn)return;

        if(!deck.length){

            showMessage(
                "🀄",
                "Taş Bitti",
                "Destede taş kalmadı."
            );

            return;
        }

        player.push(deck.shift());

        selected=[];

        render();
    }

    function discardTile(){

        if(
            finished||
            !turn||
            selected.length!==1
        ){

            showMessage(
                "🀄",
                "Taş Seç",
                "Atmak için bir taş seçmelisin."
            );

            return;
        }

        const index=selected[0];

        const tile=player.splice(index,1)[0];

        discard.push(tile);

        selected=[];

        if(player.length>=14){

            const possible=
                player.length>=14;

            if(possible&&Math.random()<0.07){

                finished=true;

                win("101 Okey");

                return;
            }
        }

        turn=false;

        render();

        setTimeout(botTurn,700);
    }

    function botTurn(){

        if(finished)return;

        bots.forEach(bot=>{

            if(deck.length){

                bot.push(deck.shift());
            }

            if(bot.length>14){

                bot.splice(
                    rand(0,bot.length-1),
                    1
                );
            }

        });

        if(Math.random()<0.08){

            finished=true;

            lose("101 Okey");

            return;
        }

        turn=true;

        render();
    }

    function sortPlayer(){

        player.sort((a,b)=>{

            if(a.color===b.color){

                return a.number-b.number;
            }

            return a.color.localeCompare(
                b.color
            );
        });

        selected=[];

        render();
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game okey-table">

                    <div class="table-title">
                        🀄 101 OKEY
                    </div>

                    <div class="game-info">
                        ${turn
                            ?"Senin sıran."
                            :"Rakip oynuyor..."
                        }

                        &nbsp; | &nbsp;

                        Destede:
                        <strong>
                            ${deck.length}
                        </strong>
                        taş
                    </div>

                    <div class="okey-opponents">

                        ${bots.map(
                            (bot,i)=>`

                                <div
                                    class="okey-opponent"
                                >

                                    <div class="okey-avatar">
                                        🧑
                                    </div>

                                    <strong>
                                        ${botName()}
                                    </strong>

                                    <div class="okey-hidden">

                                        ${bot
                                            .map(
                                                ()=>`
                                                    <span
                                                        class="okey-back">
                                                    </span>
                                                `
                                            )
                                            .join("")
                                        }

                                    </div>

                                </div>

                            `
                        ).join("")}

                    </div>

                    <div class="okey-center">

                        <div>

                            <div class="game-info">
                                Kalan Taş
                            </div>

                            <div class="okey-pile">
                                🀄
                            </div>

                        </div>

                        <div>

                            <div class="game-info">
                                Atılan
                            </div>

                            <div class="okey-pile">

                                ${
                                    discard.length
                                    ?(
                                        discard[
                                            discard.length-1
                                        ].joker
                                        ?"⭐"
                                        :discard[
                                            discard.length-1
                                        ].number
                                    )
                                    :"—"
                                }

                            </div>

                        </div>

                    </div>

                    <div class="player-name">
                        Sen
                    </div>

                    <div class="okey-rack">

                        ${player.map(
                            (tile,index)=>
                                tileHTML(tile,index)
                        ).join("")}

                    </div>

                    <div class="game-toolbar">

                        <button
                            class="game-button"
                            id="okey-draw"
                            ${!turn?"disabled":""}
                        >
                            🀄 Taş Çek
                        </button>

                        <button
                            class="game-button"
                            id="okey-discard"
                            ${!turn?"disabled":""}
                        >
                            🗑️ Taş At
                        </button>

                        <button
                            class="game-button"
                            id="okey-sort"
                            ${!turn?"disabled":""}
                        >
                            🔢 Sırala
                        </button>

                    </div>

                    <div class="game-info">

                        Taşına tıklayarak seç.
                        Bir taş seçip
                        <strong>Taş At</strong>
                        butonuna bas.

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-tile]")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        const index=
                            Number(
                                button.dataset.tile
                            );

                        if(selected.includes(index)){

                            selected=
                                selected.filter(
                                    x=>x!==index
                                );

                        }else{

                            selected.push(index);
                        }

                        render();
                    }
                );
            });

        document
            .getElementById("okey-draw")
            ?.addEventListener(
                "click",
                drawTile
            );

        document
            .getElementById("okey-discard")
            ?.addEventListener(
                "click",
                discardTile
            );

        document
            .getElementById("okey-sort")
            ?.addEventListener(
                "click",
                sortPlayer
            );
    }

    start();
}

/* =========================================================
   TAVLA
========================================================= */

function createTavla(){

    let finished=false;
    let turn=true;
    let dice=[];
    let selectedDie=null;

    const points=Array(24).fill(0);

    points[0]=2;
    points[5]=-5;
    points[7]=-3;
    points[11]=5;

    points[12]=-5;
    points[16]=3;
    points[18]=5;
    points[23]=-2;

    let playerOff=0;
    let botOff=0;

    function roll(){

        if(finished||!turn)return;

        dice=[
            rand(1,6),
            rand(1,6)
        ];

        selectedDie=null;

        if(dice[0]===dice[1]){

            dice=[
                dice[0],
                dice[0],
                dice[0],
                dice[0]
            ];
        }

        render();
    }

    function move(to){

        if(
            finished||
            !turn||
            selectedDie===null
        ){
            return;
        }

        const die=selectedDie;

        let from=-1;

        for(
            let i=23;
            i>=0;
            i--
        ){

            if(points[i]>0){

                const distance=
                    Math.abs(to-i);

                if(distance===die){

                    from=i;

                    break;
                }
            }
        }

        if(from<0){

            showMessage(
                "🎲",
                "Geçersiz Hamle",
                "Bu zar ile uygun pul bulunamadı."
            );

            return;
        }

        points[from]--;

        if(
            to>=0&&
            to<24
        ){

            if(points[to]<0){

                points[to]=1;
            }else{

                points[to]++;
            }

        }else{

            playerOff++;

            if(playerOff>=15){

                finished=true;

                win("Klasik Tavla");

                return;
            }
        }

        const index=
            dice.indexOf(die);

        if(index>=0){

            dice.splice(index,1);
        }

        selectedDie=null;

        if(!dice.length){

            turn=false;

            render();

            setTimeout(
                botTurn,
                700
            );

        }else{

            render();
        }
    }

    function botTurn(){

        if(finished)return;

        const movesCount=
            rand(1,2);

        for(
            let m=0;
            m<movesCount;
            m++
        ){

            const candidates=[];

            points.forEach(
                (value,index)=>{

                    if(value<0){

                        candidates.push(index);
                    }
                }
            );

            if(candidates.length){

                const index=
                    candidates[
                        rand(
                            0,
                            candidates.length-1
                        )
                    ];

                points[index]++;

                if(points[index]===0){

                    points[index]=0;
                }

            }

        }

        botOff+=
            rand(0,1);

        if(botOff>=15){

            finished=true;

            lose("Klasik Tavla");

            return;
        }

        turn=true;

        dice=[];

        selectedDie=null;

        render();
    }

    function render(){

        if(finished)return;

        const order=[
            ...Array.from(
                {length:12},
                (_,i)=>23-i
            ),
            ...Array.from(
                {length:12},
                (_,i)=>i
            )
        ];

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        🎲 KLASİK TAVLA MASASI
                    </div>

                    <div class="game-info">

                        Sen:
                        <strong>
                            ${15-playerOff}
                        </strong>
                        pul

                        &nbsp; | &nbsp;

                        Rakip:
                        <strong>
                            ${15-botOff}
                        </strong>
                        pul

                    </div>

                    <div class="dice-row">

                        ${
                            dice.map(d=>`

                                <button
                                    class="
                                        die
                                        ${
                                            selectedDie===d
                                            ?"selected"
                                            :""
                                        }
                                    "
                                    data-die="${d}">

                                    ${d}

                                </button>

                            `).join("")
                        }

                    </div>

                    <div class="tavla-board">

                        ${order.map(index=>{

                            const count=
                                Math.abs(points[index]);

                            const player=
                                points[index]>0;

                            return `

                                <div
                                    class="tavla-point"
                                    data-point="${index}">

                                    <span class="tavla-number">
                                        ${index+1}
                                    </span>

                                    ${Array.from(
                                        {
                                            length:
                                                Math.min(count,6)
                                        },
                                        ()=>`

                                            <span
                                                class="
                                                    tavla-checker
                                                    ${
                                                        player
                                                        ?"white"
                                                        :"black"
                                                    }
                                                ">
                                            </span>

                                        `
                                    ).join("")}

                                </div>

                            `;

                        }).join("")}

                    </div>

                    <div class="game-toolbar">

                        <button
                            class="game-button"
                            id="tavla-roll"
                            ${
                                !turn||dice.length
                                ?"disabled"
                                :""
                            }>

                            🎲 Zar At

                        </button>

                    </div>

                    <div class="game-info">

                        ${
                            turn
                            ?(
                                dice.length
                                ?"Zarı seç, sonra oynatacağın pula tıkla."
                                :"Zar atarak oyuna başla."
                            )
                            :"Rakip oynuyor..."
                        }

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll(".die")
            .forEach(el=>{

                el.addEventListener(
                    "click",
                    ()=>{

                        selectedDie=
                            Number(
                                el.dataset.die
                            );

                        render();
                    }
                );
            });

        gameArea
            .querySelectorAll(".tavla-point")
            .forEach(el=>{

                el.addEventListener(
                    "click",
                    ()=>{

                        if(selectedDie===null){

                            showMessage(
                                "🎲",
                                "Zar Seç",
                                "Önce bir zar seç."
                            );

                            return;
                        }

                        move(
                            Number(
                                el.dataset.point
                            )
                        );
                    }
                );
            });

        document
            .getElementById("tavla-roll")
            ?.addEventListener(
                "click",
                roll
            );
    }

    render();
}

/* =========================================================
   TÜRK DAMASI
========================================================= */

function createDama(){

    let finished=false;
    let turn=true;
    let selected=null;

    const board=Array(64).fill(null);

    for(let r=0;r<2;r++){

        for(let c=0;c<8;c++){

            board[r*8+c]={
                side:"bot",
                king:false
            };
        }
    }

    for(let r=6;r<8;r++){

        for(let c=0;c<8;c++){

            board[r*8+c]={
                side:"player",
                king:false
            };
        }
    }

    function rc(i){

        return [
            Math.floor(i/8),
            i%8
        ];
    }

    function id(r,c){

        return r*8+c;
    }

    function inside(r,c){

        return (
            r>=0&&
            r<8&&
            c>=0&&
            c<8
        );
    }

    const dirs=[
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    function moves(i,captureOnly=false){

        const piece=board[i];

        if(!piece)return[];

        const [r,c]=rc(i);

        const result=[];

        if(!captureOnly){

            if(piece.king){

                dirs.forEach(([dr,dc])=>{

                    const nr=r+dr;
                    const nc=c+dc;

                    if(
                        inside(nr,nc)&&
                        !board[id(nr,nc)]
                    ){

                        result.push({
                            to:id(nr,nc),
                            capture:null
                        });
                    }
                });

            }else{

                const forward=
                    piece.side==="player"
                    ?-1
                    :1;

                [
                    [forward,0],
                    [0,-1],
                    [0,1]
                ].forEach(([dr,dc])=>{

                    const nr=r+dr;
                    const nc=c+dc;

                    if(
                        inside(nr,nc)&&
                        !board[id(nr,nc)]
                    ){

                        result.push({
                            to:id(nr,nc),
                            capture:null
                        });
                    }
                });
            }
        }

        dirs.forEach(([dr,dc])=>{

            const mr=r+dr;
            const mc=c+dc;

            const lr=r+2*dr;
            const lc=c+2*dc;

            if(
                !inside(mr,mc)||
                !inside(lr,lc)
            ){

                return;
            }

            const middle=
                board[id(mr,mc)];

            if(
                middle&&
                middle.side!==piece.side&&
                !board[id(lr,lc)]
            ){

                result.push({
                    to:id(lr,lc),
                    capture:id(mr,mc)
                });
            }
        });

        return result;
    }

    function hasCapture(side){

        return board.some(
            (p,i)=>
                p&&
                p.side===side&&
                moves(i,true).length
        );
    }

    function makeMove(from,m){

        const piece=board[from];

        board[m.to]=piece;
        board[from]=null;

        if(m.capture!==null){

            board[m.capture]=null;
        }

        const [r]=rc(m.to);

        if(
            piece.side==="player"&&
            r===0
        ){

            piece.king=true;
        }

        if(
            piece.side==="bot"&&
            r===7
        ){

            piece.king=true;
        }
    }

    function clickCell(i){

        if(
            finished||
            !turn
        ){
            return;
        }

        const piece=board[i];

        if(selected===null){

            if(piece?.side!=="player"){
                return;
            }

            if(
                hasCapture("player")&&
                !moves(i,true).length
            ){

                showMessage(
                    "⚫",
                    "Zorunlu Alma",
                    "Alabilen başka taşın var."
                );

                return;
            }

            selected=i;

            render();

            return;
        }

        const mustCapture=
            hasCapture("player");

        const legal=
            moves(
                selected,
                mustCapture
            );

        const move=
            legal.find(
                x=>x.to===i
            );

        if(!move){

            if(
                piece?.side==="player"
            ){

                selected=i;

                render();
            }

            return;
        }

        makeMove(
            selected,
            move
        );

        if(
            move.capture!==null
        ){

            const more=
                moves(
                    i,
                    true
                );

            if(more.length){

                selected=i;

                render();

                return;
            }
        }

        selected=null;

        const playerCount=
            board.filter(
                p=>p?.side==="player"
            ).length;

        const botCount=
            board.filter(
                p=>p?.side==="bot"
            ).length;

        if(playerCount===0){

            finished=true;

            lose("Türk Daması");

            return;
        }

        if(botCount===0){

            finished=true;

            win("Türk Daması");

            return;
        }

        turn=false;

        render();

        setTimeout(
            botMove,
            700
        );
    }

    function botMove(){

        if(finished)return;

        const captures=[];

        board.forEach(
            (piece,index)=>{

                if(
                    piece?.side==="bot"
                ){

                    moves(
                        index,
                        true
                    ).forEach(
                        move=>{
                            captures.push({
                                from:index,
                                move
                            });
                        }
                    );
                }
            }
        );

        let choice;

        if(captures.length){

            choice=
                captures[
                    rand(
                        0,
                        captures.length-1
                    )
                ];

        }else{

            const normal=[];

            board.forEach(
                (piece,index)=>{

                    if(
                        piece?.side==="bot"
                    ){

                        moves(
                            index,
                            false
                        ).forEach(
                            move=>{

                                normal.push({
                                    from:index,
                                    move
                                });
                            }
                        );
                    }
                }
            );

            if(!normal.length){

                finished=true;

                win("Türk Daması");

                return;
            }

            choice=
                normal[
                    rand(
                        0,
                        normal.length-1
                    )
                ];
        }

        makeMove(
            choice.from,
            choice.move
        );

        const playerCount=
            board.filter(
                p=>p?.side==="player"
            ).length;

        const botCount=
            board.filter(
                p=>p?.side==="bot"
            ).length;

        if(playerCount===0){

            finished=true;

            lose("Türk Daması");

            return;
        }

        if(botCount===0){

            finished=true;

            win("Türk Daması");

            return;
        }

        turn=true;

        render();
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        ⚫ TÜRK DAMASI
                    </div>

                    <div class="game-info">

                        ${
                            turn
                            ?"Senin sıran."
                            :"Rakip oynuyor..."
                        }

                    </div>

                    <div class="dama-board">

                        ${board.map(
                            (piece,index)=>`

                                <div
                                    class="
                                        dama-cell
                                        ${
                                            selected===index
                                            ?"selected"
                                            :""
                                        }
                                    "
                                    data-cell="${index}"
                                >

                                    ${
                                        piece
                                        ?`
                                            <div
                                                class="
                                                    dama-piece
                                                    ${
                                                        piece.side==="player"
                                                        ?"white"
                                                        :"black"
                                                    }
                                                    ${
                                                        piece.king
                                                        ?"king"
                                                        :""
                                                    }
                                                "
                                            ></div>
                                        `
                                        :""
                                    }

                                </div>

                            `
                        ).join("")}

                    </div>

                    <div class="game-info">

                        Taşını seç,
                        ardından gitmek istediğin
                        kareye tıkla.

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-cell]")
            .forEach(cell=>{

                cell.addEventListener(
                    "click",
                    ()=>{

                        clickCell(
                            Number(
                                cell.dataset.cell
                            )
                        );

                    }
                );
            });
    }

    render();
}

/* =========================================================
   BATAK
========================================================= */

function createBatak(){

    let finished=false;
    let turn=true;

    const suits=[
        "♠",
        "♥",
        "♦",
        "♣"
    ];

    const ranks=[
        "2","3","4","5","6","7","8",
        "9","10","J","Q","K","A"
    ];

    let deck=[];
    let hand=[];
    let trick=[];
    let scorePlayer=0;
    let scoreBot=0;
    let trump=null;

    function createDeck(){

        const result=[];

        suits.forEach(
            suit=>{

                ranks.forEach(
                    rank=>{

                        result.push({
                            suit,
                            rank,
                            value:ranks.indexOf(rank)+2
                        });

                    }
                );
            }
        );

        return shuffle(result);
    }

    function cardHTML(card,index){

        const red=
            card.suit==="♥"||
            card.suit==="♦";

        return `
            <button
                class="
                    playing-card
                    ${red?"red":""}
                "
                data-card="${index}"
            >

                <span>
                    ${card.rank}
                </span>

                <span>
                    ${card.suit}
                </span>

            </button>
        `;
    }

    function start(){

        deck=createDeck();

        hand=deck.splice(
            0,
            13
        );

        trump=
            suits[
                rand(
                    0,
                    suits.length-1
                )
            ];

        render();
    }

    function play(index){

        if(
            finished||
            !turn
        ){
            return;
        }

        const card=
            hand.splice(
                index,
                1
            )[0];

        trick.push({
            player:"Sen",
            card
        });

        if(
            trick.length===4
        ){

            resolveTrick();

        }else{

            turn=false;

            render();

            setTimeout(
                botPlay,
                500
            );
        }
    }

    function botPlay(){

        if(finished)return;

        const card=
            deck.length
            ?deck.pop()
            :null;

        if(card){

            trick.push({
                player:"Rakip",
                card
            });
        }

        if(
            trick.length>=4
        ){

            resolveTrick();

        }else{

            turn=true;

            render();
        }
    }

    function resolveTrick(){

        const trumpCards=
            trick.filter(
                item=>
                    item.card.suit===trump
            );

        let winner;

        if(trumpCards.length){

            winner=
                trumpCards.reduce(
                    (best,item)=>
                        item.card.value>
                        best.card.value
                        ?item
                        :best
                );

        }else{

            const lead=
                trick[0].card.suit;

            const leadCards=
                trick.filter(
                    item=>
                        item.card.suit===lead
                );

            winner=
                leadCards.reduce(
                    (best,item)=>
                        item.card.value>
                        best.card.value
                        ?item
                        :best
                );
        }

        if(winner.player==="Sen"){

            scorePlayer++;

        }else{

            scoreBot++;
        }

        trick=[];

        if(
            !hand.length
        ){

            finished=true;

            if(scorePlayer>=scoreBot){

                win("Batak");

            }else{

                lose("Batak");
            }

            return;
        }

        turn=
            winner.player==="Sen";

        render();

        if(!turn){

            setTimeout(
                botPlay,
                500
            );
        }
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="batak-table">

                    <div class="table-title">
                        🃏 BATAK
                    </div>

                    <div class="game-info">

                        Koz:
                        <strong>
                            ${trump}
                        </strong>

                        &nbsp; | &nbsp;

                        Sen:
                        <strong>
                            ${scorePlayer}
                        </strong>

                        &nbsp; - &nbsp;

                        Rakip:
                        <strong>
                            ${scoreBot}
                        </strong>

                    </div>

                    <div class="batak-seats">

                        <div class="batak-seat">
                            🧑<br>
                            Sen
                        </div>

                        <div class="batak-seat">
                            🤖<br>
                            ${botName()}
                        </div>

                        <div class="batak-seat">
                            🤖<br>
                            ${botName()}
                        </div>

                    </div>

                    <div class="batak-center">

                        ${
                            trick.map(
                                item=>`

                                    <div>
                                        <div
                                            class="
                                                playing-card
                                                ${
                                                    item.card.suit==="♥"||
                                                    item.card.suit==="♦"
                                                    ?"red"
                                                    :""
                                                }
                                            "
                                        >

                                            ${item.card.rank}
                                            ${item.card.suit}

                                        </div>

                                        <small>
                                            ${item.player}
                                        </small>

                                    </div>

                                `
                            ).join("")
                        }

                    </div>

                    <div class="player-name">
                        Senin Kartların
                    </div>

                    <div class="card-hand">

                        ${
                            hand.map(
                                (card,index)=>
                                    cardHTML(
                                        card,
                                        index
                                    )
                            ).join("")
                        }

                    </div>

                    <div class="game-info">

                        ${
                            turn
                            ?"Bir kart seç."
                            :"Rakip oynuyor..."
                        }

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-card]")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        play(
                            Number(
                                button.dataset.card
                            )
                        );

                    }
                );
            });
    }

    start();
}

/* =========================================================
   BİLARDO
========================================================= */

function createBilardo(){

    let finished=false;
    let scorePool=0;

    const balls=[
        {
            x:18,
            y:50,
            color:"#fff"
        },
        {
            x:35,
            y:42,
            color:"#f44336"
        },
        {
            x:39,
            y:50,
            color:"#2196f3"
        },
        {
            x:43,
            y:58,
            color:"#ffeb3b"
        },
        {
            x:47,
            y:42,
            color:"#9c27b0"
        },
        {
            x:51,
            y:50,
            color:"#4caf50"
        },
        {
            x:55,
            y:58,
            color:"#ff9800"
        }
    ];

    function hitBall(index){

        if(finished)return;

        const ball=balls[index];

        if(!ball)return;

        scorePool++;

        ball.hit=true;

        render();

        setTimeout(
            ()=>{

                balls.splice(
                    index,
                    1
                );

                if(
                    balls.length<=1
                ){

                    finished=true;

                    win(
                        "Bilardo",
                        WIN_REWARD
                    );

                    return;
                }

                render();

            },
            500
        );
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        🎱 BİLARDO
                    </div>

                    <div class="game-info">

                        Cebe sokulan:
                        <strong>
                            ${scorePool}
                        </strong>

                    </div>

                    <div class="pool-table">

                        <div
                            class="pool-pocket"
                            style="left:-20px;top:-20px"
                        ></div>

                        <div
                            class="pool-pocket"
                            style="right:-20px;top:-20px"
                        ></div>

                        <div
                            class="pool-pocket"
                            style="left:-20px;bottom:-20px"
                        ></div>

                        <div
                            class="pool-pocket"
                            style="right:-20px;bottom:-20px"
                        ></div>

                        <div
                            class="pool-pocket"
                            style="
                                left:calc(50% - 26px);
                                top:-20px
                            "
                        ></div>

                        <div
                            class="pool-pocket"
                            style="
                                left:calc(50% - 26px);
                                bottom:-20px
                            "
                        ></div>

                        ${
                            balls.map(
                                (ball,index)=>`

                                    <button
                                        class="
                                            pool-ball
                                            ${
                                                ball.hit
                                                ?"hit"
                                                :""
                                            }
                                        "
                                        data-ball="${index}"
                                        style="
                                            left:${ball.x}%;
                                            top:${ball.y}%;
                                            background:${ball.color};
                                        "
                                    ></button>

                                `
                            ).join("")
                        }

                    </div>

                    <div class="game-info">

                        Toplara tıklayarak
                        vuruş yap.

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-ball]")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        hitBall(
                            Number(
                                button.dataset.ball
                            )
                        );

                    }
                );
            });
    }

    render();
}

/* =========================================================
   MAHJONG
========================================================= */

function createMahjong(){

    let finished=false;

    const symbols=[
        "🀄","🀅","🀆","🀇",
        "🀈","🀉","🀊","🀋",
        "🀌","🀍","🀎","🀏"
    ];

    let cards=
        shuffle(
            [...symbols,...symbols]
        );

    let open=[];
    let matched=0;

    function clickCard(index){

        if(
            finished||
            open.includes(index)
        ){
            return;
        }

        if(
            open.length>=2
        ){
            return;
        }

        open.push(index);

        render();

        if(
            open.length===2
        ){

            const [a,b]=open;

            if(
                cards[a]===cards[b]
            ){

                matched+=2;

                open=[];

                if(
                    matched===cards.length
                ){

                    finished=true;

                    win("Mahjong");

                    return;
                }

                render();

            }else{

                setTimeout(
                    ()=>{
                        open=[];
                        render();
                    },
                    700
                );
            }
        }
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        🀄 MAHJONG
                    </div>

                    <div class="game-info">
                        Eşleşen:
                        ${matched}/${cards.length}
                    </div>

                    <div class="memory-grid">

                        ${cards.map(
                            (card,index)=>`

                                <button
                                    class="
                                        memory-card
                                        ${
                                            open.includes(index)||
                                            matched>0&&
                                            false
                                            ?"open"
                                            :""
                                        }
                                    "
                                    data-mahjong="${index}"
                                >

                                    ${
                                        open.includes(index)
                                        ?card
                                        :"?"
                                    }

                                </button>

                            `
                        ).join("")}

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-mahjong]")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        clickCard(
                            Number(
                                button.dataset.mahjong
                            )
                        );

                    }
                );
            });
    }

    render();
}

/* =========================================================
   SUDOKU
========================================================= */

function createSudoku(){

    let finished=false;

    const puzzle=[
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

    const board=[...puzzle];

    function valid(){

        for(let r=0;r<9;r++){

            const row=
                board.slice(
                    r*9,
                    r*9+9
                );

            const nums=
                row.filter(Boolean);

            if(
                new Set(nums).size!==nums.length
            ){
                return false;
            }
        }

        for(let c=0;c<9;c++){

            const nums=[];

            for(let r=0;r<9;r++){

                const value=
                    board[r*9+c];

                if(value){
                    nums.push(value);
                }
            }

            if(
                new Set(nums).size!==nums.length
            ){
                return false;
            }
        }

        for(
            let br=0;
            br<9;
            br+=3
        ){

            for(
                let bc=0;
                bc<9;
                bc+=3
            ){

                const nums=[];

                for(
                    let r=0;
                    r<3;
                    r++
                ){

                    for(
                        let c=0;
                        c<3;
                        c++
                    ){

                        const value=
                            board[
                                (br+r)*9+
                                bc+c
                            ];

                        if(value){
                            nums.push(value);
                        }
                    }
                }

                if(
                    new Set(nums).size!==nums.length
                ){
                    return false;
                }
            }
        }

        return true;
    }

    function clickCell(index){

        if(
            finished||
            puzzle[index]
        ){
            return;
        }

        let value=
            board[index]+1;

        if(value>9){
            value=0;
        }

        board[index]=value;

        if(
            board.every(
                value=>value>=1
            )&&
            valid()
        ){

            finished=true;

            win("Sudoku");

            return;
        }

        render();
    }

    function render(){

        if(finished)return;

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="table-game">

                    <div class="table-title">
                        🔢 SUDOKU
                    </div>

                    <div class="game-info">

                        Boş hücreye tıklayarak
                        sayıyı değiştir.

                    </div>

                    <div class="sudoku">

                        ${board.map(
                            (value,index)=>`

                                <button
                                    class="
                                        sudoku-cell
                                        ${
                                            puzzle[index]
                                            ?"fixed"
                                            :""
                                        }
                                    "
                                    data-sudoku="${index}"
                                >

                                    ${
                                        value||""
                                    }

                                </button>

                            `
                        ).join("")}

                    </div>

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll("[data-sudoku]")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        clickCell(
                            Number(
                                button.dataset.sudoku
                            )
                        );

                    }
                );
            });
    }

    render();
}
/* =========================================================
   BUBBLE SHOOTER
========================================================= */

function createBubble(){

    let score=0;

    gameArea.innerHTML=`

        <div class="game-shell">

            <div class="game-info">
                15 baloncuk patlat.
                Skor:
                <strong id="bubble-score">
                    0
                </strong>
            </div>

            <div
                class="bubbles"
                id="bubbles">
            </div>

        </div>
    `;

    const colors=[
        "#e53935",
        "#2196f3",
        "#4caf50",
        "#ffca28",
        "#9c27b0"
    ];

    const grid=
        document.getElementById("bubbles");

    for(let i=0;i<40;i++){

        const b=
            document.createElement("button");

        b.className="bubble";

        b.style.background=
            colors[
                rand(0,colors.length-1)
            ];

        b.addEventListener(
            "click",
            ()=>{

                if(b.disabled)return;

                b.disabled=true;
                b.style.visibility="hidden";

                score++;

                document.getElementById(
                    "bubble-score"
                ).textContent=score;

                if(score>=15){
                    win("Bubble Shooter");
                }
            }
        );

        grid.appendChild(b);
    }
}

/* =========================================================
   ARABA YARIŞI
========================================================= */

function createRace(){

    let x=45;
    let score=0;
    let finished=false;

    gameArea.innerHTML=`

        <div class="game-shell">

            <div class="game-info">
                Rakiplerden kaç.
                20 puana ulaş.
            </div>

            <div class="race">

                <div
                    id="race-player"
                    class="race-car"
                    style="left:45%">
                </div>

                <div
                    id="race-enemy"
                    class="race-enemy"
                    style="left:30%;top:-80px">
                </div>

            </div>

            <div class="game-toolbar">

                <button
                    class="game-button"
                    id="race-left">

                    ◀ Sol

                </button>

                <button
                    class="game-button"
                    id="race-right">

                    Sağ ▶

                </button>

            </div>

        </div>
    `;

    const player=
        document.getElementById(
            "race-player"
        );

    const enemy=
        document.getElementById(
            "race-enemy"
        );

    function move(n){

        x=Math.max(
            5,
            Math.min(85,x+n)
        );

        player.style.left=x+"%";
    }

    document.getElementById(
        "race-left"
    ).addEventListener(
        "click",
        ()=>move(-6)
    );

    document.getElementById(
        "race-right"
    ).addEventListener(
        "click",
        ()=>move(6)
    );

    const timer=setInterval(()=>{

        if(finished){

            clearInterval(timer);
            return;
        }

        let y=
            parseFloat(
                enemy.style.top
            )||-80;

        y+=5;

        if(y>420){

            y=-80;

            enemy.style.left=
                rand(8,80)+"%";

            score++;

            if(score>=20){

                finished=true;
                clearInterval(timer);
                win("Araba Yarışı");
                return;
            }
        }

        enemy.style.top=y+"px";

    },80);
}

/* =========================================================
   BLOCK PUZZLE
========================================================= */

function createBlock(){

    const cells=
        Array(64).fill(false);

    let score=0;

    function render(){

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="game-info">
                    Temizlenen satır:
                    <strong>${score}</strong>
                </div>

                <div class="block-grid">

                    ${cells.map((v,i)=>`

                        <div
                            class="
                                block-cell
                                ${v?"filled":""}
                            "
                            data-i="${i}">
                        </div>

                    `).join("")}

                </div>

                <div class="game-toolbar">

                    <button
                        class="game-button"
                        id="block-add">

                        🧱 Blok Yerleştir

                    </button>

                </div>

            </div>
        `;

        document.getElementById(
            "block-add"
        )?.addEventListener(
            "click",
            ()=>{

                let free=
                    cells
                    .map((v,i)=>v?null:i)
                    .filter(
                        v=>v!==null
                    );

                for(
                    let i=0;
                    i<4&&free.length;
                    i++
                ){

                    const p=
                        free.splice(
                            rand(
                                0,
                                free.length-1
                            ),
                            1
                        )[0];

                    cells[p]=true;
                }

                for(let r=0;r<8;r++){

                    if(
                        cells
                        .slice(r*8,r*8+8)
                        .every(Boolean)
                    ){

                        for(let c=0;c<8;c++){
                            cells[r*8+c]=false;
                        }

                        score++;
                    }
                }

                render();

                if(score>=5){
                    win("Block Puzzle");
                }
            }
        );
    }

    render();
}

/* =========================================================
   OKÇULUK
========================================================= */

function createArchery(){

    let score=0;

    gameArea.innerHTML=`

        <div class="game-shell">

            <div class="game-info">
                Hedefe 5 kez isabet ettir.
            </div>

            <div
                class="target-area"
                id="target-area">

                <button
                    class="target"
                    id="target">
                </button>

            </div>

            <div class="game-info">

                Puan:
                <strong id="archery-score">
                    0
                </strong>

            </div>

        </div>
    `;

    const target=
        document.getElementById("target");

    function move(){

        target.style.left=
            rand(5,85)+"%";

        target.style.top=
            rand(5,75)+"%";
    }

    target.addEventListener(
        "click",
        ()=>{

            score++;

            document.getElementById(
                "archery-score"
            ).textContent=score;

            move();

            if(score>=5){
                win("Okçuluk");
            }
        }
    );

    move();
}

/* =========================================================
   HAFIZA
========================================================= */

function createMemory(title){

    const values=[
        "🍎","🍎",
        "🍌","🍌",
        "🍇","🍇",
        "🍉","🍉",
        "🍓","🍓",
        "🥝","🥝",
        "🍒","🍒",
        "🥥","🥥"
    ];

    const cards=
        shuffle([...values]);

    let open=[];
    let matched=[];
    let locked=false;

    function render(){

        gameArea.innerHTML=`

            <div class="game-shell">

                <div class="game-info">
                    🧠 ${title}
                    - Tüm çiftleri bul.
                </div>

                <div class="memory-grid">

                    ${cards.map((value,i)=>`

                        <button
                            class="
                                memory-card
                                ${
                                    open.includes(i)||
                                    matched.includes(i)
                                    ?"open"
                                    :""
                                }
                            "
                            data-i="${i}">

                            ${
                                open.includes(i)||
                                matched.includes(i)
                                ?value
                                :"?"
                            }

                        </button>

                    `).join("")}

                </div>

            </div>
        `;

        gameArea
            .querySelectorAll(".memory-card")
            .forEach(btn=>{

                btn.addEventListener(
                    "click",
                    ()=>{

                        const i=
                            Number(btn.dataset.i);

                        if(
                            locked||
                            matched.includes(i)||
                            open.includes(i)
                        ){
                            return;
                        }

                        open.push(i);

                        render();

                        if(open.length===2){

                            locked=true;

                            setTimeout(()=>{

                                if(
                                    cards[open[0]]===
                                    cards[open[1]]
                                ){

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
                                ){

                                    win(title);
                                }

                            },500);
                        }
                    }
                );
            });
    }

    render();
}

/* =========================================================
   YILAN
========================================================= */

function createSnake(){

    const size=20;

    let snake=[
        210,
        211,
        212
    ];

    let dir=-1;
    let food=100;
    let score=0;
    let running=true;

    gameArea.innerHTML=`

        <div class="game-shell">

            <div class="game-info">

                🐍 Ok tuşlarıyla yönet.
                Skor:
                <strong id="snake-score">
                    0
                </strong>

            </div>

            <div
                class="snake-board"
                id="snake-board">
            </div>

        </div>
    `;

    const board=
        document.getElementById(
            "snake-board"
        );

    function render(){

        board.innerHTML="";

        for(let i=0;i<400;i++){

            const cell=
                document.createElement("div");

            cell.className=
                "snake-cell";

            if(snake.includes(i)){
                cell.classList.add("snake");
            }

            if(i===food){
                cell.classList.add("food");
            }

            board.appendChild(cell);
        }

        document.getElementById(
            "snake-score"
        ).textContent=score;
    }

    function newFood(){

        do{
            food=rand(0,399);
        }while(snake.includes(food));
    }

    const key=e=>{

        if(
            e.key==="ArrowUp"&&
            dir!==20
        ){
            dir=-20;
        }

        if(
            e.key==="ArrowDown"&&
            dir!==-20
        ){
            dir=20;
        }

        if(
            e.key==="ArrowLeft"&&
            dir!==1
        ){
            dir=-1;
        }

        if(
            e.key==="ArrowRight"&&
            dir!==-1
        ){
            dir=1;
        }
    };

    document.addEventListener(
        "keydown",
        key
    );

    const timer=setInterval(()=>{

        if(!running){

            clearInterval(timer);

            document.removeEventListener(
                "keydown",
                key
            );

            return;
        }

        const head=
            snake[snake.length-1];

        const next=head+dir;

        const row=
            Math.floor(head/20);

        const nextRow=
            Math.floor(next/20);

        if(
            next<0||
            next>=400||
            (dir===1&&nextRow!==row)||
            (dir===-1&&nextRow!==row)||
            snake.includes(next)
        ){

            running=false;

            lose("Yılan Oyunu");

            return;
        }

        snake.push(next);

        if(next===food){

            score++;

            newFood();

            if(score>=10){

                running=false;
                win("Yılan Oyunu");
                return;
            }

        }else{

            snake.shift();
        }

        render();

    },130);

    render();
}

/* =========================================================
   BASKET
========================================================= */

function createBasket(){

    let score=0;
    let attempts=0;
    let finished=false;

    gameArea.innerHTML=`

        <div class="game-shell">

            <div class="game-info">
                🏀 5 basket yap.
            </div>

            <div class="basket-area">

                <div class="hoop"></div>

                <button
                    class="basket-ball"
                    id="basket-ball">
                </button>

            </div>

            <div class="game-info">

                Basket:
                <strong id="basket-score">
                    0
                </strong>

                &nbsp; | &nbsp;

                Atış:
                <strong id="basket-attempts">
                    0
                </strong>

            </div>

        </div>
    `;

    const ball=
        document.getElementById(
            "basket-ball"
        );

    ball.addEventListener(
        "click",
        ()=>{

            if(finished)return;

            attempts++;

            const success=
                Math.random()>.4;

            if(success){

                score++;

                ball.style.transform=
                    "translate(-50%,-230px)";

                setTimeout(()=>{

                    ball.style.transform=
                        "translateX(-50%)";

                },400);
            }

            document.getElementById(
                "basket-score"
            ).textContent=score;

            document.getElementById(
                "basket-attempts"
            ).textContent=attempts;

            if(score>=5){

                finished=true;
                win("Basket Atışı");
                return;
            }

            if(attempts>=10){

                finished=true;
                lose("Basket Atışı");
            }
        }
    );
}

/* =========================================================
   REKLAM BONUSU
========================================================= */

adButton?.addEventListener(
    "click",
    ()=>{

        changeScore(AD_REWARD);

        showMessage(
            "📺",
            "Bonus",
            "Deneme reklam bonusu olarak +100 puan eklendi."
        );
    }
);

/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    e=>{

        if(e.key==="Escape"){

            closeGame();
            hideMessage();
        }
    }
);

/* =========================================================
   BAŞLAT
========================================================= */

updateScore();

console.log(
    "OynaKazan aktif:",
    games.length,
    "oyun"
);

});   
