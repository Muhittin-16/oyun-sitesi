/* =========================================================
   OYNAKAZAN - 15 OYUN
   YENİ STABİL OYUN MOTORU
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
   GARANTİ CSS
========================================================= */

const style = document.createElement("style");

style.textContent = `
html,body{
    overflow-x:hidden !important;
}

#games-container{
    display:grid !important;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:18px;
    width:100%;
}

.game-card{
    display:flex !important;
    flex-direction:column !important;
    align-items:center !important;
    justify-content:flex-start !important;
    min-height:245px;
    padding:22px 16px !important;
    border-radius:20px !important;
    background:linear-gradient(145deg,#151d38,#0c1225) !important;
    border:1px solid rgba(255,255,255,.12) !important;
    box-shadow:0 10px 30px rgba(0,0,0,.25) !important;
    color:#fff !important;
    text-align:center;
}

.game-card-icon{
    width:78px;
    height:78px;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    border-radius:22px;
    background:linear-gradient(145deg,#6c63ff,#4239c7);
    font-size:42px;
    margin-bottom:12px;
    box-shadow:0 8px 20px rgba(0,0,0,.3);
}

.game-card h3{
    margin:4px 0 8px !important;
    color:#fff !important;
    font-size:20px !important;
}

.game-card p{
    color:#b9c2dd !important;
    margin:0 0 15px !important;
    line-height:1.45;
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

.game-card-btn:hover{
    transform:translateY(-2px);
}

.modal{
    position:fixed !important;
    inset:0 !important;
    z-index:9999 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
}

.modal-content{
    width:min(1200px,96vw) !important;
    max-width:1200px !important;
    margin:3vh auto !important;
    max-height:94vh !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
}

.game-area{
    width:100% !important;
    max-width:100% !important;
    overflow:hidden !important;
}

.game-shell{
    width:100%;
    max-width:1180px;
    margin:auto;
    padding:10px;
}

.game-toolbar{
    display:flex;
    flex-wrap:wrap;
    gap:9px;
    justify-content:center;
    align-items:center;
    margin:12px 0;
}

.game-button{
    border:0;
    border-radius:11px;
    padding:11px 16px;
    background:#6c63ff;
    color:#fff;
    font-weight:800;
    cursor:pointer;
}

.game-button:hover{
    filter:brightness(1.15);
    transform:translateY(-1px);
}

.game-info{
    background:rgba(255,255,255,.07);
    border-radius:12px;
    padding:11px;
    margin:9px 0;
    text-align:center;
}

.table-game{
    position:relative;
    width:100%;
    min-height:520px;
    padding:18px;
    border:12px solid #603719;
    border-radius:28px;
    background:
        radial-gradient(circle at center,#177447,#0b4329 65%,#062719);
    box-shadow:
        inset 0 0 45px rgba(0,0,0,.65),
        0 18px 45px rgba(0,0,0,.45);
}

.table-title{
    text-align:center;
    font-size:23px;
    font-weight:900;
    margin-bottom:12px;
    text-shadow:0 3px 5px #000;
}

/* =========================================================
   OKEY
========================================================= */

.okey-opponents{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
}

.okey-opponent{
    padding:10px;
    border-radius:13px;
    background:rgba(0,0,0,.22);
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
    width:22px;
    height:32px;
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
    font-size:28px;
    font-weight:900;
    box-shadow:0 6px 14px #0008;
}

.okey-rack{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    flex-wrap:wrap;
    gap:4px;
    padding:13px 9px;
    min-height:105px;
    background:#704019;
    border:6px solid #42200d;
    border-radius:15px;
}

.okey-tile{
    width:39px;
    height:57px;
    border-radius:6px;
    border:2px solid #bba468;
    background:linear-gradient(#fffdf2,#e6dab2);
    display:flex;
    align-items:center;
    justify-content:center;
    color:#d22636;
    font-weight:900;
    font-size:20px;
    cursor:pointer;
    box-shadow:0 3px 6px #0007;
    transition:.15s;
    user-select:none;
}

.okey-tile:hover{
    transform:translateY(-6px);
}

.okey-tile.selected{
    transform:translateY(-13px);
    outline:3px solid #ffd166;
}

.okey-tile.red{color:#d12636}
.okey-tile.black{color:#222}
.okey-tile.blue{color:#1769aa}
.okey-tile.green{color:#16844a}
.okey-tile.joker{color:#7c35c8}

/* =========================================================
   TAVLA
========================================================= */

.tavla-board{
    width:100%;
    max-width:950px;
    margin:auto;
    background:#713d1c;
    border:12px solid #351708;
    border-radius:16px;
    padding:10px;
    display:grid;
    grid-template-columns:repeat(12,1fr);
    gap:5px;
    position:relative;
}

.tavla-point{
    min-height:190px;
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

.tavla-number{
    position:absolute;
    top:3px;
    font-size:10px;
    opacity:.8;
}

.tavla-checker{
    width:37px;
    height:37px;
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
}

/* =========================================================
   DAMA
========================================================= */

.dama-board{
    width:min(620px,100%);
    margin:auto;
    aspect-ratio:1/1;
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
    width:72%;
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
    min-height:570px;
    padding:15px;
    border:12px solid #593317;
    border-radius:30px;
    background:
        radial-gradient(circle,#177446,#073b25);
}

.batak-seats{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:8px;
}

.batak-seat{
    padding:8px;
    border-radius:12px;
    background:#0005;
    text-align:center;
}

.card-back{
    width:25px;
    height:38px;
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
    min-height:160px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
}

.playing-card{
    width:58px;
    height:84px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background:#fff;
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
    gap:5px;
}

/* =========================================================
   BİLARDO
========================================================= */

.pool-table{
    width:min(900px,100%);
    aspect-ratio:2/1;
    margin:15px auto;
    position:relative;
    border:20px solid #6c401e;
    border-radius:28px;
    background:#075d39;
    box-shadow:
        inset 0 0 35px #0009,
        0 15px 35px #0008;
    overflow:hidden;
}

.pool-pocket{
    position:absolute;
    width:48px;
    height:48px;
    border-radius:50%;
    background:#050505;
    box-shadow:inset 0 0 10px #000;
    z-index:2;
}

.pool-ball{
    position:absolute;
    width:30px;
    height:30px;
    border:2px solid #fff;
    border-radius:50%;
    cursor:pointer;
    box-shadow:0 4px 7px #0009;
    z-index:5;
    transition:.25s;
}

.pool-ball.hit{
    animation:ballHit .45s ease;
}

@keyframes ballHit{
    0%{transform:scale(1)}
    40%{transform:scale(1.25)}
    100%{transform:scale(.2);opacity:0}
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

.race-car{
    position:absolute;
    width:45px;
    height:72px;
    border-radius:12px;
    bottom:15px;
    background:#e53935;
}

.race-enemy{
    position:absolute;
    width:45px;
    height:72px;
    border-radius:12px;
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
    width:min(650px,100%);
    height:400px;
    margin:auto;
    position:relative;
    border-radius:15px;
    overflow:hidden;
    background:linear-gradient(#8bd3f7,#eafaff);
}

.hoop{
    position:absolute;
    top:70px;
    left:50%;
    transform:translateX(-50%);
    width:130px;
    height:80px;
    border:8px solid #e65100;
    border-top:0;
    border-radius:0 0 70px 70px;
}

.basket-ball{
    position:absolute;
    left:50%;
    bottom:35px;
    width:38px;
    height:38px;
    border:0;
    border-radius:50%;
    background:#e87519;
    cursor:pointer;
    transition:.4s;
}

/* =========================================================
   MOBİL
========================================================= */

@media(max-width:700px){

    #games-container{
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
    }

    .game-card{
        min-height:220px;
        padding:14px 9px !important;
    }

    .game-card-icon{
        width:60px;
        height:60px;
        font-size:32px;
    }

    .game-card h3{
        font-size:16px !important;
    }

    .game-card p{
        font-size:12px;
    }

    .okey-opponents{
        grid-template-columns:1fr;
    }

    .okey-tile{
        width:29px;
        height:43px;
        font-size:15px;
    }

    .tavla-board{
        gap:2px;
        padding:5px;
        border-width:7px;
    }

    .tavla-point{
        min-height:125px;
    }

    .tavla-checker{
        width:25px;
        height:25px;
        border-width:2px;
    }

    .playing-card{
        width:45px;
        height:68px;
        font-size:15px;
    }

    .batak-seats{
        grid-template-columns:1fr;
    }

    .pool-table{
        border-width:12px;
    }

    .pool-pocket{
        width:30px;
        height:30px;
    }

    .pool-ball{
        width:22px;
        height:22px;
    }

    .dama-board{
        border-width:6px;
    }

    .dama-piece{
        border-width:2px;
    }
}
`;

