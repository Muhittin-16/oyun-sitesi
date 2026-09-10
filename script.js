/* =========================================================
   OYUN DÜNYASI / OYNAKAZAN
   15 OYUN - 1/100 SEVİYE SİSTEMİ
   GELİŞMİŞ OYUN MOTORU
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
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

const gamesContainer =
    document.getElementById("games-container");

const gameModal =
    document.getElementById("game-modal");

const gameArea =
    document.getElementById("game-area");

const modalTitle =
    document.getElementById("modal-game-title");

const modalCategory =
    document.getElementById("modal-category");

const closeModalBtn =
    document.getElementById("close-modal-btn");

const userScore =
    document.getElementById("user-score");

const messageModal =
    document.getElementById("message-modal");

const messageTitle =
    document.getElementById("message-title");

const messageText =
    document.getElementById("message-text");

const messageClose =
    document.getElementById("message-close");

const watchAdBtn =
    document.getElementById("watch-ad-btn");

/* =========================================================
   CSS
   ========================================================= */

const style = document.createElement("style");

style.textContent = `
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
}

.game-info{
    display:flex;
    gap:12px;
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

/* =========================================================
   GENEL OYUN ALANI
   ========================================================= */

.board{
    position:relative;
    background:#116b45;
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

/* =========================================================
   OKEY
   ========================================================= */

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
    background:rgba(0,0,0,.25);
    border-radius:12px;
    padding:10px;
    text-align:center;
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
    min-height:130px;
}

.okey-pile{
    width:70px;
    height:95px;
    border-radius:9px;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f2eadc;
    color:#222;
    font-size:30px;
    font-weight:800;
    box-shadow:0 5px 12px #0007;
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
    font-size:18px;
    font-weight:800;
    cursor:pointer;
    box-shadow:0 3px 6px #0005;
    user-select:none;
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

/* =========================================================
   TAVLA
   ========================================================= */

.backgammon{
    background:#613a1f;
}

.tavla-board{
    display:grid;
    grid-template-columns:1fr 70px 1fr;
    min-height:480px;
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
    min-height:205px;
    border-radius:4px;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
}

.tavla-point:nth-child(even){
    background:linear-gradient(180deg,#d2a166,#74431f);
}

.tavla-point.bottom{
    justify-content:flex-end;
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
    gap:15px;
}

.dice{
    font-size:44px;
    font-weight:900;
    background:#fff;
    color:#111;
    border-radius:10px;
    padding:8px 15px;
}

/* =========================================================
   DAMA
   ========================================================= */

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
}

.dama-cell.light{
    background:#e4c79a;
}

.dama-cell.dark{
    background:#6e4025;
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

.dama-piece.king::after{
    content:"♛";
    font-size:22px;
    color:#ffd166;
}

/* =========================================================
   BATAK
   ========================================================= */

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

.card-hand{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:5px;
    padding:12px;
    background:rgba(0,0,0,.2);
    border-radius:12px;
}

/* =========================================================
   BİLARDO
   ========================================================= */

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

/* =========================================================
   DİĞER OYUNLAR
   ========================================================= */

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

/* =========================================================
   MOBİL
   ========================================================= */

@media(max-width:700px){

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
}
`;

document.head.appendChild(style);

/* =========================================================
   OYUNCU SİSTEMİ
   ========================================================= */

let score =
    Number(localStorage.getItem(SCORE_KEY));

if (!Number.isFinite(score) || score <= 0)
    score = START_SCORE;

let xp =
    Number(localStorage.getItem(XP_KEY)) || 0;

let level =
    Number(localStorage.getItem(LEVEL_KEY)) || 1;

let played =
    Number(localStorage.getItem(PLAYED_KEY)) || 0;

function xpNeeded(lv){
    return 100 + ((lv - 1) * 25);
}

function updateLevel(){
    while(level < 100 && xp >= xpNeeded(level)){
        xp -= xpNeeded(level);
        level++;
    }

    localStorage.setItem(XP_KEY,xp);
    localStorage.setItem(LEVEL_KEY,level);
}

function addXP(amount){
    xp += amount;
    updateLevel();
    updateScoreUI();
}

function updateScoreUI(){

    if(userScore)
        userScore.textContent = score;

    localStorage.setItem(SCORE_KEY,score);
    localStorage.setItem(XP_KEY,xp);
    localStorage.setItem(LEVEL_KEY,level);
    localStorage.setItem(PLAYED_KEY,played);

    const stat =
        JSON.parse(localStorage.getItem(STATS_KEY) || "{}");

    stat.best = Math.max(stat.best || 0,score);
    stat.played = played;
    stat.coins = score;
    stat.xp = xp;
    stat.level = level;

    localStorage.setItem(STATS_KEY,JSON.stringify(stat));
}

function changeScore(amount){

    score += amount;

    if(score < 0)
        score = 0;

    updateScoreUI();
}

function startPaidGame(game){

    const paid =
        ["okey","tavla","dama","batak","bilardo"]
        .includes(game.type);

    if(!paid)
        return true;

    if(score < ENTRY_COST){

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

function winGame(points=100){

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

function loseGame(){

    addXP(15);
    played++;

    updateScoreUI();

    showMessage(
        "Oyun Bitti",
        "+15 XP kazandın. Tekrar dene!"
    );
}

/* =========================================================
   MESAJ
   ========================================================= */

function showMessage(title,text){

    if(messageTitle)
        messageTitle.textContent = title;

    if(messageText)
        messageText.textContent = text;

    if(messageModal)
        messageModal.classList.add("active");
}

function hideMessage(){

    if(messageModal)
        messageModal.classList.remove("active");
}

if(messageClose)
    messageClose.addEventListener("click",hideMessage);

/* =========================================================
   YARDIMCILAR
   ========================================================= */

function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]] =
        [array[j],array[i]];
    }

    return array;
}

function botName(i){

    const names=[
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

function el(tag,className,text){

    const e=document.createElement(tag);

    if(className)
        e.className=className;

    if(text !== undefined)
        e.textContent=text;

    return e;
}

/* =========================================================
   OYUN LİSTESİ
   ========================================================= */

const games=[

{
 id:1,
 title:"101 Okey",
 type:"okey",
 category:"Masa Oyunları"
},

{
 id:2,
 title:"Klasik Tavla",
 type:"tavla",
 category:"Masa Oyunları"
},

{
 id:3,
 title:"Türk Daması",
 type:"dama",
 category:"Masa Oyunları"
},

{
 id:4,
 title:"Batak",
 type:"batak",
 category:"Kart Oyunları"
},

{
 id:5,
 title:"Bilardo",
 type:"bilardo",
 category:"Spor"
},

{
 id:6,
 title:"Mahjong",
 type:"mahjong",
 category:"Zeka Oyunları"
},

{
 id:7,
 title:"Sudoku",
 type:"sudoku",
 category:"Zeka Oyunları"
},

{
 id:8,
 title:"Bubble Shooter",
 type:"bubble",
 category:"Eğlence"
},

{
 id:9,
 title:"Araba Yarışı",
 type:"race",
 category:"Yarış"
},

{
 id:10,
 title:"Block Puzzle",
 type:"block",
 category:"Zeka Oyunları"
},

{
 id:11,
 title:"Okçuluk",
 type:"archery",
 category:"Beceri"
},

{
 id:12,
 title:"Zeka Eşleştirme",
 type:"memory",
 category:"Zeka Oyunları"
},

{
 id:13,
 title:"Hafıza Oyunu",
 type:"memory2",
 category:"Zeka Oyunları"
},

{
 id:14,
 title:"Yılan Oyunu",
 type:"snake",
 category:"Arcade"
},

{
 id:15,
 title:"Basket Atışı",
 type:"basket",
 category:"Spor"
}

];

/* =========================================================
   OYUN KARTLARI
   ========================================================= */

function renderGames(filter="Tümü"){

    if(!gamesContainer)
        return;

    gamesContainer.innerHTML="";

    const list =
        filter==="Tümü"
        ? games
        : games.filter(g=>g.category===filter);

    list.forEach(game=>{

        const card=document.createElement("div");

        card.className="game-card";

        card.innerHTML=`
            <div class="game-card-content">
                <h3>${game.title}</h3>
                <p>${game.category}</p>
                <button class="game-button play-game"
                    data-id="${game.id}">
                    🎮 Oyna
                </button>
            </div>
        `;

        gamesContainer.appendChild(card);
    });

    gamesContainer
        .querySelectorAll(".play-game")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                const game =
                    games.find(
                        g=>g.id===Number(btn.dataset.id)
                    );

                if(game)
                    openGame(game);
            });
        });
}

