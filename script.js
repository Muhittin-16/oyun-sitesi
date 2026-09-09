/* =========================================================
   OYNAKAZAN - ANA JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PUAN SİSTEMİ
    ===================================================== */

    const START_SCORE = 500;
    const GAME_ENTRY_COST = 50;
    const WIN_REWARD = 100;
    const LOSS_REWARD = -50;
    const AD_REWARD = 100;

    let score = Number(localStorage.getItem("oynakazan_score"));

    if (!Number.isFinite(score)) {
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
       BİLGİ PENCERESİ
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
            name: "101 Okey",
            category: "board",
            icon: "fa-solid fa-dice",
            bg: "okey-bg",
            badge: "POPÜLER",
            description: "101 Okey'i bot rakiplerle oyna.",
            type: "okey"
        },

        {
            name: "Klasik Tavla",
            category: "board",
            icon: "fa-solid fa-dice",
            bg: "tavla-bg",
            description: "Zarları at, pullarını topla ve rakibini yen.",
            type: "tavla"
        },

        {
            name: "Türk Daması",
            category: "board",
            icon: "fa-solid fa-chess-board",
            bg: "dama-bg",
            description: "Stratejini kullan ve rakibinin taşlarını ele geçir.",
            type: "dama"
        },

        {
            name: "Batak",
            category: "cards",
            icon: "fa-solid fa-club",
            bg: "batak-bg",
            description: "Kozunu seç, elini iyi oyna ve rakiplerini geç.",
            type: "batak"
        },

        {
            name: "Bilardo",
            category: "arcade",
            icon: "fa-solid fa-circle",
            bg: "bilardo-bg",
            description: "Topları doğru ceplere gönder.",
            type: "bilardo"
        },

        {
            name: "Mahjong",
            category: "puzzle",
            icon: "fa-solid fa-puzzle-piece",
            bg: "mahjong-bg",
            description: "Aynı taşları eşleştir ve tahtayı temizle.",
            type: "mahjong"
        },

        {
            name: "Sudoku",
            category: "puzzle",
            icon: "fa-solid fa-table-cells",
            bg: "sudoku-bg",
            description: "Sayıları doğru yerlere yerleştir.",
            type: "sudoku"
        },

        {
            name: "Bubble Shooter",
            category: "arcade",
            icon: "fa-solid fa-circle-dot",
            bg: "bubble-bg",
            description: "Aynı renk baloncukları patlat.",
            type: "bubble"
        },

        {
            name: "Araba Yarışı",
            category: "arcade",
            icon: "fa-solid fa-car",
            bg: "racing-bg",
            description: "Rakiplerini geç ve birinci ol.",
            type: "racing"
        },

        {
            name: "Block Puzzle",
            category: "puzzle",
            icon: "fa-solid fa-cubes",
            bg: "block-bg",
            description: "Blokları doğru yerleştir ve yüksek skor yap.",
            type: "block"
        },

        {
            name: "Okçuluk",
            category: "arcade",
            icon: "fa-solid fa-bullseye",
            bg: "archery-bg",
            description: "Hedefi vur ve yüksek puan kazan.",
            type: "archery"
        },

        {
            name: "Zeka Eşleştirme",
            category: "puzzle",
            icon: "fa-solid fa-brain",
            bg: "match-bg",
            description: "Kartları eşleştir ve hafızanı test et.",
            type: "memory"
        },

        {
            name: "Hafıza Oyunu",
            category: "puzzle",
            icon: "fa-solid fa-brain",
            bg: "memory-bg",
            description: "Kartların eşlerini bul.",
            type: "memory"
        },

        {
            name: "Yılan Oyunu",
            category: "arcade",
            icon: "fa-solid fa-worm",
            bg: "snake-bg",
            description: "Yılanı büyüt ve engellere çarpmadan ilerle.",
            type: "snake"
        },

        {
            name: "Basket Atışı",
            category: "arcade",
            icon: "fa-solid fa-basketball",
            bg: "basket-bg",
            description: "Topu potaya gönder ve skor yap.",
            type: "basket"
        }

    ];


    /* =====================================================
       OYUN KARTLARINI OLUŞTUR
    ===================================================== */

    function renderGames(filter = "all") {

        if (!gamesContainer) {
            return;
        }

        gamesContainer.innerHTML = "";

        const filteredGames = games.filter(function (game) {

            return filter === "all" || game.category === filter;

        });


        filteredGames.forEach(function (game) {

            const card = document.createElement("article");

            card.className = "game-card";
            card.dataset.category = game.category;


            card.innerHTML = `

                <div class="game-img ${game.bg}">

                    <i class="${game.icon}"></i>

                    ${
                        game.badge
                        ?
                        `<span class="game-badge">${game.badge}</span>`
                        :
                        ""
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


            card.addEventListener("click", function () {

                openGame(game);

            });


            gamesContainer.appendChild(card);

        });

    }


    renderGames();


    /* =====================================================
       KATEGORİLER
    ===================================================== */

    const categoryButtons = document.querySelectorAll(".cat-btn");


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            categoryButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            const filter = button.dataset.filter;

            renderGames(filter);

        });

    });


    /* =====================================================
       OYUNU AÇ
    ===================================================== */

    function openGame(game) {

        if (!modal || !gameArea) {
            return;
        }


        /*
         * Masa oyunlarında giriş ücreti vardır.
         */

        const paidGames = [
            "okey",
            "tavla",
            "dama",
            "batak"
        ];


        if (paidGames.includes(game.type)) {

            if (score < GAME_ENTRY_COST) {

                showMessage(
                    "Yeterli Puan Yok",
                    "Bu oyuna girmek için " +
                    GAME_ENTRY_COST +
                    " puan gerekiyor.\n\n" +
                    "Mevcut puanın: " +
                    score,
                    "🪙"
                );

                return;
            }


            changeScore(-GAME_ENTRY_COST);

        }


        modalTitle.textContent = game.name;
        modalCategory.textContent =
            getCategoryName(game.category);


        gameArea.innerHTML = "";


        if (game.type === "okey") {
            createOkeyGame();
        }

        else if (game.type === "tavla") {
            createTavlaGame();
        }

        else if (game.type === "dama") {
            createDamaGame();
        }

        else if (game.type === "batak") {
            createBatakGame();
        }

        else {
            createSinglePlayerGame(game);
        }


        modal.classList.remove("hidden");

        document.body.style.overflow = "hidden";

    }


    window.openGame = openGame;


    function getCategoryName(category) {

        if (category === "board") {
            return "MASA OYUNU";
        }

        if (category === "cards") {
            return "KART OYUNU";
        }

        if (category === "puzzle") {
            return "ZEKA OYUNU";
        }

        return "EĞLENCE";

    }


    /* =====================================================
       OYUNU KAPAT
    ===================================================== */

    function closeGame() {

        if (!modal) {
            return;
        }

        modal.classList.add("hidden");

        gameArea.innerHTML = "";

        document.body.style.overflow = "";

    }


    window.closeGame = closeGame;


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeGame
        );

    }


    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeGame();

            }

        });

    }


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeGame();

            hideMessage();

        }

    });


    /* =====================================================
       BOT İSİMLERİ
    ===================================================== */

    const botNames = [
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


    function randomBots(count) {

        const shuffled = [...botNames].sort(
            () => Math.random() - 0.5
        );

        return shuffled.slice(0, count);

    }


    /* =====================================================
       ORTAK MASA OYUNU EKRANI
    ===================================================== */

    function createTableHeader(title, players) {

        const div = document.createElement("div");

        div.className = "table-game";

        div.innerHTML = `

            <div class="table-title">

                <h3>${title}</h3>

                <span>
                    Giriş: ${GAME_ENTRY_COST} 🪙
                </span>

            </div>

            <div class="players">

                ${players.map(function (player, index) {

                    return `
                        <div class="player">

                            <div class="player-avatar">
                                ${index === 0 ? "🙂" : "🤖"}
                            </div>

                            <strong>
                                ${player}
                            </strong>

                            <small>
                                ${index === 0 ? "Sen" : "Bot"}
                            </small>

                        </div>
                    `;

                }).join("")}

            </div>

        `;

        return div;

    }


    /* =====================================================
       101 OKEY
    ===================================================== */

    function createOkeyGame() {

        const bots = randomBots(3);

        const players = [
            "Sen",
            ...bots
        ];


        const table = createTableHeader(
            "101 Okey Masası",
            players
        );


        table.innerHTML += `

            <div class="board-placeholder">

                <div class="big-game-icon">
                    🀄
                </div>

                <h2>101 Okey</h2>

                <p>
                    3 bot rakip masada hazır.
                </p>

                <p class="game-note">
                    Botlar oyuna katıldı.
                    Gerçek Okey taş ve kural sistemi
                    bir sonraki aşamada eklenecek.
                </p>

                <button
                    class="action-btn"
                    id="okey-play-btn">

                    🎲 Eli Başlat

                </button>

            </div>

        `;


        gameArea.appendChild(table);


        document
            .getElementById("okey-play-btn")
            .addEventListener("click", function () {

                finishTableGame(
                    "101 Okey",
                    true
                );

            });

    }


    /* =====================================================
       TAVLA
    ===================================================== */

    function createTavlaGame() {

        const bot = randomBots(1)[0];

        const players = [
            "Sen",
            bot
        ];


        const table = createTableHeader(
            "Klasik Tavla",
            players
        );


        table.innerHTML += `

            <div class="board-placeholder">

                <div class="big-game-icon">
                    🎲
                </div>

                <h2>Tavla</h2>

                <p>
                    Rakibin: <strong>${bot}</strong>
                </p>

                <p class="game-note">
                    Bot rakibin hazır.
                </p>

                <button
                    class="action-btn"
                    id="tavla-play-btn">

                    🎲 Zar At

                </button>

            </div>

        `;


        gameArea.appendChild(table);


        document
            .getElementById("tavla-play-btn")
            .addEventListener("click", function () {

                finishTableGame(
                    "Tavla",
                    Math.random() >= 0.5
                );

            });

    }


    /* =====================================================
       DAMA
    ===================================================== */

    function createDamaGame() {

        const bot = randomBots(1)[0];

        const players = [
            "Sen",
            bot
        ];


        const table = createTableHeader(
            "Türk Daması",
            players
        );


        table.innerHTML += `

            <div class="board-placeholder">

                <div class="checker-board">

                    ${Array.from(
                        { length: 64 },
                        function (_, index) {

                            return `
                                <div class="
                                    checker-cell
                                    ${
                                        index % 2 === 0
                                        ? "dark"
                                        : "light"
                                    }
                                "></div>
                            `;

                        }
                    ).join("")}

                </div>

                <h2>Türk Daması</h2>

                <p>
                    Rakibin: <strong>${bot}</strong>
                </p>

                <button
                    class="action-btn"
                    id="dama-play-btn">

                    ▶ Oyunu Başlat

                </button>

            </div>

        `;


        gameArea.appendChild(table);


        document
            .getElementById("dama-play-btn")
            .addEventListener("click", function () {

                finishTableGame(
                    "Türk Daması",
                    Math.random() >= 0.5
                );

            });

    }


    /* =====================================================
       BATAK
    ===================================================== */

    function createBatakGame() {

        const bots = randomBots(3);

        const players = [
            "Sen",
            ...bots
        ];


        const table = createTableHeader(
            "Batak Masası",
            players
        );


        table.innerHTML += `

            <div class="board-placeholder">

                <div class="big-game-icon">
                    🃏
                </div>

                <h2>Batak</h2>

                <p>
                    3 bot rakip masada.
                </p>

                <div class="cards-demo">

                    <span>🂡</span>
                    <span>🂱</span>
                    <span>🃁</span>
                    <span>🃑</span>

                </div>

                <button
                    class="action-btn"
                    id="batak-play-btn">

                    🃏 Eli Başlat

                </button>

            </div>

        `;


        gameArea.appendChild(table);


        document
            .getElementById("batak-play-btn")
            .addEventListener("click", function () {

                finishTableGame(
                    "Batak",
                    Math.random() >= 0.5
                );

            });

    }


    /* =====================================================
       MASA OYUNU SONUCU
    ===================================================== */

    function finishTableGame(gameName, playerWon) {

        if (playerWon) {

            changeScore(WIN_REWARD);

            showMessage(
                "🎉 Kazandın!",
                gameName +
                " oyununu kazandın.\n\n" +
                "+" +
                WIN_REWARD +
                " puan kazandın.\n\n" +
                "Giriş ücreti: -" +
                GAME_ENTRY_COST +
                " puan",
                "🏆"
            );

        }

        else {

            changeScore(LOSS_REWARD);

            showMessage(
                "😔 Oyun Bitti",
                gameName +
                " oyununu kaybettin.\n\n" +
                LOSS_REWARD +
                " puan.",
                "🎮"
            );

        }

    }


    /* =====================================================
       TEK OYUNCULU OYUNLAR
    ===================================================== */

    function createSinglePlayerGame(game) {

        gameArea.innerHTML = `

            <div class="single-game">

                <div class="big-game-icon">
                    🎮
                </div>

                <h2>${game.name}</h2>

                <p>
                    ${game.description}
                </p>

                <div class="game-coming">

                    <strong>
                        Oyun motoru hazırlanıyor
                    </strong>

                    <span>
                        Bu alan gerçek oyun bağlantısı
                        eklendiğinde aktif olacak.
                    </span>

                </div>

                <button
                    class="action-btn"
                    id="demo-action">

                    ▶ Devam Et

                </button>

            </div>

        `;


        document
            .getElementById("demo-action")
            .addEventListener("click", function () {

                showMessage(
                    game.name,
                    "Bu oyunun gerçek oyun motoru bir sonraki aşamada bağlanacak.",
                    "🎮"
                );

            });

    }


    /* =====================================================
       REKLAM ÖDÜLÜ
    ===================================================== */

    if (watchAdButton) {

        watchAdButton.addEventListener(
            "click",
            function () {

                showMessage(
                    "📺 Reklam Ödülü",
                    "Gerçek reklam sistemi henüz bağlanmadı.\n\n" +
                    "Reklam ağı onaylandığında reklam izleyerek " +
                    AD_REWARD +
                    " puan kazanma sistemi burada aktif edilecek.",
                    "📺"
                );

            }
        );

    }


});