document.head.appendChild(style);

/* =========================================================
   PUAN
========================================================= */

function updateScore(){
    score = Math.max(0, Number(score) || 0);
    localStorage.setItem(SCORE_KEY, score);

    if(scoreElement){
        scoreElement.textContent = score;
    }
}

function changeScore(amount){
    score += Number(amount) || 0;
    updateScore();
}

function showMessage(icon,title,text){
    if(!messageModal) return;

    messageIcon.textContent = icon;
    messageTitle.textContent = title;
    messageText.textContent = text;

    messageModal.classList.remove("hidden");
}

function hideMessage(){
    if(messageModal){
        messageModal.classList.add("hidden");
    }
}

messageClose?.addEventListener("click",hideMessage);

function win(name,points=WIN_REWARD){
    changeScore(points);
    showMessage("🏆","Tebrikler!",`${name} oyununu kazandın! +${points} puan.`);
}

function lose(name){
    changeScore(LOSS_REWARD);
    showMessage("😔","Oyun Bitti",`${name} oyununu kaybettin. ${LOSS_REWARD} puan.`);
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
    return botNames[Math.floor(Math.random()*botNames.length)];
}

function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}

/* =========================================================
   15 OYUN
========================================================= */

const games=[
    {id:1,name:"101 Okey",icon:"🀄",category:"board",type:"okey",description:"106 taşlık gerçek 101 Okey masası."},
    {id:2,name:"Klasik Tavla",icon:"🎲",category:"board",type:"tavla",description:"15 pullu klasik tavla."},
    {id:3,name:"Türk Daması",icon:"⚫",category:"board",type:"dama",description:"16 taşlı Türk Daması."},
    {id:4,name:"Batak",icon:"🃏",category:"cards",type:"batak",description:"4 kişilik kozlu Batak."},
    {id:5,name:"Bilardo",icon:"🎱",category:"arcade",type:"bilardo",description:"Topları ceplere gönder."},
    {id:6,name:"Mahjong",icon:"🀄",category:"puzzle",type:"mahjong",description:"Aynı taşları eşleştir."},
    {id:7,name:"Sudoku",icon:"🔢",category:"puzzle",type:"sudoku",description:"9x9 Sudoku çöz."},
    {id:8,name:"Bubble Shooter",icon:"🫧",category:"arcade",type:"bubble",description:"Aynı renk baloncukları patlat."},
    {id:9,name:"Araba Yarışı",icon:"🏎️",category:"arcade",type:"race",description:"Rakiplerden kaç ve bitişe ulaş."},
    {id:10,name:"Block Puzzle",icon:"🧱",category:"puzzle",type:"block",description:"Blokları yerleştir."},
    {id:11,name:"Okçuluk",icon:"🏹",category:"arcade",type:"archery",description:"Hedefi tam ortadan vur."},
    {id:12,name:"Zeka Eşleştirme",icon:"🧠",category:"puzzle",type:"memory",description:"Kartların eşlerini bul."},
    {id:13,name:"Hafıza Oyunu",icon:"🃏",category:"puzzle",type:"memory2",description:"Hafızanı test et."},
    {id:14,name:"Yılan Oyunu",icon:"🐍",category:"arcade",type:"snake",description:"Yılanı büyüt."},
    {id:15,name:"Basket Atışı",icon:"🏀",category:"arcade",type:"basket",description:"Basketleri sayıya çevir."}
];

/* =========================================================
   KARTLARI GÖSTER
========================================================= */