renderGames();

/* =========================================================
   KATEGORİLER
   ========================================================= */

document
.querySelectorAll(".cat-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .querySelectorAll(".cat-btn")
        .forEach(x=>x.classList.remove("active"));

        btn.classList.add("active");

        renderGames(
            btn.dataset.filter ||
            btn.textContent.trim()
        );
    });
});

/* =========================================================
   OYUN AÇ
   ========================================================= */

let currentCleanup=null;

function openGame(game){

    if(!startPaidGame(game))
        return;

    if(currentCleanup)
        currentCleanup();

    if(gameModal)
        gameModal.classList.add("active");

    if(modalTitle)
        modalTitle.textContent=game.title;

    if(modalCategory)
        modalCategory.textContent =
            game.category +
            " • Seviye " +
            level +
            "/100";

    if(gameArea)
        gameArea.innerHTML="";

    switch(game.type){

        case "okey":
            currentCleanup=createOkey();
            break;

        case "tavla":
            currentCleanup=createTavla();
            break;

        case "dama":
            currentCleanup=createDama();
            break;

        case "batak":
            currentCleanup=createBatak();
            break;

        case "bilardo":
            currentCleanup=createBilardo();
            break;

        case "mahjong":
            currentCleanup=createMahjong();
            break;

        case "sudoku":
            currentCleanup=createSudoku();
            break;

        case "bubble":
            currentCleanup=createBubble();
            break;

        case "race":
            currentCleanup=createRace();
            break;

        case "block":
            currentCleanup=createBlock();
            break;

        case "archery":
            currentCleanup=createArchery();
            break;

        case "memory":
            currentCleanup=createMemory(false);
            break;

        case "memory2":
            currentCleanup=createMemory(true);
            break;

        case "snake":
            currentCleanup=createSnake();
            break;

        case "basket":
            currentCleanup=createBasket();
            break;
    }
}

function closeGame(){

    if(currentCleanup)
        currentCleanup();

    currentCleanup=null;

    if(gameArea)
        gameArea.innerHTML="";

    if(gameModal)
        gameModal.classList.remove("active");
}

if(closeModalBtn)
    closeModalBtn.addEventListener("click",closeGame);

/* =========================================================
   101 OKEY
   ========================================================= */

