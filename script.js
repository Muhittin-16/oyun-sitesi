/* ============================================================
   OYNAKAZAN - 15 OYUNLU ÇALIŞAN OYUN MOTORU
   TEK DOSYA: script.js
   index.html ve stil.css ile uyumludur.
   ============================================================ */

(() => {
"use strict";

/* ============================================================
   TEMEL YARDIMCILAR
   ============================================================ */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const rand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => {
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
};

const esc = value =>
    String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

let currentGame = null;
let gameTimer = null;
let gameTimeouts = [];

function clearGameTimers(){
    if(gameTimer){
        clearInterval(gameTimer);
        clearTimeout(gameTimer);
        gameTimer=null;
    }

    gameTimeouts.forEach(t=>{
        clearTimeout(t);
        clearInterval(t);
    });

    gameTimeouts=[];
}

function later(fn,ms){
    const t=setTimeout(fn,ms);
    gameTimeouts.push(t);
    return t;
}

/* ============================================================
   OYUNCU İLERLEMESİ
   ============================================================ */

let score = Number(localStorage.getItem("oynakazan_score") || 500);
let xp = Number(localStorage.getItem("oynakazan_xp") || 0);
let level = Number(localStorage.getItem("oynakazan_level") || 1);
let coins = Number(localStorage.getItem("oynakazan_coins") || 0);
let played = Number(localStorage.getItem("oynakazan_played") || 0);

function xpNeeded(){
    return 100 + ((level-1)*50);
}

function saveProgress(){
    localStorage.setItem("oynakazan_score",String(score));
    localStorage.setItem("oynakazan_xp",String(xp));
    localStorage.setItem("oynakazan_level",String(level));
    localStorage.setItem("oynakazan_coins",String(coins));
    localStorage.setItem("oynakazan_played",String(played));

    localStorage.setItem("oyunDunyasiStats",JSON.stringify({
        best:score,
        played,
        coins,
        xp
    }));
}

function updateTopUI(){
    const scoreEl=$("#user-score");

    if(scoreEl)
        scoreEl.textContent=score.toLocaleString("tr-TR");

    const oldScore=$("#score");
    if(oldScore) oldScore.textContent=score;

    const oldCoins=$("#coins");
    if(oldCoins) oldCoins.textContent=coins;

    const levelEl=$("#level");
    if(levelEl) levelEl.textContent=level;
}

function addXP(amount){
    xp+=amount;

    let leveled=false;

    while(xp>=xpNeeded()){
        xp-=xpNeeded();
        level++;
        coins+=10;
        leveled=true;
    }

    if(leveled){
        notify(
            `⭐ Seviye ${level}! +10 🪙 kazandın.`,
            "⭐",
            "Seviye Atladın"
        );
    }

    saveProgress();
    updateTopUI();
}

function changeScore(amount){
    score=Math.max(0,score+amount);
    saveProgress();
    updateTopUI();
}

function gameReward(win=true){
    played++;

    if(win){
        changeScore(50);
        coins+=15;
        addXP(25);
    }else{
        changeScore(10);
        coins+=3;
        addXP(8);
    }

    saveProgress();
    updateTopUI();
}

/* ============================================================
   BİLGİ MESAJI
   ============================================================ */

function notify(text,icon="🎮",title="Bilgi"){
    const modal=$("#message-modal");
    const textEl=$("#message-text");
    const titleEl=$("#message-title");
    const iconEl=$("#message-icon");
    const close=$("#message-close");

    if(!modal){
        alert(text);
        return;
    }

    if(textEl) textEl.textContent=text;
    if(titleEl) titleEl.textContent=title;
    if(iconEl) iconEl.textContent=icon;

    modal.classList.remove("hidden");

    if(close){
        close.onclick=()=>{
            modal.classList.add("hidden");
        };
    }
}

/* ============================================================
   15 OYUN BİLGİLERİ
   ============================================================ */

const GAME_META={

    okey:{
        title:"101 Okey",
        category:"Masa Oyunları",
        filter:"board",
        icon:"🀄",
        color:"#ffb703",
        desc:"106 taşlı gerçekçi 101 Okey masası."
    },

    tavla:{
        title:"Klasik Tavla",
        category:"Masa Oyunları",
        filter:"board",
        icon:"🎲",
        color:"#c77d32",
        desc:"15'e 15 pullarla klasik tavla."
    },

    dama:{
        title:"Türk Daması",
        category:"Masa Oyunları",
        filter:"board",
        icon:"⚫",
        color:"#ef476f",
        desc:"Zorunlu alma ve zincir hamleli dama."
    },

    batak:{
        title:"Batak",
        category:"Kart Oyunları",
        filter:"cards",
        icon:"🂡",
        color:"#8d99ae",
        desc:"52 kartlı dört kişilik Batak."
    },

    bilardo:{
        title:"Bilardo",
        category:"Spor",
        filter:"arcade",
        icon:"🎱",
        color:"#00b4d8",
        desc:"15 toplu bilardo masası."
    },

    mahjong:{
        title:"Mahjong",
        category:"Zeka Oyunları",
        filter:"puzzle",
        icon:"🀙",
        color:"#52b788",
        desc:"Taş eşleştirmeli Mahjong."
    },

    sudoku:{
        title:"Sudoku",
        category:"Zeka Oyunları",
        filter:"puzzle",
        icon:"🔢",
        color:"#6c63ff",
        desc:"1-9 rakamlarıyla Sudoku."
    },

    bubble:{
        title:"Bubble Shooter",
        category:"Eğlence",
        filter:"arcade",
        icon:"🫧",
        color:"#00d4ff",
        desc:"Baloncukları eşleştir ve temizle."
    },

    race:{
        title:"Araba Yarışı",
        category:"Yarış",
        filter:"arcade",
        icon:"🏎️",
        color:"#f72585",
        desc:"Rakiplerini geç ve yarışı kazan."
    },

    block:{
        title:"Block Puzzle",
        category:"Zeka Oyunları",
        filter:"puzzle",
        icon:"🧩",
        color:"#8338ec",
        desc:"Satırları doldur ve temizle."
    },

    archery:{
        title:"Okçuluk",
        category:"Beceri",
        filter:"arcade",
        icon:"🏹",
        color:"#fb8500",
        desc:"Hedefi vur, yüksek skor yap."
    },

    memory:{
        title:"Zeka Eşleştirme",
        category:"Zeka Oyunları",
        filter:"puzzle",
        icon:"🧠",
        color:"#ff006e",
        desc:"Kartların eşlerini bul."
    },

    memory2:{
        title:"Hafıza Oyunu",
        category:"Zeka Oyunları",
        filter:"puzzle",
        icon:"🃏",
        color:"#3a86ff",
        desc:"Daha büyük kart destesiyle hafıza."
    },

    snake:{
        title:"Yılan Oyunu",
        category:"Eğlence",
        filter:"arcade",
        icon:"🐍",
        color:"#80ed99",
        desc:"Yılanı büyüt ve rekor kır."
    },

    basket:{
        title:"Basket Atışı",
        category:"Spor",
        filter:"arcade",
        icon:"🏀",
        color:"#fb8500",
        desc:"Atışlarını yap, 100 puana ulaş."
    }
};

/* ============================================================
   OYUN KARTLARINI OLUŞTUR
   ============================================================ */

function createGameCards(){

    const container=$("#games-container");

    if(!container)return;

    container.innerHTML="";

    Object.entries(GAME_META).forEach(([id,game])=>{

        const card=document.createElement("article");

        card.className="game-card";
        card.dataset.game=id;
        card.dataset.id=id;
        card.dataset.category=game.filter;
        card.dataset.cat=game.filter;

        card.innerHTML=`
            <div class="game-image"
                 style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    min-height:120px;
                    font-size:70px;
                    background:
                    radial-gradient(
                        circle at 50% 35%,
                        ${game.color}55,
                        transparent 65%
                    );
                 ">
                ${game.icon}
            </div>

            <div class="game-card-content">
                <div style="
                    font-size:11px;
                    font-weight:800;
                    opacity:.65;
                    text-transform:uppercase;
                    margin-bottom:5px;
                ">
                    ${esc(game.category)}
                </div>

                <h3>${esc(game.title)}</h3>

                <p>${esc(game.desc)}</p>

                <button
                    class="play-game play-btn"
                    data-play="${id}"
                    type="button"
                >
                    <i class="fa-solid fa-play"></i>
                    Oyna
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    bindGameButtons();
    improveGameCards();
}

/* ============================================================
   MODAL
   ============================================================ */

function openGameModal(title,html){

    const modal=$("#game-modal");
    const area=$("#game-area");
    const titleEl=$("#modal-game-title");
    const category=$("#modal-category");

    if(!modal || !area){
        console.error("Oyun modalı bulunamadı.");
        return;
    }

    if(titleEl)
        titleEl.textContent=title;

    if(category){
        const game=GAME_META[currentGame];
        category.textContent=game ? game.category.toUpperCase() : "OYUN";
    }

    area.innerHTML=html;

    modal.classList.remove("hidden");

    document.body.style.overflow="hidden";
}

function closeGame(){

    clearGameTimers();

    const modal=$("#game-modal");

    if(modal)
        modal.classList.add("hidden");

    const area=$("#game-area");

    if(area)
        area.innerHTML="";

    currentGame=null;

    document.body.style.overflow="";
}

/* ============================================================
   OYUNU AÇ
   ============================================================ */

function openGame(id){

    if(!GAME_META[id])return;

    clearGameTimers();

    currentGame=id;

    const games={
        okey:OkeyGame,
        tavla:TavlaGame,
        dama:DamaGame,
        batak:BatakGame,
        bilardo:BilardoGame,
        mahjong:MahjongGame,
        sudoku:SudokuGame,
        bubble:BubbleGame,
        race:RaceGame,
        block:BlockGame,
        archery:ArcheryGame,
        memory:MemoryGame,
        memory2:Memory2Game,
        snake:SnakeGame,
        basket:BasketGame
    };

    if(games[id])
        games[id].start();
}

/* ============================================================
   101 OKEY
   ============================================================ */

const OkeyGame=(()=>{

    let state=null;

    const colors=["Kırmızı","Siyah","Mavi","Sarı"];

    function makeTiles(){

        const tiles=[];

        for(let color=0;color<4;color++){
            for(let number=1;number<=13;number++){
                for(let copy=0;copy<2;copy++){
                    tiles.push({
                        color,
                        number,
                        id:`${color}-${number}-${copy}`
                    });
                }
            }
        }

        tiles.push({
            joker:true,
            id:"joker-1"
        });

        tiles.push({
            joker:true,
            id:"joker-2"
        });

        return tiles;
    }

    function tileText(t){
        if(t.joker)return "★";

        return t.number;
    }

    function tileColor(t){

        if(t.joker)return "#333";

        return [
            "#e63946",
            "#111",
            "#1976d2",
            "#f5a400"
        ][t.color];
    }

    function sortHand(hand,mode="normal"){

        if(mode==="pair"){
            return [...hand].sort((a,b)=>{
                if(a.joker&&!b.joker)return 1;
                if(!a.joker&&b.joker)return -1;

                if(a.number!==b.number)
                    return a.number-b.number;

                return a.color-b.color;
            });
        }

        return [...hand].sort((a,b)=>{
            if(a.joker&&!b.joker)return 1;
            if(!a.joker&&b.joker)return -1;

            if(a.color!==b.color)
                return a.color-b.color;

            return a.number-b.number;
        });
    }

    function start(){

        const tiles=shuffle(makeTiles());

        const players=[
            {name:"Sen",hand:[],discard:[],score:0},
            {name:"Ali",hand:[],discard:[],score:0},
            {name:"Ayşe",hand:[],discard:[],score:0},
            {name:"Mehmet",hand:[],discard:[],score:0}
        ];

        players.forEach(p=>{
            for(let i=0;i<21;i++)
                p.hand.push(tiles.pop());
        });

        const indicator=tiles.pop();

        state={
            players,
            deck:tiles,
            indicator,
            turn:0,
            selected:[],
            discarded:null,
            gameOver:false
        };

        render();
    }

    function draw(){

        if(state.turn!==0)return;

        if(!state.deck.length){
            notify("🀄 Ortadaki taşlar bitti.","🀄","Oyun");
            return;
        }

        const tile=state.deck.pop();

        state.players[0].hand.push(tile);

        render();
    }

    function takeDiscard(){

        if(state.turn!==0)return;

        if(!state.discarded){
            notify("Ortada alınacak atılmış taş yok.");
            return;
        }

        state.players[0].hand.push(state.discarded);
        state.discarded=null;

        render();
    }

    function discard(index){

        if(state.turn!==0)return;

        if(index<0 || index>=state.players[0].hand.length)
            return;

        const tile=state.players[0].hand.splice(index,1)[0];

        state.discarded=tile;

        state.turn=1;

        render();

        later(botTurn,650);
    }

    function botTurn(){

        if(!state || state.gameOver)return;

        const p=state.players[state.turn];

        if(state.deck.length)
            p.hand.push(state.deck.pop());

        if(p.hand.length){
            const index=rand(0,p.hand.length-1);
            p.discard.push(p.hand.splice(index,1)[0]);
        }

        state.discarded=p.discard[p.discard.length-1]||null;

        state.turn++;

        if(state.turn>=4)
            state.turn=0;

        render();

        if(state.turn!==0)
            later(botTurn,650);
    }

    function selectTile(index){

        if(state.turn!==0)return;

        if(state.selected.includes(index)){
            state.selected=state.selected.filter(i=>i!==index);
        }else{
            state.selected.push(index);
        }

        render();
    }

    function sortNormal(){
        state.players[0].hand=sortHand(
            state.players[0].hand,
            "normal"
        );
        state.selected=[];
        render();
    }

    function sortPair(){
        state.players[0].hand=sortHand(
            state.players[0].hand,
            "pair"
        );
        state.selected=[];
        render();
    }

    function check101(){

        const hand=state.players[0].hand;

        let total=0;

        hand.forEach(t=>{
            if(!t.joker)
                total+=t.number;
        });

        if(hand.length<=1){
            gameReward(true);
            notify(
                "🎉 Elini bitirdin!",
                "🀄",
                "101 Okey"
            );
            return;
        }

        notify(
            `Elindeki taşların toplam değeri yaklaşık ${total}. Gerçek açılış için geçerli perleri oluşturmalısın.`,
            "🀄",
            "101 Okey"
        );
    }

    function render(){

        const p=state.players[0];

        const handHTML=p.hand.map((t,i)=>{

            const selected=state.selected.includes(i);

            return `
                <button
                    class="okey-tile"
                    data-idx="${i}"
                    style="
                        width:42px;
                        height:58px;
                        min-width:42px;
                        border-radius:7px;
                        border:2px solid ${selected?"#ffd166":"#ddd"};
                        background:#fff;
                        color:${tileColor(t)};
                        font-size:20px;
                        font-weight:900;
                        box-shadow:${selected?"0 0 12px #ffd166":"0 2px 5px #0005"};
                        transform:${selected?"translateY(-8px)":"none"};
                        cursor:pointer;
                    "
                >
                    ${tileText(t)}
                    ${
                        !t.joker
                        ?`<small style="
                            display:block;
                            font-size:8px;
                            opacity:.7;
                        ">${colors[t.color]}</small>`
                        :""
                    }
                </button>
            `;
        }).join("");

        openGameModal("🀄 101 Okey",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn primary"
                        id="okeyDraw"
                    >
                        ⬇️ Taş Çek
                    </button>

                    <button
                        class="game-btn"
                        id="okeyTake"
                    >
                        ↩️ Atılanı Al
                    </button>

                    <button
                        class="game-btn"
                        id="okeySort"
                    >
                        🔢 Taş Diz
                    </button>

                    <button
                        class="game-btn"
                        id="okeyPair"
                    >
                        🧩 Çift Diz
                    </button>

                    <button
                        class="game-btn gold"
                        id="okeyCheck"
                    >
                        101 Kontrol
                    </button>

                    <button
                        class="game-btn"
                        id="okeyNew"
                    >
                        🔄 Yeni El
                    </button>

                </div>

                <div class="game-status">
                    🀄 Gösterge:
                    <b>
                        ${tileText(state.indicator)}
                    </b>
                    •
                    ${
                        state.turn===0
                        ?"🎯 Sıra sende"
                        :`Rakip ${state.turn} oynuyor...`
                    }
                    •
                    Destede ${state.deck.length} taş
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:repeat(2,1fr);
                        gap:10px;
                        margin-bottom:12px;
                    "
                >
                    ${state.players.slice(1).map((p,i)=>`
                        <div
                            style="
                                padding:10px;
                                border-radius:12px;
                                background:#17233d;
                            "
                        >
                            🤖 ${esc(p.name)}
                            <b>${p.hand.length}</b> taş
                            <div style="opacity:.65;font-size:12px">
                                ${p.discard.length
                                    ?"Son taş: "+tileText(p.discard[p.discard.length-1])
                                    :"Bekliyor"}
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div
                    style="
                        text-align:center;
                        padding:12px;
                        border-radius:15px;
                        background:
                        radial-gradient(circle,#315d43,#163224);
                        margin-bottom:15px;
                    "
                >
                    <div style="font-size:12px;opacity:.7">
                        OKEY MASASI
                    </div>

                    <div style="font-size:45px;margin:8px">
                        ${
                            state.discarded
                            ?tileText(state.discarded)
                            :"🀫"
                        }
                    </div>

                    <div style="font-size:12px;opacity:.7">
                        Atılan taş
                    </div>
                </div>

                <div
                    style="
                        display:flex;
                        gap:5px;
                        flex-wrap:wrap;
                        justify-content:center;
                        align-items:flex-end;
                        padding:15px 5px;
                        background:
                        linear-gradient(
                            #0d3b25,
                            #092719
                        );
                        border-radius:18px;
                    "
                    id="okeyHand"
                >
                    ${handHTML}
                </div>

                <div
                    style="
                        text-align:center;
                        margin-top:10px;
                        opacity:.7;
                        font-size:12px;
                    "
                >
                    Taşı seç → tekrar tıklayarak seçimini kaldır.
                    Atmak için seçtiğin taşın üzerine bas.
                </div>

            </div>
        `);

        $$("#okeyHand .okey-tile").forEach(el=>{
            el.onclick=()=>{
                const i=Number(el.dataset.idx);

                if(state.selected.includes(i)){
                    discard(i);
                }else{
                    selectTile(i);
                }
            };
        });

        $("#okeyDraw").onclick=draw;
        $("#okeyTake").onclick=takeDiscard;
        $("#okeySort").onclick=sortNormal;
        $("#okeyPair").onclick=sortPair;
        $("#okeyCheck").onclick=check101;
        $("#okeyNew").onclick=start;
    }

    return {start};

})();

/* ============================================================
   TAVLA
   ============================================================ */

const TavlaGame=(()=>{

    let state=null;

    function start(){

        const board=Array(24).fill(0);

        board[0]=2;
        board[11]=5;
        board[16]=3;
        board[18]=5;

        board[23]=-2;
        board[12]=-5;
        board[7]=-3;
        board[5]=-5;

        state={
            board,
            playerBar:0,
            botBar:0,
            playerOff:0,
            botOff:0,
            dice:[],
            used:[],
            turn:"player",
            rolled:false,
            message:"Zar at."
        };

        render();
    }

    function roll(){

        if(state.turn!=="player" || state.rolled)return;

        const a=rand(1,6);
        const b=rand(1,6);

        state.dice=a===b
            ?[a,a,a,a]
            :[a,b];

        state.used=[];
        state.rolled=true;
        state.message=`Zarlar: ${a} - ${b}`;

        render();
    }

    function move(from){

        if(state.turn!=="player" || !state.rolled)return;

        const p=state.board[from];

        if(p<=0){
            notify("Bu hanede senin pulun yok.");
            return;
        }

        const dice=state.dice
            .map((d,i)=>state.used.includes(i)?null:d)
            .filter(Boolean);

        if(!dice.length){
            endTurn();
            return;
        }

        let moved=false;

        for(let i=0;i<state.dice.length;i++){

            if(state.used.includes(i))continue;

            const d=state.dice[i];

            const to=from+d;

            if(to>23){
                state.board[from]--;
                state.playerOff++;
                state.used.push(i);
                moved=true;
                break;
            }

            if(state.board[to]<-1){
                notify("Bu hanede iki veya daha fazla rakip pulu var.");
                continue;
            }

            if(state.board[to]===-1){
                state.board[to]=0;
                state.botBar++;
            }

            state.board[from]--;
            state.board[to]++;
            state.used.push(i);
            moved=true;
            break;
        }

        if(!moved){
            notify("Bu zar ile geçerli hamle yok.");
            return;
        }

        if(state.playerOff>=15){
            gameReward(true);
            notify("🎲 Tavlayı kazandın!","🎲","Tavla");
            start();
            return;
        }

        if(state.used.length>=state.dice.length)
            endTurn();

        render();
    }

    function endTurn(){

        state.turn="bot";
        state.rolled=false;

        render();

        later(botTurn,700);
    }

    function botTurn(){

        if(state.turn!=="bot")return;

        const d1=rand(1,6);
        const d2=rand(1,6);
        const dice=d1===d2
            ?[d1,d1,d1,d1]
            :[d1,d2];

        for(const d of dice){

            const possible=[];

            state.board.forEach((v,i)=>{
                if(v<0){
                    const to=i-d;

                    if(to>=0 && state.board[to]>-2)
                        possible.push(i);
                    else if(to<0)
                        possible.push(i);
                }
            });

            if(!possible.length)continue;

            const from=possible[rand(0,possible.length-1)];
            const to=from-d;

            state.board[from]++;

            if(to<0){
                state.botOff++;
            }else{
                if(state.board[to]===1){
                    state.board[to]=0;
                    state.playerBar++;
                }

                state.board[to]--;
            }
        }

        if(state.botOff>=15){
            gameReward(false);
            notify("🤖 Rakip tavlayı kazandı.","🎲","Tavla");
            start();
            return;
        }

        state.turn="player";
        state.rolled=false;
        state.dice=[];
        state.used=[];

        render();
    }

    function render(){

        const points=state.board.map((v,i)=>{

            let pieces="";

            for(let n=0;n<Math.min(Math.abs(v),5);n++){
                pieces+=`
                    <div
                        style="
                            width:28px;
                            height:28px;
                            border-radius:50%;
                            background:${v>0?"#f3e9d2":"#111"};
                            border:2px solid ${v>0?"#8d6e63":"#ddd"};
                            margin:2px;
                        "
                    ></div>
                `;
            }

            return `
                <button
                    class="tavla-point"
                    data-point="${i}"
                    style="
                        min-height:180px;
                        border:0;
                        background:
                        linear-gradient(
                            ${i%2
                            ?"rgba(193,68,14,.45)"
                            :"rgba(237,201,122,.28)"}
                        );
                        color:white;
                        position:relative;
                        display:flex;
                        flex-direction:${i<12?"column":"column-reverse"};
                        justify-content:${i<12?"flex-start":"flex-end"};
                        align-items:center;
                        cursor:pointer;
                        border-radius:6px;
                    "
                >
                    ${pieces}
                    <span
                        style="
                            position:absolute;
                            bottom:3px;
                            font-size:10px;
                            opacity:.5;
                        "
                    >${i+1}</span>
                </button>
            `;
        }).join("");

        openGameModal("🎲 Klasik Tavla",`

            <div class="game-shell">

                <div class="game-toolbar">
                    <button
                        class="game-btn primary"
                        id="rollBackgammon"
                    >
                        🎲 ZAR AT
                    </button>

                    <button
                        class="game-btn gold"
                        id="newBackgammon"
                    >
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div class="game-status">
                    ${
                        state.turn==="player"
                        ?"👤 Sıra sende"
                        :"🤖 Rakip oynuyor..."
                    }
                    •
                    ${state.message}
                    •
                    Sen: ${state.playerOff}/15
                    •
                    Rakip: ${state.botOff}/15
                </div>

                <div
                    style="
                        padding:10px;
                        background:
                        linear-gradient(
                            90deg,
                            #5b321e,
                            #9b633e,
                            #5b321e
                        );
                        border:8px solid #30190e;
                        border-radius:15px;
                    "
                >

                    <div
                        style="
                            display:grid;
                            grid-template-columns:repeat(12,1fr);
                            gap:3px;
                        "
                    >
                        ${points}
                    </div>

                    <div
                        style="
                            display:flex;
                            justify-content:center;
                            gap:10px;
                            padding:12px;
                        "
                    >
                        ${
                            state.dice.map((d,i)=>`
                                <div
                                    style="
                                        width:50px;
                                        height:50px;
                                        background:#fff;
                                        color:#111;
                                        border-radius:10px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:25px;
                                        font-weight:900;
                                    "
                                >${state.used.includes(i)?"✓":d}</div>
                            `).join("")
                        }
                    </div>

                    <div
                        style="
                            display:grid;
                            grid-template-columns:repeat(12,1fr);
                            gap:3px;
                            margin-top:5px;
                        "
                    >
                        ${points}
                    </div>

                </div>

                <div
                    style="
                        text-align:center;
                        margin-top:12px;
                        opacity:.75;
                    "
                >
                    Zarları at. Sonra hareket ettirmek istediğin
                    kendi pulunun bulunduğu haneye bas.
                </div>

            </div>
        `);

        $$(".tavla-point").forEach(el=>{
            el.onclick=()=>{
                move(Number(el.dataset.point));
            };
        });

        $("#rollBackgammon").onclick=roll;
        $("#newBackgammon").onclick=start;
    }

    return {start};

})();

/* ============================================================
   TÜRK DAMASI
   ============================================================ */

const DamaGame=(()=>{

    let state=null;

    function start(){

        const board=Array.from({length:8},()=>Array(8).fill(0));

        for(let r=0;r<2;r++)
            for(let c=0;c<8;c++)
                board[r][c]=-1;

        for(let r=5;r<8;r++)
            for(let c=0;c<8;c++)
                board[r][c]=1;

        state={
            board,
            turn:1,
            selected:null,
            chain:false,
            winner:null
        };

        render();
    }

    function directions(piece){

        if(Math.abs(piece)===2)
            return [
                [-1,-1],[-1,0],[-1,1],
                [0,-1],[0,1],
                [1,-1],[1,0],[1,1]
            ];

        return piece===1
            ?[[-1,0],[0,-1],[0,1]]
            :[[1,0],[0,-1],[0,1]];
    }

    function inside(r,c){
        return r>=0&&r<8&&c>=0&&c<8;
    }

    function capturesFor(piece,r,c){

        const result=[];

        directions(piece).forEach(([dr,dc])=>{

            const mr=r+dr;
            const mc=c+dc;
            const lr=r+dr*2;
            const lc=c+dc*2;

            if(
                inside(lr,lc)&&
                state.board[mr]?.[mc] &&
                Math.sign(state.board[mr][mc])!==Math.sign(piece)&&
                state.board[lr][lc]===0
            ){
                result.push({
                    r:lr,
                    c:lc,
                    mr,
                    mc
                });
            }
        });

        return result;
    }

    function hasCapture(player){

        for(let r=0;r<8;r++){
            for(let c=0;c<8;c++){

                if(Math.sign(state.board[r][c])!==player)
                    continue;

                if(capturesFor(state.board[r][c],r,c).length)
                    return true;
            }
        }

        return false;
    }

    function select(r,c){

        if(state.turn!==1)return;

        const piece=state.board[r][c];

        if(state.selected){

            const sr=state.selected.r;
            const sc=state.selected.c;
            const p=state.board[sr][sc];

            const captures=capturesFor(p,sr,sc);

            const cap=captures.find(x=>x.r===r&&x.c===c);

            if(cap){

                state.board[r][c]=p;
                state.board[sr][sc]=0;
                state.board[cap.mr][cap.mc]=0;

                if(r===0&&p===1)
                    state.board[r][c]=2;

                if(capturesFor(state.board[r][c],r,c).length){
                    state.selected={r,c};
                    state.chain=true;
                    render();
                    return;
                }

                state.selected=null;
                state.chain=false;
                state.turn=-1;

                render();

                later(botTurn,650);
                return;
            }

            if(!state.chain){
                state.selected=null;
                render();
            }

            return;
        }

        if(Math.sign(piece)!==1)return;

        if(hasCapture(1) && !capturesFor(piece,r,c).length){
            notify("⚫ Alma zorunlu. Başka bir taşla alma yapmalısın.");
            return;
        }

        state.selected={r,c};
        render();
    }

    function botTurn(){

        if(state.turn!==-1)return;

        const pieces=[];

        for(let r=0;r<8;r++){
            for(let c=0;c<8;c++){

                if(Math.sign(state.board[r][c])!==-1)
                    continue;

                const caps=capturesFor(state.board[r][c],r,c);

                if(caps.length)
                    pieces.push({r,c,caps});
            }
        }

        let chosen=null;

        if(pieces.length){

            chosen=pieces[rand(0,pieces.length-1)];

            const cap=chosen.caps[0];

            const p=state.board[chosen.r][chosen.c];

            state.board[cap.r][cap.c]=p;
            state.board[chosen.r][chosen.c]=0;
            state.board[cap.mr][cap.mc]=0;

        }else{

            const moves=[];

            for(let r=0;r<8;r++){
                for(let c=0;c<8;c++){

                    const p=state.board[r][c];

                    if(Math.sign(p)!==-1)continue;

                    directions(p).forEach(([dr,dc])=>{
                        const nr=r+dr;
                        const nc=c+dc;

                        if(inside(nr,nc)&&state.board[nr][nc]===0){
                            moves.push({
                                r,c,nr,nc
                            });
                        }
                    });
                }
            }

            if(moves.length){

                const m=moves[rand(0,moves.length-1)];
                const p=state.board[m.r][m.c];

                state.board[m.nr][m.nc]=p;
                state.board[m.r][m.c]=0;

                if(m.nr===7&&p===-1)
                    state.board[m.nr][m.nc]=-2;
            }
        }

        if(checkWinner()){
            render();
            return;
        }

        state.turn=1;
        render();
    }

    function checkWinner(){

        const playerPieces=state.board.flat().filter(x=>x>0).length;
        const botPieces=state.board.flat().filter(x=>x<0).length;

        if(playerPieces===0){
            gameReward(false);
            notify("🤖 Rakip kazandı.","⚫","Dama");
            return true;
        }

        if(botPieces===0){
            gameReward(true);
            notify("🏆 Damayı kazandın!","⚫","Dama");
            return true;
        }

        return false;
    }

    function render(){

        openGameModal("⚫ Türk Daması",`

            <div class="game-shell">

                <div class="game-toolbar">
                    <button
                        class="game-btn gold"
                        id="newDama"
                    >
                        🔄 Yeni Oyun
                    </button>
                </div>

                <div class="game-status">
                    ${
                        state.turn===1
                        ?"👤 Sıra sende"
                        :"🤖 Rakip oynuyor..."
                    }
                    •
                    Alma zorunludur.
                </div>

                <div
                    style="
                        width:min(92vw,600px);
                        margin:auto;
                        display:grid;
                        grid-template-columns:repeat(8,1fr);
                        border:6px solid #3b2415;
                    "
                >
                    ${state.board.flatMap((row,r)=>
                        row.map((v,c)=>{

                            const selected=
                                state.selected?.r===r &&
                                state.selected?.c===c;

                            return `
                                <button
                                    data-r="${r}"
                                    data-c="${c}"
                                    style="
                                        aspect-ratio:1;
                                        border:0;
                                        background:
                                        ${(r+c)%2
                                            ?"#b88755"
                                            :"#f0d9b5"};
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        cursor:pointer;
                                        box-shadow:
                                        ${selected
                                            ?"inset 0 0 0 4px #ffd166"
                                            :"none"};
                                    "
                                >
                                    ${
                                        v
                                        ?`
                                            <span
                                                style="
                                                    width:72%;
                                                    height:72%;
                                                    border-radius:50%;
                                                    display:block;
                                                    background:
                                                    ${v>0
                                                        ?"radial-gradient(circle at 35% 30%,#555,#050505)"
                                                        :"radial-gradient(circle at 35% 30%,#eee,#aaa)"};
                                                    border:
                                                    3px solid ${v>0?"#000":"#fff"};
                                                    box-shadow:
                                                    0 4px 7px #0008;
                                                "
                                            >
                                                ${Math.abs(v)===2?"♛":""}
                                            </span>
                                        `
                                        :""
                                    }
                                </button>
                            `;
                        })
                    ).join("")}
                </div>

            </div>
        `);

        $$("[data-r][data-c]").forEach(el=>{
            el.onclick=()=>{
                select(
                    Number(el.dataset.r),
                    Number(el.dataset.c)
                );
            };
        });

        $("#newDama").onclick=start;
    }

    return {start};

})();

/* ============================================================
   BATAK
   ============================================================ */

const BatakGame=(()=>{

    let state=null;

    const suits=["♠","♥","♦","♣"];

    const suitNames={
        "♠":"Maça",
        "♥":"Kupa",
        "♦":"Karo",
        "♣":"Sinek"
    };

    function deck(){

        const d=[];

        for(const suit of suits){
            for(let rank=2;rank<=14;rank++){
                d.push({
                    suit,
                    rank,
                    red:suit==="♥"||suit==="♦"
                });
            }
        }

        return shuffle(d);
    }

    function cardName(c){
        const names={
            11:"J",
            12:"Q",
            13:"K",
            14:"A"
        };

        return `${names[c.rank]||c.rank}${c.suit}`;
    }

    function start(){

        const d=deck();

        const players=[
            {name:"Sen",hand:[],tricks:0,score:0},
            {name:"Ali",hand:[],tricks:0,score:0},
            {name:"Ayşe",hand:[],tricks:0,score:0},
            {name:"Mehmet",hand:[],tricks:0,score:0}
        ];

        players.forEach(p=>{
            for(let i=0;i<13;i++)
                p.hand.push(d.pop());
        });

        state={
            players,
            trump:suits[rand(0,3)],
            turn:0,
            trick:[],
            leadSuit:null
        };

        render();
    }

    function canPlay(card,p){

        if(!state.leadSuit)return true;

        if(card.suit===state.leadSuit)return true;

        return !p.hand.some(c=>c.suit===state.leadSuit);
    }

    function playHuman(index){

        if(state.turn!==0)return;

        const p=state.players[0];
        const card=p.hand[index];

        if(!card)return;

        if(!canPlay(card,p)){
            notify(
                "Elinde o renk var. O rengi oynamalısın.",
                "🂡",
                "Batak"
            );
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
            later(resolveTrick,700);

        }else{

            state.turn=1;
            render();
            later(botPlay,600);
        }
    }

    function botPlay(){

        if(state.turn===0)return;

        const p=state.players[state.turn];

        let options=p.hand.filter(c=>canPlay(c,p));

        if(!options.length)
            options=[...p.hand];

        const card=options[rand(0,options.length-1)];

        p.hand.splice(
            p.hand.indexOf(card),
            1
        );

        state.trick.push({
            player:state.turn,
            card
        });

        if(!state.leadSuit)
            state.leadSuit=card.suit;

        if(state.trick.length===4){

            render();
            later(resolveTrick,700);
            return;
        }

        state.turn++;

        if(state.turn>=4)
            state.turn=0;

        render();

        if(state.turn!==0)
            later(botPlay,550);
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

            if(
                c.suit===state.trump &&
                b.suit!==state.trump
            ){
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
            later(botPlay,600);
    }

    function finishHand(){

        state.players.forEach(p=>{
            p.score+=p.tricks;
        });

        const won=
            state.players[0].tricks>=
            Math.max(
                state.players[1].tricks,
                state.players[2].tricks,
                state.players[3].tricks
            );

        gameReward(won);

        notify(
            `El bitti. Sen ${state.players[0].tricks} el aldın.`,
            won?"🏆":"🂡",
            won?"Batak - Kazandın":"Batak"
        );

        render(true);
    }

    function cardHTML(card,back=false,index=null){

        if(back){
            return `
                <div
                    style="
                        width:42px;
                        height:58px;
                        border-radius:6px;
                        background:
                        repeating-linear-gradient(
                            45deg,
                            #263b75,
                            #263b75 5px,
                            #17244b 5px,
                            #17244b 10px
                        );
                        border:2px solid #fff;
                    "
                ></div>
            `;
        }

        return `
            <button
                class="playing-card ${card.red?"red":""}"
                ${index!==null?`data-card="${index}"`:""}
                style="
                    width:45px;
                    height:62px;
                    border-radius:7px;
                    background:#fff;
                    color:${card.red?"#d62828":"#111"};
                    border:2px solid #ddd;
                    font-weight:900;
                    font-size:17px;
                    cursor:pointer;
                "
            >
                ${cardName(card)}
            </button>
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

                    <button
                        class="game-btn gold"
                        id="newBatak"
                    >
                        🔄 Yeni El
                    </button>

                </div>

                <div class="game-status">

                    ${
                        finished
                        ?"🏁 El tamamlandı."
                        :`
                            🎴 Koz:
                            <b>${state.trump}</b>
                            (${suitNames[state.trump]})
                            •
                            ${
                                state.turn===0
                                ?"🎯 Sıra sende"
                                :"Rakip oynuyor..."
                            }
                        `
                    }

                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:10px;
                        padding:12px;
                        background:
                        radial-gradient(circle,#276749,#123524);
                        border-radius:18px;
                    "
                >

                    <div
                        style="
                            grid-column:1/-1;
                            text-align:center;
                        "
                    >
                        <b>Rakip 3</b>
                        • ${state.players[2].tricks} el

                        <div
                            style="
                                display:flex;
                                justify-content:center;
                                margin-top:5px;
                            "
                        >
                            ${Array.from(
                                {length:state.players[2].hand.length},
                                ()=>cardHTML(null,true)
                            ).join("")}
                        </div>
                    </div>

                    <div>
                        <b>Rakip 2</b>
                        • ${state.players[1].tricks} el

                        <div
                            style="
                                display:flex;
                                flex-wrap:wrap;
                                margin-top:5px;
                            "
                        >
                            ${Array.from(
                                {length:Math.min(state.players[1].hand.length,8)},
                                ()=>cardHTML(null,true)
                            ).join("")}
                        </div>
                    </div>

                    <div>
                        <b>Rakip 4</b>
                        • ${state.players[3].tricks} el
                    </div>

                    <div
                        style="
                            grid-column:1/-1;
                            min-height:110px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            gap:15px;
                            flex-wrap:wrap;
                            padding:15px;
                            border-radius:14px;
                            background:#0b2419;
                        "
                    >
                        ${
                            trickHTML ||
                            "<span style='opacity:.6'>İlk kartı sen oynayabilirsin.</span>"
                        }
                    </div>

                </div>

                <div
                    style="
                        margin-top:15px;
                        text-align:center;
                        font-weight:900;
                    "
                >
                    👤 Sen • ${p.tricks} el
                </div>

                <div
                    id="batakHand"
                    style="
                        display:flex;
                        gap:5px;
                        flex-wrap:wrap;
                        justify-content:center;
                        padding:15px 5px;
                    "
                >
                    ${p.hand.map((c,i)=>
                        cardHTML(c,false,i)
                    ).join("")}
                </div>

            </div>
        `);

        $$("#batakHand [data-card]").forEach(el=>{
            el.onclick=()=>{
                playHuman(
                    Number(el.dataset.card)
                );
            };
        });

        $("#newBatak").onclick=start;
    }

    return {start};

})();

/* ============================================================
   BİLARDO
   ============================================================ */

const BilardoGame=(()=>{

    let state=null;

    function start(){

        state={
            balls:[],
            angle:0,
            power:35,
            turn:"player",
            shots:0,
            sunk:0
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

        for(let row=0;row<5;row++){

            for(let col=0;col<=row;col++){

                state.balls.push({
                    id:id++,
                    x:72+row*4,
                    y:50+(col-row/2)*4,
                    vx:0,
                    vy:0,
                    color:
                        id%2
                        ?"#e63946"
                        :"#2464d6"
                });
            }
        }
    }

    function shoot(){

        if(state.turn!=="player")return;

        const cue=state.balls.find(b=>b.cue);

        if(!cue)return;

        const rad=state.angle*Math.PI/180;

        cue.vx=
            Math.cos(rad)*
            (state.power/10);

        cue.vy=
            Math.sin(rad)*
            (state.power/10);

        state.shots++;
        state.turn="moving";

        render();

        clearGameTimers();

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

            if(
                Math.abs(b.vx)>.03 ||
                Math.abs(b.vy)>.03
            )
                moving=true;
        }

        for(
            let i=0;
            i<state.balls.length;
            i++
        ){

            for(
                let j=i+1;
                j<state.balls.length;
                j++
            ){

                const a=state.balls[i];
                const b=state.balls[j];

                const dx=b.x-a.x;
                const dy=b.y-a.y;
                const dist=Math.sqrt(dx*dx+dy*dy);

                if(dist<3 && dist>.01){

                    const nx=dx/dist;
                    const ny=dy/dist;

                    const av=
                        a.vx*nx+
                        a.vy*ny;

                    const bv=
                        b.vx*nx+
                        b.vy*ny;

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
            gameTimer=null;

            state.turn="player";

            const objectBalls=
                state.balls.filter(b=>!b.cue);

            if(objectBalls.length===0){
                gameReward(true);
                notify(
                    "🎱 Masayı temizledin!",
                    "🎱",
                    "Bilardo"
                );
                createBalls();
            }
        }
    }

    function render(){

        const balls=state.balls.map(b=>`
            <div
                style="
                    position:absolute;
                    left:${b.x}%;
                    top:${b.y}%;
                    transform:translate(-50%,-50%);
                    width:25px;
                    height:25px;
                    border-radius:50%;
                    background:${b.color};
                    border:2px solid #fff8;
                    box-shadow:0 3px 6px #0009;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:9px;
                    font-weight:900;
                    color:${b.cue?"#111":"#fff"};
                "
            >
                ${b.cue?"":b.id}
            </div>
        `).join("");

        openGameModal("🎱 Bilardo",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn"
                        id="angleMinus"
                    >
                        ↶ Açı -
                    </button>

                    <button
                        class="game-btn"
                        id="anglePlus"
                    >
                        ↷ Açı +
                    </button>

                    <button
                        class="game-btn"
                        id="powerMinus"
                    >
                        − Güç
                    </button>

                    <button
                        class="game-btn"
                        id="powerPlus"
                    >
                        + Güç
                    </button>

                    <button
                        class="game-btn primary"
                        id="shootPool"
                    >
                        🎯 VUR
                    </button>

                    <button
                        class="game-btn gold"
                        id="newPool"
                    >
                        🔄 Yeni
                    </button>

                </div>

                <div class="game-status">
                    Atış: ${state.shots}
                    • Güç: ${Math.round(state.power)}
                    • Açı: ${Math.round(state.angle)}°
                    •
                    ${
                        state.turn==="player"
                        ?"Sıra sende"
                        :"Toplar hareket ediyor..."
                    }
                </div>

                <div
                    style="
                        position:relative;
                        width:100%;
                        max-width:850px;
                        aspect-ratio:16/9;
                        margin:auto;
                        background:
                        radial-gradient(
                            ellipse,
                            #277a42,
                            #0b4922
                        );
                        border:25px solid #58371d;
                        border-radius:30px;
                        overflow:hidden;
                        box-shadow:
                        inset 0 0 20px #000;
                    "
                >

                    <div
                        style="
                            position:absolute;
                            width:7%;
                            aspect-ratio:1;
                            border-radius:50%;
                            background:#111;
                            left:0;
                            top:0;
                        "
                    ></div>

                    <div
                        style="
                            position:absolute;
                            width:7%;
                            aspect-ratio:1;
                            border-radius:50%;
                            background:#111;
                            right:0;
                            top:0;
                        "
                    ></div>

                    <div
                        style="
                            position:absolute;
                            width:7%;
                            aspect-ratio:1;
                            border-radius:50%;
                            background:#111;
                            left:0;
                            bottom:0;
                        "
                    ></div>

                    <div
                        style="
                            position:absolute;
                            width:7%;
                            aspect-ratio:1;
                            border-radius:50%;
                            background:#111;
                            right:0;
                            bottom:0;
                        "
                    ></div>

                    ${balls}

                </div>

                <div class="game-status">
                    Açı ve gücü ayarla → VUR.
                    Toplar durduğunda tekrar atış yap.
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
            state.power=Math.max(
                10,
                state.power-5
            );
            render();
        };

        $("#powerPlus").onclick=()=>{
            state.power=Math.min(
                100,
                state.power+5
            );
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

const MahjongGame=(()=>{

    let state=null;

    function start(){

        const symbols=[
            "🀀","🀁","🀂","🀃",
            "🀄","🀅","🀆",
            "🀇","🀈","🀉","🀊",
            "🀋","🀌","🀍","🀎"
        ];

        let tiles=[];

        shuffle(symbols.slice(0,12))
        .forEach(s=>{
            tiles.push(s,s);
        });

        state={
            tiles:shuffle(tiles),
            selected:[],
            moves:0
        };

        render();
    }

    function choose(i){

        if(state.tiles[i]===null)return;

        if(state.selected.includes(i))
            return;

        state.selected.push(i);
        state.moves++;

        if(state.selected.length===2){

            const [a,b]=state.selected;

            if(state.tiles[a]===state.tiles[b]){

                state.tiles[a]=null;
                state.tiles[b]=null;

                addXP(10);

                if(state.tiles.every(t=>t===null)){

                    gameReward(true);

                    notify(
                        "🀙 Tüm taşları eşleştirdin!",
                        "🀙",
                        "Mahjong"
                    );
                }

            }else{

                later(()=>{
                    state.selected=[];
                    render();
                },500);

                render();
                return;
            }

            state.selected=[];
        }

        render();
    }

    function render(){

        openGameModal("🀙 Mahjong",`

            <div class="game-shell">

                <div class="game-toolbar">
                    <button
                        class="game-btn gold"
                        id="newMahjong"
                    >
                        🔄 Yeni Tahta
                    </button>
                </div>

                <div class="game-status">
                    Aynı iki taşı bul.
                    • Hamle: ${state.moves}
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(6,1fr);
                        gap:8px;
                        max-width:650px;
                        margin:auto;
                    "
                >
                    ${state.tiles.map((t,i)=>`

                        <button
                            data-mahjong="${i}"
                            style="
                                aspect-ratio:.75;
                                border-radius:9px;
                                border:2px solid
                                ${
                                    state.selected.includes(i)
                                    ?"gold"
                                    :"#bbb"
                                };
                                background:
                                ${
                                    t===null
                                    ?"transparent"
                                    :"linear-gradient(#fff,#ddd)"
                                };
                                color:#111;
                                font-size:28px;
                                font-weight:900;
                                box-shadow:
                                0 4px 7px #0005;
                            "
                        >
                            ${
                                t===null
                                ?""
                                :state.selected.includes(i)
                                ?t
                                :"🀫"
                            }
                        </button>

                    `).join("")}
                </div>

            </div>
        `);

        $$("[data-mahjong]").forEach(el=>{
            el.onclick=()=>{
                choose(
                    Number(el.dataset.mahjong)
                );
            };
        });

        $("#newMahjong").onclick=start;
    }

    return {start};

})();

/* ============================================================
   SUDOKU
   ============================================================ */

const SudokuGame=(()=>{

    let board=[];
    let solution=[];

    function baseBoard(){

        const b=Array.from(
            {length:9},
            ()=>Array(9).fill(0)
        );

        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                b[r][c]=
                    (r*3+
                    Math.floor(r/3)+
                    c)%9+1;
            }
        }

        return b;
    }

    function start(){

        solution=baseBoard();

        board=solution.map(row=>[...row]);

        for(let i=0;i<45;i++){

            const r=rand(0,8);
            const c=rand(0,8);

            board[r][c]=0;
        }

        render();
    }

    function check(){

        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){

                const input=
                    $(`.sudoku-cell[data-r="${r}"][data-c="${c}"]`);

                if(!input)continue;

                const value=
                    Number(input.value||0);

                if(value!==solution[r][c]){
                    return false;
                }
            }
        }

        return true;
    }

    function render(){

        openGameModal("🔢 Sudoku",`

            <div class="game-shell">

                <div class="game-toolbar">
                    <button
                        class="game-btn gold"
                        id="newSudoku"
                    >
                        🔄 Yeni Bulmaca
                    </button>

                    <button
                        class="game-btn primary"
                        id="checkSudoku"
                    >
                        ✓ Kontrol Et
                    </button>
                </div>

                <div class="game-status">
                    1-9 rakamlarını kullan.
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(9,1fr);
                        max-width:600px;
                        margin:auto;
                        border:4px solid #fff;
                    "
                >

                    ${board.flatMap((row,r)=>
                        row.map((v,c)=>`

                            <input
                                class="sudoku-cell"
                                data-r="${r}"
                                data-c="${c}"
                                value="${v||""}"
                                maxlength="1"
                                inputmode="numeric"
                                ${
                                    v
                                    ?"readonly"
                                    :""
                                }
                                style="
                                    width:100%;
                                    aspect-ratio:1;
                                    text-align:center;
                                    font-size:22px;
                                    font-weight:900;
                                    border:1px solid #777;
                                    background:
                                    ${
                                        v
                                        ?"rgba(108,99,255,.3)"
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

        $$(".sudoku-cell:not([readonly])").forEach(input=>{
            input.oninput=()=>{
                input.value=
                    input.value
                    .replace(/[^1-9]/g,"");
            };
        });

        $("#newSudoku").onclick=start;

        $("#checkSudoku").onclick=()=>{

            if(check()){

                gameReward(true);

                notify(
                    "🎉 Sudoku doğru tamamlandı!",
                    "🔢",
                    "Sudoku"
                );

            }else{

                notify(
                    "Henüz doğru değil. Boş veya hatalı hücreler var.",
                    "🔢",
                    "Sudoku"
                );
            }
        };
    }

    return {start};

})();

/* ============================================================
   BUBBLE SHOOTER
   ============================================================ */

const BubbleGame=(()=>{

    let state=null;

    const colors=[
        "🔴","🟡","🟢","🔵","🟣"
    ];

    function start(){

        state={
            bubbles:[],
            shots:0,
            level:1
        };

        for(let i=0;i<35;i++){

            state.bubbles.push({
                color:rand(0,4),
                x:rand(7,93),
                y:rand(7,45)
            });
        }

        render();
    }

    function shoot(){

        state.shots++;

        const color=rand(0,4);

        const same=
            state.bubbles
            .map((b,i)=>({b,i}))
            .filter(x=>x.b.color===color);

        if(same.length>=2){

            const amount=
                Math.min(
                    rand(2,4),
                    same.length
                );

            shuffle(same)
            .slice(0,amount)
            .sort((a,b)=>b.i-a.i)
            .forEach(x=>{
                state.bubbles.splice(x.i,1);
            });

            addXP(amount*3);
        }

        if(!state.bubbles.length){

            gameReward(true);

            notify(
                "🫧 Bölüm tamamlandı!",
                "🫧",
                "Bubble Shooter"
            );

            state.level++;

            for(let i=0;i<35+state.level*2;i++){
                state.bubbles.push({
                    color:rand(0,4),
                    x:rand(7,93),
                    y:rand(7,45)
                });
            }
        }

        render();
    }

    function render(){

        openGameModal("🫧 Bubble Shooter",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn primary"
                        id="bubbleShoot"
                    >
                        🫧 Ateş Et
                    </button>

                    <button
                        class="game-btn gold"
                        id="bubbleNew"
                    >
                        🔄 Yeni Bölüm
                    </button>

                </div>

                <div
                    style="
                        position:relative;
                        height:520px;
                        max-width:700px;
                        margin:auto;
                        background:
                        radial-gradient(
                            circle at 50% 20%,
                            #173a6a,
                            #071426
                        );
                        border-radius:20px;
                        overflow:hidden;
                    "
                >

                    ${state.bubbles.map(b=>`

                        <div
                            style="
                                position:absolute;
                                left:${b.x}%;
                                top:${b.y}%;
                                font-size:38px;
                                transform:
                                translate(-50%,-50%);
                            "
                        >
                            ${colors[b.color]}
                        </div>

                    `).join("")}

                    <div
                        style="
                            position:absolute;
                            bottom:12px;
                            left:50%;
                            transform:
                            translateX(-50%);
                            font-size:50px;
                        "
                    >
                        🔵
                    </div>

                </div>

                <div class="game-status">
                    Seviye: ${state.level}
                    • Kalan: ${state.bubbles.length}
                    • Atış: ${state.shots}
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

const RaceGame=(()=>{

    let state=null;

    function start(){

        state={
            distance:0,
            player:50,
            opponents:[25,50,75],
            speed:3,
            turbo:false,
            level:1,
            finished:false
        };

        render();

        clearGameTimers();

        gameTimer=setInterval(step,350);
    }

    function step(){

        if(!state || state.finished)return;

        state.distance+=state.speed;

        state.opponents=
            state.opponents.map(
                x=>Math.max(
                    8,
                    Math.min(
                        92,
                        x+rand(-5,5)
                    )
                )
            );

        if(state.distance>=100){

            state.finished=true;

            gameReward(true);

            notify(
                "🏁 Yarışı kazandın!",
                "🏎️",
                "Yarış"
            );

            clearInterval(gameTimer);
        }

        render();
    }

    function move(delta){

        if(state.finished)return;

        state.player=Math.max(
            8,
            Math.min(
                92,
                state.player+delta
            )
        );

        render();
    }

    function turbo(){

        if(state.finished)return;

        state.speed=7;

        render();

        later(()=>{
            if(state)
                state.speed=3;
        },1500);
    }

    function render(){

        openGameModal("🏎️ Araba Yarışı",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn"
                        id="raceLeft"
                    >⬅️</button>

                    <button
                        class="game-btn primary"
                        id="raceBoost"
                    >
                        🚀 TURBO
                    </button>

                    <button
                        class="game-btn"
                        id="raceRight"
                    >➡️</button>

                    <button
                        class="game-btn gold"
                        id="raceNew"
                    >
                        🔄 Yeni
                    </button>

                </div>

                <div class="game-status">
                    Mesafe:
                    ${Math.min(100,
                        Math.floor(state.distance)
                    )}%
                    •
                    ${state.turbo?"🚀 TURBO":""}
                </div>

                <div
                    style="
                        position:relative;
                        height:600px;
                        max-width:500px;
                        margin:auto;
                        background:
                        repeating-linear-gradient(
                            to bottom,
                            #333 0,
                            #333 80px,
                            #555 80px,
                            #555 160px
                        );
                        border-left:45px solid #222;
                        border-right:45px solid #222;
                        overflow:hidden;
                        border-radius:15px;
                    "
                >

                    ${state.opponents.map(
                        (x,i)=>`
                            <div
                                style="
                                    position:absolute;
                                    left:${x}%;
                                    top:${25+i*18}%;
                                    transform:
                                    translateX(-50%);
                                    font-size:42px;
                                "
                            >🚗</div>
                        `
                    ).join("")}

                    <div
                        style="
                            position:absolute;
                            left:${state.player}%;
                            bottom:25px;
                            transform:
                            translateX(-50%);
                            font-size:48px;
                        "
                    >🏎️</div>

                </div>

            </div>
        `);

        $("#raceLeft").onclick=()=>{
            move(-7);
        };

        $("#raceRight").onclick=()=>{
            move(7);
        };

        $("#raceBoost").onclick=turbo;
        $("#raceNew").onclick=start;
    }

    return {start};

})();

/* ============================================================
   BLOCK PUZZLE
   ============================================================ */

const BlockGame=(()=>{

    let state=null;

    function start(){

        state={
            grid:Array.from(
                {length:8},
                ()=>Array(8).fill(false)
            ),
            score:0,
            level:1
        };

        render();
    }

    function toggle(r,c){

        state.grid[r][c]=
            !state.grid[r][c];

        let cleared=0;

        for(let i=0;i<8;i++){

            if(state.grid[i].every(Boolean)){
                state.grid[i]=
                    Array(8).fill(false);
                cleared++;
            }
        }

        for(let c2=0;c2<8;c2++){

            let full=true;

            for(let r=0;r<8;r++){
                if(!state.grid[r][c2]){
                    full=false;
                    break;
                }
            }

            if(full){

                for(let r=0;r<8;r++)
                    state.grid[r][c2]=false;

                cleared++;
            }
        }

        if(cleared){

            state.score+=cleared*100;
            addXP(cleared*10);

            if(state.score>=state.level*500){
                state.level++;
                coins+=5;
                saveProgress();
            }
        }

        render();
    }

    function render(){

        openGameModal("🧩 Block Puzzle",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn gold"
                        id="newBlock"
                    >
                        🔄 Yeni Oyun
                    </button>

                </div>

                <div class="game-status">
                    Seviye: ${state.level}
                    • Skor: ${state.score}
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(8,1fr);
                        width:min(92vw,520px);
                        margin:auto;
                        gap:4px;
                    "
                >

                    ${state.grid.flatMap(
                        (row,r)=>
                        row.map((v,c)=>`

                            <button
                                data-br="${r}"
                                data-bc="${c}"
                                style="
                                    aspect-ratio:1;
                                    border:0;
                                    border-radius:8px;
                                    background:
                                    ${
                                        v
                                        ?"linear-gradient(135deg,#8b5cf6,#4f46e5)"
                                        :"#202a49"
                                    };
                                    box-shadow:
                                    ${v
                                        ?"inset 0 2px 3px #fff4"
                                        :"none"};
                                "
                            ></button>

                        `)
                    ).join("")}

                </div>

            </div>
        `);

        $$("[data-br][data-bc]").forEach(el=>{
            el.onclick=()=>{
                toggle(
                    Number(el.dataset.br),
                    Number(el.dataset.bc)
                );
            };
        });

        $("#newBlock").onclick=start;
    }

    return {start};

})();

/* ============================================================
   OKÇULUK
   ============================================================ */

const ArcheryGame=(()=>{

    let state=null;

    function start(){

        state={
            score:0,
            arrows:0,
            level:1
        };

        render();
    }

    function shoot(){

        const points=[
            5,10,20,30,50,100
        ];

        const hit=
            points[rand(0,points.length-1)];

        state.score+=hit;
        state.arrows++;

        addXP(Math.max(2,Math.floor(hit/5)));

        if(state.score>=500){

            gameReward(true);

            notify(
                "🏹 Hedef tamamlandı!",
                "🏹",
                "Okçuluk"
            );

            state.score=0;
            state.level++;
        }

        render();
    }

    function render(){

        openGameModal("🏹 Okçuluk",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn primary"
                        id="archShoot"
                    >
                        🏹 ATIŞ YAP
                    </button>

                    <button
                        class="game-btn gold"
                        id="archNew"
                    >
                        🔄 Yeni Seri
                    </button>

                </div>

                <div
                    style="
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
                        box-shadow:
                        0 10px 25px #0008;
                    "
                >
                    🎯
                </div>

                <div class="game-status">
                    Seviye: ${state.level}
                    • Skor: ${state.score}/500
                    • Ok: ${state.arrows}
                </div>

            </div>
        `);

        $("#archShoot").onclick=shoot;
        $("#archNew").onclick=start;
    }

    return {start};

})();

/* ============================================================
   HAFIZA OYUNU
   ============================================================ */

function createMemoryGame(title,size){

    let cards=[];
    let open=[];
    let matched=[];
    let locked=false;
    let moves=0;

    const symbols=[
        "🍎","🍋","🍇","🍉",
        "🍒","🥝","🍓","🍊",
        "🥕","🍔","🍕","🍩",
        "🍪","🍀","⭐","🚀"
    ];

    function start(){

        const needed=size/2;

        cards=shuffle(
            symbols
            .slice(0,needed)
            .flatMap(x=>[x,x])
        );

        open=[];
        matched=[];
        locked=false;
        moves=0;

        render();
    }

    function click(i){

        if(locked)return;
        if(open.includes(i))return;
        if(matched.includes(i))return;

        open.push(i);
        moves++;

        render();

        if(open.length===2){

            locked=true;

            later(()=>{

                const [a,b]=open;

                if(cards[a]===cards[b]){

                    matched.push(a,b);
                    addXP(10);

                }

                open=[];
                locked=false;

                if(matched.length===cards.length){

                    gameReward(true);

                    notify(
                        "🧠 Tüm kartları buldun!",
                        "🧠",
                        title
                    );
                }

                render();

            },600);
        }
    }

    function render(){

        openGameModal(title,`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn gold"
                        id="memoryNew"
                    >
                        🔄 Yeni Oyun
                    </button>

                </div>

                <div class="game-status">
                    Hamle: ${moves}
                    • Bulunan: ${matched.length/2}/${cards.length/2}
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(4,1fr);
                        gap:10px;
                        max-width:550px;
                        margin:auto;
                    "
                >

                    ${cards.map((c,i)=>`

                        <button
                            data-memory="${i}"
                            style="
                                aspect-ratio:1;
                                border:2px solid #455;
                                border-radius:14px;
                                background:
                                ${
                                    open.includes(i)||
                                    matched.includes(i)
                                    ?"linear-gradient(135deg,#fff,#ddd)"
                                    :"linear-gradient(135deg,#27365d,#111b34)"
                                };
                                color:#111;
                                font-size:36px;
                                cursor:pointer;
                            "
                        >
                            ${
                                open.includes(i)||
                                matched.includes(i)
                                ?c
                                :"?"
                            }
                        </button>

                    `).join("")}

                </div>

            </div>
        `);

        $$("[data-memory]").forEach(el=>{
            el.onclick=()=>{
                click(
                    Number(el.dataset.memory)
                );
            };
        });

        $("#memoryNew").onclick=start;
    }

    return {start};
}

const MemoryGame=
    createMemoryGame(
        "🧠 Zeka Eşleştirme",
        16
    );

const Memory2Game=
    createMemoryGame(
        "🃏 Hafıza Oyunu",
        24
    );

/* ============================================================
   YILAN
   ============================================================ */

const SnakeGame=(()=>{

    let state=null;

    function start(){

        state={
            snake:[
                {x:5,y:5},
                {x:4,y:5},
                {x:3,y:5}
            ],
            food:{
                x:rand(0,9),
                y:rand(0,9)
            },
            dir:{x:1,y:0},
            score:0,
            level:1,
            alive:true
        };

        render();

        clearGameTimers();

        gameTimer=
            setInterval(step,
                Math.max(
                    120,
                    350-(state.level*15)
                )
            );
    }

    function changeDir(x,y){

        if(
            state.dir.x===-x &&
            state.dir.y===-y
        )return;

        state.dir={x,y};
    }

    function step(){

        if(!state.alive)return;

        const head={
            x:state.snake[0].x+
              state.dir.x,
            y:state.snake[0].y+
              state.dir.y
        };

        if(
            head.x<0||
            head.x>=10||
            head.y<0||
            head.y>=10||
            state.snake.some(
                s=>s.x===head.x&&s.y===head.y
            )
        ){

            state.alive=false;

            clearGameTimers();

            gameReward(false);

            notify(
                `Oyun bitti. Skorun: ${state.score}`,
                "🐍",
                "Yılan Oyunu"
            );

            render();
            return;
        }

        state.snake.unshift(head);

        if(
            head.x===state.food.x &&
            head.y===state.food.y
        ){

            state.score+=10;

            addXP(5);

            state.food={
                x:rand(0,9),
                y:rand(0,9)
            };

            if(
                state.score>=
                state.level*100
            ){
                state.level++;
                coins+=5;
                saveProgress();
            }

        }else{
            state.snake.pop();
        }

        render();
    }

    function render(){

        openGameModal("🐍 Yılan Oyunu",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn"
                        id="snakeUp"
                    >⬆️</button>

                    <button
                        class="game-btn"
                        id="snakeLeft"
                    >⬅️</button>

                    <button
                        class="game-btn"
                        id="snakeDown"
                    >⬇️</button>

                    <button
                        class="game-btn"
                        id="snakeRight"
                    >➡️</button>

                    <button
                        class="game-btn gold"
                        id="snakeNew"
                    >
                        🔄 Yeni
                    </button>

                </div>

                <div class="game-status">
                    Seviye: ${state.level}
                    • Skor: ${state.score}
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(10,1fr);
                        max-width:520px;
                        margin:auto;
                        background:#07111d;
                        gap:2px;
                        padding:4px;
                        border-radius:12px;
                    "
                >

                    ${Array.from(
                        {length:100},
                        (_,i)=>{

                            const x=i%10;
                            const y=Math.floor(i/10);

                            const isSnake=
                                state.snake.some(
                                    s=>
                                    s.x===x&&
                                    s.y===y
                                );

                            const isFood=
                                state.food.x===x&&
                                state.food.y===y;

                            return `
                                <div
                                    style="
                                        aspect-ratio:1;
                                        border-radius:3px;
                                        background:
                                        ${
                                            isFood
                                            ?"red"
                                            :isSnake
                                            ?"limegreen"
                                            :"#14233a"
                                        };
                                    "
                                ></div>
                            `;
                        }
                    ).join("")}

                </div>

            </div>
        `);

        $("#snakeUp").onclick=()=>{
            changeDir(0,-1);
        };

        $("#snakeDown").onclick=()=>{
            changeDir(0,1);
        };

        $("#snakeLeft").onclick=()=>{
            changeDir(-1,0);
        };

        $("#snakeRight").onclick=()=>{
            changeDir(1,0);
        };

        $("#snakeNew").onclick=start;
    }

    return {start};

})();

/* ============================================================
   BASKET
   ============================================================ */

const BasketGame=(()=>{

    let state=null;

    function start(){

        state={
            points:0,
            level:1,
            shots:0,
            made:0
        };

        render();
    }

    function shoot(){

        state.shots++;

        const success=
            Math.random()>
            Math.max(
                .15,
                .42-(state.level*.02)
            );

        if(success){

            state.points+=10;
            state.made++;

            addXP(5);

        }else{

            addXP(1);
        }

        if(state.points>=100){

            gameReward(true);

            notify(
                "🏀 Bölümü tamamladın!",
                "🏀",
                "Basket Atışı"
            );

            state.level++;
            state.points=0;
        }

        render();
    }

    function render(){

        openGameModal("🏀 Basket Atışı",`

            <div class="game-shell">

                <div class="game-toolbar">

                    <button
                        class="game-btn primary"
                        id="basketShoot"
                    >
                        🏀 ATIŞ
                    </button>

                    <button
                        class="game-btn gold"
                        id="basketNew"
                    >
                        🔄 Yeni Bölüm
                    </button>

                </div>

                <div
                    style="
                        height:520px;
                        max-width:700px;
                        margin:auto;
                        border-radius:20px;
                        background:
                        linear-gradient(
                            #4e82c5,
                            #c8793d
                        );
                        position:relative;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            position:absolute;
                            right:12%;
                            top:22%;
                            font-size:80px;
                        "
                    >
                        🏀
                    </div>

                    <div
                        style="
                            position:absolute;
                            right:11%;
                            top:18%;
                            font-size:90px;
                        "
                    >
                        🥅
                    </div>

                    <div
                        style="
                            position:absolute;
                            bottom:35px;
                            left:50%;
                            transform:
                            translateX(-50%);
                            font-size:80px;
                        "
                    >
                        🏀
                    </div>

                </div>

                <div class="game-status">
                    Seviye: ${state.level}
                    • Skor: ${state.points}/100
                    • Atış: ${state.shots}
                    • İsabet: ${state.made}
                </div>

            </div>
        `);

        $("#basketShoot").onclick=shoot;
        $("#basketNew").onclick=start;
    }

    return {start};

})();

/* ============================================================
   ANA SAYFA BUTONLARI
   ============================================================ */

function bindGameButtons(){

    $$("[data-game]").forEach(el=>{

        if(el.dataset.boundGame)
            return;

        el.dataset.boundGame="1";

        el.addEventListener("click",e=>{

            if(
                e.target.closest(
                    ".play-game,.play-btn,.game-play"
                )
            ){
                return;
            }

            e.preventDefault();

            const id=
                el.dataset.game||
                el.dataset.id;

            if(id)
                openGame(id);
        });
    });

    $$(".play-game,.play-btn,.game-play,[data-play]")
    .forEach(btn=>{

        if(btn.dataset.boundPlay)
            return;

        btn.dataset.boundPlay="1";

        btn.addEventListener("click",e=>{

            e.preventDefault();
            e.stopPropagation();

            const id=
                btn.dataset.play||
                btn.closest("[data-game]")?.dataset.game||
                btn.closest("[data-id]")?.dataset.id;

            if(id && GAME_META[id])
                openGame(id);
        });
    });
}

/* ============================================================
   KART GÖRSELLERİ
   ============================================================ */

function improveGameCards(){

    $$(".game-card").forEach(card=>{

        const id=
            card.dataset.game||
            card.dataset.id;

        if(!GAME_META[id])return;

        const game=GAME_META[id];

        const icon=
            card.querySelector(
                ".game-icon,.game-thumb,.game-image"
            );

        if(icon){

            if(id==="okey")
                icon.textContent="🀄";

            else if(id==="mahjong")
                icon.textContent="🀙";

            else
                icon.textContent=game.icon;
        }
    });
}

/* ============================================================
   FİLTRELER
   ============================================================ */

function bindFilters(){

    $$("[data-filter]").forEach(btn=>{

        if(btn.dataset.boundFilter)
            return;

        btn.dataset.boundFilter="1";

        btn.addEventListener("click",()=>{

            const filter=
                String(
                    btn.dataset.filter||"all"
                ).toLowerCase();

            $$(".game-card").forEach(card=>{

                const cat=
                    String(
                        card.dataset.category||
                        card.dataset.cat||
                        ""
                    ).toLowerCase();

                card.style.display=
                    filter==="all"||
                    filter==="tümü"||
                    cat===filter
                    ?""
                    :"none";
            });

            $$("[data-filter]").forEach(b=>{
                b.classList.remove("active");
            });

            btn.classList.add("active");
        });
    });
}

/* ============================================================
   REKLAM DEMOSU
   ============================================================ */

function setupDemoAd(){

    const btn=$("#watch-ad-btn");

    if(!btn || btn.dataset.boundAd)
        return;

    btn.dataset.boundAd="1";

    btn.addEventListener("click",()=>{

        notify(
            "📺 Bu şu anda deneme reklamıdır. Gerçek AdSense reklamı değildir.",
            "📺",
            "Deneme Reklamı"
        );

        later(()=>{

            changeScore(100);

            coins+=10;

            addXP(10);

            saveProgress();

            notify(
                "🎁 Deneme reklam ödülü: +100 puan ve +10 🪙",
                "🎁",
                "Ödül"
            );

        },1000);
    });
}

/* ============================================================
   GÜNLÜK BONUS
   ============================================================ */

function setupDailyBonus(){

    const btn=
        $("#dailyBonusBtn")||
        $("#watchDailyBonus")||
        $("#dailyBonus");

    if(!btn || btn.dataset.boundDaily)
        return;

    btn.dataset.boundDaily="1";

    btn.addEventListener("click",()=>{

        const today=
            new Date()
            .toISOString()
            .slice(0,10);

        const last=
            localStorage.getItem(
                "oynakazan_daily"
            );

        if(last===today){

            notify(
                "🎁 Günlük bonusunu bugün zaten aldın."
            );

            return;
        }

        localStorage.setItem(
            "oynakazan_daily",
            today
        );

        coins+=25;
        changeScore(25);
        addXP(10);

        saveProgress();

        notify(
            "🎁 Günlük bonus: +25 🪙 ve +25 puan!",
            "🎁",
            "Günlük Bonus"
        );
    });
}

/* ============================================================
   MODAL KAPATMA
   ============================================================ */

function setupModal(){

    const close=$("#close-modal-btn");

    if(close){

        close.onclick=closeGame;
    }

    const modal=$("#game-modal");

    if(modal){

        modal.addEventListener("click",e=>{

            if(e.target===modal)
                closeGame();
        });
    }

    const message=$("#message-modal");

    if(message){

        message.addEventListener("click",e=>{

            if(e.target===message)
                message.classList.add("hidden");
        });
    }
}

/* ============================================================
   KLAVYE
   ============================================================ */

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        if(currentGame)
            closeGame();

        const msg=$("#message-modal");

        if(msg)
            msg.classList.add("hidden");

        return;
    }

    if(currentGame==="snake"){

        if(e.key==="ArrowUp")
            $("#snakeUp")?.click();

        else if(e.key==="ArrowDown")
            $("#snakeDown")?.click();

        else if(e.key==="ArrowLeft")
            $("#snakeLeft")?.click();

        else if(e.key==="ArrowRight")
            $("#snakeRight")?.click();
    }
});

/* ============================================================
   BAŞLANGIÇ
   ============================================================ */

function init(){

    updateTopUI();

    createGameCards();

    bindGameButtons();

    improveGameCards();

    bindFilters();

    setupDemoAd();

    setupDailyBonus();

    setupModal();

    saveProgress();

    console.log(
        "🎮 OynaKazan hazır:",
        Object.keys(GAME_META).length,
        "oyun"
    );
}

if(document.readyState==="loading"){

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

}else{

    init();
}

/* ============================================================
   DIŞARIDAN ERİŞİM
   ============================================================ */

window.OynaKazan={
    openGame,
    closeGame,
    score:()=>score,
    xp:()=>xp,
    level:()=>level,
    coins:()=>coins,
    games:GAME_META
};

})();