function renderGames(filter="all"){

    if(!gamesContainer){
        console.error("games-container bulunamadı!");
        return;
    }

    gamesContainer.innerHTML="";

    const list=games.filter(g =>
        filter==="all" || g.category===filter
    );

    list.forEach(game=>{

        const card=document.createElement("article");

        card.className="game-card";

        card.innerHTML=`
            <div class="game-card-icon">${game.icon}</div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <button class="game-card-btn">
                🎮 Oyna
            </button>
        `;

        card.querySelector(".game-card-btn")
            .addEventListener("click",()=>{
                openGame(game);
            });

        gamesContainer.appendChild(card);
    });

    console.log("Oyun kartları oluşturuldu:",list.length);
}

renderGames();

/* =========================================================
   KATEGORİLER
========================================================= */

document.querySelectorAll(".cat-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".cat-btn")
            .forEach(x=>x.classList.remove("active"));

        btn.classList.add("active");

        renderGames(btn.dataset.filter || "all");
    });
});

/* =========================================================
   OYUN AÇ
========================================================= */

function openGame(game){

    const paid=["okey","tavla","dama","batak"];

    if(paid.includes(game.type)){

        if(score<ENTRY_COST){
            showMessage(
                "🪙",
                "Yetersiz Puan",
                `${ENTRY_COST} puan gerekiyor.`
            );
            return;
        }

        changeScore(-ENTRY_COST);
    }

    modalTitle.textContent=game.name;
    modalCategory.textContent=game.category.toUpperCase();

    gameModal.classList.remove("hidden");

    gameArea.innerHTML="";

    switch(game.type){

        case "okey": createOkey(); break;
        case "tavla": createTavla(); break;
        case "dama": createDama(); break;
        case "batak": createBatak(); break;
        case "bilardo": createBilardo(); break;
        case "mahjong": createMahjong(); break;
        case "sudoku": createSudoku(); break;
        case "bubble": createBubble(); break;
        case "race": createRace(); break;
        case "block": createBlock(); break;
        case "archery": createArchery(); break;
        case "memory": createMemory("Zeka Eşleştirme"); break;
        case "memory2": createMemory("Hafıza Oyunu"); break;
        case "snake": createSnake(); break;
        case "basket": createBasket(); break;
    }
}

/* =========================================================
   MODAL KAPAT
========================================================= */

function closeGame(){
    gameModal?.classList.add("hidden");
    if(gameArea) gameArea.innerHTML="";
}

closeBtn?.addEventListener("click",closeGame);

/* =========================================================
   101 OKEY
   106 TAŞ
========================================================= */

function createOkey(){

    let ended=false;
    let selected=[];
    let opened=false;
    let discard=[];
    let deck=[];

    const colors=[
        ["red","Kırmızı"],
        ["black","Siyah"],
        ["blue","Mavi"],
        ["green","Yeşil"]
    ];

    const bots=[
        {name:botName(),count:21},
        {name:botName(),count:21},
        {name:botName(),count:21}
    ];

    const hand=[];

    colors.forEach(([color,name])=>{
        for(let copy=0;copy<2;copy++){
            for(let n=1;n<=13;n++){
                deck.push({
                    color,
                    colorName:name,
                    value:n,
                    wild:false
                });
            }
        }
    });

    deck.push({color:"joker",colorName:"Sahte Okey",value:0,wild:true});
    deck.push({color:"joker",colorName:"Sahte Okey",value:0,wild:true});

    shuffle(deck);

    const indicator=deck.pop();

    const okeyValue=indicator.value===13 ? 1 : indicator.value+1;

    deck.forEach(tile=>{
        if(
            tile.color===indicator.color &&
            tile.value===okeyValue
        ){
            tile.wild=true;
        }
    });

    /*
      Gerçek dağıtıma uygun:
      Başlayan oyuncu 22 taş,
      diğer oyuncular 21 taş.
    */

    for(let i=0;i<22;i++){
        hand.push(deck.pop());
    }

    function tileClass(t){
        return t.color;
    }

    function tileText(t){
        return t.wild ? "★" : t.value;
    }

    function draw(){

        if(ended) return;

        if(deck.length===0){
            showMessage("🀄","Taş Bitti","Destede taş kalmadı.");
            return;
        }

        hand.push(deck.pop());
        selected=[];
        render();
    }

    function discardTile(){

        if(selected.length!==1){
            showMessage(
                "🀄",
                "Taş Seç",
                "Atmak için bir taş seç."
            );
            return;
        }

        const index=selected[0];

        discard.push(hand.splice(index,1)[0]);
        selected=[];

        render();

        setTimeout(botRound,500);
    }

    function openTiles(){

        if(selected.length<3){
            showMessage(
                "🀄",
                "Per Seç",
                "En az 3 taş seçmelisin."
            );
            return;
        }

        const chosen=selected.map(i=>hand[i]);

        const sum=chosen.reduce(
            (s,t)=>s+(t.wild?11:t.value),0
        );

        if(!opened && sum<101){
            showMessage(
                "🀄",
                "101 Eksik",
                `Seçtiğin taşların değeri ${sum}. En az 101 gerekli.`
            );
            return;
        }

        opened=true;

        const indexes=[...selected].sort((a,b)=>b-a);

        indexes.forEach(i=>{
            hand.splice(i,1);
        });

        selected=[];
        render();

        if(hand.length===0){
            ended=true;
            win("101 Okey");
        }
    }

    function botRound(){

        if(ended) return;

        bots.forEach(bot=>{
            if(deck.length){
                bot.count++;
                deck.pop();
            }

            if(bot.count>21){
                bot.count--;
                discard.push(deck.length ? deck.pop() : {});
            }
        });

        render();
    }

    function render(){

        if(ended) return;

        gameArea.innerHTML=`
            <div class="game-shell">
                <div class="table-game okey-table">

                    <div class="table-title">
                        🀄 101 OKEY MASASI
                    </div>

                    <div class="game-info">
                        Gösterge:
                        <strong>
                            ${indicator.value}
                            ${indicator.colorName}
                        </strong>
                        &nbsp; | &nbsp;
                        Okey:
                        <strong>${okeyValue}</strong>
                        &nbsp; | &nbsp;
                        Sen:
                        <strong>${hand.length} taş</strong>
                    </div>

                    <div class="okey-opponents">

                        ${bots.map(bot=>`
                            <div class="okey-opponent">
                                <div class="okey-avatar">👤</div>
                                <strong>${bot.name}</strong>
                                <div>${bot.count} taş</div>

                                <div class="okey-hidden">
                                    ${Array.from(
                                        {length:Math.min(bot.count,14)},
                                        ()=>`<span class="okey-back"></span>`
                                    ).join("")}
                                </div>
                            </div>
                        `).join("")}

                    </div>

                    <div class="okey-center">

                        <div>
                            <div class="game-info">Taş Çek</div>
                            <button
                                class="okey-pile"
                                id="okey-draw">
                                🀄
                            </button>
                        </div>

                        <div>
                            <div class="game-info">Son Atılan</div>
                            <div class="okey-pile">
                                ${
                                    discard.length
                                    ? tileText(discard[discard.length-1])
                                    : "—"
                                }
                            </div>
                        </div>

                    </div>

                    <div class="player-zone">

                        <div class="player-name">
                            🎮 SEN
                        </div>

                        <div class="okey-rack">

                            ${hand.map((tile,i)=>`
                                <div
                                    class="
                                        okey-tile
                                        ${tileClass(tile)}
                                        ${selected.includes(i)?"selected":""}
                                    "
                                    data-i="${i}">
                                    ${tileText(tile)}
                                </div>
                            `).join("")}

                        </div>

                    </div>

                    <div class="game-toolbar">

                        <button
                            class="game-button"
                            id="okey-open">
                            ${opened?"➕ Per Aç":"🔓 101 Aç"}
                        </button>

                        <button
                            class="game-button"
                            id="okey-discard">
                            🗑️ Taş At
                        </button>

                    </div>

                    <div class="game-info">
                        ${
                            opened
                            ? "Elini açtın. Perlerini geliştirebilirsin."
                            : "Başlangıçta 22 taşın var ve ilk taşı sen atarsın. 101 açılışı için en az 101 puan gerekir."
                        }
                    </div>

                </div>
            </div>
        `;

        gameArea.querySelectorAll(".okey-tile")
            .forEach(el=>{
                el.addEventListener("click",()=>{
                    const i=Number(el.dataset.i);

                    if(selected.includes(i)){
                        selected=selected.filter(x=>x!==i);
                    }else{
                        selected.push(i);
                    }

                    render();
                });
            });

        document.getElementById("okey-draw")
            ?.addEventListener("click",draw);

        document.getElementById("okey-open")
            ?.addEventListener("click",openTiles);

        document.getElementById("okey-discard")
            ?.addEventListener("click",discardTile);
    }

    render();
}