function createOkey(){

    let stopped=false;
    let turn=0;

    const root=el("div","game-shell");
    const board=el("div","board okey-table");

    root.appendChild(board);
    gameArea.appendChild(root);

    const toolbar=el("div","game-toolbar");

    const status=el(
        "div",
        "game-info"
    );

    const levelBox=el(
        "div",
        "info-box",
        "Seviye "+level+"/100"
    );

    const xpBox=el(
        "div",
        "info-box",
        "XP "+xp
    );

    status.append(levelBox,xpBox);

    const newBtn=el(
        "button",
        "game-button",
        "Yeni El"
    );

    toolbar.append(status,newBtn);
    root.insertBefore(toolbar,board);

    const title=el(
        "div",
        "table-title",
        "🀄 101 Okey • 4 Kişilik Masa"
    );

    board.appendChild(title);

    const opponents=el("div","okey-opponents");

    const opponentEls=[];

    for(let i=0;i<3;i++){

        const p=el("div","okey-player");

        p.innerHTML=
            `<strong>${botName(i)}</strong>
             <div class="okey-hand-count">
             21 taş
             </div>`;

        opponents.push(p);
        opponentEls.push(p);

        opponents.appendChild(p);
    }

    board.appendChild(opponents);

    const center=el("div","okey-center");

    const deckEl=el(
        "div",
        "okey-pile",
        "🀄"
    );

    const indicatorEl=el(
        "div",
        "okey-pile"
    );

    const discardEl=el(
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

    const meldTitle=el(
        "div",
        "",
        "Masadaki Açılmış Per / Seriler"
    );

    board.appendChild(meldTitle);

    const meldsEl=el("div","okey-melds");

    board.appendChild(meldsEl);

    const rack=el("div","okey-rack");

    board.appendChild(rack);

    const controls=el(
        "div",
        "game-toolbar"
    );

    const drawBtn=el(
        "button",
        "game-button",
        "🀄 Taş Çek"
    );

    const discardBtn=el(
        "button",
        "game-button",
        "📤 Taş At"
    );

    const openBtn=el(
        "button",
        "game-button",
        "101 Aç"
    );

    controls.append(
        drawBtn,
        discardBtn,
        openBtn
    );

    root.appendChild(controls);

    let deck=[];
    let hand=[];
    let discard=[];
    let tableMelds=[];
    let selected=new Set();
    let hasOpened=false;
    let drawnThisTurn=false;
    let gameOver=false;

    let indicator=null;
    let okeyNumber=null;

    function makeDeck(){

        const d=[];

        const colors=[
            {name:"red",symbol:"♥"},
            {name:"blue",symbol:"◆"},
            {name:"black",symbol:"♠"},
            {name:"green",symbol:"♣"}
        ];

        for(const color of colors){

            for(let copy=0;copy<2;copy++){

                for(let value=1;value<=13;value++){

                    d.push({
                        color:color.name,
                        symbol:color.symbol,
                        value,
                        id:
                          color.name+
                          "-" +
                          value+
                          "-" +
                          copy
                    });
                }
            }
        }

        d.push(
            {
                fake:true,
                value:0,
                id:"fake1"
            },
            {
                fake:true,
                value:0,
                id:"fake2"
            }
        );

        return shuffle(d);
    }

    function tileValue(tile){

        if(tile.fake)
            return okeyNumber || 1;

        if(tile.value===okeyNumber)
            return 11;

        return tile.value;
    }

    function tileText(tile){

        if(tile.fake)
            return "★";

        return tile.symbol + tile.value;
    }

    function sortHand(){

        hand.sort((a,b)=>{

            if(a.fake && !b.fake)
                return 1;

            if(!a.fake && b.fake)
                return -1;

            if(a.color!==b.color)
                return a.color.localeCompare(b.color);

            return a.value-b.value;
        });
    }

    function render(){

        rack.innerHTML="";

        sortHand();

        hand.forEach((tile,index)=>{

            const t=el(
                "div",
                "okey-tile okey-"+(tile.color||"black"),
                tileText(tile)
            );

            if(selected.has(index))
                t.classList.add("selected");

            t.addEventListener("click",()=>{

                if(gameOver || turn!==0)
                    return;

                if(selected.has(index))
                    selected.delete(index);
                else
                    selected.add(index);

                render();
            });

            rack.appendChild(t);
        });

        indicatorEl.textContent =
            indicator ? tileText(indicator) : "—";

        discardEl.textContent =
            discard.length
            ? tileText(discard[discard.length-1])
            : "—";

        opponentEls.forEach((p,i)=>{

            p.querySelector(".okey-hand-count")
             .textContent =
                (i===0?21:21) +
                " taş";
        });

        drawBtn.disabled =
            gameOver ||
            turn!==0 ||
            drawnThisTurn;

        discardBtn.disabled =
            gameOver ||
            turn!==0 ||
            !drawnThisTurn ||
            selected.size!==1;

        openBtn.disabled =
            gameOver ||
            turn!==0 ||
            selected.size===0;
    }

    function isSet(tiles){

        if(tiles.length<3 || tiles.length>4)
            return false;

        const normal=tiles.filter(t=>!t.fake);

        const values=
            normal.map(t=>t.value);

        const wilds=
            tiles.length-normal.length;

        const target=
            values.length
            ? values[0]
            : null;

        if(target===null)
            return true;

        if(values.some(v=>v!==target))
            return false;

        const colors=
            new Set(
                normal.map(t=>t.color)
            );

        return colors.size===normal.length-wilds;
    }

    function isRun(tiles){

        if(tiles.length<3)
            return false;

        const normals=
            tiles
            .filter(t=>!t.fake)
            .sort((a,b)=>a.value-b.value);

        if(!normals.length)
            return true;

        const color=normals[0].color;

        if(normals.some(t=>t.color!==color))
            return false;

        let wilds=
            tiles.length-normals.length;

        let previous=normals[0].value;

        for(let i=1;i<normals.length;i++){

            const diff=
                normals[i].value-previous;

            if(diff===1){
                previous=normals[i].value;
                continue;
            }

            if(diff>1){
                wilds-=diff-1;
                previous=normals[i].value;
            }

            if(diff<=0)
                return false;
        }

        return wilds>=0;
    }

    function validMeld(tiles){

        return isSet(tiles) || isRun(tiles);
    }

    function selectedTiles(){

        return [...selected]
            .sort((a,b)=>b-a)
            .map(i=>hand[i]);
    }

    function removeSelected(){

        [...selected]
        .sort((a,b)=>b-a)
        .forEach(i=>{

            tableMelds.push([hand[i]]);
            hand.splice(i,1);
        });

        selected.clear();
    }

    function draw(){

        if(turn!==0 ||
           drawnThisTurn ||
           gameOver)
            return;

        if(!deck.length){

            showMessage(
                "Deste Bitti",
                "Deste tükendi."
            );

            return;
        }

        hand.push(deck.pop());
        drawnThisTurn=true;

        render();
    }

    function discardTile(){

        if(turn!==0 ||
           !drawnThisTurn ||
           selected.size!==1)
            return;

        const index=[...selected][0];

        const tile=hand.splice(index,1)[0];

        discard.push(tile);

        selected.clear();
        drawnThisTurn=false;

        render();

        botTurns();
    }

    function openSelected(){

        if(turn!==0 ||
           gameOver ||
           selected.size<3)
            return;

        const tiles=selectedTiles();

        const total=
            tiles.reduce(
                (sum,t)=>sum+tileValue(t),
                0
            );

        if(!hasOpened && total<101){

            showMessage(
                "101 Açılmadı",
                "Seçtiğin taşların toplamı en az 101 olmalı."
            );

            return;
        }

        if(!validMeld(tiles)){

            showMessage(
                "Geçersiz Per",
                "Taşları seri veya aynı sayı farklı renk olacak şekilde seç."
            );

            return;
        }

        const indexes=
            [...selected]
            .sort((a,b)=>b-a);

        const meld=
            indexes.map(i=>hand[i]);

        indexes.forEach(i=>hand.splice(i,1));

        tableMelds.push(meld);

        selected.clear();

        if(!hasOpened)
            hasOpened=true;

        render();

        if(hand.length===0){

            gameOver=true;

            winGame(300);

            return;
        }
    }

    function botTurns(){

        if(gameOver)
            return;

        turn=1;

        setTimeout(()=>{

            if(stopped || gameOver)
                return;

            for(let i=0;i<3;i++){

                if(deck.length)
                    deck.pop();
            }

            turn=0;

            render();

        },650);
    }

    function newGame(){

        gameOver=false;
        turn=0;
        hasOpened=false;
        drawnThisTurn=false;
        selected.clear();
        tableMelds=[];
        discard=[];
        deck=makeDeck();

        indicator=deck.pop();

        if(indicator.fake)
            indicator=deck.pop();

        okeyNumber=
            indicator.value===13
            ? 1
            : indicator.value+1;

        for(let i=0;i<22;i++)
            hand.push(deck.pop());

        render();
    }

    drawBtn.addEventListener("click",draw);
    discardBtn.addEventListener("click",discardTile);
    openBtn.addEventListener("click",openSelected);
    newBtn.addEventListener("click",()=>{
        hand=[];
        newGame();
    });

    hand=[];
    newGame();

    return ()=>{
        stopped=true;
    };
}

/* =========================================================
   TAVLA
   ========================================================= */

function createTavla(){

    let stopped=false;

    const root=el("div","game-shell");
    gameArea.appendChild(root);

    const toolbar=el("div","game-toolbar");

    const info=el(
        "div",
        "game-info"
    );

    const status=el(
        "div",
        "info-box",
        "Sıra: Sen"
    );

    const diceBox=el(
        "div",
        "info-box",
        "Zarlar: —"
    );

    info.append(status,diceBox);

    const rollBtn=el(
        "button",
        "game-button",
        "🎲 Zar At"
    );

    toolbar.append(info,rollBtn);
    root.appendChild(toolbar);

    const board=el(
        "div",
        "tavla-board backgammon"
    );

    root.appendChild(board);

    const left=el("div","tavla-half");
    const middle=el("div","tavla-middle");
    const right=el("div","tavla-half");

    board.append(left,middle,right);

    const dice=el(
        "div",
        "dice",
        "—"
    );

    middle.appendChild(dice);

    const barWhite=el(
        "div",
        "info-box",
        "Bara: 0"
    );

    const barBlack=el(
        "div",
        "info-box",
        "Rakip: 0"
    );

    middle.append(barWhite,barBlack);

    const points=Array(24).fill(0);

    /*
       Pozitif = oyuncu
       Negatif = rakip
    */

    points[0]=2;
    points[11]=5;
    points[16]=3;
    points[18]=5;

    points[23]=-2;
    points[12]=-5;
    points[7]=-3;
    points[5]=-5;

    let barPlayer=0;
    let barBot=0;
    let bornePlayer=0;
    let borneBot=0;

    let diceValues=[];
    let rolled=false;
    let selectedFrom=null;
    let gameOver=false;

    function renderPoint(point,index){

        point.innerHTML="";

        const count=Math.abs(points[index]);

        const isPlayer=points[index]>0;

        for(let i=0;i<count;i++){

            const c=el(
                "div",
                "checker "+(
                    isPlayer
                    ? "white"
                    : "black"
                )
            );

            point.appendChild(c);
        }
    }

    function render(){

        left.innerHTML="";
        right.innerHTML="";

        /*
          Üst 12 nokta
        */

        for(let i=11;i>=6;i--){

            const p=el("div","tavla-point");
            renderPoint(p,i);

            p.addEventListener(
                "click",
                ()=>selectPoint(i)
            );

            left.appendChild(p);
        }

        for(let i=5;i>=0;i--){

            const p=el(
                "div",
                "tavla-point bottom"
            );

            renderPoint(p,i);

            p.addEventListener(
                "click",
                ()=>selectPoint(i)
            );

            right.appendChild(p);
        }

        /*
          Alt tarafı ayrıca oluşturmak yerine
          aynı noktaları ikinci satırda göstermek
          için CSS ile görünürlük korunuyor.
        */

        diceBox.textContent =
            "Zarlar: "+
            (diceValues.length
             ? diceValues.join(" - ")
             : "—");

        barWhite.textContent=
            "Bara: "+barPlayer;

        barBlack.textContent=
            "Rakip Bara: "+barBot;
    }

    function homeRange(index){

        return index>=0 && index<=5;
    }

    function allPlayerHome(){

        if(barPlayer>0)
            return false;

        for(let i=6;i<24;i++){

            if(points[i]>0)
                return false;
        }

        return true;
    }

    function distance(from,to){

        return to-from;
    }

    function legalMove(from,to,die){

        if(points[from]<=0)
            return false;

        if(barPlayer>0 && from!==-1)
            return false;

        const target=
            to>=0 && to<24
            ? points[to]
            : 0;

        if(to>=24){

            if(!allPlayerHome())
                return false;

            return from+die>=24;
        }

        if(target<-1)
            return false;

        return distance(from,to)===die;
    }

    function selectPoint(index){

        if(gameOver || !rolled)
            return;

        if(selectedFrom===null){

            if(points[index]<=0)
                return;

            selectedFrom=index;

            status.textContent=
                "Hedef noktayı seç";
            return;
        }

        const from=selectedFrom;

        const die=
            index-from;

        if(!diceValues.includes(die)){

            status.textContent=
                "Bu zar ile oynayamazsın";

            selectedFrom=null;
            return;
        }

        if(!legalMove(from,index,die)){

            status.textContent=
                "Geçersiz hamle";

            selectedFrom=null;
            return;
        }

        move(from,index,die);
    }

    function move(from,to,die){

        points[from]--;

        if(to<0)
            return;

        if(points[to]===-1){

            points[to]=1;
            barBot++;
        }
        else{
            points[to]++;
        }

        diceValues.splice(
            diceValues.indexOf(die),
            1
        );

        selectedFrom=null;

        if(diceValues.length===0){

            rolled=false;

            botTurn();

        }else{

            status.textContent=
                "Bir zar daha kullan";
        }

        render();

        if(bornePlayer>=15)
            finish(true);
    }

    function roll(){

        if(rolled || gameOver)
            return;

        let a=rand(1,6);
        let b=rand(1,6);

        diceValues=
            a===b
            ? [a,a,a,a]
            : [a,b];

        rolled=true;

        dice.textContent=
            a+" • "+b;

        status.textContent=
            "Taşını seç";

        render();

        /*
          Bar'daki taş varsa önce giriş zorunluluğu.
        */

        if(barPlayer>0){

            status.textContent=
                "Önce bardaki taşı oyuna sokmalısın";
        }
    }

    function botTurn(){

        if(stopped || gameOver)
            return;

        status.textContent="Rakip düşünüyor...";

        setTimeout(()=>{

            if(stopped || gameOver)
                return;

            /*
              Basit ama gerçek kurallara uygun
              rakip hamlesi.
            */

            let moved=false;

            for(let d=0;d<24;d++){

                if(points[d]<0){

                    for(const die of [1,2,3,4,5,6]){

                        const to=d-die;

                        if(
                            to>=0 &&
                            legalBotMove(d,to,die)
                        ){

                            points[d]++;

                            if(points[to]===1)
                                barPlayer++;
                            else
                                points[to]--;

                            moved=true;
                            break;
                        }
                    }
                }

                if(moved)
                    break;
            }

            status.textContent="Senin sıran";

        },800);
    }

    function legalBotMove(from,to,die){

        if(points[from]>=0)
            return false;

        if(to<0)
            return true;

        return points[to]>=-1;
    }

    function finish(playerWon){

        if(gameOver)
            return;

        gameOver=true;

        if(playerWon)
            winGame(350);
        else
            loseGame();
    }

    rollBtn.addEventListener("click",roll);

    render();

    return ()=>{
        stopped=true;
    };
}

/* =========================================================
   TÜRK DAMASI
   ========================================================= */

function createDama(){

    let stopped=false;

    const root=el("div","game-shell");

    const toolbar=el(
        "div",
        "game-toolbar"
    );

    const status=el(
        "div",
        "info-box",
        "Senin sıran"
    );

    const newBtn=el(
        "button",
        "game-button",
        "Yeni Oyun"
    );

    toolbar.append(status,newBtn);

    root.appendChild(toolbar);

    const board=el(
        "div",
        "dama-board"
    );

    root.appendChild(board);
    gameArea.appendChild(root);

    let cells=[];
    let selected=null;
    let mustContinue=false;
    let gameOver=false;

    function initial(){

        cells=Array.from(
            {length:8},
            ()=>Array(8).fill(null)
        );

        /*
          Türk damasında başlangıç
        */

        for(let r=0;r<2;r++)
            for(let c=0;c<8;c++)
                cells[r][c]={
                    player:"bot",
                    king:false
                };

        for(let r=5;r<8;r++)
            for(let c=0;c<8;c++)
                cells[r][c]={
                    player:"human",
                    king:false
                };

        selected=null;
        mustContinue=false;
        gameOver=false;

        status.textContent="Senin sıran";

        render();
    }

    function inside(r,c){

        return r>=0 &&
               r<8 &&
               c>=0 &&
               c<8;
    }

    function capturesFor(r,c){

        const piece=cells[r][c];

        if(!piece)
            return [];

        const dirs=[
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        ];

        const result=[];

        for(const [dr,dc] of dirs){

            const r1=r+dr;
            const c1=c+dc;

            const r2=r+dr*2;
            const c2=c+dc*2;

            if(
                inside(r2,c2) &&
                cells[r1] &&
                cells[r1][c1] &&
                cells[r1][c1].player!==piece.player &&
                !cells[r2][c2]
            ){

                result.push({
                    from:[r,c],
                    over:[r1,c1],
                    to:[r2,c2]
                });
            }
        }

        return result;
    }

    function hasAnyCapture(player){

        for(let r=0;r<8;r++)
            for(let c=0;c<8;c++)
                if(
                    cells[r][c] &&
                    cells[r][c].player===player &&
                    capturesFor(r,c).length
                )
                    return true;

        return false;
    }

    function legalMoves(r,c){

        const piece=cells[r][c];

        if(!piece)
            return [];

        const capture=capturesFor(r,c);

        if(capture.length)
            return capture;

        if(hasAnyCapture(piece.player))
            return [];

        const result=[];

        const dirs=[
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        ];

        for(const [dr,dc] of dirs){

            const nr=r+dr;
            const nc=c+dc;

            if(
                inside(nr,nc) &&
                !cells[nr][nc]
            ){

                result.push({
                    from:[r,c],
                    to:[nr,nc]
                });
            }
        }

        return result;
    }

    function move(m){

        const [fr,fc]=m.from;
        const [tr,tc]=m.to;

        const piece=cells[fr][fc];

        cells[fr][fc]=null;

        if(m.over){

            const [or,oc]=m.over;

            cells[or][oc]=null;
        }

        cells[tr][tc]=piece;

        if(piece.player==="human" && tr===0)
            piece.king=true;

        if(piece.player==="bot" && tr===7)
            piece.king=true;

        render();

        const more=
            m.over &&
            capturesFor(tr,tc).length;

        if(more){

            selected=[tr,tc];
            mustContinue=true;

            status.textContent=
                "Çoklu alma: devam et";

            render();

            return;
        }

        selected=null;
        mustContinue=false;

        checkEnd();

        if(!gameOver)
            botTurn();
    }

    function render(){

        board.innerHTML="";

        for(let r=0;r<8;r++){

            for(let c=0;c<8;c++){

                const cell=el(
                    "div",
                    "dama-cell "+
                    ((r+c)%2
                    ? "dark"
                    : "light")
                );

                const piece=cells[r][c];

                if(piece){

                    const p=el(
                        "div",
                        "dama-piece "+
                        (piece.player==="human"
                         ? "white"
                         : "black")
                    );

                    if(piece.king)
                        p.classList.add("king");

                    cell.appendChild(p);
                }

                if(
                    selected &&
                    selected[0]===r &&
                    selected[1]===c
                )
                    cell.style.outline=
                        "4px solid #ffd166";

                cell.addEventListener(
                    "click",
                    ()=>clickCell(r,c)
                );

                board.appendChild(cell);
            }
        }
    }

    function clickCell(r,c){

        if(gameOver)
            return;

        if(selected){

            const moves=
                legalMoves(
                    selected[0],
                    selected[1]
                );

            const moveFound=
                moves.find(
                    m=>m.to[0]===r &&
                       m.to[1]===c
                );

            if(moveFound){

                move(moveFound);
                return;
            }
        }

        const piece=cells[r][c];

        if(
            piece &&
            piece.player==="human"
        ){

            if(
                mustContinue &&
                (
                    !selected ||
                    selected[0]!==r ||
                    selected[1]!==c
                )
            )
                return;

            if(legalMoves(r,c).length){

                selected=[r,c];

                status.textContent=
                    "Hamleni seç";

                render();
            }
        }
    }

    function botTurn(){

        if(stopped || gameOver)
            return;

        status.textContent="Rakip oynuyor...";

        setTimeout(()=>{

            const captures=[];

            for(let r=0;r<8;r++)
                for(let c=0;c<8;c++){

                    if(
                        cells[r][c] &&
                        cells[r][c].player==="bot"
                    ){

                        captures.push(
                            ...capturesFor(r,c)
                        );
                    }
                }

            let moves=captures;

            if(!moves.length){

                for(let r=0;r<8;r++)
                    for(let c=0;c<8;c++){

                        if(
                            cells[r][c] &&
                            cells[r][c].player==="bot"
                        ){

                            moves.push(
                                ...legalMoves(r,c)
                            );
                        }
                    }
            }

            if(!moves.length){

                finish(true);
                return;
            }

            /*
              Yakalama varsa her zaman
              yakalamayı tercih et.
            */

            const chosen=
                moves[rand(0,moves.length-1)];

            moveBot(chosen);

        },600);
    }

    function moveBot(m){

        const [fr,fc]=m.from;
        const [tr,tc]=m.to;

        const piece=cells[fr][fc];

        cells[fr][fc]=null;

        if(m.over){

            const [or,oc]=m.over;

            cells[or][oc]=null;
        }

        cells[tr][tc]=piece;

        if(tr===7)
            piece.king=true;

        render();

        checkEnd();

        if(!gameOver)
            status.textContent="Senin sıran";
    }

    function checkEnd(){

        let human=0;
        let bot=0;

        for(const row of cells)
            for(const p of row)
                if(p){

                    if(p.player==="human")
                        human++;
                    else
                        bot++;
                }

        if(!human){

            gameOver=true;
            loseGame();

        }else if(!bot){

            gameOver=true;
            winGame(300);
        }
    }

    function finish(win){

        gameOver=true;

        if(win)
            winGame(300);
        else
            loseGame();
    }

    newBtn.addEventListener("click",initial);

    initial();

    return ()=>{
        stopped=true;
    };
}

/* =========================================================
   BATAK
   ========================================================= */

function createBatak(){

    let stopped=false;

    const root=el("div","game-shell");

    const toolbar=el(
        "div",
        "game-toolbar"
    );

    const info=el(
        "div",
        "game-info"
    );

    const status=el(
        "div",
        "info-box",
        "Koz seç"
    );

    const scoreBox=el(
        "div",
        "info-box",
        "El: 0"
    );

    info.append(status,scoreBox);

    const newBtn=el(
        "button",
        "game-button",
        "Yeni El"
    );

    toolbar.append(info,newBtn);

    root.appendChild(toolbar);

    const board=el(
        "div",
        "board batak-table"
    );

    root.appendChild(board);

    const seats=el(
        "div",
        "batak-seats"
    );

    board.appendChild(seats);

    for(let i=0;i<4;i++){

        const s=el(
            "div",
            "batak-seat",
            i===0
            ? "👤 Sen"
            : "🤖 "+botName(i)
        );

        seats.appendChild(s);
    }

    const center=el(
        "div",
        "batak-center"
    );

    const trumpBox=el(
        "div",
        "info-box",
        "Koz: —"
    );

    const trick=el(
        "div",
        "batak-trick"
    );

    center.append(
        trumpBox,
        trick
    );

    board.appendChild(center);

    const handEl=el(
        "div",
        "card-hand"
    );

    board.appendChild(handEl);

    const trumpControls=el(
        "div",
        "game-toolbar"
    );

    ["♠","♥","♦","♣"].forEach(suit=>{

        const b=el(
            "button",
            "game-button",
            suit
        );

        b.addEventListener(
            "click",
            ()=>start(suit)
        );

        trumpControls.appendChild(b);
    });

    root.appendChild(trumpControls);

    const suits={
        "♠":"spades",
        "♥":"hearts",
        "♦":"diamonds",
        "♣":"clubs"
    };

    const values=[
        "2","3","4","5","6","7",
        "8","9","10","J","Q","K","A"
    ];

    function deck(){

        const d=[];

        for(const s of Object.keys(suits))
            for(const v of values)
                d.push({
                    suit:s,
                    value:v,
                    rank:values.indexOf(v)+2
                });

        return shuffle(d);
    }

    let players=[];
    let trump=null;
    let leader=0;
    let current=0;
    let trickCards=[];
    let tricks=[0,0,0,0];
    let started=false;
    let gameOver=false;

    function cardText(card){
        return card.value+card.suit;
    }

    function cardPower(card){

        let power=card.rank;

        if(card.suit===trump)
            power+=100;

        return power;
    }

    function legal(card){

        if(!trickCards.length)
            return true;

        const lead=
            trickCards[0].card.suit;

        const hand=players[0];

        const hasLead=
            hand.some(
                c=>c.suit===lead
            );

        if(hasLead)
            return card.suit===lead;

        return true;
    }

    function render(){

        handEl.innerHTML="";

        players[0]
        .sort((a,b)=>{

            if(a.suit!==b.suit)
                return a.suit.localeCompare(b.suit);

            return a.rank-b.rank;
        })
        .forEach((card,index)=>{

            const c=el(
                "div",
                "playing-card "+
                (
                    card.suit==="♥" ||
                    card.suit==="♦"
                    ? "red"
                    : ""
                ),
                cardText(card)
            );

            if(!legal(card))
                c.classList.add("disabled");

            c.addEventListener(
                "click",
                ()=>{
                    if(
                        !started ||
                        gameOver ||
                        current!==0 ||
                        !legal(card)
                    )
                        return;

                    playCard(0,index);
                }
            );

            handEl.appendChild(c);
        });

        trick.innerHTML="";

        trickCards.forEach(x=>{

            const c=el(
                "div",
                "playing-card "+
                (
                    x.card.suit==="♥" ||
                    x.card.suit==="♦"
                    ? "red"
                    : ""
                ),
                cardText(x.card)
            );

            trick.appendChild(c);
        });

        trumpBox.textContent=
            "Koz: "+(trump||"—");

        scoreBox.textContent=
            "Senin elin: "+tricks[0];
    }

    function start(chosenTrump){

        if(started)
            return;

        trump=chosenTrump;

        const d=deck();

        players=[
            d.splice(0,13),
            d.splice(0,13),
            d.splice(0,13),
            d.splice(0,13)
        ];

        started=true;
        gameOver=false;
        leader=0;
        current=leader;
        trickCards=[];
        tricks=[0,0,0,0];

        status.textContent=
            "Koz "+trump+" • Oyun başladı";

        render();

        if(current!==0)
            botPlay();
    }

    function playCard(player,index){

        const card=
            players[player][index];

        if(
            player===0 &&
            !legal(card)
        )
            return;

        players[player].splice(index,1);

        trickCards.push({
            player,
            card
        });

        current=(current+1)%4;

        render();

        if(trickCards.length===4){

            resolveTrick();

        }else if(current===0){

            status.textContent=
                "Senin sıran";

            render();

        }else{

            botPlay();
        }
    }

    function botPlay(){

        if(stopped || gameOver)
            return;

        setTimeout(()=>{

            const hand=players[current];

            const legalCards=
                hand.filter(legal);

            /*
              Bot:
              mümkünse koz kullanmadan,
              en düşük legal kartı oynar.
            */

            legalCards.sort(
                (a,b)=>cardPower(a)-cardPower(b)
            );

            const card=
                legalCards[0];

            const index=
                hand.indexOf(card);

            playCard(current,index);

        },450);
    }

    function resolveTrick(){

        let winner=
            trickCards[0];

        for(const c of trickCards.slice(1)){

            const lead=
                trickCards[0].card.suit;

            const currentWinner=
                winner.card;

            if(
                c.card.suit===trump &&
                currentWinner.suit!==trump
            ){

                winner=c;
                continue;
            }

            if(
                c.card.suit===currentWinner.suit &&
                cardPower(c.card)>
                cardPower(currentWinner)
            ){

                winner=c;
            }

            if(
                currentWinner.suit!==trump &&
                c.card.suit===lead &&
                currentWinner.suit!==lead
            )
                winner=c;
        }

        tricks[winner.player]++;

        leader=winner.player;
        current=leader;

        trickCards=[];

        if(players[0].length===0){

            endGame();
            return;
        }

        status.textContent=
            winner.player===0
            ? "Eli sen aldın!"
            : botName(winner.player-1)+" eli aldı.";

        render();

        if(current!==0)
            botPlay();
    }

    function endGame(){

        gameOver=true;
        started=false;

        if(tricks[0]>=7)
            winGame(300);
        else
            loseGame();
    }

    newBtn.addEventListener("click",()=>{

        started=false;
        gameOver=false;
        players=[];
        trump=null;
        trickCards=[];
        tricks=[0,0,0,0];

        status.textContent="Koz seç";

        render();
    });

    render();

    return ()=>{
        stopped=true;
    };
}

/* =========================================================
   BİLARDO - CANVAS FİZİK
   ========================================================= */

function createBilardo(){

    let stopped=false;
    let animation=0;

    const root=el("div","game-shell");

    const toolbar=el(
        "div",
        "game-toolbar"
    );

    const status=el(
        "div",
        "info-box",
        "Topu hedefle"
    );

    const reset=el(
        "button",
        "game-button",
        "Yeni Oyun"
    );

    toolbar.append(status,reset);
    root.appendChild(toolbar);

    const wrap=el("div","pool-wrap");

    const canvas=el(
        "canvas",
        "pool-canvas"
    );

    canvas.width=1000;
    canvas.height=500;

    wrap.appendChild(canvas);

    const help=el(
        "div",
        "pool-help",
        "Beyaz topu nişanla. Fareyi veya parmağını sürükleyerek gücü ayarla ve bırak."
    );

    wrap.appendChild(help);

    root.appendChild(wrap);
    gameArea.appendChild(root);

    const ctx=canvas.getContext("2d");

    const W=canvas.width;
    const H=canvas.height;

    const pockets=[
        [20,20],
        [W/2,12],
        [W-20,20],
        [20,H-20],
        [W/2,H-12],
        [W-20,H-20]
    ];

    let balls=[];
    let aiming=false;
    let aimX=0;
    let aimY=0;
    let gameOver=false;
    let score=0;

    function makeBalls(){

        balls=[];

        balls.push({
            x:250,
            y:H/2,
            vx:0,
            vy:0,
            r:13,
            color:"#fff",
            cue:true,
            active:true
        });

        const colors=[
            "#f00","#00aaff","#ff0",
            "#f80","#0c5","#a0f",
            "#f69","#333"
        ];

        for(let i=0;i<7;i++){

            const row=Math.floor(i/3);
            const col=i%3;

            balls.push({
                x:650+row*28,
                y:H/2+(col-1)*30,
                vx:0,
                vy:0,
                r:13,
                color:colors[i],
                active:true
            });
        }

        score=0;
        gameOver=false;
    }

    function drawTable(){

        ctx.clearRect(0,0,W,H);

        ctx.fillStyle="#08704c";
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle="#111";

        pockets.forEach(([x,y])=>{
            ctx.beginPath();
            ctx.arc(x,y,25,0,Math.PI*2);
            ctx.fill();
        });

        balls.forEach(b=>{

            if(!b.active)
                return;

            ctx.beginPath();
            ctx.arc(
                b.x,
                b.y,
                b.r,
                0,
                Math.PI*2
            );

            ctx.fillStyle=b.color;
            ctx.fill();

            ctx.strokeStyle="#222";
            ctx.lineWidth=2;
            ctx.stroke();

            if(b.cue){

                ctx.beginPath();
                ctx.arc(
                    b.x-4,
                    b.y-4,
                    3,
                    0,
                    Math.PI*2
                );

                ctx.fillStyle="#bbb";
                ctx.fill();
            }
        });

        if(aiming){

            const cue=
                balls.find(b=>b.cue);

            if(cue){

                ctx.beginPath();
                ctx.moveTo(cue.x,cue.y);
                ctx.lineTo(aimX,aimY);
                ctx.strokeStyle="#fff";
                ctx.lineWidth=2;
                ctx.setLineDash([8,8]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    function physics(){

        balls.forEach(b=>{

            if(!b.active)
                return;

            b.x+=b.vx;
            b.y+=b.vy;

            b.vx*=.985;
            b.vy*=.985;

            if(Math.abs(b.vx)<.02)
                b.vx=0;

            if(Math.abs(b.vy)<.02)
                b.vy=0;

            if(
                b.x-b.r<5 ||
                b.x+b.r>W-5
            ){

                b.vx*=-.9;

                b.x=
                    Math.max(
                        b.r+5,
                        Math.min(
                            W-b.r-5,
                            b.x
                        )
                    );
            }

            if(
                b.y-b.r<5 ||
                b.y+b.r>H-5
            ){

                b.vy*=-.9;

                b.y=
                    Math.max(
                        b.r+5,
                        Math.min(
                            H-b.r-5,
                            b.y
                        )
                    );
            }
        });

        /*
          Top çarpışmaları
        */

        for(let i=0;i<balls.length;i++){

            for(let j=i+1;j<balls.length;j++){

                const a=balls[i];
                const b=balls[j];

                if(!a.active || !b.active)
                    continue;

                const dx=b.x-a.x;
                const dy=b.y-a.y;

                const dist=Math.hypot(dx,dy);
                const min=a.r+b.r;

                if(dist>0 && dist<min){

                    const nx=dx/dist;
                    const ny=dy/dist;

                    const dvx=a.vx-b.vx;
                    const dvy=a.vy-b.vy;

                    const impulse=
                        dvx*nx+dvy*ny;

                    if(impulse>0)
                        continue;

                    a.vx-=impulse*nx;
                    a.vy-=impulse*ny;

                    b.vx+=impulse*nx;
                    b.vy+=impulse*ny;

                    const overlap=min-dist;

                    a.x-=nx*overlap/2;
                    a.y-=ny*overlap/2;

                    b.x+=nx*overlap/2;
                    b.y+=ny*overlap/2;
                }
            }
        }

        /*
          Cepler
        */

        balls.forEach(b=>{

            if(!b.active)
                return;

            for(const [px,py] of pockets){

                if(
                    Math.hypot(
                        b.x-px,
                        b.y-py
                    )<23
                ){

                    b.active=false;

                    if(b.cue){

                        /*
                          Beyaz top tekrar masaya
                          alınır.
                        */

                        setTimeout(()=>{

                            if(!stopped && !gameOver){

                                b.active=true;
                                b.x=250;
                                b.y=H/2;
                                b.vx=0;
                                b.vy=0;
                            }

                        },700);

                    }else{

                        score++;

                        if(score>=7){

                            gameOver=true;
                            winGame(400);
                        }
                    }

                    break;
                }
            }
        });
    }

    function loop(){

        if(stopped)
            return;

        physics();
        drawTable();

        animation=
            requestAnimationFrame(loop);
    }

    function pointer(e){

        const rect=
            canvas.getBoundingClientRect();

        const source=
            e.touches
            ? e.touches[0]
            : e;

        return {
            x:(source.clientX-rect.left)
                *(W/rect.width),

            y:(source.clientY-rect.top)
                *(H/rect.height)
        };
    }

    function down(e){

        e.preventDefault();

        const p=pointer(e);

        const cue=
            balls.find(
                b=>b.cue && b.active
            );

        if(!cue)
            return;

        if(
            Math.hypot(
                p.x-cue.x,
                p.y-cue.y
            )<100
        ){

            aiming=true;
            aimX=p.x;
            aimY=p.y;
        }
    }

    function movePointer(e){

        if(!aiming)
            return;

        e.preventDefault();

        const p=pointer(e);

        aimX=p.x;
        aimY=p.y;
    }

    function shoot(){

        if(!aiming)
            return;

        const cue=
            balls.find(
                b=>b.cue && b.active
            );

        if(!cue)
            return;

        const dx=cue.x-aimX;
        const dy=cue.y-aimY;

        const dist=
            Math.min(
                Math.hypot(dx,dy),
                260
            );

        if(dist<10){

            aiming=false;
            return;
        }

        const power=
            Math.min(dist/25,10);

        const len=Math.hypot(dx,dy);

        cue.vx=
            dx/len*power;

        cue.vy=
            dy/len*power;

        aiming=false;

        status.textContent=
            "Toplar hareket ediyor...";
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

    return ()=>{
        stopped=true;
        cancelAnimationFrame(animation);
    };
}

/* =========================================================
   MAHJONG
   ========================================================= */

function createMahjong(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const info=el(
        "div",
        "game-info"
    );

    let pairs=0;

    const title=el(
        "h2",
        "",
        "🀄 Mahjong • Seviye "+level+"/100"
    );

    shell.appendChild(title);

    const grid=el("div","game-grid");

    const symbols=[
        "🀄","🐉","🌸","🎋",
        "☀️","🌙","⭐","🪙"
    ];

    let cards=shuffle([
        ...symbols,
        ...symbols
    ]);

    let selected=[];

    cards.forEach((symbol,i)=>{

        const c=el(
            "div",
            "memory-card",
            "?"
        );

        c.addEventListener(
            "click",
            ()=>{

                if(
                    selected.length>=2 ||
                    c.classList.contains("open") ||
                    c.classList.contains("done")
                )
                    return;

                c.textContent=symbol;
                c.classList.add("open");

                selected.push({
                    el:c,
                    symbol
                });

                if(selected.length===2){

                    if(
                        selected[0].symbol===
                        selected[1].symbol
                    ){

                        selected.forEach(
                            x=>x.el.classList.add("done")
                        );

                        pairs++;
                        addXP(15);

                        selected=[];

                        if(pairs===symbols.length)
                            winGame(150);

                    }else{

                        const copy=selected;

                        selected=[];

                        setTimeout(()=>{

                            copy.forEach(
                                x=>{
                                    x.el.classList.remove("open");
                                    x.el.textContent="?";
                                }
                            );

                        },600);
                    }
                }
            }
        );

        grid.appendChild(c);
    });

    shell.appendChild(grid);
    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   SUDOKU
   ========================================================= */

function createSudoku(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🔢 Sudoku • Seviye "+level+"/100"
    );

    shell.appendChild(title);

    const solved=[
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

    const puzzle=
        solved.map(row=>row.slice());

    const removeCount=
        Math.min(
            60,
            35+Math.floor(level/3)
        );

    let removed=0;

    while(removed<removeCount){

        const r=rand(0,8);
        const c=rand(0,8);

        if(puzzle[r][c]!==0){

            puzzle[r][c]=0;
            removed++;
        }
    }

    const grid=el("div","sudoku");

    for(let r=0;r<9;r++){

        for(let c=0;c<9;c++){

            const input=document.createElement("input");

            if(puzzle[r][c]){

                input.value=
                    puzzle[r][c];

                input.disabled=true;

            }else{

                input.maxLength=1;
                input.inputMode="numeric";
            }

            input.dataset.r=r;
            input.dataset.c=c;

            grid.appendChild(input);
        }
    }

    const check=el(
        "button",
        "game-button",
        "Kontrol Et"
    );

    check.addEventListener(
        "click",
        ()=>{

            let correct=true;

            grid.querySelectorAll("input")
            .forEach(input=>{

                const r=Number(input.dataset.r);
                const c=Number(input.dataset.c);

                if(
                    Number(input.value)!==
                    solved[r][c]
                )
                    correct=false;
            });

            if(correct)
                winGame(200);
            else
                showMessage(
                    "Henüz Tamamlanmadı",
                    "Bazı hücreler yanlış."
                );
        }
    );

    shell.append(grid,check);
    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   BUBBLE SHOOTER
   ========================================================= */

function createBubble(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🔵 Bubble Shooter • Seviye "+level+"/100"
    );

    const scoreEl=el(
        "div",
        "info-box",
        "Skor: 0"
    );

    const grid=el("div","game-grid");

    const colors=[
        "🔴","🟢","🔵","🟡","🟣"
    ];

    let scoreLocal=0;

    for(let i=0;i<40;i++){

        const cell=el(
            "div",
            "grid-cell",
            colors[rand(0,colors.length-1)]
        );

        cell.addEventListener(
            "click",
            ()=>{

                const group=
                    grid.querySelectorAll(
                        ".grid-cell"
                    );

                const current=cell.textContent;

                let same=0;

                group.forEach(x=>{
                    if(x.textContent===current)
                        same++;
                });

                if(same>=3){

                    cell.textContent="";

                    scoreLocal+=same*10;

                    scoreEl.textContent=
                        "Skor: "+scoreLocal;

                    addXP(5);

                    if(scoreLocal>=300)
                        winGame(150);

                }else{

                    scoreLocal+=2;

                    scoreEl.textContent=
                        "Skor: "+scoreLocal;
                }
            }
        );

        grid.appendChild(cell);
    }

    shell.append(title,scoreEl,grid);
    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   ARABA YARIŞI
   ========================================================= */

function createRace(){

    let stopped=false;
    let frame=0;

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🏎️ Araba Yarışı • Seviye "+level+"/100"
    );

    const canvas=el(
        "canvas",
        "race-canvas"
    );

    canvas.width=600;
    canvas.height=500;

    const ctx=canvas.getContext("2d");

    let x=300;
    let enemies=[];
    let scoreLocal=0;

    function draw(){

        ctx.fillStyle="#1b1b1b";
        ctx.fillRect(0,0,600,500);

        ctx.fillStyle="#444";
        ctx.fillRect(120,0,360,500);

        ctx.strokeStyle="#fff";
        ctx.setLineDash([30,25]);
        ctx.lineWidth=4;

        ctx.beginPath();
        ctx.moveTo(300,0);
        ctx.lineTo(300,500);
        ctx.stroke();

        ctx.setLineDash([]);

        ctx.fillStyle="#3498db";
        ctx.fillRect(x-20,420,40,60);

        enemies.forEach(e=>{

            ctx.fillStyle="#e74c3c";
            ctx.fillRect(e.x-20,e.y-30,40,60);
        });

        enemies.forEach(e=>{

            e.y+=
                3+
                level*.08;

            if(e.y>530){

                scoreLocal++;
                e.y=-50;
                e.x=
                    rand(150,450);

                addXP(3);
            }

            if(
                Math.abs(e.x-x)<35 &&
                Math.abs(e.y-450)<55
            ){

                stopped=true;
                loseGame();
            }
        });

        if(scoreLocal>=15){

            stopped=true;
            winGame(200);
        }

        frame=
            requestAnimationFrame(draw);
    }

    for(let i=0;i<3;i++)
        enemies.push({
            x:rand(150,450),
            y:-i*180
        });

    function key(e){

        if(e.key==="ArrowLeft")
            x-=30;

        if(e.key==="ArrowRight")
            x+=30;

        x=Math.max(145,Math.min(455,x));
    }

    window.addEventListener("keydown",key);

    shell.append(title,canvas);
    root.appendChild(shell);
    gameArea.appendChild(root);

    draw();

    return ()=>{
        stopped=true;
        cancelAnimationFrame(frame);
        window.removeEventListener("keydown",key);
    };
}

/* =========================================================
   BLOCK PUZZLE
   ========================================================= */

function createBlock(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🧱 Block Puzzle • Seviye "+level+"/100"
    );

    const scoreEl=el(
        "div",
        "info-box",
        "Skor: 0"
    );

    const grid=el("div","block-grid");

    let scoreLocal=0;

    for(let i=0;i<64;i++){

        const c=el(
            "div",
            "block-cell"
        );

        c.addEventListener(
            "click",
            ()=>{

                if(
                    !c.classList.contains("filled")
                ){

                    c.classList.add("filled");

                    scoreLocal+=5;

                    scoreEl.textContent=
                        "Skor: "+scoreLocal;

                    addXP(2);

                    checkRows();
                }
            }
        );

        grid.appendChild(c);
    }

    function checkRows(){

        const cells=
            [...grid.children];

        for(let r=0;r<8;r++){

            const row=
                cells.slice(r*8,r*8+8);

            if(
                row.every(
                    c=>c.classList.contains("filled")
                )
            ){

                row.forEach(
                    c=>c.classList.remove("filled")
                );

                scoreLocal+=80;

                scoreEl.textContent=
                    "Skor: "+scoreLocal;

                addXP(10);
            }
        }

        if(scoreLocal>=500)
            winGame(200);
    }

    shell.append(title,scoreEl,grid);
    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   OKÇULUK
   ========================================================= */

function createArchery(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🏹 Okçuluk • Seviye "+level+"/100"
    );

    const area=el(
        "div",
        "simple-game"
    );

    area.style.position="relative";
    area.style.height="420px";

    let scoreLocal=0;
    let shots=0;

    function newTarget(){

        area.querySelectorAll(".target")
            .forEach(x=>x.remove());

        const target=el(
            "div",
            "target"
        );

        target.style.left=
            rand(20,80)+"%";

        target.style.top=
            rand(20,75)+"%";

        target.addEventListener(
            "click",
            ()=>{

                const rect=
                    target.getBoundingClientRect();

                const cx=
                    rect.left+rect.width/2;

                const cy=
                    rect.top+rect.height/2;

                scoreLocal+=100;
                shots++;

                addXP(8);

                target.remove();

                if(
                    scoreLocal>=
                    1000+
                    level*10
                ){

                    winGame(200);

                }else if(shots>=15){

                    loseGame();

                }else{

                    newTarget();
                }
            }
        );

        area.appendChild(target);
    }

    shell.append(title,area);
    root.appendChild(shell);
    gameArea.appendChild(root);

    newTarget();

    return ()=>{};
}

/* =========================================================
   MEMORY
   ========================================================= */

function createMemory(hard){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const count=hard?12:8;

    const title=el(
        "h2",
        "",
        "🧠 "+
        (hard?"Hafıza Oyunu":"Zeka Eşleştirme")+
        " • Seviye "+level+"/100"
    );

    const grid=el(
        "div",
        "game-grid"
    );

    if(hard)
        grid.style.gridTemplateColumns=
            "repeat(6,1fr)";

    const symbols=[
        "🍎","🍌","🍇","🍒",
        "🍉","🥝","🍓","🍊",
        "🥭","🍋","🥥","🍑"
    ].slice(0,count);

    const cards=shuffle([
        ...symbols,
        ...symbols
    ]);

    let selected=[];
    let matched=0;

    cards.forEach(symbol=>{

        const card=el(
            "div",
            "memory-card",
            "?"
        );

        card.addEventListener(
            "click",
            ()=>{

                if(
                    selected.length>=2 ||
                    card.classList.contains("done") ||
                    card.classList.contains("open")
                )
                    return;

                card.textContent=symbol;
                card.classList.add("open");

                selected.push({
                    card,
                    symbol
                });

                if(selected.length===2){

                    const a=selected[0];
                    const b=selected[1];

                    if(a.symbol===b.symbol){

                        a.card.classList.add("done");
                        b.card.classList.add("done");

                        matched++;

                        addXP(10);

                        selected=[];

                        if(matched===symbols.length)
                            winGame(200);

                    }else{

                        const pair=selected;
                        selected=[];

                        setTimeout(()=>{

                            pair.forEach(
                                x=>{
                                    x.card.classList.remove("open");
                                    x.card.textContent="?";
                                }
                            );

                        },700);
                    }
                }
            }
        );

        grid.appendChild(card);
    });

    shell.append(title,grid);
    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   YILAN
   ========================================================= */

function createSnake(){

    let stopped=false;
    let timer=null;

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🐍 Yılan Oyunu • Seviye "+level+"/100"
    );

    const canvas=el(
        "canvas",
        "snake-canvas"
    );

    canvas.width=500;
    canvas.height=500;

    shell.append(title,canvas);
    root.appendChild(shell);
    gameArea.appendChild(root);

    const ctx=canvas.getContext("2d");

    const size=25;

    let snake=[
        {x:10,y:10},
        {x:9,y:10},
        {x:8,y:10}
    ];

    let dir={x:1,y:0};

    let food={
        x:rand(0,19),
        y:rand(0,19)
    };

    let scoreLocal=0;

    function draw(){

        ctx.fillStyle="#101629";
        ctx.fillRect(0,0,500,500);

        ctx.fillStyle="#6c63ff";

        snake.forEach(p=>{
            ctx.fillRect(
                p.x*size,
                p.y*size,
                size-2,
                size-2
            );
        });

        ctx.fillStyle="#e74c3c";

        ctx.beginPath();

        ctx.arc(
            food.x*size+12,
            food.y*size+12,
            10,
            0,
            Math.PI*2
        );

        ctx.fill();
    }

    function tick(){

        if(stopped)
            return;

        const head={
            x:snake[0].x+dir.x,
            y:snake[0].y+dir.y
        };

        if(
            head.x<0 ||
            head.x>=20 ||
            head.y<0 ||
            head.y>=20 ||
            snake.some(
                p=>p.x===head.x &&
                   p.y===head.y
            )
        ){

            stopped=true;
            loseGame();
            return;
        }

        snake.unshift(head);

        if(
            head.x===food.x &&
            head.y===food.y
        ){

            scoreLocal+=10;

            addXP(5);

            food={
                x:rand(0,19),
                y:rand(0,19)
            };

            if(scoreLocal>=200){

                stopped=true;
                winGame(200);
                return;
            }

        }else{

            snake.pop();
        }

        draw();
    }

    function key(e){

        if(e.key==="ArrowUp" && dir.y!==1)
            dir={x:0,y:-1};

        if(e.key==="ArrowDown" && dir.y!==-1)
            dir={x:0,y:1};

        if(e.key==="ArrowLeft" && dir.x!==1)
            dir={x:-1,y:0};

        if(e.key==="ArrowRight" && dir.x!==-1)
            dir={x:1,y:0};
    }

    window.addEventListener("keydown",key);

    draw();

    timer=setInterval(
        tick,
        Math.max(70,150-level)
    );

    return ()=>{
        stopped=true;
        clearInterval(timer);
        window.removeEventListener("keydown",key);
    };
}

/* =========================================================
   BASKET
   ========================================================= */

function createBasket(){

    const root=el("div","game-shell");
    const shell=el("div","simple-game");

    const title=el(
        "h2",
        "",
        "🏀 Basket Atışı • Seviye "+level+"/100"
    );

    const scoreEl=el(
        "div",
        "info-box",
        "İsabet: 0/10"
    );

    const hoop=el(
        "div",
        "basket-hoop"
    );

    const ball=el(
        "div",
        "basket-ball"
    );

    let scoreLocal=0;
    let attempts=0;

    ball.addEventListener(
        "click",
        ()=>{

            if(attempts>=10)
                return;

            attempts++;

            /*
              Seviye yükseldikçe hedef
              başarı oranı düşüyor.
            */

            const chance=
                Math.max(
                    .35,
                    .75-level*.003
                );

            if(Math.random()<chance){

                scoreLocal++;
                addXP(8);

                ball.animate(
                    [
                        {transform:"translateY(0)"},
                        {transform:"translateY(-180px)"},
                        {transform:"translateY(0)"}
                    ],
                    {
                        duration:700
                    }
                );
            }

            scoreEl.textContent=
                "İsabet: "+
                scoreLocal+
                "/10";

            if(
                scoreLocal>=7 &&
                attempts<=10
            ){

                winGame(200);

            }else if(attempts>=10){

                loseGame();
            }
        }
    );

    shell.append(
        title,
        scoreEl,
        hoop,
        ball
    );

    root.appendChild(shell);
    gameArea.appendChild(root);

    return ()=>{};
}

/* =========================================================
   REKLAM DEMO SİSTEMİ
   ========================================================= */

if(watchAdBtn){

    watchAdBtn.addEventListener(
        "click",
        ()=>{

            /*
              Şimdilik DEMO.
              Gerçek AdSense reklamı değildir.
            */

            showMessage(
                "📺 Reklam Alanı",
                "Bu şu anda deneme reklamıdır. " +
                "AdSense onayından sonra gerçek reklam kodu " +
                "buraya bağlanabilir."
            );

            /*
              Test amacıyla puan.
              Gerçek reklam sistemine geçildiğinde
              bu bölüm gerçek reklam akışına göre
              değiştirilecek.
            */

            setTimeout(()=>{

                changeScore(AD_REWARD);

                addXP(10);

                showMessage(
                    "🎁 Demo Bonus",
                    "+"+
                    AD_REWARD+
                    " test puanı ve +10 XP eklendi."
                );

            },1200);
        }
    );
}

/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    e=>{

        if(e.key==="Escape"){

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
