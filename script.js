/* =========================================================
   OYNAKAZAN - 15 OYUNLU ÇALIŞAN OYUN MOTORU
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       TEMEL AYARLAR
    ===================================================== */

    const START_SCORE = 0;
    const GAME_ENTRY_COST = 50;
    const WIN_REWARD = 100;
    const LOSS_REWARD = -50;
    const AD_REWARD = 100;

    let score = Number(localStorage.getItem("oynakazan_score"));

    if (!Number.isFinite(score) || score < 0) {
        score = START_SCORE;
        localStorage.setItem("oynakazan_score", score);
    }

    const scoreElement = document.getElementById("user-score");
    const gamesContainer = document.getElementById("games-container");
    const watchAdButton = document.getElementById("watch-ad-btn");

    const modal = document.getElementById("game-modal");
    const gameArea = document.getElementById("game-area");
    const modalTitle = document.getElementById("modal-game-title");
    const modalCategory = document.getElementById("modal-category");
    const closeModalButton = document.getElementById("close-modal-btn");

    const messageModal = document.getElementById("message-modal");
    const messageIcon = document.getElementById("message-icon");
    const messageTitle = document.getElementById("message-title");
    const messageText = document.getElementById("message-text");
    const messageClose = document.getElementById("message-close");


    /* =====================================================
       OYUN İÇİ STİLLER
       ===================================================== */

    const gameStyle = document.createElement("style");

    gameStyle.textContent = `
        .game-ui{
            width:100%;
            max-width:850px;
            margin:auto;
            color:#fff;
            text-align:center;
        }

        .game-toolbar{
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
            flex-wrap:wrap;
            margin-bottom:15px;
            padding:12px;
            border-radius:14px;
            background:rgba(255,255,255,.07);
        }

        .game-stat{
            padding:8px 12px;
            border-radius:10px;
            background:rgba(0,0,0,.25);
            font-weight:700;
        }

        .game-button{
            border:0;
            border-radius:10px;
            padding:10px 16px;
            cursor:pointer;
            font-weight:800;
            color:white;
            background:#6c63ff;
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

        .game-message{
            min-height:28px;
            margin:10px 0;
            font-weight:700;
        }

        .game-board{
            margin:auto;
            border-radius:16px;
            padding:15px;
            background:rgba(0,0,0,.25);
        }

        .memory-grid{
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:8px;
            max-width:430px;
            margin:20px auto;
        }

        .memory-card{
            aspect-ratio:1;
            border:0;
            border-radius:12px;
            font-size:30px;
            cursor:pointer;
            background:#28304d;
            color:white;
            font-weight:bold;
        }

        .memory-card.open,
        .memory-card.done{
            background:#6c63ff;
        }

        .sudoku-grid{
            display:grid;
            grid-template-columns:repeat(9,1fr);
            max-width:450px;
            margin:20px auto;
            border:3px solid #fff;
        }

        .sudoku-cell{
            width:100%;
            aspect-ratio:1;
            border:1px solid rgba(255,255,255,.25);
            background:#171d35;
            color:#fff;
            text-align:center;
            font-size:20px;
            font-weight:bold;
        }

        .sudoku-cell.given{
            background:#303957;
        }

        .sudoku-cell:nth-child(3n){
            border-right:2px solid #fff;
        }

        .sudoku-cell:nth-child(27n),
        .sudoku-cell:nth-child(54n){
            border-bottom:2px solid #fff;
        }

        .snake-board{
            position:relative;
            width:min(90vw,420px);
            aspect-ratio:1;
            margin:15px auto;
            background:#10162b;
            border:3px solid #6c63ff;
            border-radius:12px;
            overflow:hidden;
        }

        .snake-cell{
            position:absolute;
            width:5%;
            height:5%;
            border-radius:4px;
            background:#00d4ff;
        }

        .snake-food{
            position:absolute;
            width:5%;
            height:5%;
            border-radius:50%;
            background:#ff4d6d;
        }

        .snake-controls{
            display:grid;
            grid-template-columns:repeat(3,60px);
            justify-content:center;
            gap:5px;
            margin-top:10px;
        }

        .snake-controls button{
            height:50px;
            border:0;
            border-radius:10px;
            background:#6c63ff;
            color:#fff;
            font-size:20px;
            cursor:pointer;
        }

        .racing-track{
            position:relative;
            width:min(92vw,500px);
            height:390px;
            margin:15px auto;
            border-left:4px solid #fff;
            border-right:4px solid #fff;
            overflow:hidden;
            background:
                repeating-linear-gradient(
                    to bottom,
                    #252b43 0px,
                    #252b43 35px,
                    #303650 35px,
                    #303650 70px
                );
            border-radius:15px;
        }

        .race-car{
            position:absolute;
            width:45px;
            height:70px;
            border-radius:10px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:28px;
        }

        .player-car{
            bottom:20px;
            left:50%;
            transform:translateX(-50%);
        }

        .enemy-car{
            top:-80px;
        }

        .race-controls{
            display:flex;
            justify-content:center;
            gap:10px;
        }

        .archery-target{
            position:relative;
            width:min(75vw,350px);
            aspect-ratio:1;
            margin:25px auto;
            border-radius:50%;
            background:
                radial-gradient(
                    circle,
                    #fff 0 12%,
                    #ff5555 12% 25%,
                    #fff 25% 38%,
                    #ff5555 38% 51%,
                    #fff 51% 65%,
                    #222 65% 100%
                );
            cursor:pointer;
            border:5px solid #aaa;
        }

        .archery-arrow{
            position:absolute;
            width:8px;
            height:8px;
            border-radius:50%;
            background:#ffd166;
            box-shadow:0 0 10px #ffd166;
        }

        .bubble-board{
            display:grid;
            grid-template-columns:repeat(8,1fr);
            gap:4px;
            max-width:450px;
            margin:15px auto;
            padding:8px;
            background:#11182d;
            border-radius:15px;
        }

        .bubble{
            aspect-ratio:1;
            border:0;
            border-radius:50%;
            cursor:pointer;
            font-size:0;
            box-shadow:inset 0 -5px 8px rgba(0,0,0,.25);
        }

        .block-grid{
            display:grid;
            grid-template-columns:repeat(8,1fr);
            max-width:420px;
            margin:15px auto;
            gap:3px;
            padding:5px;
            background:#11182d;
            border-radius:12px;
        }

        .block-cell{
            aspect-ratio:1;
            border-radius:4px;
            background:#252d49;
            cursor:pointer;
        }

        .block-cell.filled{
            background:#6c63ff;
        }

        .basket-court{
            position:relative;
            max-width:500px;
            height:300px;
            margin:20px auto;
            border-radius:18px;
            background:linear-gradient(#526080,#28304b);
            border:3px solid #fff;
            overflow:hidden;
        }

        .basket-hoop{
            position:absolute;
            right:30px;
            top:75px;
            width:80px;
            height:80px;
            border:8px solid #ff7043;
            border-radius:50%;
        }

        .basket-ball{
            position:absolute;
            width:35px;
            height:35px;
            border-radius:50%;
            background:#ff8c42;
            cursor:pointer;
            transition:.35s;
        }

        .bilardo-table{
            position:relative;
            width:min(92vw,650px);
            aspect-ratio:2/1;
            margin:15px auto;
            border:18px solid #6b3d20;
            border-radius:25px;
            background:#087447;
            box-shadow:inset 0 0 0 5px #033d27;
            overflow:hidden;
        }

        .pool-ball{
            position:absolute;
            width:28px;
            height:28px;
            border-radius:50%;
            cursor:pointer;
            border:2px solid white;
        }

        .pool-hole{
            position:absolute;
            width:38px;
            height:38px;
            border-radius:50%;
            background:#050505;
        }

        .mahjong-grid{
            display:grid;
            grid-template-columns:repeat(6,1fr);
            gap:7px;
            max-width:500px;
            margin:15px auto;
        }

        .mahjong-tile{
            aspect-ratio:.75;
            border:0;
            border-radius:8px;
            background:#eee;
            color:#111;
            font-size:24px;
            cursor:pointer;
            font-weight:bold;
        }

        .mahjong-tile.selected{
            outline:4px solid #6c63ff;
        }

        .mahjong-tile.removed{
            visibility:hidden;
        }

        .okey-rack{
            display:flex;
            flex-wrap:wrap;
            justify-content:center;
            gap:6px;
            max-width:700px;
            margin:15px auto;
            padding:15px;
            background:#563b1f;
            border-radius:15px;
        }

        .okey-tile{
            min-width:42px;
            padding:8px 5px;
            border:0;
            border-radius:7px;
            background:#f5e7bf;
            color:#111;
            cursor:pointer;
            font-weight:900;
        }

        .okey-tile.selected{
            transform:translateY(-8px);
            background:#ffd166;
        }

        .dice{
            font-size:70px;
            margin:20px;
        }

        .backgammon-board{
            display:grid;
            grid-template-columns:repeat(12,1fr);
            gap:3px;
            max-width:650px;
            margin:20px auto;
            padding:12px;
            background:#75451f;
            border-radius:15px;
        }

        .back-point{
            min-height:130px;
            background:#c58a50;
            border-radius:5px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            gap:3px;
            padding-top:5px;
        }

        .checker{
            width:27px;
            height:27px;
            border-radius:50%;
            border:2px solid #fff;
            cursor:pointer;
        }

        .checker.white{
            background:#eee;
        }

        .checker.black{
            background:#222;
        }

        .checkers-board{
            display:grid;
            grid-template-columns:repeat(8,1fr);
            max-width:480px;
            margin:15px auto;
            border:5px solid #5a351d;
        }

        .checkers-cell{
            aspect-ratio:1;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
        }

        .checkers-cell.light{
            background:#e8c99a;
        }

        .checkers-cell.dark{
            background:#704522;
        }

        .check-piece{
            width:65%;
            height:65%;
            border-radius:50%;
            border:3px solid rgba(255,255,255,.7);
        }

        .check-piece.player{
            background:#e33b4d;
        }

        .check-piece.bot{
            background:#222;
        }

        .card-hand{
            display:flex;
            justify-content:center;
            flex-wrap:wrap;
            gap:7px;
            margin:20px auto;
        }

        .playing-card{
            width:58px;
            height:82px;
            border:0;
            border-radius:8px;
            background:#fff;
            color:#111;
            font-size:20px;
            cursor:pointer;
            font-weight:bold;
        }

        .playing-card.red{
            color:#d22;
        }

        .word-display{
            font-size:36px;
            letter-spacing:8px;
            margin:25px 0;
            font-weight:900;
        }

        .word-letters{
            display:flex;
            flex-wrap:wrap;
            justify-content:center;
            gap:7px;
            max-width:600px;
            margin:auto;
        }

        .letter-btn{
            width:45px;
            height:45px;
            border:0;
            border-radius:9px;
            background:#28304d;
            color:#fff;
            font-weight:bold;
            cursor:pointer;
        }

        .quiz-options{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            max-width:600px;
            margin:20px auto;
        }

        .quiz-options button{
            min-height:55px;
            border:0;
            border-radius:12px;
            background:#28304d;
            color:white;
            cursor:pointer;
            font-weight:bold;
        }

        .quiz-options button:hover{
            background:#6c63ff;
        }

        .reaction-area{
            width:min(85vw,400px);
            height:300px;
            margin:20px auto;
            border-radius:20px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#28304d;
            cursor:pointer;
            font-size:28px;
            font-weight:bold;
        }

        @media(max-width:600px){
            .memory-grid{
                gap:5px;
            }

            .quiz-options{
                grid-template-columns:1fr;
            }

            .back-point{
                min-height:90px;
            }

            .checker{
                width:21px;
                height:21px;
            }

            .playing-card{
                width:48px;
                height:70px;
            }
        }
    `;

    document.head.appendChild(gameStyle);


    /* =====================================================
       PUAN
       ===================================================== */

    function updateScore() {

        if (score < 0) {
            score = 0;
        }

        localStorage.setItem("oynakazan_score", score);

        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }

    function changeScore(amount) {
        score += amount;

        if (score < 0) {
            score = 0;
        }

        updateScore();
    }

    updateScore();


    /* =====================================================
       MESAJ
       ===================================================== */

    function showMessage(title, text, icon = "🎮") {

        if (!messageModal) {
            alert(title + "\n\n" + text);
            return;
        }

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

    if (messageModal) {
        messageModal.addEventListener("click", function (event) {

            if (event.target === messageModal) {
                hideMessage();
            }

        });
    }


    /* =====================================================
       15 OYUN
       ===================================================== */

    const games = [

        {
            name:"101 Okey",
            category:"board",
            icon:"fa-solid fa-dice",
            bg:"okey-bg",
            badge:"POPÜLER",
            description:"101 Okey mini masa oyununu botlara karşı oyna.",
            type:"okey"
        },

        {
            name:"Klasik Tavla",
            category:"board",
            icon:"fa-solid fa-dice",
            bg:"tavla-bg",
            description:"Zarları at, pullarını ilerlet ve rakibini yen.",
            type:"tavla"
        },

        {
            name:"Türk Daması",
            category:"board",
            icon:"fa-solid fa-chess-board",
            bg:"dama-bg",
            description:"Taşlarını hareket ettir ve botu yen.",
            type:"dama"
        },

        {
            name:"Batak",
            category:"cards",
            icon:"fa-solid fa-club",
            bg:"batak-bg",
            description:"Kartlarını kullan ve eli kazanmaya çalış.",
            type:"batak"
        },

        {
            name:"Bilardo",
            category:"arcade",
            icon:"fa-solid fa-circle",
            bg:"bilardo-bg",
            description:"Toplara tıklayarak ceplere gönder.",
            type:"bilardo"
        },

        {
            name:"Mahjong",
            category:"puzzle",
            icon:"fa-solid fa-puzzle-piece",
            bg:"mahjong-bg",
            description:"Aynı taşları eşleştir ve tahtayı temizle.",
            type:"mahjong"
        },

        {
            name:"Sudoku",
            category:"puzzle",
            icon:"fa-solid fa-table-cells",
            bg:"sudoku-bg",
            description:"Sudoku bulmacasını çöz.",
            type:"sudoku"
        },

        {
            name:"Bubble Shooter",
            category:"arcade",
            icon:"fa-solid fa-circle-dot",
            bg:"bubble-bg",
            description:"Aynı renk baloncukları patlat.",
            type:"bubble"
        },

        {
            name:"Araba Yarışı",
            category:"arcade",
            icon:"fa-solid fa-car",
            bg:"racing-bg",
            description:"Arabayı kontrol et ve rakiplere çarpma.",
            type:"racing"
        },

        {
            name:"Block Puzzle",
            category:"puzzle",
            icon:"fa-solid fa-cubes",
            bg:"block-bg",
            description:"Blokları yerleştir ve satırları temizle.",
            type:"block"
        },

        {
            name:"Okçuluk",
            category:"arcade",
            icon:"fa-solid fa-bullseye",
            bg:"archery-bg",
            description:"Hedefin merkezine mümkün olduğunca yaklaş.",
            type:"archery"
        },

        {
            name:"Zeka Eşleştirme",
            category:"puzzle",
            icon:"fa-solid fa-brain",
            bg:"match-bg",
            description:"Kart çiftlerini en az hamleyle eşleştir.",
            type:"memory"
        },

        {
            name:"Hafıza Oyunu",
            category:"puzzle",
            icon:"fa-solid fa-brain",
            bg:"memory-bg",
            description:"Kartların eşlerini bul.",
            type:"memory2"
        },

        {
            name:"Yılan Oyunu",
            category:"arcade",
            icon:"fa-solid fa-worm",
            bg:"snake-bg",
            description:"Yılanı büyüt ve duvarlara çarpma.",
            type:"snake"
        },

        {
            name:"Basket Atışı",
            category:"arcade",
            icon:"fa-solid fa-basketball",
            bg:"basket-bg",
            description:"Topu potaya gönder ve isabet ettir.",
            type:"basket"
        }

    ];


    /* =====================================================
       KARTLARI OLUŞTUR
       ===================================================== */

    function renderGames(filter="all") {

        if (!gamesContainer) return;

        gamesContainer.innerHTML="";

        games
            .filter(game => filter==="all" || game.category===filter)
            .forEach(game => {

                const card=document.createElement("article");

                card.className="game-card";
                card.dataset.category=game.category;

                card.innerHTML=`
                    <div class="game-img ${game.bg}">
                        <i class="${game.icon}"></i>
                        ${
                            game.badge
                            ? `<span class="game-badge">${game.badge}</span>`
                            : ""
                        }
                    </div>

                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <p>${game.description}</p>

                        <button class="play-btn">
                            <i class="fa-solid fa-play"></i>
                            Oyna
                        </button>
                    </div>
                `;

                card.addEventListener("click",()=>openGame(game));

                gamesContainer.appendChild(card);

            });
    }

    renderGames();


    /* =====================================================
       KATEGORİLER
       ===================================================== */

    document.querySelectorAll(".cat-btn").forEach(button=>{

        button.addEventListener("click",function(){

            document.querySelectorAll(".cat-btn")
                .forEach(btn=>btn.classList.remove("active"));

            button.classList.add("active");

            renderGames(button.dataset.filter);

        });

    });


    /* =====================================================
       OYUN AÇ
       ===================================================== */

    const paidGames=["okey","tavla","dama","batak"];

    function openGame(game) {

        if (!modal || !gameArea) return;

        if (paidGames.includes(game.type)) {

            if(score<GAME_ENTRY_COST){

                showMessage(
                    "Yeterli Puan Yok",
                    "Bu oyuna girmek için 50 puan gerekiyor.\n\n"+
                    "Mevcut puanın: "+score+
                    "\n\nReklam ödül sistemi bağlandığında +100 puan kazanabileceksin.",
                    "🪙"
                );

                return;
            }

            changeScore(-GAME_ENTRY_COST);
        }

        modalTitle.textContent=game.name;
        modalCategory.textContent=getCategoryName(game.category);

        gameArea.innerHTML="";

        switch(game.type){

            case "okey":createOkeyGame();break;
            case "tavla":createTavlaGame();break;
            case "dama":createDamaGame();break;
            case "batak":createBatakGame();break;
            case "bilardo":createBilardoGame();break;
            case "mahjong":createMahjongGame();break;
            case "sudoku":createSudokuGame();break;
            case "bubble":createBubbleGame();break;
            case "racing":createRacingGame();break;
            case "block":createBlockGame();break;
            case "archery":createArcheryGame();break;
            case "memory":createMemoryGame(6);break;
            case "memory2":createMemoryGame(8);break;
            case "snake":createSnakeGame();break;
            case "basket":createBasketGame();break;
        }

        modal.classList.remove("hidden");
        document.body.style.overflow="hidden";
    }

    window.openGame=openGame;


    function getCategoryName(category){

        if(category==="board")return "MASA OYUNU";
        if(category==="cards")return "KART OYUNU";
        if(category==="puzzle")return "ZEKA OYUNU";
        return "EĞLENCE";
    }


    /* =====================================================
       OYUN KAPAT
       ===================================================== */

    function closeGame(){

        if(!modal)return;

        modal.classList.add("hidden");
        gameArea.innerHTML="";
        document.body.style.overflow="";
    }

    window.closeGame=closeGame;

    if(closeModalButton){
        closeModalButton.addEventListener("click",closeGame);
    }

    if(modal){

        modal.addEventListener("click",function(event){

            if(event.target===modal){
                closeGame();
            }

        });
    }

    document.addEventListener("keydown",function(event){

        if(event.key==="Escape"){
            closeGame();
            hideMessage();
        }

    });


    /* =====================================================
       ORTAK SONUÇ
       ===================================================== */

    function gameWon(name,points=WIN_REWARD){

        changeScore(points);

        showMessage(
            "🎉 Kazandın!",
            name+" oyununu kazandın.\n\n+"+
            points+" puan kazandın.",
            "🏆"
        );
    }

    function gameLost(name){

        changeScore(LOSS_REWARD);

        showMessage(
            "😔 Oyun Bitti",
            name+" oyununu kaybettin.\n\n"+
            LOSS_REWARD+" puan.",
            "🎮"
        );
    }


    /* =====================================================
       BOT İSİMLERİ
       ===================================================== */

    const botNames=[
        "Ali","Mehmet","Ahmet","Burak","Murat","Emre",
        "Can","Kerem","Hasan","Hakan","Efe","Oğuz"
    ];

    function randomBot(){
        return botNames[Math.floor(Math.random()*botNames.length)];
    }


    /* =====================================================
       1 - 101 OKEY
       ===================================================== */

    function createOkeyGame(){

        const bot1=randomBot();
        const bot2=randomBot();
        const bot3=randomBot();

        let tiles=[];
        let selected=[];
        let turn=0;

        const colors=["🔴","🔵","🟢","🟡"];

        for(let c=0;c<4;c++){
            for(let n=1;n<=13;n++){
                tiles.push({
                    value:n,
                    color:colors[c]
                });
            }
        }

        tiles.sort(()=>Math.random()-.5);

        let rack=tiles.slice(0,14);

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span class="game-stat">👤 Sen</span>
                    <span class="game-stat">🤖 ${bot1}</span>
                    <span class="game-stat">🤖 ${bot2}</span>
                    <span class="game-stat">🤖 ${bot3}</span>
                </div>

                <h2>🀄 101 Okey</h2>

                <p>
                    Aynı renk ardışık taşlardan veya aynı sayı farklı
                    renklerden gruplar oluştur.
                </p>

                <div id="okey-rack" class="okey-rack"></div>

                <button id="okey-draw" class="game-button">
                    🎲 Taş Çek
                </button>

                <button id="okey-finish" class="game-button">
                    🏆 Elini Bitir
                </button>

                <div id="okey-info" class="game-message">
                    14 taşın var. En az 3erli gruplar oluşturmaya çalış.
                </div>

            </div>
        `;

        const rackEl=document.getElementById("okey-rack");
        const info=document.getElementById("okey-info");

        function renderRack(){

            rackEl.innerHTML="";

            rack.forEach((tile,index)=>{

                const btn=document.createElement("button");

                btn.className="okey-tile";

                if(selected.includes(index)){
                    btn.classList.add("selected");
                }

                btn.textContent=tile.color+" "+tile.value;

                btn.addEventListener("click",()=>{

                    if(selected.includes(index)){
                        selected=selected.filter(i=>i!==index);
                    }else{
                        selected.push(index);
                    }

                    renderRack();
                });

                rackEl.appendChild(btn);
            });
        }

        renderRack();

        document.getElementById("okey-draw").onclick=()=>{

            if(turn>=5){
                info.textContent="Bu mini el için artık elini bitirmelisin.";
                return;
            }

            if(tiles.length){

                rack.push(tiles.pop());
                selected=[];
                turn++;

                info.textContent=
                    "Taş çektin. Elini güçlendirmeye çalış.";
                renderRack();
            }
        };

        document.getElementById("okey-finish").onclick=()=>{

            let valueSum=selected.reduce(
                (sum,index)=>sum+rack[index].value,0
            );

            if(selected.length>=3 && valueSum>=15){

                gameWon("101 Okey");

            }else{

                gameLost("101 Okey");

            }

        };
    }


    /* =====================================================
       2 - TAVLA
       ===================================================== */

    function createTavlaGame(){

        const bot=randomBot();

        let player=0;
        let botPos=0;
        let playerTurn=true;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>👤 Sen: <b id="tavla-player">0</b></span>
                    <span>🤖 ${bot}: <b id="tavla-bot">0</b></span>
                </div>

                <h2>🎲 Klasik Tavla</h2>

                <div class="backgammon-board" id="tavla-board">
                    ${Array.from({length:12},(_,i)=>`
                        <div class="back-point">
                            <small>${i+1}</small>
                        </div>
                    `).join("")}
                </div>

                <div class="dice" id="tavla-dice">🎲</div>

                <button class="game-button" id="tavla-roll">
                    Zar At
                </button>

                <div class="game-message" id="tavla-info">
                    İlk olarak zar at.
                </div>

            </div>
        `;

        const diceEl=document.getElementById("tavla-dice");
        const info=document.getElementById("tavla-info");

        document.getElementById("tavla-roll").onclick=()=>{

            if(!playerTurn)return;

            const d1=Math.floor(Math.random()*6)+1;
            const d2=Math.floor(Math.random()*6)+1;

            const total=d1+d2;

            diceEl.textContent=
                ["","⚀","⚁","⚂","⚃","⚄","⚅"][d1]+
                " "+
                ["","⚀","⚁","⚂","⚃","⚄","⚅"][d2];

            player+=total;

            if(player>=30){

                gameWon("Tavla");
                return;
            }

            document.getElementById("tavla-player").textContent=player;

            playerTurn=false;

            info.textContent=
                bot+" düşünüyor...";

            setTimeout(()=>{

                const botRoll=Math.floor(Math.random()*6)+
                              Math.floor(Math.random()*6)+2;

                botPos+=botRoll;

                document.getElementById("tavla-bot").textContent=botPos;

                if(botPos>=30){

                    gameLost("Tavla");
                    return;
                }

                playerTurn=true;

                info.textContent=
                    "Sıra sende. Zarını at.";

            },600);
        };
    }


    /* =====================================================
       3 - TÜRK DAMASI
       ===================================================== */

    function createDamaGame(){

        const board=Array(64).fill(null);

        for(let r=0;r<3;r++){
            for(let c=0;c<8;c++){
                if((r+c)%2===0){
                    board[r*8+c]="bot";
                }
            }
        }

        for(let r=5;r<8;r++){
            for(let c=0;c<8;c++){
                if((r+c)%2===0){
                    board[r*8+c]="player";
                }
            }
        }

        let selected=-1;
        let moves=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <h2>⚫ Türk Daması</h2>

                <div class="game-toolbar">
                    <span>🔴 Sen</span>
                    <span>⚫ Bot</span>
                    <span>Hamle: <b id="dama-moves">0</b></span>
                </div>

                <div id="dama-board" class="checkers-board"></div>

                <div id="dama-info" class="game-message">
                    Kırmızı taşlarından birine tıkla.
                </div>

            </div>
        `;

        const boardEl=document.getElementById("dama-board");
        const info=document.getElementById("dama-info");

        function render(){

            boardEl.innerHTML="";

            board.forEach((piece,index)=>{

                const cell=document.createElement("div");

                cell.className=
                    "checkers-cell "+
                    ((Math.floor(index/8)+index)%2===0
                        ?"light":"dark");

                if(piece){

                    const p=document.createElement("div");

                    p.className=
                        "check-piece "+
                        (piece==="player"?"player":"bot");

                    cell.appendChild(p);
                }

                cell.onclick=()=>{

                    if(board[index]==="player"){

                        selected=index;

                        info.textContent=
                            "Şimdi taşını oynatmak istediğin boş kareye tıkla.";

                        return;
                    }

                    if(selected>=0 && !board[index]){

                        const sr=Math.floor(selected/8);
                        const sc=selected%8;

                        const tr=Math.floor(index/8);
                        const tc=index%8;

                        if(Math.abs(sr-tr)<=1 &&
                           Math.abs(sc-tc)<=1){

                            board[index]="player";
                            board[selected]=null;
                            selected=-1;
                            moves++;

                            document.getElementById("dama-moves")
                                .textContent=moves;

                            const botPieces=board.filter(x=>x==="bot").length;

                            if(botPieces===0){

                                gameWon("Türk Daması");
                                return;
                            }

                            botMove();
                        }

                    }

                    render();
                };

                boardEl.appendChild(cell);
            });
        }

        function botMove(){

            const botIndexes=board
                .map((p,i)=>p==="bot"?i:-1)
                .filter(i=>i>=0);

            if(!botIndexes.length)return;

            const from=botIndexes[
                Math.floor(Math.random()*botIndexes.length)
            ];

            const fr=Math.floor(from/8);
            const fc=from%8;

            const possible=[];

            [-1,0,1].forEach(dr=>{
                [-1,0,1].forEach(dc=>{

                    const nr=fr+dr;
                    const nc=fc+dc;

                    if(nr>=0&&nr<8&&nc>=0&&nc<8){

                        const to=nr*8+nc;

                        if(!board[to]){
                            possible.push(to);
                        }
                    }
                });
            });

            if(possible.length){

                const to=possible[
                    Math.floor(Math.random()*possible.length)
                ];

                board[to]="bot";
                board[from]=null;
            }

            render();
        }

        render();
    }


    /* =====================================================
       4 - BATAK
       ===================================================== */

    function createBatakGame(){

        const suits=["♠","♥","♦","♣"];
        const values=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

        let deck=[];

        suits.forEach(s=>{
            values.forEach(v=>{
                deck.push({
                    suit:s,
                    value:v,
                    rank:values.indexOf(v)
                });
            });
        });

        deck.sort(()=>Math.random()-.5);

        const hand=deck.slice(0,5);
        const botHand=deck.slice(5,10);

        let playerScore=0;
        let botScore=0;
        let round=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>👤 Sen: <b id="batak-player-score">0</b></span>
                    <span>🤖 Rakipler</span>
                </div>

                <h2>🃏 Batak</h2>

                <p>Her elde bir kart seç. Daha yüksek kart eli kazanır.</p>

                <div id="batak-hand" class="card-hand"></div>

                <div id="batak-info" class="game-message">
                    Kartını seç.
                </div>

            </div>
        `;

        const handEl=document.getElementById("batak-hand");
        const info=document.getElementById("batak-info");

        function render(){

            handEl.innerHTML="";

            hand.forEach((card,index)=>{

                const btn=document.createElement("button");

                btn.className="playing-card "+
                    ((card.suit==="♥"||card.suit==="♦")?"red":"");

                btn.textContent=card.value+card.suit;

                btn.onclick=()=>play(index);

                handEl.appendChild(btn);
            });
        }

        function play(index){

            if(round>=5)return;

            const playerCard=hand.splice(index,1)[0];
            const botCard=botHand.splice(
                Math.floor(Math.random()*botHand.length),1
            )[0];

            if(playerCard.rank>=botCard.rank){

                playerScore++;

                info.textContent=
                    "Eli kazandın: "+playerCard.value+playerCard.suit+
                    " > "+botCard.value+botCard.suit;

            }else{

                botScore++;

                info.textContent=
                    "Rakip eli aldı: "+playerCard.value+playerCard.suit+
                    " < "+botCard.value+botCard.suit;
            }

            round++;

            document.getElementById("batak-player-score")
                .textContent=playerScore;

            if(round>=5){

                if(playerScore>=3){
                    gameWon("Batak");
                }else{
                    gameLost("Batak");
                }

                return;
            }

            render();
        }

        render();
    }


    /* =====================================================
       5 - BİLARDO
       ===================================================== */

    function createBilardoGame(){

        let balls=[
            {x:20,y:50},
            {x:35,y:40},
            {x:35,y:60},
            {x:45,y:35},
            {x:45,y:50},
            {x:45,y:65}
        ];

        let scorePool=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🎱 Toplar: <b id="pool-count">6</b></span>
                    <span>🏆 Skor: <b id="pool-score">0</b></span>
                </div>

                <h2>🎱 Bilardo</h2>

                <p>Toplara tıklayarak ceplere göndermeye çalış.</p>

                <div id="pool-table" class="bilardo-table">

                    <div class="pool-hole" style="left:-15px;top:-15px"></div>
                    <div class="pool-hole" style="right:-15px;top:-15px"></div>
                    <div class="pool-hole" style="left:-15px;bottom:-15px"></div>
                    <div class="pool-hole" style="right:-15px;bottom:-15px"></div>
                    <div class="pool-hole" style="left:50%;top:-15px"></div>
                    <div class="pool-hole" style="left:50%;bottom:-15px"></div>

                </div>

            </div>
        `;

        const table=document.getElementById("pool-table");

        function render(){

            table.querySelectorAll(".pool-ball")
                .forEach(x=>x.remove());

            balls.forEach((ball,index)=>{

                const b=document.createElement("div");

                b.className="pool-ball";

                b.style.left=ball.x+"%";
                b.style.top=ball.y+"%";

                b.style.background=
                    ["#fff","#ff4444","#4488ff","#ffd166","#bb66ff","#44cc88"][index%6];

                b.onclick=()=>{

                    balls.splice(index,1);

                    scorePool+=20;

                    document.getElementById("pool-count")
                        .textContent=balls.length;

                    document.getElementById("pool-score")
                        .textContent=scorePool;

                    render();

                    if(!balls.length){
                        gameWon("Bilardo");
                    }
                };

                table.appendChild(b);
            });
        }

        render();
    }


    /* =====================================================
       6 - MAHJONG
       ===================================================== */

    function createMahjongGame(){

        const symbols=[
            "🌸","🌸","🐉","🐉","🐢","🐢",
            "🀄","🀄","🎋","🎋","⭐","⭐",
            "🍀","🍀","🔔","🔔","🌙","🌙"
        ];

        symbols.sort(()=>Math.random()-.5);

        let selected=-1;
        let removed=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🀄 Kalan: <b id="mahjong-left">18</b></span>
                </div>

                <h2>🀄 Mahjong</h2>

                <div id="mahjong-grid" class="mahjong-grid"></div>

                <div id="mahjong-info" class="game-message">
                    Aynı iki taşı seç.
                </div>

            </div>
        `;

        const grid=document.getElementById("mahjong-grid");
        const info=document.getElementById("mahjong-info");

        function render(){

            grid.innerHTML="";

            symbols.forEach((symbol,index)=>{

                const tile=document.createElement("button");

                tile.className="mahjong-tile";

                if(symbol===null){
                    tile.classList.add("removed");
                }else{
                    tile.textContent=symbol;
                }

                if(selected===index){
                    tile.classList.add("selected");
                }

                tile.onclick=()=>{

                    if(symbols[index]===null)return;

                    if(selected===-1){

                        selected=index;
                        render();

                    }else{

                        if(selected===index)return;

                        if(symbols[selected]===symbols[index]){

                            symbols[selected]=null;
                            symbols[index]=null;

                            removed+=2;
                            selected=-1;

                            document.getElementById("mahjong-left")
                                .textContent=18-removed;

                            info.textContent="Eşleşti! 🎉";

                            if(removed===18){
                                gameWon("Mahjong");
                                return;
                            }

                        }else{

                            info.textContent=
                                "Bu iki taş aynı değil.";
                            selected=-1;
                        }

                        render();
                    }
                };

                grid.appendChild(tile);
            });
        }

        render();
    }


    /* =====================================================
       7 - SUDOKU
       ===================================================== */

    function createSudokuGame(){

        const solution=[
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

        const puzzle=[...solution];

        const givens=new Set();

        while(givens.size<42){
            givens.add(Math.floor(Math.random()*81));
        }

        givens.forEach(i=>puzzle[i]=0);

        gameArea.innerHTML=`
            <div class="game-ui">

                <h2>🔢 Sudoku</h2>

                <div id="sudoku-grid" class="sudoku-grid"></div>

                <button class="game-button" id="sudoku-check">
                    Çözümü Kontrol Et
                </button>

                <div id="sudoku-info" class="game-message">
                    Boş kareleri doldur.
                </div>

            </div>
        `;

        const grid=document.getElementById("sudoku-grid");

        puzzle.forEach((value,index)=>{

            const input=document.createElement("input");

            input.className="sudoku-cell";

            input.maxLength=1;
            input.inputMode="numeric";

            if(value!==0){

                input.value=value;
                input.disabled=true;
                input.classList.add("given");

            }

            input.dataset.answer=solution[index];

            input.addEventListener("input",function(){

                this.value=this.value.replace(/[^1-9]/g,"");

            });

            grid.appendChild(input);
        });

        document.getElementById("sudoku-check").onclick=()=>{

            const cells=[...grid.querySelectorAll("input")];

            const correct=cells.every(
                cell=>Number(cell.value)===Number(cell.dataset.answer)
            );

            if(correct){

                gameWon("Sudoku");

            }else{

                document.getElementById("sudoku-info")
                    .textContent="Bazı sayılar yanlış. Tekrar dene.";
            }
        };
    }


    /* =====================================================
       8 - BUBBLE SHOOTER
       ===================================================== */

    function createBubbleGame(){

        const colors=[
            "#ff4d6d",
            "#ffd166",
            "#00d4ff",
            "#6c63ff",
            "#44cc88"
        ];

        let bubbles=[];

        for(let i=0;i<32;i++){
            bubbles.push(
                colors[Math.floor(Math.random()*colors.length)]
            );
        }

        let points=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🎯 Skor: <b id="bubble-score">0</b></span>
                    <span>Baloncukları temizle</span>
                </div>

                <h2>🫧 Bubble Shooter</h2>

                <div id="bubble-board" class="bubble-board"></div>

                <div class="game-message">
                    Aynı renkten 3 veya daha fazlasına tıkla.
                </div>

            </div>
        `;

        const board=document.getElementById("bubble-board");

        function render(){

            board.innerHTML="";

            bubbles.forEach((color,index)=>{

                const b=document.createElement("button");

                b.className="bubble";
                b.style.background=color;

                b.onclick=()=>{

                    const target=bubbles[index];

                    const group=bubbles
                        .map((c,i)=>c===target?i:-1)
                        .filter(i=>i>=0);

                    if(group.length>=3){

                        group.reverse().forEach(i=>{
                            bubbles.splice(i,1);
                        });

                        points+=group.length*10;

                        document.getElementById("bubble-score")
                            .textContent=points;

                        if(bubbles.length===0){
                            gameWon("Bubble Shooter");
                            return;
                        }

                    }

                    render();
                };

                board.appendChild(b);
            });
        }

        render();
    }


    /* =====================================================
       9 - ARABA YARIŞI
       ===================================================== */

    function createRacingGame(){

        let x=50;
        let enemyY=-80;
        let enemyX=20+Math.random()*60;
        let running=true;
        let distance=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🏁 Mesafe: <b id="race-distance">0</b></span>
                    <span>Kontrol: ← →</span>
                </div>

                <h2>🏎️ Araba Yarışı</h2>

                <div id="race-track" class="racing-track">

                    <div id="player-car"
                         class="race-car player-car">
                        🏎️
                    </div>

                    <div id="enemy-car"
                         class="race-car enemy-car">
                        🚙
                    </div>

                </div>

                <div class="race-controls">
                    <button class="game-button" id="race-left">⬅️</button>
                    <button class="game-button" id="race-right">➡️</button>
                </div>

            </div>
        `;

        const player=document.getElementById("player-car");
        const enemy=document.getElementById("enemy-car");

        function move(direction){

            if(!running)return;

            x+=direction*5;

            if(x<10)x=10;
            if(x>90)x=90;

            player.style.left=x+"%";
        }

        document.getElementById("race-left")
            .onclick=()=>move(-1);

        document.getElementById("race-right")
            .onclick=()=>move(1);

        const keyHandler=(e)=>{

            if(e.key==="ArrowLeft")move(-1);
            if(e.key==="ArrowRight")move(1);
        };

        document.addEventListener("keydown",keyHandler);

        const interval=setInterval(()=>{

            if(!running){
                clearInterval(interval);
                document.removeEventListener("keydown",keyHandler);
                return;
            }

            enemyY+=5;

            if(enemyY>110){

                enemyY=-80;
                enemyX=10+Math.random()*80;

                distance++;

                document.getElementById("race-distance")
                    .textContent=distance;

                if(distance>=20){

                    running=false;
                    clearInterval(interval);
                    document.removeEventListener("keydown",keyHandler);

                    gameWon("Araba Yarışı");
                    return;
                }
            }

            enemy.style.top=enemyY+"%";
            enemy.style.left=enemyX+"%";

            const hit=
                enemyY>70 &&
                enemyY<95 &&
                Math.abs(enemyX-x)<12;

            if(hit){

                running=false;
                clearInterval(interval);
                document.removeEventListener("keydown",keyHandler);

                gameLost("Araba Yarışı");
            }

        },100);
    }


    /* =====================================================
       10 - BLOCK PUZZLE
       ===================================================== */

    function createBlockGame(){

        const size=8;
        const board=Array(64).fill(false);
        let scoreBlock=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🧱 Skor: <b id="block-score">0</b></span>
                    <span>5 satır temizle = kazan</span>
                </div>

                <h2>🧱 Block Puzzle</h2>

                <div id="block-grid" class="block-grid"></div>

                <div class="game-message">
                    Karelere tıklayarak blok yerleştir.
                </div>

            </div>
        `;

        const grid=document.getElementById("block-grid");

        function render(){

            grid.innerHTML="";

            board.forEach((filled,index)=>{

                const cell=document.createElement("div");

                cell.className="block-cell";

                if(filled){
                    cell.classList.add("filled");
                }

                cell.onclick=()=>{

                    if(board[index])return;

                    board[index]=true;
                    scoreBlock++;

                    const row=Math.floor(index/size);

                    const rowComplete=
                        board.slice(row*size,row*size+size)
                        .every(Boolean);

                    if(rowComplete){

                        for(let i=row*size;i<row*size+size;i++){
                            board[i]=false;
                        }

                        scoreBlock+=10;
                    }

                    document.getElementById("block-score")
                        .textContent=scoreBlock;

                    if(scoreBlock>=15){

                        gameWon("Block Puzzle");
                        return;
                    }

                    render();
                };

                grid.appendChild(cell);
            });
        }

        render();
    }


    /* =====================================================
       11 - OKÇULUK
       ===================================================== */

    function createArcheryGame(){

        let shots=0;
        let total=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🏹 Atış: <b id="arrow-shots">0</b>/5</span>
                    <span>Skor: <b id="arrow-score">0</b></span>
                </div>

                <h2>🏹 Okçuluk</h2>

                <p>Hedefin merkezine tıkla.</p>

                <div id="archery-target" class="archery-target"></div>

                <div id="archery-info" class="game-message">
                    İlk atışını yap.
                </div>

            </div>
        `;

        const target=document.getElementById("archery-target");

        target.onclick=(event)=>{

            if(shots>=5)return;

            const rect=target.getBoundingClientRect();

            const cx=rect.width/2;
            const cy=rect.height/2;

            const x=event.clientX-rect.left;
            const y=event.clientY-rect.top;

            const distance=Math.sqrt(
                Math.pow(x-cx,2)+Math.pow(y-cy,2)
            );

            const radius=rect.width/2;

            let points=Math.max(
                0,
                Math.round(100-(distance/radius)*100)
            );

            shots++;
            total+=points;

            const arrow=document.createElement("div");

            arrow.className="archery-arrow";

            arrow.style.left=
                ((x/rect.width)*100)+"%";

            arrow.style.top=
                ((y/rect.height)*100)+"%";

            target.appendChild(arrow);

            document.getElementById("arrow-shots")
                .textContent=shots;

            document.getElementById("arrow-score")
                .textContent=total;

            document.getElementById("archery-info")
                .textContent="+"+points+" puan!";

            if(shots>=5){

                if(total>=250){
                    gameWon("Okçuluk");
                }else{
                    gameLost("Okçuluk");
                }
            }
        };
    }


    /* =====================================================
       12/13 - HAFIZA OYUNLARI
       ===================================================== */

    function createMemoryGame(pairCount){

        const symbols=[
            "🍎","🍌","🍇","🍉","🍓","🍒",
            "🥝","🍍","🥑","🍊","🍋","🥥"
        ];

        const chosen=symbols.slice(0,pairCount);

        let cards=[...chosen,...chosen];

        cards.sort(()=>Math.random()-.5);

        let open=[];
        let matched=0;
        let moves=0;
        let locked=false;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🎯 Hamle: <b id="memory-moves">0</b></span>
                    <span>Çift: <b id="memory-pairs">0</b>/${pairCount}</span>
                </div>

                <h2>🧠 Hafıza Oyunu</h2>

                <div id="memory-grid" class="memory-grid"></div>

                <div class="game-message">
                    Kartları aç ve eşlerini bul.
                </div>

            </div>
        `;

        const grid=document.getElementById("memory-grid");

        function render(){

            grid.innerHTML="";

            cards.forEach((symbol,index)=>{

                const btn=document.createElement("button");

                btn.className="memory-card";

                if(open.includes(index) || matchedCards.has(index)){

                    btn.textContent=symbol;
                    btn.classList.add(
                        matchedCards.has(index)?"done":"open"
                    );

                }else{
                    btn.textContent="❓";
                }

                btn.onclick=()=>select(index);

                grid.appendChild(btn);
            });
        }

        const matchedCards=new Set();

        function select(index){

            if(locked)return;

            if(
                open.includes(index) ||
                matchedCards.has(index)
            )return;

            open.push(index);

            render();

            if(open.length===2){

                moves++;

                document.getElementById("memory-moves")
                    .textContent=moves;

                locked=true;

                setTimeout(()=>{

                    const [a,b]=open;

                    if(cards[a]===cards[b]){

                        matchedCards.add(a);
                        matchedCards.add(b);

                        matched+=1;

                        document.getElementById("memory-pairs")
                            .textContent=matched;

                        if(matched===pairCount){

                            gameWon(
                                "Hafıza Oyunu",
                                Math.max(50,120-moves*2)
                            );

                            return;
                        }

                    }

                    open=[];
                    locked=false;

                    render();

                },600);
            }
        }

        render();
    }


    /* =====================================================
       14 - YILAN
       ===================================================== */

    function createSnakeGame(){

        const size=20;

        let snake=[
            {x:10,y:10},
            {x:9,y:10},
            {x:8,y:10}
        ];

        let food={
            x:Math.floor(Math.random()*size),
            y:Math.floor(Math.random()*size)
        };

        let direction={x:1,y:0};
        let nextDirection={x:1,y:0};

        let running=true;
        let points=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🐍 Skor: <b id="snake-score">0</b></span>
                    <span>Yem: 10 = kazan</span>
                </div>

                <h2>🐍 Yılan Oyunu</h2>

                <div id="snake-board" class="snake-board"></div>

                <div class="snake-controls">
                    <span></span>
                    <button id="snake-up">⬆️</button>
                    <span></span>

                    <button id="snake-left">⬅️</button>
                    <button id="snake-down">⬇️</button>
                    <button id="snake-right">➡️</button>
                </div>

            </div>
        `;

        const board=document.getElementById("snake-board");

        function setDirection(x,y){

            if(
                snake.length>1 &&
                x===-direction.x &&
                y===-direction.y
            )return;

            nextDirection={x,y};
        }

        document.getElementById("snake-up")
            .onclick=()=>setDirection(0,-1);

        document.getElementById("snake-down")
            .onclick=()=>setDirection(0,1);

        document.getElementById("snake-left")
            .onclick=()=>setDirection(-1,0);

        document.getElementById("snake-right")
            .onclick=()=>setDirection(1,0);

        const keyHandler=(e)=>{

            if(e.key==="ArrowUp")setDirection(0,-1);
            if(e.key==="ArrowDown")setDirection(0,1);
            if(e.key==="ArrowLeft")setDirection(-1,0);
            if(e.key==="ArrowRight")setDirection(1,0);

        };

        document.addEventListener("keydown",keyHandler);

        function render(){

            board.innerHTML="";

            snake.forEach(part=>{

                const el=document.createElement("div");

                el.className="snake-cell";

                el.style.left=(part.x*5)+"%";
                el.style.top=(part.y*5)+"%";

                board.appendChild(el);
            });

            const foodEl=document.createElement("div");

            foodEl.className="snake-food";
            foodEl.style.left=(food.x*5)+"%";
            foodEl.style.top=(food.y*5)+"%";

            board.appendChild(foodEl);
        }

        const interval=setInterval(()=>{

            if(!running){
                clearInterval(interval);
                document.removeEventListener("keydown",keyHandler);
                return;
            }

            direction=nextDirection;

            const head={
                x:snake[0].x+direction.x,
                y:snake[0].y+direction.y
            };

            if(
                head.x<0 ||
                head.x>=size ||
                head.y<0 ||
                head.y>=size ||
                snake.some(p=>p.x===head.x&&p.y===head.y)
            ){

                running=false;
                gameLost("Yılan Oyunu");
                return;
            }

            snake.unshift(head);

            if(head.x===food.x&&head.y===food.y){

                points++;

                document.getElementById("snake-score")
                    .textContent=points;

                do{
                    food={
                        x:Math.floor(Math.random()*size),
                        y:Math.floor(Math.random()*size)
                    };
                }while(
                    snake.some(p=>p.x===food.x&&p.y===food.y)
                );

                if(points>=10){

                    running=false;
                    gameWon("Yılan Oyunu");
                    return;
                }

            }else{

                snake.pop();
            }

            render();

        },130);

        render();
    }


    /* =====================================================
       15 - BASKET ATIŞI
       ===================================================== */

    function createBasketGame(){

        let shots=0;
        let scoreBasket=0;

        gameArea.innerHTML=`
            <div class="game-ui">

                <div class="game-toolbar">
                    <span>🏀 Atış: <b id="basket-shots">0</b>/10</span>
                    <span>Skor: <b id="basket-score">0</b></span>
                </div>

                <h2>🏀 Basket Atışı</h2>

                <p>
                    Topa tıkla. Potaya ne kadar yakınsan o kadar iyi.
                </p>

                <div id="basket-court" class="basket-court">

                    <div class="basket-hoop"></div>

                    <div id="basket-ball"
                         class="basket-ball"
                         style="left:15%;bottom:35%;">
                    </div>

                </div>

                <button class="game-button" id="basket-shoot">
                    🏀 Şut At
                </button>

                <div id="basket-info" class="game-message">
                    Şut için hazır!
                </div>

            </div>
        `;

        const ball=document.getElementById("basket-ball");
        const info=document.getElementById("basket-info");

        document.getElementById("basket-shoot").onclick=()=>{

            if(shots>=10)return;

            shots++;

            const accuracy=Math.random();

            let points=0;

            if(accuracy>.78){
                points=30;
            }else if(accuracy>.48){
                points=20;
            }else if(accuracy>.25){
                points=10;
            }

            scoreBasket+=points;

            document.getElementById("basket-shots")
                .textContent=shots;

            document.getElementById("basket-score")
                .textContent=scoreBasket;

            ball.style.left=
                (65+Math.random()*20)+"%";

            ball.style.bottom=
                (45+Math.random()*30)+"%";

            if(points===30){
                info.textContent="🔥 Mükemmel isabet! +30";
            }else if(points>0){
                info.textContent="🏀 İsabet! +"+points;
            }else{
                info.textContent="❌ Kaçırdın.";
            }

            if(shots>=10){

                if(scoreBasket>=150){

                    gameWon(
                        "Basket Atışı",
                        100
                    );

                }else{

                    gameLost("Basket Atışı");

                }
            }
        };
    }


    /* =====================================================
       REKLAM ÖDÜLÜ - ŞİMDİLİK TEST MESAJI
       ===================================================== */

    if(watchAdButton){

        watchAdButton.addEventListener("click",function(){

            showMessage(
                "📺 Reklam Ödülü",
                "Gerçek reklam sistemi henüz bağlanmadı.\n\n"+
                "Reklam ağı onaylandıktan sonra reklamı tamamlayan "+
                "kullanıcıya +100 puan otomatik verilecek.",
                "📺"
            );

        });

    }


});