/* =========================================================
   TAVLA
========================================================= */

function createTavla(){

    let finished=false;
    let turn=true;
    let dice=[];
    let selectedDie=null;
    let selectedPoint=null;

    const points=Array(24).fill(0);

    /*
      Pozitif = oyuncu
      Negatif = bot
    */

    points[0]=2;
    points[11]=5;
    points[16]=3;
    points[18]=5;

    points[23]=-2;
    points[12]=-5;
    points[7]=-3;
    points[5]=-5;

    let playerOff=0;
    let botOff=0;

    function roll(){

        if(!turn || dice.length) return;

        const a=rand(1,6);
        const b=rand(1,6);

        dice=a===b?[a,a,a,a]:[a,b];

        selectedDie=null;
        selectedPoint=null;

        render();
    }

    function move(from){

        if(!turn || selectedDie===null) return;

        if(points[from]<=0){
            showMessage("🎲","Geçersiz","Bu hanede senin pulun yok.");
            return;
        }

        const target=from+selectedDie;

        if(target>=24){

            playerOff++;
            points[from]--;
        }else{

            if(points[target]<-1){
                showMessage(
                    "🎲",
                    "Kapalı Hane",
                    "Bu hane rakip tarafından kapatılmış."
                );
                return;
            }

            points[from]--;

            if(points[target]===-1){
                points[target]=1;
            }else{
                points[target]++;
            }
        }

        dice.splice(dice.indexOf(selectedDie),1);

        selectedDie=null;
        selectedPoint=null;

        if(playerOff>=15){
            finished=true;
            win("Klasik Tavla");
            return;
        }

        if(!dice.length){
            turn=false;
            render();
            setTimeout(botMove,700);
        }else{
            render();
        }
    }

    function botMove(){

        if(finished) return;

        if(!dice.length){

            const a=rand(1,6);
            const b=rand(1,6);

            dice=a===b?[a,a,a,a]:[a,b];
        }

        function oneMove(){

            if(!dice.length){
                turn=true;
                render();
                return;
            }

            let moved=false;

            for(const d of [...dice]){

                for(let from=23;from>=0;from--){

                    if(points[from]>=0) continue;

                    const target=from-d;

                    if(target<0){
                        botOff++;
                        points[from]++;
                        dice.splice(dice.indexOf(d),1);
                        moved=true;
                        break;
                    }

                    if(points[target]>1) continue;

                    points[from]++;

                    if(points[target]===1){
                        points[target]=-1;
                    }else{
                        points[target]--;
                    }

                    dice.splice(dice.indexOf(d),1);
                    moved=true;
                    break;
                }

                if(moved) break;
            }

            if(botOff>=15){
                finished=true;
                lose("Klasik Tavla");
                return;
            }

            render();
            setTimeout(oneMove,300);
        }

        oneMove();
    }

    function render(){

        if(finished) return;

        const order=[
            ...Array.from({length:12},(_,i)=>23-i),
            ...Array.from({length:12},(_,i)=>i)
        ];

        gameArea.innerHTML=`
            <div class="game-shell">
                <div class="table-game">

                    <div class="table-title">
                        🎲 KLASİK TAVLA
                    </div>

                    <div class="game-info">
                        Sen: ${15-playerOff}/15 pul
                        &nbsp; | &nbsp;
                        Rakip: ${15-botOff}/15 pul
                    </div>

                    <div class="dice-row">
                        ${
                            dice.map((d,i)=>`
                                <button
                                    class="die ${selectedDie===d?"selected":""}"
                                    data-die="${d}">
                                    ${d}
                                </button>
                            `).join("")
                        }
                    </div>

                    <div class="tavla-board">

                        ${order.map(index=>{

                            const count=Math.abs(points[index]);
                            const player=points[index]>0;

                            return `
                                <div
                                    class="tavla-point"
                                    data-point="${index}">

                                    <span class="tavla-number">
                                        ${index+1}
                                    </span>

                                    ${Array.from(
                                        {length:Math.min(count,6)},
                                        ()=>`
                                            <span class="tavla-checker ${
                                                player?"white":"black"
                                            }"></span>
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
                            ${!turn||dice.length?"disabled":""}>
                            🎲 Zar At
                        </button>

                    </div>

                    <div class="game-info">
                        ${
                            turn
                            ? (
                                dice.length
                                ? "Zarı seç, sonra oynatmak istediğin pula tıkla."
                                : "Zar at."
                            )
                            : "Rakip oynuyor..."
                        }
                    </div>

                </div>
            </div>
        `;

        document.querySelectorAll(".die")
            .forEach(d=>{
                d.addEventListener("click",()=>{
                    selectedDie=Number(d.dataset.die);
                    selectedPoint=null;
                    render();
                });
            });

        document.querySelectorAll(".tavla-point")
            .forEach(p=>{
                p.addEventListener("click",()=>{
                    const index=Number(p.dataset.point);

                    if(selectedDie===null){
                        showMessage("🎲","Zar Seç","Önce bir zar seç.");
                        return;
                    }

                    move(index);
                });
            });

        document.getElementById("tavla-roll")
            ?.addEventListener("click",roll);
    }

    render();
}

/* =========================================================
   TÜRK DAMASI
   16 TAŞ
========================================================= */

function createDama(){

    let finished=false;
    let selected=null;
    let turn=true;

    const board=Array(64).fill(null);

    /*
      16 + 16 taş.
    */

    for(let r=0;r<2;r++){
        for(let c=0;c<8;c++){
            board[r*8+c]={side:"bot",king:false};
        }
    }

    for(let r=6;r<8;r++){
        for(let c=0;c<8;c++){
            board[r*8+c]={side:"player",king:false};
        }
    }

    function rc(i){
        return [Math.floor(i/8),i%8];
    }

    function id(r,c){
        return r*8+c;
    }

    function inside(r,c){
        return r>=0&&r<8&&c>=0&&c<8;
    }

    const dirs=[
        [-1,0],[1,0],[0,-1],[0,1]
    ];

    function moves(i,captureOnly=false){

        const piece=board[i];

        if(!piece) return [];

        const [r,c]=rc(i);
        const result=[];

        if(!captureOnly){

            if(piece.king){

                dirs.forEach(([dr,dc])=>{
                    const nr=r+dr;
                    const nc=c+dc;

                    if(inside(nr,nc)&&!board[id(nr,nc)]){
                        result.push({
                            to:id(nr,nc),
                            capture:null
                        });
                    }
                });

            }else{

                const forward=piece.side==="player"?-1:1;

                [
                    [forward,0],
                    [0,-1],
                    [0,1]
                ].forEach(([dr,dc])=>{

                    const nr=r+dr;
                    const nc=c+dc;

                    if(
                        inside(nr,nc) &&
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
            ) return;

            const middle=board[id(mr,mc)];

            if(
                middle &&
                middle.side!==piece.side &&
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

    function playerCaptureExists(){

        return board.some((p,i)=>
            p &&
            p.side==="player" &&
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
            (piece.side==="player"&&r===0)||
            (piece.side==="bot"&&r===7)
        ){
            piece.king=true;
        }
    }

    function clickCell(i){

        if(finished||!turn) return;

        const piece=board[i];

        if(selected===null){

            if(piece?.side!=="player") return;

            if(
                playerCaptureExists() &&
                !moves(i,true).length
            ){
                showMessage(
                    "⚫",
                    "Zorunlu Alma",
                    "Alabilecek başka bir taşın var."
                );
                return;
            }

            selected=i;
            render();
            return;
        }

        const mustCapture=playerCaptureExists();

        const legal=moves(selected,mustCapture);

        const m=legal.find(x=>x.to===i);

        if(!m){
            if(piece?.side==="player"){
                selected=i;
                render();
            }
            return;
        }

        makeMove(selected,m);

        if(m.capture!==null){

            const more=moves(m.to,true);

            if(more.length){
                selected=m.to;
                render();
                return;
            }
        }

        selected=null;
        turn=false;

        checkEnd();

        if(!finished){
            render();
            setTimeout(botMove,500);
        }
    }

    function botMove(){

        if(finished) return;

        const captures=[];

        board.forEach((p,i)=>{
            if(p?.side==="bot"){
                moves(i,true).forEach(m=>{
                    captures.push({from:i,m});
                });
            }
        });

        let choice;

        if(captures.length){
            choice=captures[rand(0,captures.length-1)];
        }else{

            const all=[];

            board.forEach((p,i)=>{
                if(p?.side==="bot"){
                    moves(i).forEach(m=>{
                        all.push({from:i,m});
                    });
                }
            });

            if(!all.length){
                finished=true;
                win("Türk Daması");
                return;
            }

            choice=all[rand(0,all.length-1)];
        }

        makeMove(choice.from,choice.m);

        if(
            choice.m.capture!==null &&
            moves(choice.m.to,true).length
        ){
            render();
            setTimeout(botMove,400);
            return;
        }

        turn=true;
        checkEnd();

        if(!finished) render();
    }

    function checkEnd(){

        const player=board.filter(
            p=>p?.side==="player"
        ).length;

        const bot=board.filter(
            p=>p?.side==="bot"
        ).length;

        if(!player){
            finished=true;
            lose("Türk Daması");
            return;
        }

        if(!bot){
            finished=true;
            win("Türk Daması");
            return;
        }
    }

    function render(){

        if(finished) return;

        gameArea.innerHTML=`
            <div class="game-shell">
                <div class="table-game">

                    <div class="table-title">
                        ⚫ TÜRK DAMASI
                    </div>

                    <div class="game-info">
                        Sen: ${
                            board.filter(
                                p=>p?.side==="player"
                            ).length
                        } taş
                        &nbsp; | &nbsp;
                        Rakip: ${
                            board.filter(
                                p=>p?.side==="bot"
                            ).length
                        } taş
                    </div>

                    <div class="dama-board">

                        ${board.map((piece,i)=>`

                            <div
                                class="
                                    dama-cell
                                    ${selected===i?"selected":""}
                                "
                                data-i="${i}">

                                ${
                                    piece
                                    ? `
                                        <div class="
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
                                        ></div>
                                    `
                                    :""
                                }

                            </div>

                        `).join("")}

                    </div>

                    <div class="game-info">
                        ${
                            turn
                            ? (
                                playerCaptureExists()
                                ? "⚠️ ALMA ZORUNLU!"
                                : "Taşını seç ve hedef kareye dokun."
                            )
                            : "Rakip düşünüyor..."
                        }
                    </div>

                </div>
            </div>
        `;

        document.querySelectorAll(".dama-cell")
            .forEach(cell=>{
                cell.addEventListener("click",()=>{
                    clickCell(Number(cell.dataset.i));
                });
            });
    }

    render();
}

/* =========================================================
   BATAK
========================================================= */

function createBatak(){

    let trump=null;
    let target=5;
    let started=false;
    let finished=false;

    const suits=[
        {s:"♠",name:"Maça",color:"black"},
        {s:"♥",name:"Kupa",color:"red"},
        {s:"♦",name:"Karo",color:"red"},
        {s:"♣",name:"Sinek",color:"black"}
    ];

    const ranks=[
        ["2",2],["3",3],["4",4],["5",5],
        ["6",6],["7",7],["8",8],["9",9],
        ["10",10],["J",11],["Q",12],
        ["K",13],["A",14]
    ];

    let deck=[];
    let hand=[];
    let bots=[];
    let trick=[];
    let trickNo=0;
    let myTricks=0;

    function buildDeck(){

        deck=[];

        suits.forEach(suit=>{
            ranks.forEach(([text,value])=>{
                deck.push({
                    suit:suit.s,
                    suitName:suit.name,
                    color:suit.color,
                    text,
                    value
                });
            });
        });

        shuffle(deck);

        hand=deck.splice(0,13);

        bots=[
            {name:botName(),hand:deck.splice(0,13),tricks:0},
            {name:botName(),hand:deck.splice(0,13),tricks:0},
            {name:botName(),hand:deck.splice(0,13),tricks:0}
        ];
    }

    function start(){

        trump=suits[
            Number(
                document.getElementById("batak-trump").value
            )
        ];

        target=Number(
            document.getElementById("batak-target").value
        );

        started=true;
        buildDeck();
        render();
    }

    function legal(card){

        if(!trick.length) return true;

        const lead=trick[0].card.suit;

        const hasLead=hand.some(
            c=>c.suit===lead
        );

        return !hasLead || card.suit===lead;
    }

    function play(index){

        if(finished) return;

        const card=hand[index];

        if(!card) return;

        if(!legal(card)){

            showMessage(
                "🃏",
                "Kural İhlali",
                "Elinde o renkten kart varken başka renkten oynayamazsın."
            );

            return;
        }

        hand.splice(index,1);

        trick.push({
            player:0,
            card
        });

        render();

        setTimeout(botPlays,350);
    }

    function botPlays(){

        if(finished) return;

        bots.forEach((bot,i)=>{

            const lead=trick[0]?.card.suit;

            let legalCards=lead
                ? bot.hand.filter(c=>c.suit===lead)
                : [];

            if(!legalCards.length){
                legalCards=[...bot.hand];
            }

            legalCards.sort(
                (a,b)=>a.value-b.value
            );

            const card=legalCards[0];

            bot.hand.splice(
                bot.hand.indexOf(card),
                1
            );

            trick.push({
                player:i+1,
                card
            });
        });

        resolveTrick();
    }

    function resolveTrick(){

        const lead=trick[0].card.suit;

        let winner=trick[0];

        trick.forEach(play=>{

            const c=play.card;
            const w=winner.card;

            if(
                trump &&
                c.suit===trump.s &&
                w.suit!==trump.s
            ){
                winner=play;
                return;
            }

            if(
                c.suit===w.suit &&
                c.value>w.value
            ){
                winner=play;
            }
        });

        if(winner.player===0){
            myTricks++;
        }else{
            bots[winner.player-1].tricks++;
        }

        trick=[];
        trickNo++;

        if(trickNo>=13){

            finished=true;

            if(myTricks>=target){
                win("Batak");
            }else{
                lose("Batak");
            }

            return;
        }

        render();
    }

    function render(){

        if(finished) return;

        if(!started){

            gameArea.innerHTML=`
                <div class="game-shell">
                    <div class="batak-table">

                        <div class="table-title">
                            🃏 BATAK MASASI
                        </div>

                        <div class="game-info">
                            4 oyuncu • 52 kart • 13 el
                        </div>

                        <div class="game-toolbar">

                            <select
                                class="select-box"
                                id="batak-trump">

                                ${suits.map((s,i)=>`
                                    <option value="${i}">
                                        ${s.s} ${s.name}
                                    </option>
                                `).join("")}

                            </select>

                            <select
                                class="select-box"
                                id="batak-target">

                                ${Array.from(
                                    {length:11},
                                    (_,i)=>`
                                        <option value="${i+3}">
                                            Hedef ${i+3}
                                        </option>
                                    `
                                ).join("")}

                            </select>

                            <button
                                class="game-button"
                                id="batak-start">
                                🃏 Masaya Otur
                            </button>

                        </div>

                    </div>
                </div>
            `;

            document.getElementById("batak-start")
                ?.addEventListener("click",start);

            return;
        }

        gameArea.innerHTML=`
            <div class="game-shell">
                <div class="batak-table">

                    <div class="table-title">
                        🃏 BATAK MASASI
                    </div>

                    <div class="game-info">
                        Koz:
                        <strong>${trump.s} ${trump.name}</strong>
                        &nbsp; | &nbsp;
                        El:
                        <strong>${trickNo}/13</strong>
                        &nbsp; | &nbsp;
                        Sen:
                        <strong>${myTricks}</strong>
                    </div>

                    <div class="batak-seats">

                        ${bots.map(bot=>`
                            <div class="batak-seat">
                                👤 <strong>${bot.name}</strong>
                                <div>${bot.hand.length} kart</div>
                                <div>
                                    ${Array.from(
                                        {length:bot.hand.length},
                                        ()=>`<span class="card-back"></span>`
                                    ).join("")}
                                </div>
                                <small>
                                    Aldığı: ${bot.tricks}
                                </small>
                            </div>
                        `).join("")}

                    </div>

                    <div class="batak-center">

                        ${trick.map(p=>`
                            <div>
                                <small>
                                    ${
                                        p.player===0
                                        ?"Sen"
                                        :bots[p.player-1].name
                                    }
                                </small>

                                <div class="playing-card ${p.card.color}">
                                    ${p.card.text}<br>
                                    ${p.card.suit}
                                </div>
                            </div>
                        `).join("")}

                    </div>

                    <div class="game-info">
                        Senin elin: ${myTricks}
                    </div>

                    <div class="card-hand">

                        ${hand.map((card,i)=>`
                            <div
                                class="playing-card ${card.color}"
                                data-card="${i}">

                                ${card.text}<br>
                                ${card.suit}

                            </div>
                        `).join("")}

                    </div>

                </div>
            </div>
        `;

        document.querySelectorAll("[data-card]")
            .forEach(card=>{
                card.addEventListener("click",()=>{
                    play(Number(card.dataset.card));
                });
            });
    }

    render();
}

/* =========================================================
   BİLARDO
========================================================= */

function createBilardo(){

    let score=0;
    let shots=0;
    let finished=false;

    gameArea.innerHTML=`
        <div class="game-shell">

            <div class="table-game">

                <div class="table-title">
                    🎱 BİLARDO
                </div>

                <div class="game-info">
                    Toplara tıklayarak vuruş yap.
                    6 topu cebe gönder.
                </div>

                <div class="pool-table" id="pool">

                    <div class="pool-pocket" style="left:-10px;top:-10px"></div>
                    <div class="pool-pocket" style="left:50%;top:-10px;transform:translateX(-50%)"></div>
                    <div class="pool-pocket" style="right:-10px;top:-10px"></div>

                    <div class="pool-pocket" style="left:-10px;bottom:-10px"></div>
                    <div class="pool-pocket" style="left:50%;bottom:-10px;transform:translateX(-50%)"></div>
                    <div class="pool-pocket" style="right:-10px;bottom:-10px"></div>

                    ${Array.from({length:8},(_,i)=>`
                        <button
                            class="pool-ball"
                            data-ball="${i}"
                            style="
                                left:${18+(i%4)*18}%;
                                top:${28+Math.floor(i/4)*30}%;
                                background:hsl(${i*43},75%,50%);
                            ">
                        </button>
                    `).join("")}

                </div>

                <div class="game-info">
                    Cebe Giren:
                    <strong id="pool-score">0</strong>
                    &nbsp; | &nbsp;
                    Vuruş:
                    <strong id="pool-shots">0</strong>
                </div>

            </div>
        </div>
    `;

    document.querySelectorAll(".pool-ball")
        .forEach(ball=>{

            ball.addEventListener("click",()=>{

                if(finished||ball.classList.contains("hit")) return;

                shots++;

                /*
                  İsabet olasılığı.
                */

                const success=Math.random()>.28;

                if(success){

                    score++;
                    ball.classList.add("hit");

                    setTimeout(()=>{
                        ball.style.display="none";
                    },430);
                }

                document.getElementById("pool-score").textContent=score;
                document.getElementById("pool-shots").textContent=shots;

                if(score>=6){

                    finished=true;
                    setTimeout(
                        ()=>win("Bilardo"),
                        300
                    );
                }
            });
        });
}

/* =========================================================
   MAHJONG
========================================================= */

function createMahjong(){

    const values=[
        "🀄","🌸","🎋","🐉",
        "🍀","⭐","🔴","🔵",
        "🟢","🟡","🟣","🐼"
    ];

    let tiles=shuffle([...values,...values]);
    let selected=[];
    let removed=0;

    function render(){

        gameArea.innerHTML=`
            <div class="game-shell">

                <div class="game-info">
                    🀄 Aynı iki taşı bul.
                </div>

                <div class="memory-grid">

                    ${tiles.map((tile,i)=>{

                        if(tile===null){
                            return "<div></div>";
                        }

                        return `
                            <button
                                class="memory-card open"
                                data-i="${i}">
                                ${tile}
                            </button>
                        `;
                    }).join("")}

                </div>

            </div>
        `;

        document.querySelectorAll("[data-i]")
            .forEach(btn=>{
                btn.addEventListener("click",()=>{
                    const i=Number(btn.dataset.i);

                    if(selected.includes(i)) return;

                    selected.push(i);

                    if(selected.length===2){

                        const [a,b]=selected;

                        if(tiles[a]===tiles[b]){

                            tiles[a]=null;
                            tiles[b]=null;
                            removed+=2;
                        }

                        selected=[];

                        render();

                        if(removed===24){
                            win("Mahjong");
                        }

                    }
                });
            });
    }

    render();
}

/* =========================================================
   SUDOKU
========================================================= */

function createSudoku(){

    const solved=[
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

    const removed=new Set();

    while(removed.size<42){
        removed.add(rand(0,80));
    }

    removed.forEach(i=>{
        puzzle[i]=0;
    });

    gameArea.innerHTML=`
        <div class="game-shell">

            <div class="game-info">
                Boş kareleri 1-9 arası sayılarla doldur.
            </div>

            <div class="sudoku">

                ${puzzle.map((v,i)=>`

                    <div
                        class="sudoku-cell ${v?"fixed":""}"
                        ${
                            v
                            ? ""
                            : `contenteditable="true" data-i="${i}"`
                        }>
                        ${v||""}
                    </div>

                `).join("")}

            </div>

            <div class="game-toolbar">
                <button
                    class="game-button"
                    id="sudoku-check">
                    🔢 Kontrol Et
                </button>
            </div>

        </div>
    `;

    document.getElementById("sudoku-check")
        ?.addEventListener("click",()=>{

            const cells=[
                ...document.querySelectorAll(".sudoku-cell")
            ];

            const values=cells.map(c=>
                Number(c.textContent.trim())
            );

            if(values.every((v,i)=>v===solved[i])){
                win("Sudoku");
            }else{
                showMessage(
                    "🔢",
                    "Henüz Değil",
                    "Bazı karelerde hata var."
                );
            }
        });
}

/* =========================================================
   BUBBLE
========================================================= */

function createBubble(){

    let score=0;

    gameArea.innerHTML=`
        <div class="game-shell">

            <div class="game-info">
                15 baloncuk patlat.
            </div>

            <div class="bubbles" id="bubbles"></div>

        </div>
    `;

    const colors=[
        "#e53935","#2196f3","#4caf50",
        "#ffca28","#9c27b0"
    ];

    const grid=document.getElementById("bubbles");

    for(let i=0;i<40;i++){

        const b=document.createElement("button");

        b.className="bubble";
        b.style.background=
            colors[rand(0,colors.length-1)];

        b.addEventListener("click",()=>{

            if(b.disabled) return;

            b.disabled=true;
            b.style.visibility="hidden";

            score++;

            if(score>=15){
                win("Bubble Shooter");
            }
        });

        grid.appendChild(b);
    }
}

/* =========================================================
   ARABA
========================================================= */

function createRace(){

    let x=45;
    let score=0;
    let finished=false;

    gameArea.innerHTML=`
        <div class="game-shell">

            <div class="game-info">
                Rakiplardan kaç. 20 puana ulaş.
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

                <button class="game-button" id="race-left">
                    ◀ Sol
                </button>

                <button class="game-button" id="race-right">
                    Sağ ▶
                </button>

            </div>

        </div>
    `;

    const player=document.getElementById("race-player");
    const enemy=document.getElementById("race-enemy");

    function move(n){
        x=Math.max(5,Math.min(85,x+n));
        player.style.left=x+"%";
    }

    document.getElementById("race-left")
        .addEventListener("click",()=>move(-6));

    document.getElementById("race-right")
        .addEventListener("click",()=>move(6));

    const timer=setInterval(()=>{

        if(finished){
            clearInterval(timer);
            return;
        }

        let y=parseFloat(enemy.style.top)||-80;

        y+=5;

        if(y>420){

            y=-80;
            enemy.style.left=rand(8,80)+"%";
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
   BLOCK
========================================================= */

function createBlock(){

    const cells=Array(64).fill(false);
    let score=0;

    function render(){

        gameArea.innerHTML=`
            <div class="game-shell">

                <div class="game-info">
                    Satırları doldur.
                    Temizlenen satır: ${score}
                </div>

                <div class="block-grid">
                    ${cells.map((v,i)=>`
                        <div
                            class="block-cell ${v?"filled":""}"
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

        document.getElementById("block-add")
            ?.addEventListener("click",()=>{

                let free=cells
                    .map((v,i)=>v?null:i)
                    .filter(v=>v!==null);

                for(let i=0;i<4&&free.length;i++){

                    const p=free.splice(
                        rand(0,free.length-1),
                        1
                    )[0];

                    cells[p]=true;
                }

                for(let r=0;r<8;r++){

                    if(
                        cells.slice(r*8,r*8+8)
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
            });
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
                Puan: <strong id="archery-score">0</strong>
            </div>

        </div>
    `;

    const target=document.getElementById("target");

    function move(){
        target.style.left=rand(5,85)+"%";
        target.style.top=rand(5,75)+"%";
    }

    target.addEventListener("click",()=>{

        score++;

        document.getElementById(
            "archery-score"
        ).textContent=score;

        move();

        if(score>=5){
            win("Okçuluk");
        }
    });

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

    const cards=shuffle([...values]);

    let open=[];
    let matched=[];
    let locked=false;

    function render(){

        gameArea.innerHTML=`
            <div class="game-shell">

                <div class="game-info">
                    🧠 ${title} - Tüm çiftleri bul.
                </div>

                <div class="memory-grid">

                    ${cards.map((value,i)=>`

                        <button
                            class="memory-card ${
                                open.includes(i)||
                                matched.includes(i)
                                ?"open":""
                            }"
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

        document.querySelectorAll(".memory-card")
            .forEach(btn=>{

                btn.addEventListener("click",()=>{

                    const i=Number(btn.dataset.i);

                    if(
                        locked||
                        matched.includes(i)||
                        open.includes(i)
                    ) return;

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
                });
            });
    }

    render();
}

/* =========================================================
   YILAN
========================================================= */

function createSnake(){

    const size=20;

    let snake=[210,211,212];
    let dir=-1;
    let food=100;
    let score=0;
    let running=true;

    gameArea.innerHTML=`
        <div class="game-shell">

            <div class="game-info">
                🐍 Yılanı ok tuşlarıyla yönet.
                Skor: <strong id="snake-score">0</strong>
            </div>

            <div
                class="snake-board"
                id="snake-board">
            </div>

        </div>
    `;

    const board=document.getElementById("snake-board");

    function render(){

        board.innerHTML="";

        for(let i=0;i<400;i++){

            const cell=document.createElement("div");

            cell.className="snake-cell";

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

        if(e.key==="ArrowUp"&&dir!==20) dir=-20;
        if(e.key==="ArrowDown"&&dir!==-20) dir=20;
        if(e.key==="ArrowLeft"&&dir!==1) dir=-1;
        if(e.key==="ArrowRight"&&dir!==-1) dir=1;
    };

    document.addEventListener("keydown",key);

    const timer=setInterval(()=>{

        if(!running){
            clearInterval(timer);
            document.removeEventListener("keydown",key);
            return;
        }

        const head=snake[snake.length-1];
        const next=head+dir;

        const row=Math.floor(head/20);
        const nextRow=Math.floor(next/20);

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
                <strong id="basket-score">0</strong>
                &nbsp; | &nbsp;
                Atış:
                <strong id="basket-attempts">0</strong>
            </div>

        </div>
    `;

    const ball=document.getElementById("basket-ball");

    ball.addEventListener("click",()=>{

        if(finished) return;

        attempts++;

        const success=Math.random()>.4;

        if(success){

            score++;

            ball.style.transform=
                "translate(-50%,-230px)";

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

        if(score>=5){

            finished=true;
            win("Basket Atışı");
            return;
        }

        if(attempts>=10){

            finished=true;
            lose("Basket Atışı");
        }
    });
}

/* =========================================================
   REKLAM BONUSU
========================================================= */

adButton?.addEventListener("click",()=>{

    changeScore(AD_REWARD);

    showMessage(
        "📺",
        "Bonus",
        "Deneme reklam bonusu olarak +100 puan eklendi."
    );
});

/* =========================================================
   ESC
========================================================= */

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        closeGame();
        hideMessage();
    }
});

/* =========================================================
   BAŞLAT
========================================================= */

updateScore();

console.log(
    "OynaKazan oyun motoru aktif:",
    games.length,
    "oyun"
);

});
