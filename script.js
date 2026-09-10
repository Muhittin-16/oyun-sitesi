

/* ============================================================
   OYUN DÜNYASI / OYNAKAZAN
   15 OYUN - GELİŞMİŞ OYUN MOTORU
   TEK PARÇA script.js
   ============================================================ */

(() => {
"use strict";

/* ============================================================
   GENEL SİSTEM
   ============================================================ */

const GAME_KEY = "oynakazan_current_game";
const SCORE_KEY = "oynakazan_score";
const XP_KEY = "oynakazan_xp";
const LEVEL_KEY = "oynakazan_level";
const PLAYED_KEY = "oynakazan_played";
const COIN_KEY = "oynakazan_coins";
const STATS_KEY = "oyunDunyasiStats";

const START_SCORE = 500;
const ENTRY_COST = 50;
const MAX_LEVEL = 100;

let score = Number(localStorage.getItem(SCORE_KEY));
if (!Number.isFinite(score)) score = START_SCORE;

let xp = Number(localStorage.getItem(XP_KEY)) || 0;
let level = Number(localStorage.getItem(LEVEL_KEY)) || 1;
let played = Number(localStorage.getItem(PLAYED_KEY)) || 0;
let coins = Number(localStorage.getItem(COIN_KEY)) || 0;

let currentGame = null;
let gameTimer = null;

/* ============================================================
   YARDIMCI FONKSİYONLAR
   ============================================================ */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveProgress() {
    localStorage.setItem(SCORE_KEY, String(score));
    localStorage.setItem(XP_KEY, String(xp));
    localStorage.setItem(LEVEL_KEY, String(level));
    localStorage.setItem(PLAYED_KEY, String(played));
    localStorage.setItem(COIN_KEY, String(coins));
}

function xpNeeded() {
    return 100 + ((level - 1) * 25);
}

function addXP(amount) {
    xp += amount;

    while (level < MAX_LEVEL && xp >= xpNeeded()) {
        xp -= xpNeeded();
        level++;
        coins += 25;
        notify("🎉 Seviye atladın! +" + 25 + " 🪙");
    }

    saveProgress();
    updateTopUI();
}

function changeScore(amount) {
    score += amount;
    if (score < 0) score = 0;
    saveProgress();
    updateTopUI();
}

function updateTopUI() {
    const scoreEls = [
        "#score", "#playerScore", "#puan", ".score-value"
    ];

    const levelEls = [
        "#level", "#playerLevel", ".level-value"
    ];

    const coinEls = [
        "#coins", "#coin", "#bonus", ".coin-value"
    ];

    scoreEls.forEach(s => $$(s).forEach(e => e.textContent = score));
    levelEls.forEach(s => $$(s).forEach(e => e.textContent = level));
    coinEls.forEach(s => $$(s).forEach(e => e.textContent = coins));
}

function notify(text) {
    let box = $("#oynakazanToast");

    if (!box) {
        box = document.createElement("div");
        box.id = "oynakazanToast";
        box.style.cssText = `
            position:fixed;
            left:50%;
            bottom:25px;
            transform:translateX(-50%);
            z-index:999999;
            background:#10182e;
            color:white;
            padding:14px 20px;
            border-radius:14px;
            border:1px solid rgba(255,255,255,.15);
            box-shadow:0 12px 35px rgba(0,0,0,.4);
            font-weight:700;
            opacity:0;
            transition:.25s;
            pointer-events:none;
        `;
        document.body.appendChild(box);
    }

    box.textContent = text;
    box.style.opacity = "1";

    clearTimeout(box._timer);
    box._timer = setTimeout(() => {
        box.style.opacity = "0";
    }, 2200);
}

function gameReward(win = true) {
    if (win) {
        changeScore(100);
        coins += 10;
        addXP(35);
        notify("🏆 Kazandın! +100 puan +10 🪙 +35 XP");
    } else {
        addXP(10);
        notify("👏 El tamamlandı! +10 XP");
    }
    saveProgress();
}

function startGameCost() {
    if (score < ENTRY_COST) {
        notify("❌ Oyuna başlamak için en az " + ENTRY_COST + " puanın olmalı.");
        return false;
    }

    changeScore(-ENTRY_COST);
    played++;
    saveProgress();
    return true;
}

/* ============================================================
   OYUN MODALINI BUL / OLUŞTUR
   ============================================================ */

function ensureModal() {
    let modal = $("#gameModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "gameModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="game-modal-inner">
                <button id="closeGame" class="game-close">✕</button>
                <div id="gameTitle"></div>
                <div id="gameArea"></div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    let area = $("#gameArea", modal);
    let title = $("#gameTitle", modal);

    if (!area) {
        area = document.createElement("div");
        area.id = "gameArea";
        modal.appendChild(area);
    }

    if (!title) {
        title = document.createElement("div");
        title.id = "gameTitle";
        modal.prepend(title);
    }

    const close = $("#closeGame", modal);
    if (close && !close.dataset.bound) {
        close.dataset.bound = "1";
        close.addEventListener("click", closeGame);
    }

    modal.style.zIndex = "100000";
    return { modal, area, title };
}

function openGameModal(title, html) {
    const { modal, area, title: titleEl } = ensureModal();

    titleEl.innerHTML = `
        <div style="
            font-size:24px;
            font-weight:900;
            padding:12px 0 18px;
        ">${title}</div>
    `;

    area.innerHTML = html;

    modal.classList.remove("hidden");
    modal.classList.add("active");

    modal.style.display = "flex";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.overflow = "auto";

    document.body.style.overflow = "hidden";
}

function closeGame() {
    clearInterval(gameTimer);
    clearTimeout(gameTimer);

    const modal = $("#gameModal");

    if (modal) {
        modal.classList.remove("active");
        modal.classList.add("hidden");
        modal.style.display = "none";
    }

    document.body.style.overflow = "";
    currentGame = null;
}

/* ============================================================
   OYUN İSİMLERİ / İKONLAR
   ============================================================ */

const GAME_META = {
    okey: {
        name:"101 Okey",
        icon:"🀄",
        color:"emerald"
    },
    tavla:{
        name:"Klasik Tavla",
        icon:"⚫",
        color:"wood"
    },
    dama:{
        name:"Türk Daması",
        icon:"🔴",
        color:"red"
    },
    batak:{
        name:"Batak",
        icon:"🂡",
        color:"card"
    },
    bilardo:{
        name:"Bilardo",
        icon:"🎱",
        color:"pool"
    },
    mahjong:{
        name:"Mahjong",
        icon:"🀙",
        color:"jade"
    },
    sudoku:{
        name:"Sudoku",
        icon:"🔢"
    },
    bubble:{
        name:"Bubble Shooter",
        icon:"🫧"
    },
    race:{
        name:"Araba Yarışı",
        icon:"🏎️"
    },
    block:{
        name:"Block Puzzle",
        icon:"🧩"
    },
    archery:{
        name:"Okçuluk",
        icon:"🏹"
    },
    memory:{
        name:"Zeka Eşleştirme",
        icon:"🧠"
    },
    memory2:{
        name:"Hafıza Oyunu",
        icon:"🃏"
    },
    snake:{
        name:"Yılan Oyunu",
        icon:"🐍"
    },
    basket:{
        name:"Basket Atışı",
        icon:"🏀"
    }
};

/* ============================================================
   ANA OYUN AÇICI
   ============================================================ */

function openGame(gameId) {
    clearInterval(gameTimer);
    currentGame = gameId;

    if (!startGameCost()) return;

    switch (gameId) {
        case "okey":
            OkeyGame.start();
            break;

        case "tavla":
            TavlaGame.start();
            break;

        case "dama":
            DamaGame.start();
            break;

        case "batak":
            BatakGame.start();
            break;

        case "bilardo":
            BilardoGame.start();
            break;

        case "mahjong":
            MahjongGame.start();
            break;

        case "sudoku":
            SudokuGame.start();
            break;

        case "bubble":
            BubbleGame.start();
            break;

        case "race":
            RaceGame.start();
            break;

        case "block":
            BlockGame.start();
            break;

        case "archery":
            ArcheryGame.start();
            break;

        case "memory":
            MemoryGame.start();
            break;

        case "memory2":
            Memory2Game.start();
            break;

        case "snake":
            SnakeGame.start();
            break;

        case "basket":
            BasketGame.start();
            break;

        default:
            notify("Bu oyun bulunamadı.");
    }
}

window.openGame = openGame;
window.closeGame = closeGame;

/* ============================================================
   KART / OKEY / MASA ORTAK STİLLER
   ============================================================ */

function injectGameCSS() {
    if ($("#oynakazanGameCSS")) return;

    const style = document.createElement("style");
    style.id = "oynakazanGameCSS";

    style.textContent = `
    .game-shell{
        width:min(1180px,96vw);
        margin:auto;
        color:#fff;
        font-family:inherit;
    }

    .game-toolbar{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        align-items:center;
        justify-content:center;
        margin:10px 0 18px;
    }

    .game-btn{
        border:0;
        border-radius:12px;
        padding:10px 15px;
        cursor:pointer;
        color:#fff;
        background:#26345e;
        font-weight:800;
        transition:.2s;
    }

    .game-btn:hover{
        transform:translateY(-1px);
        filter:brightness(1.15);
    }

    .game-btn.primary{
        background:#6c63ff;
    }

    .game-btn.success{
        background:#159957;
    }

    .game-btn.danger{
        background:#c43c56;
    }

    .game-btn.gold{
        background:#b88916;
    }

    .game-status{
        text-align:center;
        font-weight:800;
        min-height:25px;
        margin:8px;
    }

    .players-select{
        display:flex;
        justify-content:center;
        gap:10px;
        flex-wrap:wrap;
        margin:15px 0;
    }

    .players-select button{
        min-width:90px;
    }

    .table{
        position:relative;
        border-radius:24px;
        overflow:hidden;
        box-shadow:0 15px 50px rgba(0,0,0,.4);
    }

    .seat{
        padding:10px;
        border-radius:14px;
        background:rgba(0,0,0,.22);
        text-align:center;
        font-weight:800;
    }

    /* OKEY */
    .okey-table{
        min-height:650px;
        padding:25px;
        background:radial-gradient(circle,#13734d,#075033 65%,#043524);
        border:12px solid #6b421f;
    }

    .okey-seat{
        position:absolute;
        min-width:170px;
    }

    .okey-top{top:12px;left:50%;transform:translateX(-50%)}
    .okey-left{left:12px;top:50%;transform:translateY(-50%)}
    .okey-right{right:12px;top:50%;transform:translateY(-50%)}
    .okey-bottom{bottom:10px;left:50%;transform:translateX(-50%);width:min(95%,850px)}

    .tile-rack{
        display:flex;
        gap:4px;
        flex-wrap:wrap;
        justify-content:center;
        padding:10px;
    }

    .okey-tile{
        width:39px;
        height:54px;
        border-radius:6px;
        background:linear-gradient(135deg,#fff,#e7e7e7);
        color:#222;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:20px;
        font-weight:900;
        box-shadow:0 3px 5px rgba(0,0,0,.35);
        cursor:pointer;
        user-select:none;
        border:1px solid #bbb;
    }

    .okey-tile.red{color:#d62e2e}
    .okey-tile.blue{color:#1753c5}
    .okey-tile.black{color:#171717}
    .okey-tile.green{color:#168146}
    .okey-tile.selected{
        transform:translateY(-12px);
        outline:3px solid #ffd166;
    }

    .discard-area{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        width:330px;
        min-height:150px;
        text-align:center;
    }

    .discard-pile{
        display:flex;
        flex-wrap:wrap;
        gap:4px;
        justify-content:center;
        max-height:145px;
        overflow:auto;
        padding:10px;
    }

    /* TAVLA */
    .backgammon{
        background:#713f1f;
        border:12px solid #321b0d;
        padding:20px;
        min-height:670px;
    }

    .board-inner{
        position:relative;
        display:grid;
        grid-template-columns:repeat(12,1fr);
        gap:5px;
        background:#d4a15a;
        padding:15px 55px;
        min-height:600px;
        border-radius:12px;
    }

    .point{
        position:relative;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        min-height:270px;
        cursor:pointer;
    }

    .point.bottom{
        justify-content:flex-end;
    }

    .triangle{
        width:0;
        height:0;
        border-left:24px solid transparent;
        border-right:24px solid transparent;
        border-top:210px solid #b13e29;
    }

    .point:nth-child(even) .triangle{
        border-top-color:#ecd9a1;
    }

    .point.bottom .triangle{
        transform:rotate(180deg);
    }

    .checkers{
        position:absolute;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:1px;
        top:2px;
    }

    .point.bottom .checkers{
        top:auto;
        bottom:2px;
    }

    .checker{
        width:36px;
        height:36px;
        border-radius:50%;
        border:3px solid #222;
        box-shadow:0 2px 4px rgba(0,0,0,.4);
    }

    .checker.white{
        background:linear-gradient(#fff,#aaa);
    }

    .checker.black{
        background:linear-gradient(#333,#050505);
        border-color:#aaa;
    }

    .bar{
        position:absolute;
        left:50%;
        top:0;
        bottom:0;
        transform:translateX(-50%);
        width:42px;
        background:#30180d;
        z-index:5;
    }

    .dice-center{
        position:absolute;
        z-index:20;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:8px;
    }

    .dice{
        display:flex;
        gap:8px;
    }

    .die{
        width:48px;
        height:48px;
        background:#fff;
        color:#111;
        border-radius:8px;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:28px;
        font-weight:900;
        box-shadow:0 4px 12px rgba(0,0,0,.4);
    }

    /* DAMA */
    .dama-board{
        width:min(90vw,650px);
        aspect-ratio:1;
        margin:auto;
        display:grid;
        grid-template-columns:repeat(8,1fr);
        border:8px solid #4b2b18;
    }

    .dama-cell{
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
    }

    .dama-cell.light{background:#e7c99b}
    .dama-cell.dark{background:#6f3f24}

    .dama-piece{
        width:75%;
        aspect-ratio:1;
        border-radius:50%;
        border:4px solid rgba(0,0,0,.45);
        box-shadow:0 5px 8px rgba(0,0,0,.35);
    }

    .dama-piece.white{background:linear-gradient(#fff,#aaa)}
    .dama-piece.black{background:linear-gradient(#333,#050505)}
    .dama-piece.king::after{
        content:"♛";
        color:#ffd166;
        font-size:30px;
    }

    .dama-cell.selected{
        outline:4px solid #ffd166;
        outline-offset:-4px;
    }

    .dama-cell.capture{
        box-shadow:inset 0 0 0 5px #ffcf33;
    }

    /* BATAK */
    .card-table{
        min-height:650px;
        background:radial-gradient(circle,#176c3d,#063b22);
        border:12px solid #6b421f;
        padding:20px;
    }

    .playing-card{
        width:55px;
        height:78px;
        background:#fff;
        color:#111;
        border-radius:7px;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:21px;
        font-weight:900;
        box-shadow:0 4px 7px rgba(0,0,0,.4);
        cursor:pointer;
        user-select:none;
    }

    .playing-card.red{color:#c52235}

    .card-hand{
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:5px;
        padding:8px;
    }

    .card-back{
        background:repeating-linear-gradient(
            45deg,#1f3d8f,#1f3d8f 5px,#284ca9 5px,#284ca9 10px
        );
        color:transparent;
        border:3px solid #fff;
    }

    .trick-area{
        min-height:150px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:15px;
        flex-wrap:wrap;
    }

    /* BİLARDO */
    .pool-table{
        position:relative;
        width:min(96vw,1000px);
        aspect-ratio:2/1;
        margin:auto;
        background:#08723c;
        border:22px solid #4c2c17;
        border-radius:20px;
        box-shadow:inset 0 0 0 8px #062c1b,0 20px 50px rgba(0,0,0,.45);
        overflow:hidden;
    }

    .pocket{
        position:absolute;
        width:45px;
        height:45px;
        border-radius:50%;
        background:#050505;
        z-index:3;
    }

    .pocket.p1{left:-5px;top:-5px}
    .pocket.p2{right:-5px;top:-5px}
    .pocket.p3{left:-5px;bottom:-5px}
    .pocket.p4{right:-5px;bottom:-5px}
    .pocket.p5{left:50%;top:-5px;transform:translateX(-50%)}
    .pocket.p6{left:50%;bottom:-5px;transform:translateX(-50%)}

    .pool-ball{
        position:absolute;
        width:27px;
        height:27px;
        border-radius:50%;
        background:#fff;
        border:2px solid #111;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#111;
        font-size:10px;
        font-weight:900;
        z-index:5;
    }

    .cue-ball{
        background:#fff!important;
    }

    /* GENEL MOBİL */
    @media(max-width:700px){
        .okey-table{min-height:700px}
        .okey-tile{width:30px;height:43px;font-size:15px}
        .playing-card{width:43px;height:62px;font-size:16px}
        .board-inner{padding:12px 28px}
        .checker{width:27px;height:27px}
        .triangle{
            border-left-width:16px;
            border-right-width:16px;
            border-top-width:180px;
        }
        .die{width:40px;height:40px;font-size:22px}
        .dama-board{width:94vw}
    }
    `;

    document.head.appendChild(style);
}

injectGameCSS();

/* ============================================================
   101 OKEY
   ============================================================ */

const OkeyGame = (() => {

    let state = null;

    const colors = ["red","blue","black","green"];

    function createTiles() {
        const tiles = [];

        for (let color = 0; color < 4; color++) {
            for (let n = 1; n <= 13; n++) {
                for (let copy = 0; copy < 2; copy++) {
                    tiles.push({
                        id: `${color}-${n}-${copy}-${Math.random()}`,
                        color,
                        n,
                        joker:false
                    });
                }
            }
        }

        tiles.push(
            {id:"fake1",color:-1,n:0,joker:false,fake:true},
            {id:"fake2",color:-1,n:0,joker:false,fake:true}
        );

        return tiles;
    }

    function getIndicator(tiles) {
        const usable = tiles.filter(t => !t.fake);
        return usable[rand(0,usable.length-1)];
    }

    function makeOkey(indicator) {
        let n = indicator.n + 1;
        if (n > 13) n = 1;

        return {
            color:indicator.color,
            n,
            joker:true
        };
    }

    function tileText(t) {
        if (t.fake) return "★";
        if (t.joker) return "OK";
        return String(t.n);
    }

    function tileClass(t) {
        if (t.fake) return "";
        if (t.joker) return "green";
        return colors[t.color];
    }

    function createPlayer(name, human) {
        return {
            name,
            human,
            hand:[],
            discarded:[]
        };
    }

    function sortTiles(hand, pairs=false) {
        hand.sort((a,b) => {
            if (a.joker && !b.joker) return -1;
            if (!a.joker && b.joker) return 1;

            if (pairs) {
                const pa = a.n % 2;
                const pb = b.n % 2;
                if (pa !== pb) return pa - pb;
            }

            if (a.color !== b.color) return a.color - b.color;
            return a.n - b.n;
        });
    }

    function start() {
        state = {
            playerCount:4,
            players:[],
            deck:[],
            discard:[],
            indicator:null,
            okey:null,
            turn:0,
            phase:"draw",
            selected:[],
            handNo:1,
            roundScore:0
        };

        showPlayerSelect();
    }

    function showPlayerSelect() {
        openGameModal("🀄 101 Okey", `
            <div class="game-shell">
                <div class="game-status">
                    Kaç kişi oynayacaksınız?
                </div>

                <div class="players-select">
                    <button class="game-btn primary" data-players="2">👥 2 Kişi</button>
                    <button class="game-btn primary" data-players="3">👥 3 Kişi</button>
                    <button class="game-btn primary" data-players="4">👥 4 Kişi</button>
                </div>

                <div style="
                    max-width:650px;
                    margin:30px auto;
                    padding:22px;
                    border-radius:18px;
                    background:rgba(0,0,0,.2);
                    text-align:center;
                    line-height:1.7;
                ">
                    <b>101 Okey</b><br>
                    Gerçek masa düzeni, taş çekme, atılan taşlar,
                    taş dizme, çift dizme ve rakip sıraları.
                </div>
            </div>
        `);

        $$(".players-select button").forEach(btn => {
            btn.onclick = () => setup(Number(btn.dataset.players));
        });
    }

    function setup(count) {
        state.playerCount = count;

        state.players = [
            createPlayer("Sen",true),
            createPlayer("Oyuncu 2",false),
            createPlayer("Oyuncu 3",false),
            createPlayer("Oyuncu 4",false)
        ];

        state.players = state.players.slice(0,count);

        state.deck = shuffle(createTiles());
        state.indicator = getIndicator(state.deck);
        state.okey = makeOkey(state.indicator);

        /* Gerçek okey dağılımı: başlangıçta oyunculardan biri 15,
           diğerleri 14 taş alır. */
        for (let i=0;i<state.players.length;i++) {
            const amount = i === 0 ? 15 : 14;

            for (let j=0;j<amount;j++) {
                const t = state.deck.pop();
                if (t) state.players[i].hand.push(t);
            }
        }

        state.turn = 0;
        state.phase = "draw";
        sortTiles(state.players[0].hand);

        render();
    }

    function render() {
        const p = state.players[0];

        const opponents = state.players.slice(1);

        const opponentHTML = opponents.map((op,i) => `
            <div class="seat okey-seat ${
                i===0 ? "okey-top" :
                i===1 ? "okey-left" : "okey-right"
            }">
                <div>${esc(op.name)}</div>
                <div style="opacity:.75;font-size:13px">
                    ${op.hand.length} taş
                    ${state.turn===i+1 ? " • 🎯 SIRA ONDA" : ""}
                </div>
                <div class="tile-rack">
                    ${op.hand.slice(0,Math.min(op.hand.length,14))
                        .map(() => `<div class="okey-tile" style="background:#254c9a;color:transparent">?</div>`).join("")}
                </div>
                <div style="font-size:12px;opacity:.8">
                    ${op.discarded.length ? "Son atılan: "+tileText(op.discarded.at(-1)) : "Henüz taş atmadı"}
                </div>
            </div>
        `).join("");

        const playerTiles = p.hand.map((t,i) => `
            <div class="okey-tile ${tileClass(t)} ${
                state.selected.includes(i) ? "selected" : ""
            }" data-index="${i}">
                ${tileText(t)}
            </div>
        `).join("");

        const discardHTML = state.discard.slice(-30).map((t,i) => `
            <div class="okey-tile ${tileClass(t)}" style="transform:scale(.78)">
                ${tileText(t)}
            </div>
        `).join("");

        openGameModal("🀄 101 Okey", `
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn primary" id="okeyDraw">
                        🖐️ Taş Çek
                    </button>
                    <button class="game-btn success" id="okeyTakeDiscard">
                        ↩️ Son Taşı Al
                    </button>
                    <button class="game-btn" id="okeySort">
                        🔢 Taş Diz
                    </button>
                    <button class="game-btn" id="okeyPair">
                        🟡 Çift Diz
                    </button>
                    <button class="game-btn danger" id="okeyDiscard">
                        🗑️ Taş At
                    </button>
                    <button class="game-btn gold" id="okeyNew">
                        🔄 Yeni El
                    </button>
                </div>

                <div class="game-status" id="okeyStatus">
                    ${state.turn===0
                        ? "🎯 Sıra sende. Taş çek veya son taşı al."
                        : "⏳ Rakip oynuyor..."}
                </div>

                <div class="table okey-table">
                    ${opponentHTML}

                    <div class="discard-area">
                        <div style="font-weight:900;margin-bottom:8px">
                            MASA / ATILAN TAŞLAR
                        </div>
                        <div class="discard-pile">
                            ${discardHTML || "<span style='opacity:.6'>Henüz taş atılmadı</span>"}
                        </div>
                        <div style="margin-top:8px">
                            Gösterge:
                            <span class="okey-tile ${tileClass(state.indicator)}"
                                  style="display:inline-flex;vertical-align:middle">
                                ${tileText(state.indicator)}
                            </span>
                            → Okey:
                            <b>${state.okey.n}</b>
                        </div>
                    </div>

                    <div class="seat okey-seat okey-bottom">
                        <div>
                            👤 Sen
                            ${state.turn===0 ? " • 🎯 SIRA SENDE" : ""}
                        </div>

                        <div class="tile-rack" id="okeyHand">
                            ${playerTiles}
                        </div>

                        <div style="font-size:12px;opacity:.8">
                            ${p.hand.length} taş
                        </div>
                    </div>
                </div>
            </div>
        `);

        $$("#okeyHand .okey-tile").forEach(el => {
            el.onclick = () => {
                const index = Number(el.dataset.index);

                if (state.turn !== 0) return;

                if (state.selected.includes(index)) {
                    state.selected = state.selected.filter(x => x !== index);
                } else {
                    state.selected.push(index);
                }

                render();
            };
        });

        $("#okeyDraw").onclick = drawTile;
        $("#okeyTakeDiscard").onclick = takeDiscard;
        $("#okeyDiscard").onclick = discardSelected;
        $("#okeySort").onclick = () => {
            sortTiles(p.hand,false);
            state.selected=[];
            render();
        };

        $("#okeyPair").onclick = () => {
            sortTiles(p.hand,true);
            state.selected=[];
            render();
        };

        $("#okeyNew").onclick = () => setup(state.playerCount);
    }

    function drawTile() {
        if (state.turn !== 0) return;

        if (state.deck.length === 0) {
            notify("Deste bitti. Yeni el başlıyor.");
            setup(state.playerCount);
            return;
        }

        const t = state.deck.pop();
        state.players[0].hand.push(t);
        state.phase = "discard";
        state.selected=[];

        render();
    }

    function takeDiscard() {
        if (state.turn !== 0) return;
        if (!state.discard.length) {
            notify("Alınacak atılmış taş yok.");
            return;
        }

        const t = state.discard.pop();
        state.players[0].hand.push(t);
        state.phase="discard";

        render();
    }

    function discardSelected() {
        if (state.turn !== 0) return;

        if (state.players[0].hand.length <= 0) return;

        let index = state.selected[0];

        if (index == null) {
            notify("Önce atacağın taşı seç.");
            return;
        }

        const [tile] = state.players[0].hand.splice(index,1);

        state.discard.push(tile);
        state.selected=[];
        state.turn=1;
        state.phase="draw";

        render();

        setTimeout(botTurn,700);
    }

    async function botTurn() {
        if (!state || state.turn === 0) return;

        const bot = state.players[state.turn];

        await delay(rand(700,1300));

        if (state.deck.length) {
            bot.hand.push(state.deck.pop());
        }

        await delay(rand(500,900));

        if (bot.hand.length) {
            sortTiles(bot.hand);
            const index = rand(0,bot.hand.length-1);
            const [tile] = bot.hand.splice(index,1);
            bot.discarded.push(tile);
            state.discard.push(tile);
        }

        if (bot.hand.length === 0) {
            gameReward(true);
            notify(bot.name+" oyunu kazandı!");
            return;
        }

        state.turn++;

        if (state.turn >= state.players.length) {
            state.turn=0;
        }

        render();

        if (state.turn !== 0) {
            setTimeout(botTurn,500);
        }
    }

    return {start};
})();

/* ============================================================
   TAVLA
   ============================================================ */

const TavlaGame = (() => {

    let state;

    function start() {
        state = {
            points:Array.from({length:24},()=>[]),
            bar:{white:0,black:0},
            off:{white:0,black:0},
            turn:"white",
            dice:[0,0],
            used:[false,false],
            moving:false,
            wins:0
        };

        /* Gerçek başlangıç dizilimi */
        state.points[0]=Array(2).fill("white");
        state.points[11]=Array(5).fill("black");
        state.points[16]=Array(3).fill("black");
        state.points[18]=Array(5).fill("white");

        state.points[23]=Array(2).fill("black");
        state.points[12]=Array(5).fill("white");
        state.points[7]=Array(3).fill("white");
        state.points[5]=Array(5).fill("black");

        render();
    }

    function rollDice() {
        if (state.turn !== "white" || state.moving) return;

        state.dice=[
            rand(1,6),
            rand(1,6)
        ];

        state.used=[false,false];

        if (state.dice[0]===state.dice[1]) {
            state.used=[false,false];
            state.extraDoubles=2;
        } else {
            state.extraDoubles=0;
        }

        render();

        setTimeout(botTurn,1000);
    }

    function legalMove(from,to,color,distance) {
        if (distance < 1 || distance > 6) return false;

        if (state.bar[color] > 0) return false;

        if (!state.points[from].length) return false;
        if (state.points[from][state.points[from].length-1] !== color)
            return false;

        const target = state.points[to];

        if (target.length >= 2 && target[0] !== color)
            return false;

        return true;
    }

    function move(from,to) {
        if (state.turn!=="white") return;

        const distance=Math.abs(to-from);

        if (!legalMove(from,to,"white",distance)) {
            notify("Bu hamle yapılamaz.");
            return;
        }

        const dieIndex=state.dice.findIndex(
            (d,i)=>!state.used[i] && d===distance
        );

        if (dieIndex<0) {
            notify("Bu mesafede kullanılabilir zar yok.");
            return;
        }

        state.used[dieIndex]=true;

        const checker=state.points[from].pop();

        if (
            state.points[to].length===1 &&
            state.points[to][0]==="black"
        ) {
            state.points[to].pop();
            state.bar.black++;
        }

        state.points[to].push(checker);

        if (state.used.every(Boolean)) {
            state.turn="black";
            setTimeout(botMove,700);
        }

        render();
    }

    function render() {
        const pointHTML = state.points.map((pile,i) => `
            <div class="point ${i>=12 ? "bottom":""}" data-point="${i}">
                <div class="triangle"></div>
                <div class="checkers">
                    ${pile.map(c=>`
                        <div class="checker ${c}"></div>
                    `).join("")}
                </div>
                <small style="
                    position:absolute;
                    ${i>=12?"bottom":"top"}:0;
                    color:#111;font-weight:900;
                ">${i+1}</small>
            </div>
        `).join("");

        openGameModal("⚫ Klasik Tavla",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn primary" id="rollDice">
                        🎲 ZAR AT
                    </button>
                    <button class="game-btn gold" id="newBackgammon">
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div class="game-status">
                    ${state.turn==="white"
                        ? "🎯 Sıra sende"
                        : "⏳ Rakip düşünüyor..."}
                </div>

                <div class="table backgammon">
                    <div class="board-inner">
                        <div class="bar"></div>

                        ${pointHTML}

                        <div class="dice-center">
                            <div style="
                                background:rgba(0,0,0,.55);
                                padding:7px 12px;
                                border-radius:10px;
                            ">
                                ${state.turn==="white"?"SEN":"RAKİP"}
                            </div>

                            <div class="dice">
                                <div class="die">
                                    ${state.dice[0] || "–"}
                                </div>
                                <div class="die">
                                    ${state.dice[1] || "–"}
                                </div>
                            </div>

                            <button class="game-btn primary" id="centerRoll">
                                🎲 Zar At
                            </button>
                        </div>
                    </div>

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        margin-top:12px;
                        font-weight:900;
                    ">
                        <span>⚪ Sen: ${
                            countCheckers("white")
                        } pul</span>

                        <span>
                            BAR ⚪ ${state.bar.white}
                            • ⚫ ${state.bar.black}
                        </span>

                        <span>⚫ Rakip: ${
                            countCheckers("black")
                        } pul</span>
                    </div>
                </div>

                <div style="
                    text-align:center;
                    margin-top:12px;
                    opacity:.8;
                ">
                    Bir pulun bulunduğu haneden gitmek istediğin haneye tıkla.
                    Zar mesafesi kullanılacaktır.
                </div>
            </div>
        `);

        $("#rollDice").onclick=rollDice;
        $("#centerRoll").onclick=rollDice;
        $("#newBackgammon").onclick=start;

        $$(".point").forEach(el => {
            el.onclick=()=>{
                const to=Number(el.dataset.point);

                const from=state.points.findIndex(
                    pile=>pile.length &&
                    pile[pile.length-1]==="white"
                );

                if (from>=0) move(from,to);
            };
        });
    }

    function countCheckers(color) {
        let n=state.off[color];

        state.points.forEach(p=>{
            p.forEach(c=>{
                if(c===color)n++;
            });
        });

        n+=state.bar[color];
        return n;
    }

    async function botTurn() {
        if (!state || state.turn!=="black") return;

        await delay(800);

        const moves=[];

        state.points.forEach((pile,i)=>{
            if(pile.length && pile[pile.length-1]==="black"){
                state.dice.forEach((d,di)=>{
                    if(!state.used[di]){
                        const to=i-d;
                        if(to>=0 && legalMove(i,to,"black",d)){
                            moves.push({from:i,to,d,di});
                        }
                    }
                });
            }
        });

        if(moves.length){
            const m=moves[rand(0,moves.length-1)];
            state.used[m.di]=true;

            const checker=state.points[m.from].pop();

            if(
                state.points[m.to].length===1 &&
                state.points[m.to][0]==="white"
            ){
                state.points[m.to].pop();
                state.bar.white++;
            }

            state.points[m.to].push(checker);
        }

        state.turn="white";
        state.dice=[0,0];
        state.used=[false,false];

        render();
    }

    return {start};
})();

/* ============================================================
   TÜRK DAMASI
   ============================================================ */

const DamaGame = (() => {

    let board;
    let selected=null;
    let turn="white";

    function start() {
        board=[];

        for(let r=0;r<8;r++){
            board[r]=Array(8).fill(null);
        }

        /* Türk daması başlangıç */
        for(let c=0;c<8;c++){
            board[0][c]="black";
            board[1][c]="black";
            board[2][c]="black";

            board[5][c]="white";
            board[6][c]="white";
            board[7][c]="white";
        }

        selected=null;
        turn="white";

        render();
    }

    function inside(r,c){
        return r>=0 && r<8 && c>=0 && c<8;
    }

    function getMoves(r,c){
        const piece=board[r][c];
        if(!piece)return [];

        const color=piece.color;
        const king=piece.king;

        const dirs=[
            [1,0],[-1,0],[0,1],[0,-1]
        ];

        const moves=[];

        if(!king){
            const dr=color==="white" ? -1 : 1;

            for(const dc of [-1,0,1]){
                const nr=r+dr,nc=c+dc;

                if(inside(nr,nc) && !board[nr][nc]){
                    moves.push({
                        r:nr,c:nc,
                        capture:null
                    });
                }
            }

            for(const [dr2,dc2] of dirs){
                const mr=r+dr2,mc=c+dc2;
                const nr=r+dr2*2,nc=c+dc2*2;

                if(
                    inside(nr,nc) &&
                    board[mr]?.[mc] &&
                    board[mr][mc].color!==color &&
                    !board[nr][nc]
                ){
                    moves.push({
                        r:nr,c:nc,
                        capture:{r:mr,c:mc}
                    });
                }
            }
        } else {
            for(const [dr,dc] of dirs){
                let nr=r+dr,nc=c+dc;
                let enemy=null;

                while(inside(nr,nc)){
                    if(!board[nr][nc]){
                        moves.push({
                            r:nr,c:nc,
                            capture:enemy
                        });
                    }else{
                        if(board[nr][nc].color===color)break;

                        if(enemy)break;

                        enemy={r:nr,c:nc};
                    }

                    nr+=dr;
                    nc+=dc;
                }
            }
        }

        return moves;
    }

    function allCaptures(color){
        const result=[];

        for(let r=0;r<8;r++){
            for(let c=0;c<8;c++){
                if(board[r][c]?.color===color){
                    getMoves(r,c)
                        .filter(m=>m.capture)
                        .forEach(m=>{
                            result.push({from:{r,c},move:m});
                        });
                }
            }
        }

        return result;
    }

    function clickCell(r,c){
        if(turn!=="white")return;

        if(selected){
            const moves=getMoves(selected.r,selected.c);

            const move=moves.find(m=>m.r===r&&m.c===c);

            if(move){
                executeMove(selected,move);
                return;
            }
        }

        if(board[r][c]?.color==="white"){
            const forced=allCaptures("white");

            if(
                forced.length &&
                !forced.some(x=>x.from.r===r&&x.from.c===c)
            ){
                notify("⚠️ Taş yemen zorunlu.");
                return;
            }

            selected={r,c};
            render();
        }
    }

    function executeMove(from,move){
        const piece=board[from.r][from.c];

        board[move.r][move.c]=piece;
        board[from.r][from.c]=null;

        if(move.capture){
            board[move.capture.r][move.capture.c]=null;
        }

        if(
            piece.color==="white" &&
            move.r===0
        ){
            piece.king=true;
        }

        selected=null;

        /* Zincir yeme */
        if(move.capture){
            const next=getMoves(move.r,move.c)
                .filter(m=>m.capture);

            if(next.length){
                selected={r:move.r,c:move.c};
                render();
                notify("🔥 Devam eden yeme var!");
                return;
            }
        }

        turn="black";
        render();

        setTimeout(botMove,700);
    }

    function botMove(){
        if(turn!=="black")return;

        const captures=allCaptures("black");

        let chosen;

        if(captures.length){
            chosen=captures[rand(0,captures.length-1)];
        }else{
            const moves=[];

            for(let r=0;r<8;r++){
                for(let c=0;c<8;c++){
                    if(board[r][c]?.color==="black"){
                        getMoves(r,c)
                            .filter(m=>!m.capture)
                            .forEach(move=>{
                                moves.push({
                                    from:{r,c},
                                    move
                                });
                            });
                    }
                }
            }

            if(moves.length){
                chosen=moves[rand(0,moves.length-1)];
            }
        }

        if(!chosen){
            gameReward(true);
            notify("🏆 Dama'yı kazandın!");
            return;
        }

        executeBot(chosen);

        turn="white";
        render();
    }

    function executeBot(x){
        const piece=board[x.from.r][x.from.c];

        board[x.move.r][x.move.c]=piece;
        board[x.from.r][x.from.c]=null;

        if(x.move.capture){
            board[x.move.capture.r][x.move.capture.c]=null;
        }

        if(
            piece.color==="black" &&
            x.move.r===7
        ){
            piece.king=true;
        }
    }

    function render(){
        const cells=[];

        for(let r=0;r<8;r++){
            for(let c=0;c<8;c++){
                const p=board[r][c];

                cells.push(`
                    <div
                        class="dama-cell ${(r+c)%2?"dark":"light"}
                        data-r="${r}"
                        data-c="${c}"
                        ${selected&&selected.r===r&&selected.c===c
                            ? 'style="outline:5px solid #ffd166;outline-offset:-5px"'
                            : ""}
                    >
                        ${
                            p
                            ? `<div class="dama-piece ${p.color} ${p.king?"king":""}"></div>`
                            : ""
                        }
                    </div>
                `);
            }
        }

        openGameModal("🔴 Türk Daması",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="newDama">
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div class="game-status">
                    ${turn==="white"
                        ?"🎯 Sıra sende"
                        :"⏳ Rakip oynuyor..."}
                </div>

                <div class="dama-board">
                    ${cells.join("")}
                </div>

                <div style="
                    text-align:center;
                    margin-top:15px;
                    font-weight:800;
                ">
                    Rakip taşı varsa yeme zorunludur.
                    Taşın son sıraya ulaşırsa DAMA olur.
                </div>
            </div>
        `);

        $$(".dama-cell").forEach(cell=>{
            cell.onclick=()=>clickCell(
                Number(cell.dataset.r),
                Number(cell.dataset.c)
            );
        });

        $("#newDama").onclick=start;
    }

    return {start};
})();

/* ============================================================
   BATAK
   ============================================================ */

const BatakGame = (() => {

    let state;

    const suits=[
        {s:"♠",name:"Maça",red:false},
        {s:"♥",name:"Kupa",red:true},
        {s:"♦",name:"Karo",red:true},
        {s:"♣",name:"Sinek",red:false}
    ];

    function createDeck(){
        const d=[];

        for(const suit of suits){
            for(let rank=2;rank<=14;rank++){
                d.push({
                    suit:suit.s,
                    suitName:suit.name,
                    rank,
                    red:suit.red
                });
            }
        }

        return shuffle(d);
    }

    function cardName(c){
        const names={
            14:"A",
            13:"K",
            12:"Q",
            11:"J"
        };

        return (names[c.rank]||c.rank)+c.suit;
    }

    function start(){
        state={
            players:[
                {name:"Sen",human:true,hand:[],score:0,tricks:0},
                {name:"Rakip 2",human:false,hand:[],score:0,tricks:0},
                {name:"Rakip 3",human:false,hand:[],score:0,tricks:0},
                {name:"Rakip 4",human:false,hand:[],score:0,tricks:0}
            ],
            deck:createDeck(),
            trump:null,
            turn:0,
            trick:[],
            leadSuit:null,
            handNo:1
        };

        deal();
    }

    function deal(){
        state.deck=createDeck();

        state.players.forEach(p=>{
            p.hand=[];
            p.tricks=0;
        });

        for(let i=0;i<52;i++){
            state.players[i%4].hand.push(state.deck[i]);
        }

        state.players.forEach(p=>{
            p.hand.sort((a,b)=>{
                if(a.suit!==b.suit)
                    return a.suit.localeCompare(b.suit);

                return b.rank-a.rank;
            });
        });

        /* İlk oyuncu rastgele koz belirler */
        state.trump=suits[rand(0,3)].s;
        state.turn=0;
        state.trick=[];
        state.leadSuit=null;

        render();
    }

    function canPlay(card,p){
        if(!state.leadSuit)return true;

        const sameSuit=p.hand.filter(c=>c.suit===state.leadSuit);

        if(sameSuit.length){
            return card.suit===state.leadSuit;
        }

        return true;
    }

    function playHuman(index){
        if(state.turn!==0)return;

        const p=state.players[0];
        const card=p.hand[index];

        if(!card)return;

        if(!canPlay(card,p)){
            notify("♠ Elinde o renk var. O rengi oynamalısın.");
            return;
        }

        p.hand.splice(index,1);

        state.trick.push({
            player:0,
            card
        });

        if(!state.leadSuit)
            state.leadSuit=card.suit;

        if(state.trick.length===4){
            render();
            setTimeout(resolveTrick,800);
        }else{
            state.turn=1;
            render();
            setTimeout(botPlay,700);
        }
    }

    function botPlay(){
        if(state.turn===0)return;

        const p=state.players[state.turn];

        let options=p.hand.filter(c=>canPlay(c,p));

        if(!options.length)options=[...p.hand];

        const card=options[rand(0,options.length-1)];

        p.hand.splice(p.hand.indexOf(card),1);

        state.trick.push({
            player:state.turn,
            card
        });

        if(!state.leadSuit)
            state.leadSuit=card.suit;

        if(state.trick.length===4){
            render();
            setTimeout(resolveTrick,700);
            return;
        }

        state.turn++;

        if(state.turn>=4)state.turn=0;

        render();

        if(state.turn!==0)
            setTimeout(botPlay,650);
    }

    function winner(){
        let best=null;

        for(const item of state.trick){
            const c=item.card;

            if(!best){
                best=item;
                continue;
            }

            const b=best.card;

            if(c.suit===state.trump && b.suit!==state.trump){
                best=item;
                continue;
            }

            if(
                c.suit===b.suit &&
                c.rank>b.rank
            ){
                best=item;
            }
        }

        return best.player;
    }

    function resolveTrick(){
        const w=winner();

        state.players[w].tricks++;
        state.turn=w;

        state.trick=[];
        state.leadSuit=null;

        if(state.players[0].hand.length===0){
            finishHand();
            return;
        }

        render();

        if(state.turn!==0)
            setTimeout(botPlay,700);
    }

    function finishHand(){
        state.players.forEach(p=>{
            p.score+=p.tricks;
        });

        if(state.players[0].tricks>=state.players[1].tricks &&
           state.players[0].tricks>=state.players[2].tricks &&
           state.players[0].tricks>=state.players[3].tricks){
            gameReward(true);
        }else{
            gameReward(false);
        }

        notify(
            `El bitti. Sen ${state.players[0].tricks} el aldın.`
        );

        render(true);
    }

    function cardHTML(card,back=false,index=null){
        if(back){
            return `<div class="playing-card card-back">?</div>`;
        }

        return `
            <div
                class="playing-card ${card.red?"red":""}"
                ${index!==null?`data-card="${index}"`:""}
            >
                ${cardName(card)}
            </div>
        `;
    }

    function render(finished=false){
        const p=state.players[0];

        const trickHTML=state.trick.map(item=>`
            <div style="text-align:center">
                <div style="font-size:11px;margin-bottom:3px">
                    ${esc(state.players[item.player].name)}
                </div>
                ${cardHTML(item.card)}
            </div>
        `).join("");

        openGameModal("🂡 Batak",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="newBatak">
                        🔄 Yeni El
                    </button>
                </div>

                <div class="game-status">
                    ${finished
                        ?"🏁 El tamamlandı."
                        :`🎴 Koz: <b>${state.trump}</b> • ${
                            state.turn===0
                            ?"Sıra sende"
                            :"Rakip oynuyor..."
                        }`}
                </div>

                <div class="table card-table">
                    <div class="seat">
                        Rakip 3 • ${state.players[2].tricks} el
                        <div class="card-hand">
                            ${Array.from({
                                length:state.players[2].hand.length
                            },()=>cardHTML(null,true)).join("")}
                        </div>
                    </div>

                    <div class="seat" style="margin-top:10px">
                        Rakip 2 • ${state.players[1].tricks} el
                        <div class="card-hand">
                            ${Array.from({
                                length:Math.min(
                                    state.players[1].hand.length,8
                                )
                            },()=>cardHTML(null,true)).join("")}
                        </div>
                    </div>

                    <div class="trick-area">
                        ${trickHTML||"<span style='opacity:.6'>El bekliyor...</span>"}
                    </div>

                    <div class="seat">
                        Rakip 4 • ${state.players[3].tricks} el
                    </div>

                    <div style="margin-top:15px">
                        <div style="text-align:center;font-weight:900">
                            👤 Sen • ${p.tricks} el
                        </div>

                        <div class="card-hand" id="batakHand">
                            ${p.hand.map((c,i)=>cardHTML(c,false,i)).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `);

        $$("#batakHand .playing-card").forEach(el=>{
            el.onclick=()=>playHuman(Number(el.dataset.card));
        });

        $("#newBatak").onclick=start;
    }

    return {start};
})();

/* ============================================================
   BİLARDO
   ============================================================ */

const BilardoGame = (() => {

    let state;

    function start(){
        state={
            balls:[],
            cue:{
                x:18,
                y:50
            },
            angle:0,
            power:35,
            turn:"player",
            score:0,
            shots:0,
            ballsLeft:15
        };

        createBalls();
        render();
    }

    function createBalls(){
        state.balls=[
            {
                id:0,
                x:18,
                y:50,
                vx:0,
                vy:0,
                color:"#fff",
                cue:true
            }
        ];

        let id=1;
        const startX=72;
        const startY=50;

        for(let row=0;row<5;row++){
            for(let col=0;col<=row;col++){
                state.balls.push({
                    id:id++,
                    x:startX+row*4,
                    y:startY+(col-row/2)*4,
                    vx:0,
                    vy:0,
                    color:id%2?"#d33":"#2464d6"
                });
            }
        }
    }

    function shoot(){
        if(state.turn!=="player")return;

        const cue=state.balls.find(b=>b.cue);

        if(!cue)return;

        const rad=state.angle*Math.PI/180;

        cue.vx=Math.cos(rad)*(state.power/10);
        cue.vy=Math.sin(rad)*(state.power/10);

        state.shots++;
        state.turn="moving";

        render();

        gameTimer=setInterval(physics,30);
    }

    function physics(){
        let moving=false;

        for(const b of state.balls){
            b.x+=b.vx;
            b.y+=b.vy;

            b.vx*=.985;
            b.vy*=.985;

            if(b.x<3){
                b.x=3;
                b.vx*=-1;
            }

            if(b.x>97){
                b.x=97;
                b.vx*=-1;
            }

            if(b.y<4){
                b.y=4;
                b.vy*=-1;
            }

            if(b.y>96){
                b.y=96;
                b.vy*=-1;
            }

            if(Math.abs(b.vx)>.03 || Math.abs(b.vy)>.03)
                moving=true;
        }

        /* Basit top çarpışması */
        for(let i=0;i<state.balls.length;i++){
            for(let j=i+1;j<state.balls.length;j++){
                const a=state.balls[i];
                const b=state.balls[j];

                const dx=b.x-a.x;
                const dy=b.y-a.y;
                const dist=Math.sqrt(dx*dx+dy*dy);

                if(dist<3 && dist>.01){
                    const nx=dx/dist;
                    const ny=dy/dist;

                    const av=a.vx*nx+a.vy*ny;
                    const bv=b.vx*nx+b.vy*ny;

                    a.vx+=(bv-av)*nx;
                    a.vy+=(bv-av)*ny;

                    b.vx+=(av-bv)*nx;
                    b.vy+=(av-bv)*ny;
                }
            }
        }

        render();

        if(!moving){
            clearInterval(gameTimer);
            state.turn="player";

            if(state.balls.filter(b=>!b.cue).length===0){
                gameReward(true);
                notify("🎱 Muhteşem! Masayı temizledin.");
                createBalls();
            }
        }
    }

    function render(){
        const balls=state.balls.map(b=>`
            <div
                class="pool-ball ${b.cue?"cue-ball":""}"
                style="
                    left:${b.x}%;
                    top:${b.y}%;
                    transform:translate(-50%,-50%);
                    ${b.color?`background:${b.color}`:""}
                "
            >${b.cue?"":b.id}</div>
        `).join("");

        openGameModal("🎱 Bilardo",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn" id="angleMinus">↶ Açı -</button>
                    <button class="game-btn" id="anglePlus">↷ Açı +</button>
                    <button class="game-btn" id="powerMinus">− Güç</button>
                    <button class="game-btn" id="powerPlus">+ Güç</button>
                    <button class="game-btn primary" id="shootPool">
                        🎯 VUR
                    </button>
                    <button class="game-btn gold" id="newPool">
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div class="game-status">
                    Atış: ${state.shots}
                    • Güç: ${Math.round(state.power)}
                    • Açı: ${Math.round(state.angle)}°
                    • ${state.turn==="player"?"Sıra sende":"Toplar hareket ediyor..."}
                </div>

                <div class="pool-table">
                    <div class="pocket p1"></div>
                    <div class="pocket p2"></div>
                    <div class="pocket p3"></div>
                    <div class="pocket p4"></div>
                    <div class="pocket p5"></div>
                    <div class="pocket p6"></div>

                    ${balls}
                </div>

                <div style="
                    text-align:center;
                    margin-top:15px;
                    opacity:.8;
                ">
                    Açı ve gücü ayarla → VUR.
                    Toplar durunca yeni atış hakkın devam eder.
                </div>
            </div>
        `);

        $("#angleMinus").onclick=()=>{
            state.angle-=10;
            render();
        };

        $("#anglePlus").onclick=()=>{
            state.angle+=10;
            render();
        };

        $("#powerMinus").onclick=()=>{
            state.power=Math.max(10,state.power-5);
            render();
        };

        $("#powerPlus").onclick=()=>{
            state.power=Math.min(100,state.power+5);
            render();
        };

        $("#shootPool").onclick=shoot;
        $("#newPool").onclick=start;
    }

    return {start};
})();

/* ============================================================
   MAHJONG
   ============================================================ */

const MahjongGame = (() => {

    let state;

    function start(){
        const symbols=[
            "🀀","🀁","🀂","🀃",
            "🀄","🀅","🀆",
            "🀇","🀈","🀉","🀊","🀋"
        ];

        let tiles=[];

        symbols.forEach(s=>{
            for(let i=0;i<4;i++)tiles.push(s);
        });

        state={
            tiles:shuffle(tiles).slice(0,24),
            selected:[],
            level:1
        };

        render();
    }

    function render(){
        openGameModal("🀙 Mahjong",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="newMahjong">
                        🔄 Yeni Tahta
                    </button>
                </div>

                <div class="game-status">
                    Aynı iki taşı eşleştir.
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(6,1fr);
                    gap:8px;
                    max-width:700px;
                    margin:auto;
                ">
                    ${state.tiles.map((t,i)=>`
                        <button
                            class="okey-tile"
                            data-i="${i}"
                            style="
                                width:auto;
                                height:70px;
                                font-size:28px;
                            "
                        >${state.selected.includes(i)?"":"🀫"}</button>
                    `).join("")}
                </div>
            </div>
        `);

        $$(".okey-tile").forEach(el=>{
            el.onclick=()=>{
                const i=Number(el.dataset.i);

                if(state.selected.includes(i))return;

                state.selected.push(i);

                if(state.selected.length===2){
                    const [a,b]=state.selected;

                    if(state.tiles[a]===state.tiles[b]){
                        state.tiles[a]=null;
                        state.tiles[b]=null;
                        state.tiles=state.tiles.filter(Boolean);

                        addXP(20);

                        if(!state.tiles.length){
                            gameReward(true);
                            notify("🀙 Mahjong tamamlandı!");
                        }
                    }else{
                        notify("Eşleşmedi.");
                    }

                    state.selected=[];
                }

                render();
            };
        });

        $("#newMahjong").onclick=start;
    }

    return {start};
})();

/* ============================================================
   SUDOKU
   ============================================================ */

const SudokuGame = (() => {

    let board;

    function start(){
        board=Array.from({length:9},()=>Array(9).fill(0));

        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                board[r][c]=((r*3+Math.floor(r/3)+c)%9)+1;
            }
        }

        /* bazılarını boşalt */
        for(let i=0;i<42;i++){
            board[rand(0,8)][rand(0,8)]=0;
        }

        render();
    }

    function render(){
        openGameModal("🔢 Sudoku",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="newSudoku">
                        🔄 Yeni Bulmaca
                    </button>
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(9,1fr);
                    max-width:600px;
                    margin:auto;
                    border:4px solid #fff;
                ">
                    ${board.flatMap((row,r)=>
                        row.map((v,c)=>`
                            <input
                                class="sudoku-cell"
                                data-r="${r}"
                                data-c="${c}"
                                value="${v||""}"
                                maxlength="1"
                                inputmode="numeric"
                                style="
                                    width:100%;
                                    aspect-ratio:1;
                                    text-align:center;
                                    font-size:22px;
                                    font-weight:900;
                                    border:1px solid #777;
                                    background:${
                                        (Math.floor(r/3)+Math.floor(c/3))%2
                                        ?"rgba(108,99,255,.15)"
                                        :"rgba(255,255,255,.05)"
                                    };
                                    color:inherit;
                                "
                            >
                        `)
                    ).join("")}
                </div>
            </div>
        `);

        $$(".sudoku-cell").forEach(input=>{
            input.oninput=()=>{
                input.value=input.value.replace(/[^1-9]/g,"");
                check();
            };
        });

        $("#newSudoku").onclick=start;
    }

    function check(){
        const complete=board.every(row=>row.every(Boolean));

        if(complete){
            gameReward(true);
            notify("🎉 Sudoku tamamlandı!");
        }
    }

    return {start};
})();

/* ============================================================
   BUBBLE SHOOTER
   ============================================================ */

const BubbleGame = (() => {

    let bubbles;
    let shots;

    function start(){
        shots=0;
        bubbles=[];

        for(let i=0;i<35;i++){
            bubbles.push({
                color:rand(0,4),
                x:rand(8,92),
                y:rand(8,45)
            });
        }

        render();
    }

    function shoot(){
        if(!bubbles.length){
            gameReward(true);
            start();
            return;
        }

        shots++;

        const color=rand(0,4);
        const index=bubbles.findIndex(b=>b.color===color);

        if(index>=0){
            bubbles.splice(index,1);
            addXP(5);
        }

        render();
    }

    function render(){
        const colors=["🔴","🟡","🟢","🔵","🟣"];

        openGameModal("🫧 Bubble Shooter",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn primary" id="bubbleShoot">
                        🫧 Ateş Et
                    </button>
                    <button class="game-btn gold" id="bubbleNew">
                        🔄 Yeni Bölüm
                    </button>
                </div>

                <div style="
                    position:relative;
                    height:550px;
                    background:#08172b;
                    border-radius:20px;
                    overflow:hidden;
                ">
                    ${bubbles.map(b=>`
                        <div style="
                            position:absolute;
                            left:${b.x}%;
                            top:${b.y}%;
                            font-size:42px;
                        ">${colors[b.color]}</div>
                    `).join("")}

                    <div style="
                        position:absolute;
                        bottom:15px;
                        left:50%;
                        transform:translateX(-50%);
                        font-size:50px;
                    ">🔵</div>
                </div>

                <div class="game-status">
                    Kalan balon: ${bubbles.length} • Atış: ${shots}
                </div>
            </div>
        `);

        $("#bubbleShoot").onclick=shoot;
        $("#bubbleNew").onclick=start;
    }

    return {start};
})();

/* ============================================================
   ARABA YARIŞI
   ============================================================ */

const RaceGame = (() => {

    let state;

    function start(){
        state={
            level:1,
            player:45,
            opponents:[20,60,80],
            distance:0,
            speed:4,
            finished:false
        };

        render();

        clearInterval(gameTimer);

        gameTimer=setInterval(()=>{
            if(state.finished)return;

            state.distance+=state.speed;

            state.opponents=state.opponents.map(
                x=>x+rand(-2,2)
            );

            if(state.distance>=100){
                state.finished=true;
                gameReward(true);
                notify("🏁 Yarışı kazandın!");
            }

            render();
        },500);
    }

    function left(){
        state.player=Math.max(8,state.player-6);
        render();
    }

    function right(){
        state.player=Math.min(92,state.player+6);
        render();
    }

    function render(){
        openGameModal("🏎️ Araba Yarışı",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn" id="raceLeft">⬅️</button>
                    <button class="game-btn primary" id="raceBoost">
                        🚀 TURBO
                    </button>
                    <button class="game-btn" id="raceRight">➡️</button>
                    <button class="game-btn gold" id="raceNew">
                        🔄 Yeni Yarış
                    </button>
                </div>

                <div class="game-status">
                    Mesafe: ${Math.min(100,state.distance)}%
                </div>

                <div style="
                    position:relative;
                    height:600px;
                    max-width:500px;
                    margin:auto;
                    background:
                        repeating-linear-gradient(
                            to bottom,
                            #333 0px,
                            #333 80px,
                            #555 80px,
                            #555 160px
                        );
                    border-left:45px solid #222;
                    border-right:45px solid #222;
                    overflow:hidden;
                ">
                    ${state.opponents.map((x,i)=>`
                        <div style="
                            position:absolute;
                            left:${x}%;
                            top:${20+i*18}%;
                            font-size:42px;
                        ">🚗</div>
                    `).join("")}

                    <div style="
                        position:absolute;
                        left:${state.player}%;
                        bottom:25px;
                        transform:translateX(-50%);
                        font-size:48px;
                    ">🏎️</div>
                </div>
            </div>
        `);

        $("#raceLeft").onclick=left;
        $("#raceRight").onclick=right;

        $("#raceBoost").onclick=()=>{
            state.speed=8;
            setTimeout(()=>{
                state.speed=4;
            },1500);
        };

        $("#raceNew").onclick=start;
    }

    return {start};
})();

/* ============================================================
   BLOCK PUZZLE
   ============================================================ */

const BlockGame = (() => {

    let grid;

    function start(){
        grid=Array.from({length:8},()=>Array(8).fill(false));
        render();
    }

    function toggle(r,c){
        grid[r][c]=!grid[r][c];

        const fullRows=grid
            .map((row,i)=>row.every(Boolean)?i:-1)
            .filter(i=>i>=0);

        if(fullRows.length){
            fullRows.forEach(r=>{
                grid[r]=Array(8).fill(false);
            });

            gameReward(false);
        }

        render();
    }

    function render(){
        openGameModal("🧩 Block Puzzle",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="newBlock">
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(8,1fr);
                    width:min(92vw,520px);
                    margin:auto;
                    gap:4px;
                ">
                    ${grid.flatMap((row,r)=>
                        row.map((v,c)=>`
                            <button
                                data-r="${r}"
                                data-c="${c}"
                                style="
                                    aspect-ratio:1;
                                    border:0;
                                    border-radius:8px;
                                    background:${
                                        v?"#6c63ff":"#202a49"
                                    };
                                "
                            ></button>
                        `)
                    ).join("")}
                </div>
            </div>
        `);

        $$("[data-r]").forEach(el=>{
            el.onclick=()=>toggle(
                Number(el.dataset.r),
                Number(el.dataset.c)
            );
        });

        $("#newBlock").onclick=start;
    }

    return {start};
})();

/* ============================================================
   OKÇULUK
   ============================================================ */

const ArcheryGame = (() => {

    let scoreA=0;

    function start(){
        scoreA=0;
        render();
    }

    function shoot(){
        const points=[10,20,30,50,100];
        scoreA+=points[rand(0,points.length-1)];

        if(scoreA>=500){
            gameReward(true);
            notify("🏹 Hedef tamamlandı!");
            scoreA=0;
        }

        render();
    }

    function render(){
        openGameModal("🏹 Okçuluk",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn primary" id="archShoot">
                        🏹 ATIŞ YAP
                    </button>
                    <button class="game-btn gold" id="archNew">
                        🔄 Yeni Seri
                    </button>
                </div>

                <div style="
                    width:min(85vw,550px);
                    aspect-ratio:1;
                    border-radius:50%;
                    margin:30px auto;
                    background:
                        radial-gradient(
                            circle,
                            #111 0 8%,
                            #eee 9% 20%,
                            #e44 21% 35%,
                            #eee 36% 50%,
                            #444 51% 65%,
                            #eee 66%
                        );
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:30px;
                ">🎯</div>

                <div class="game-status">
                    Skor: ${scoreA} / 500
                </div>
            </div>
        `);

        $("#archShoot").onclick=shoot;
        $("#archNew").onclick=start;
    }

    return {start};
})();

/* ============================================================
   HAFIZA / EŞLEŞTİRME
   ============================================================ */

function createMemoryGame(title, size=16){

    let cards;
    let open=[];
    let locked=false;
    let matched=0;

    function start(){

        const symbols=[
            "🍎","🍋","🍇","🍉",
            "🍒","🥝","🍓","🍊",
            "🥕","🍔","🍕","🍩"
        ];

        const needed=size/2;

        cards=shuffle(
            symbols.slice(0,needed).flatMap(x=>[x,x])
        );

        open=[];
        locked=false;
        matched=0;

        render();
    }

    function click(i){

        if(locked)return;
        if(open.includes(i))return;

        open.push(i);

        render();

        if(open.length===2){
            locked=true;

            setTimeout(()=>{
                if(cards[open[0]]===cards[open[1]]){
                    matched+=2;
                    addXP(10);
                }

                open=[];
                locked=false;

                if(matched===cards.length){
                    gameReward(true);
                    notify("🧠 Tüm kartları buldun!");
                }

                render();
            },650);
        }
    }

    function render(){

        openGameModal(title,`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn gold" id="memoryNew">
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:10px;
                    max-width:550px;
                    margin:auto;
                ">
                    ${cards.map((c,i)=>`
                        <button
                            data-card="${i}"
                            style="
                                aspect-ratio:1;
                                border:0;
                                border-radius:14px;
                                background:#27365d;
                                color:white;
                                font-size:36px;
                                cursor:pointer;
                            "
                        >
                            ${open.includes(i)||matched>0&&false?c:"?"}
                        </button>
                    `).join("")}
                </div>
            </div>
        `);

        $$(".game-shell [data-card]").forEach(el=>{
            el.onclick=()=>click(Number(el.dataset.card));
        });

        $("#memoryNew").onclick=start;
    }

    return {start};
}

const MemoryGame=createMemoryGame("🧠 Zeka Eşleştirme",16);
const Memory2Game=createMemoryGame("🃏 Hafıza Oyunu",24);

/* ============================================================
   YILAN
   ============================================================ */

const SnakeGame = (() => {

    let snake,food,dir,scoreS;

    function start(){
        snake=[
            {x:5,y:5},
            {x:4,y:5},
            {x:3,y:5}
        ];

        food={
            x:rand(0,9),
            y:rand(0,9)
        };

        dir={x:1,y:0};
        scoreS=0;

        render();

        clearInterval(gameTimer);

        gameTimer=setInterval(step,350);
    }

    function step(){

        const head={
            x:snake[0].x+dir.x,
            y:snake[0].y+dir.y
        };

        if(
            head.x<0||head.x>=10||
            head.y<0||head.y>=10||
            snake.some(s=>s.x===head.x&&s.y===head.y)
        ){
            notify("🐍 Oyun bitti. Yeniden başla.");
            clearInterval(gameTimer);
            return;
        }

        snake.unshift(head);

        if(head.x===food.x&&head.y===food.y){
            scoreS+=10;
            addXP(5);

            food={
                x:rand(0,9),
                y:rand(0,9)
            };

            if(scoreS>=100){
                gameReward(true);
                scoreS=0;
            }
        }else{
            snake.pop();
        }

        render();
    }

    function render(){

        openGameModal("🐍 Yılan Oyunu",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn" id="snakeUp">⬆️</button>
                    <button class="game-btn" id="snakeLeft">⬅️</button>
                    <button class="game-btn" id="snakeDown">⬇️</button>
                    <button class="game-btn" id="snakeRight">➡️</button>
                    <button class="game-btn gold" id="snakeNew">
                        🔄 Yeni
                    </button>
                </div>

                <div class="game-status">Skor: ${scoreS}</div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(10,1fr);
                    max-width:520px;
                    margin:auto;
                    background:#07111d;
                    gap:2px;
                ">
                    ${Array.from({length:100},(_,i)=>{
                        const x=i%10;
                        const y=Math.floor(i/10);

                        const isSnake=snake.some(
                            s=>s.x===x&&s.y===y
                        );

                        const isFood=
                            food.x===x&&food.y===y;

                        return `
                            <div style="
                                aspect-ratio:1;
                                background:${
                                    isFood
                                    ?"red"
                                    :isSnake
                                    ?"limegreen"
                                    :"#14233a"
                                };
                            "></div>
                        `;
                    }).join("")}
                </div>
            </div>
        `);

        $("#snakeUp").onclick=()=>dir={x:0,y:-1};
        $("#snakeDown").onclick=()=>dir={x:0,y:1};
        $("#snakeLeft").onclick=()=>dir={x:-1,y:0};
        $("#snakeRight").onclick=()=>dir={x:1,y:0};
        $("#snakeNew").onclick=start;
    }

    return {start};
})();

/* ============================================================
   BASKET
   ============================================================ */

const BasketGame = (() => {

    let points=0;
    let levelB=1;

    function start(){
        points=0;
        levelB=1;
        render();
    }

    function shoot(){

        const success=Math.random()>.35;

        if(success){
            points+=10;
            addXP(5);
        }

        if(points>=100){
            levelB++;
            points=0;
            gameReward(true);
            notify("🏀 Bölüm tamamlandı!");
        }

        render();
    }

    function render(){
        openGameModal("🏀 Basket Atışı",`
            <div class="game-shell">
                <div class="game-toolbar">
                    <button class="game-btn primary" id="basketShoot">
                        🏀 ATIŞ
                    </button>
                    <button class="game-btn gold" id="basketNew">
                        🔄 Yeni Bölüm
                    </button>
                </div>

                <div style="
                    height:520px;
                    max-width:700px;
                    margin:auto;
                    border-radius:20px;
                    background:linear-gradient(#4e82c5,#c8793d);
                    position:relative;
                ">
                    <div style="
                        position:absolute;
                        right:14%;
                        top:30%;
                        font-size:90px;
                    ">🏀</div>

                    <div style="
                        position:absolute;
                        right:12%;
                        top:23%;
                        font-size:80px;
                    ">⭕</div>

                    <div style="
                        position:absolute;
                        bottom:40px;
                        left:50%;
                        transform:translateX(-50%);
                        font-size:80px;
                    ">🏀</div>
                </div>

                <div class="game-status">
                    Seviye: ${levelB} • Skor: ${points}/100
                </div>
            </div>
        `);

        $("#basketShoot").onclick=shoot;
        $("#basketNew").onclick=start;
    }

    return {start};
})();

/* ============================================================
   ANA SAYFADAKİ OYUN BUTONLARINI BAĞLA
   ============================================================ */

function bindGameButtons(){

    /* data-game kullananlar */
    $$("[data-game]").forEach(btn=>{
        if(btn.dataset.boundGame)return;

        const id=btn.dataset.game;

        if(GAME_META[id]){
            btn.dataset.boundGame="1";

            btn.addEventListener("click",e=>{
                e.preventDefault();
                openGame(id);
            });
        }
    });

    /* Oyna butonları */
    $$(".play-game, .play-btn, .game-play, [data-play]").forEach(btn=>{
        if(btn.dataset.boundPlay)return;

        btn.dataset.boundPlay="1";

        btn.addEventListener("click",e=>{
            e.preventDefault();

            const id=
                btn.dataset.play ||
                btn.closest("[data-game]")?.dataset.game ||
                btn.closest("[data-id]")?.dataset.id;

            if(id && GAME_META[id]){
                openGame(id);
            }
        });
    });

    /* Kartların onclick'i farklı olabilir */
    $$("[onclick*='openGame']").forEach(el=>{
        el.addEventListener("click",()=>{
            updateTopUI();
        });
    });
}

/* ============================================================
   KART GÖRSELLERİNİ AYIR
   ============================================================ */

function improveGameCards(){

    const possibleCards=$$(
        ".game-card, .game-item, .game-box, [data-game]"
    );

    possibleCards.forEach(card=>{

        const id=
            card.dataset.game ||
            card.dataset.id;

        if(!GAME_META[id])return;

        let icon=card.querySelector(".game-icon,.game-thumb,.game-image");

        if(!icon){
            icon=document.createElement("div");
            icon.className="game-icon";
            icon.style.cssText=`
                font-size:44px;
                min-height:55px;
                display:flex;
                align-items:center;
                justify-content:center;
                margin-bottom:8px;
            `;

            card.prepend(icon);
        }

        icon.textContent=GAME_META[id].icon;

        /* Okey ve Mahjong kesinlikle farklı görünsün */
        if(id==="okey"){
            icon.textContent="🀄";
            icon.title="101 Okey";
        }

        if(id==="mahjong"){
            icon.textContent="🀙";
            icon.title="Mahjong";
        }
    });
}

/* ============================================================
   FİLTRE SİSTEMİ
   ============================================================ */

function bindFilters(){

    $$("[data-filter]").forEach(btn=>{
        if(btn.dataset.boundFilter)return;

        btn.dataset.boundFilter="1";

        btn.addEventListener("click",()=>{
            const filter=btn.dataset.filter;

            $$(".game-card, .game-item, [data-category]").forEach(card=>{
                if(filter==="all" || filter==="tümü" || filter==="Tümü"){
                    card.style.display="";
                    return;
                }

                const cat=(
                    card.dataset.category||
                    card.dataset.cat||
                    ""
                ).toLowerCase();

                card.style.display=
                    cat===String(filter).toLowerCase()
                    ?""
                    :"none";
            });
        });
    });
}

/* ============================================================
   GÜNLÜK BONUS
   ============================================================ */

function setupDailyBonus(){

    const btn=$("#dailyBonusBtn") ||
             $("#watchDailyBonus") ||
             $("#dailyBonus");

    if(!btn || btn.dataset.boundDaily)return;

    btn.dataset.boundDaily="1";

    btn.addEventListener("click",()=>{

        const today=new Date().toISOString().slice(0,10);
        const last=localStorage.getItem("oynakazan_daily");

        if(last===today){
            notify("🎁 Günlük bonusunu bugün zaten aldın.");
            return;
        }

        localStorage.setItem("oynakazan_daily",today);

        coins+=25;
        addXP(10);
        saveProgress();

        notify("🎁 Günlük bonus: +25 🪙");
    });
}

/* ============================================================
   DEMO REKLAM ÖDÜLÜ
   ============================================================ */

function setupDemoAd(){

    const btn=$("#watchAdBtn");

    if(!btn || btn.dataset.boundAd)return;

    btn.dataset.boundAd="1";

    btn.addEventListener("click",()=>{
        notify("📺 Bu şu anda deneme reklamıdır.");

        setTimeout(()=>{
            changeScore(100);
            coins+=10;
            addXP(10);

            notify("🎁 Deneme reklam ödülü: +100 puan");
        },1200);
    });
}

/* ============================================================
   KLAVYE
   ============================================================ */

document.addEventListener("keydown",e=>{

    if(!currentGame)return;

    if(e.key==="Escape"){
        closeGame();
        return;
    }

    if(currentGame==="snake"){
        if(e.key==="ArrowUp")
            document.querySelector("#snakeUp")?.click();

        if(e.key==="ArrowDown")
            document.querySelector("#snakeDown")?.click();

        if(e.key==="ArrowLeft")
            document.querySelector("#snakeLeft")?.click();

        if(e.key==="ArrowRight")
            document.querySelector("#snakeRight")?.click();
    }
});

/* ============================================================
   BAŞLANGIÇ
   ============================================================ */

function init(){

    updateTopUI();
    bindGameButtons();
    improveGameCards();
    bindFilters();
    setupDailyBonus();
    setupDemoAd();

    /* HTML sonradan oluşursa tekrar bağla */
    setTimeout(()=>{
        bindGameButtons();
        improveGameCards();
        bindFilters();
    },500);

    setTimeout(()=>{
        bindGameButtons();
        improveGameCards();
    },1500);
}

if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init);
}else{
    init();
}

/* ============================================================
   DIŞARIDAN ERİŞİM
   ============================================================ */

window.OynaKazan = {
    openGame,
    closeGame,
    score:()=>score,
    xp:()=>xp,
    level:()=>level,
    coins:()=>coins,
    games:GAME_META
};

})();




