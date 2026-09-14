/* ============================================================
   OKEY GERÇEK MASA - 1. PARÇA
   4 OYUNCULU 101 OKEY
   ============================================================ */

(function(){

"use strict";

window.OYNAKAZAN_REAL_OKEY = {

    version: "1.0",

    state: {
        players: [],
        deck: [],
        discard: [],
        currentPlayer: 0,
        selectedTile: null,
        started: false,
        message: "Oyun hazırlanıyor..."
    },

    colors: [
        {
            id: "red",
            name: "Kırmızı",
            className: "okey-red"
        },
        {
            id: "blue",
            name: "Mavi",
            className: "okey-blue"
        },
        {
            id: "black",
            name: "Siyah",
            className: "okey-black"
        },
        {
            id: "yellow",
            name: "Sarı",
            className: "okey-yellow"
        }
    ],

    init: function(){

        this.createStyles();

        this.state.players = [

            {
                id: 0,
                name: "Sen",
                position: "bottom",
                hand: [],
                bot: false
            },

            {
                id: 1,
                name: "Ali",
                position: "top",
                hand: [],
                bot: true
            },

            {
                id: 2,
                name: "Ayşe",
                position: "left",
                hand: [],
                bot: true
            },

            {
                id: 3,
                name: "Mehmet",
                position: "right",
                hand: [],
                bot: true
            }

        ];

        this.createDeck();

        this.shuffleDeck();

        this.dealCards();

        this.state.started = true;

        this.state.message =
            "Oyun başladı. Sıra sende.";

        this.render();

    },


    /* ========================================================
       CSS
       ======================================================== */

    createStyles: function(){

        if(document.getElementById(
            "oynakazan-real-okey-style"
        )){
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "oynakazan-real-okey-style";

        style.textContent = `

        /* ====================================================
           ANA OKEY MASASI
           ==================================================== */

        .real-okey-wrapper{

            position:relative;

            width:100%;

            max-width:1250px;

            min-height:820px;

            margin:20px auto;

            padding:22px;

            box-sizing:border-box;

            border-radius:32px;

            background:

                radial-gradient(
                    ellipse at center,
                    #17824b 0%,
                    #10653b 38%,
                    #0a4529 70%,
                    #052817 100%
                );

            border:

                15px solid #351707;

            box-shadow:

                inset
                0 0 80px
                rgba(0,0,0,.8),

                inset
                0 0 20px
                rgba(255,255,255,.08),

                0 30px 70px
                rgba(0,0,0,.7);

            color:#fff;

            font-family:

                Arial,
                Helvetica,
                sans-serif;

            overflow:hidden;

        }


        /* ====================================================
           AHŞAP ÇERÇEVE PARLAKLIĞI
           ==================================================== */

        .real-okey-wrapper::before{

            content:"";

            position:absolute;

            inset:0;

            pointer-events:none;

            border-radius:18px;

            box-shadow:

                inset
                0 0 0 2px
                rgba(255,220,150,.16),

                inset
                0 0 40px
                rgba(0,0,0,.55);

        }


        /* ====================================================
           BAŞLIK
           ==================================================== */

        .real-okey-title{

            position:relative;

            z-index:10;

            text-align:center;

            font-size:27px;

            font-weight:900;

            letter-spacing:2px;

            margin:

                0 0
                12px
                0;

            text-shadow:

                0 3px 5px
                rgba(0,0,0,.8);

        }


        .real-okey-subtitle{

            text-align:center;

            color:#c9e6d4;

            font-size:13px;

            margin-bottom:12px;

        }


        /* ====================================================
           OYUNCU ALANLARI
           ==================================================== */

        .real-okey-player{

            position:absolute;

            z-index:30;

            min-width:155px;

            padding:10px;

            border-radius:18px;

            background:

                linear-gradient(
                    145deg,
                    rgba(25,25,25,.9),
                    rgba(5,5,5,.78)
                );

            border:

                2px solid
                rgba(255,255,255,.13);

            box-shadow:

                0 10px 25px
                rgba(0,0,0,.55);

            text-align:center;

            transition:

                .25s ease;

        }


        .real-okey-player.active{

            border-color:#ffd84d;

            box-shadow:

                0 0 0 2px
                rgba(255,216,77,.25),

                0 0 30px
                rgba(255,216,77,.25),

                0 10px 25px
                rgba(0,0,0,.55);

            transform:scale(1.04);

        }


        .real-okey-player-top{

            top:72px;

            left:50%;

            transform:
                translateX(-50%);

        }


        .real-okey-player-left{

            left:18px;

            top:50%;

            transform:
                translateY(-50%);

        }


        .real-okey-player-right{

            right:18px;

            top:50%;

            transform:
                translateY(-50%);

        }


        .real-okey-player-bottom{

            bottom:175px;

            left:50%;

            transform:
                translateX(-50%);

        }


        .real-okey-player.active.real-okey-player-top{

            transform:
                translateX(-50%)
                scale(1.04);

        }


        .real-okey-player.active.real-okey-player-left{

            transform:
                translateY(-50%)
                scale(1.04);

        }


        .real-okey-player.active.real-okey-player-right{

            transform:
                translateY(-50%)
                scale(1.04);

        }


        .real-okey-player.active.real-okey-player-bottom{

            transform:
                translateX(-50%)
                scale(1.04);

        }


        /* ====================================================
           OYUNCU AVATAR
           ==================================================== */

        .real-okey-avatar{

            width:44px;

            height:44px;

            margin:
                0 auto 5px;

            border-radius:50%;

            display:flex;

            align-items:center;

            justify-content:center;

            background:

                radial-gradient(
                    circle at 35% 30%,
                    #777,
                    #333 50%,
                    #111
                );

            border:

                2px solid
                rgba(255,255,255,.7);

            font-size:22px;

            box-shadow:

                0 5px 10px
                rgba(0,0,0,.5);

        }


        .real-okey-name{

            font-size:14px;

            font-weight:900;

        }


        .real-okey-player-status{

            margin-top:3px;

            font-size:11px;

            color:#c5d7cb;

        }


        /* ====================================================
           ANA MASA
           ==================================================== */

        .real-okey-center{

            position:absolute;

            left:50%;

            top:50%;

            width:

                calc(
                    100% - 390px
                );

            height:455px;

            max-width:800px;

            transform:
                translate(
                    -50%,
                    -50%
                );

            border-radius:35px;

            border:

                8px solid
                #4a2710;

            background:

                radial-gradient(
                    ellipse at center,
                    #16804a 0%,
                    #0c5b35 55%,
                    #07351f 100%
                );

            box-shadow:

                inset
                0 0 55px
                rgba(0,0,0,.8),

                0 12px 30px
                rgba(0,0,0,.5);

            display:flex;

            align-items:center;

            justify-content:center;

        }


        /* ====================================================
           MASA ORTA PANELİ
           ==================================================== */

        .real-okey-middle{

            width:90%;

            display:flex;

            align-items:center;

            justify-content:center;

            gap:45px;

        }


        /* ====================================================
           TAŞ HAVUZU
           ==================================================== */

        .real-okey-pile{

            width:120px;

            height:155px;

            border-radius:14px;

            border:

                6px solid
                #43220d;

            background:

                linear-gradient(
                    145deg,
                    #89501f,
                    #4d240b
                );

            box-shadow:

                inset
                0 0 20px
                rgba(0,0,0,.8),

                0 12px 25px
                rgba(0,0,0,.6);

            display:flex;

            align-items:center;

            justify-content:center;

            position:relative;

        }


        .real-okey-pile-label{

            position:absolute;

            bottom:7px;

            left:0;

            width:100%;

            text-align:center;

            font-size:10px;

            font-weight:900;

            color:#eee;

        }


        /* ====================================================
           OKEY TAŞI
           ==================================================== */

        .real-okey-tile{

            position:relative;

            width:43px;

            height:63px;

            flex:

                0 0 43px;

            border-radius:7px;

            border:

                2px solid
                #9b8753;

            background:

                linear-gradient(
                    145deg,
                    #fffff7 0%,
                    #eee4c1 55%,
                    #d0c295 100%
                );

            box-shadow:

                inset
                1px 1px 0
                rgba(255,255,255,.9),

                inset
                -2px -2px 0
                rgba(0,0,0,.12),

                0 5px 9px
                rgba(0,0,0,.65);

            display:flex;

            align-items:center;

            justify-content:center;

            font-size:22px;

            font-weight:900;

            user-select:none;

            cursor:pointer;

            transition:

                transform .15s ease,

                box-shadow .15s ease;

        }


        .real-okey-tile:hover{

            transform:
                translateY(-5px);

        }


        .real-okey-tile.selected{

            transform:
                translateY(-16px);

            border-color:#ffd83d;

            box-shadow:

                0 0 0 3px
                rgba(255,216,61,.45),

                0 13px 18px
                rgba(0,0,0,.7);

        }


        .real-okey-red{

            color:#d51e24;

        }


        .real-okey-blue{

            color:#075dcc;

        }


        .real-okey-black{

            color:#171717;

        }


        .real-okey-yellow{

            color:#bd8200;

        }


        .real-okey-joker{

            color:#a51b20;

            background:

                linear-gradient(
                    145deg,
                    #fff4ad,
                    #d5aa43
                );

        }


        /* ====================================================
           ISTAKA
           ==================================================== */

        .real-okey-rack-area{

            position:absolute;

            z-index:40;

            left:50%;

            bottom:28px;

            width:

                calc(
                    100% - 100px
                );

            transform:
                translateX(-50%);

        }


        .real-okey-rack{

            min-height:112px;

            width:100%;

            padding:

                14px
                12px
                11px;

            border-radius:20px;

            border:

                9px solid
                #351806;

            background:

                linear-gradient(
                    180deg,
                    #7a481f,
                    #4b250d
                );

            box-shadow:

                inset
                0 0 25px
                rgba(0,0,0,.85),

                0 13px 28px
                rgba(0,0,0,.6);

            display:flex;

            align-items:flex-end;

            justify-content:center;

            gap:3px;

            overflow-x:auto;

        }


        /* ====================================================
           KONTROLLER
           ==================================================== */

        .real-okey-controls{

            display:flex;

            justify-content:center;

            align-items:center;

            flex-wrap:wrap;

            gap:9px;

            margin-top:10px;

        }


        .real-okey-button{

            border:0;

            border-radius:11px;

            padding:

                10px
                16px;

            background:

                linear-gradient(
                    135deg,
                    #6257ff,
                    #087ea5
                );

            color:white;

            font-weight:900;

            cursor:pointer;

            box-shadow:

                0 5px 12px
                rgba(0,0,0,.5);

        }


        .real-okey-button:hover{

            filter:brightness(1.15);

        }


        .real-okey-button:disabled{

            opacity:.4;

            cursor:not-allowed;

        }


        /* ====================================================
           OYUN MESAJI
           ==================================================== */

        .real-okey-message{

            position:absolute;

            top:18px;

            left:50%;

            transform:
                translateX(-50%);

            min-width:260px;

            max-width:80%;

            padding:

                9px
                16px;

            border-radius:12px;

            background:

                rgba(0,0,0,.48);

            border:

                1px solid
                rgba(255,255,255,.12);

            text-align:center;

            font-size:13px;

            font-weight:800;

            color:#e9f5ed;

        }


        /* ====================================================
           SOHBET
           ==================================================== */

        .real-okey-chat{

            position:absolute;

            right:20px;

            bottom:185px;

            width:250px;

            z-index:60;

            border-radius:16px;

            overflow:hidden;

            background:

                rgba(5,5,5,.78);

            border:

                2px solid
                rgba(255,255,255,.12);

            box-shadow:

                0 12px 30px
                rgba(0,0,0,.65);

        }


        .real-okey-chat-title{

            padding:

                9px
                12px;

            font-size:13px;

            font-weight:900;

            background:

                rgba(255,255,255,.08);

        }


        .real-okey-chat-messages{

            height:110px;

            overflow-y:auto;

            padding:8px;

            font-size:12px;

        }


        .real-okey-chat-message{

            padding:6px 8px;

            margin-bottom:6px;

            border-radius:8px;

            background:

                rgba(255,255,255,.07);

        }


        .real-okey-chat-message strong{

            color:#ffd85b;

        }


        .real-okey-chat-input{

            display:flex;

            border-top:

                1px solid
                rgba(255,255,255,.1);

        }


        .real-okey-chat-input input{

            width:100%;

            min-width:0;

            padding:9px;

            border:0;

            outline:0;

            background:#111;

            color:white;

        }


        .real-okey-chat-input button{

            border:0;

            padding:
                8px
                12px;

            color:white;

            background:#137a48;

            font-weight:900;

            cursor:pointer;

        }


        /* ====================================================
           MOBİL
           ==================================================== */

        @media(max-width:850px){

            .real-okey-wrapper{

                min-height:780px;

                padding:8px;

                border-width:7px;

            }


            .real-okey-center{

                width:96%;

                height:390px;

            }


            .real-okey-player-left,
            .real-okey-player-right{

                display:none;

            }


            .real-okey-player-top{

                top:62px;

            }


            .real-okey-middle{

                gap:8px;

            }


            .real-okey-pile{

                width:75px;

                height:100px;

            }


            .real-okey-rack-area{

                width:96%;

                bottom:20px;

            }


            .real-okey-rack{

                justify-content:flex-start;

                overflow-x:auto;

            }


            .real-okey-tile{

                width:31px;

                height:47px;

                flex-basis:31px;

                font-size:16px;

            }


            .real-okey-chat{

                position:static;

                width:96%;

                margin:

                    0 auto
                    10px;

            }

        }

        `;

        document.head.appendChild(style);

    },


    /* ========================================================
       DESTE OLUŞTUR
       ======================================================== */

    createDeck: function(){

        const deck = [];

        for(
            let colorIndex = 0;
            colorIndex < this.colors.length;
            colorIndex++
        ){

            const color =
                this.colors[colorIndex];

            for(
                let copy = 0;
                copy < 2;
                copy++
            ){

                for(
                    let number = 1;
                    number <= 13;
                    number++
                ){

                    deck.push({

                        id:
                            color.id +
                            "-" +
                            number +
                            "-" +
                            copy,

                        color:
                            color.id,

                        value:
                            number,

                        joker:false

                    });

                }

            }

        }

        deck.push({

            id:"joker-1",

            color:"joker",

            value:0,

            joker:true

        });

        deck.push({

            id:"joker-2",

            color:"joker",

            value:0,

            joker:true

        });

        this.state.deck = deck;

    },


    /* ========================================================
       KARIŞTIR
       ======================================================== */

    shuffleDeck: function(){

        const deck =
            this.state.deck;

        for(
            let i =
                deck.length - 1;
            i > 0;
            i--
        ){

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            const temp =
                deck[i];

            deck[i] =
                deck[j];

            deck[j] =
                temp;

        }

    },


    /* ========================================================
       TAŞLARI DAĞIT
       ======================================================== */

    dealCards: function(){

        const players =
            this.state.players;

        for(
            let round = 0;
            round < 21;
            round++
        ){

            for(
                let p = 0;
                p < players.length;
                p++
            ){

                if(
                    this.state.deck.length
                ){

                    players[p].hand.push(
                        this.state.deck.pop()
                    );

                }

            }

        }

        if(
            this.state.deck.length
        ){

            players[0].hand.push(
                this.state.deck.pop()
            );

        }

        for(
            let p = 0;
            p < players.length;
            p++
        ){

            players[p].hand.sort(
                this.compareTiles.bind(this)
            );

        }

    },


    /* ========================================================
       TAŞ SIRALAMA
       ======================================================== */

    compareTiles: function(a,b){

        if(
            a.color === b.color
        ){

            return a.value - b.value;

        }

        const order = [
            "red",
            "yellow",
            "blue",
            "black",
            "joker"
        ];

        return (
            order.indexOf(a.color) -
            order.indexOf(b.color)
        );

    },


    /* ========================================================
       TAŞ HTML
       ======================================================== */

    tileHTML: function(
        tile,
        index,
        selectable
    ){

        let colorClass =
            "real-okey-" +
            tile.color;

        let text =
            tile.joker
            ? "★"
            : tile.value;

        return `

            <div

                class="
                    real-okey-tile
                    ${colorClass}
                "

                data-okey-index="
                    ${index}
                "

                data-okey-selectable="
                    ${selectable ? "1" : "0"}
                "

                title="
                    ${
                        tile.joker
                        ? "Okey/Joker"
                        : tile.value +
                          " " +
                          tile.color
                    }
                "

            >

                ${text}

            </div>

        `;

    },


    /* ========================================================
       OYUNCU HTML
       ======================================================== */

    playerHTML: function(
        player
    ){

        const active =
            this.state.currentPlayer ===
            player.id
            ? "active"
            : "";

        let icon = "👨";

        if(
            player.id === 0
        ){
            icon = "👤";
        }

        if(
            player.id === 2
        ){
            icon = "👩";
        }

        return `

            <div

                class="
                    real-okey-player
                    real-okey-player-${player.position}
                    ${active}
                "

            >

                <div
                    class="real-okey-avatar"
                >

                    ${icon}

                </div>

                <div
                    class="real-okey-name"
                >

                    ${player.name}

                </div>

                <div
                    class="
                        real-okey-player-status
                    "
                >

                    ${
                        player.id === 0
                        ? "Sen"
                        : player.hand.length +
                          " taş"
                    }

                </div>

            </div>

        `;

    },


    /* ========================================================
       RENDER BAŞLANGICI
       ======================================================== */

    render: function(){

        const area =
            this.findGameArea();

        if(!area){

            console.warn(
                "Okey oyun alanı bulunamadı."
            );

            return;

        }

        const players =
            this.state.players;

        area.innerHTML = `

            <div
                class="real-okey-wrapper"
            >

                <div
                    class="real-okey-title"
                >

                    🀄 101 OKEY

                </div>

                <div
                    class="real-okey-subtitle"
                >

                    Gerçek masa düzeni •
                    4 Oyuncu

                </div>

                ${this.playerHTML(
                    players[1]
                )}

                ${this.playerHTML(
                    players[2]
                )}

                ${this.playerHTML(
                    players[3]
                )}

                <div
                    class="real-okey-center"
                >

                    <div
                        class="real-okey-message"
                        id="real-okey-message"
                    >

                        ${
                            this.state.message
                        }

                    </div>

                    <div
                        class="real-okey-middle"
                    >

                        <div
                            class="real-okey-pile"
                        >

                            <div
                                class="
                                    real-okey-tile
                                    real-okey-black
                                "
                                style="
                                    cursor:default;
                                "
                            >

                                ▣

                            </div>

                            <div
                                class="
                                    real-okey-pile-label
                                "
                            >

                                TAŞ HAVUZU

                            </div>

                        </div>


                        <div
                            style="
                                text-align:center;
                                font-weight:900;
                                line-height:1.7;
                            "
                        >

                            <div>
                                101 OKEY
                            </div>

                            <div
                                style="
                                    font-size:12px;
                                    color:#c9e6d4;
                                "
                            >

                                Kalan taş:
                                ${
                                    this.state.deck.length
                                }

                            </div>

                        </div>


                        <div
                            class="
                                real-okey-pile
                            "
                        >

                            ${
                                this.state.discard.length
                                ? this.tileHTML(
                                    this.state.discard[
                                        this.state.discard.length - 1
                                    ],
                                    -1,
                                    false
                                )
                                : `
                                    <span
                                        style="
                                            font-size:30px;
                                            color:white;
                                        "
                                    >
                                        —
                                    </span>
                                `
                            }

                            <div
                                class="
                                    real-okey-pile-label
                                "
                            >

                                ATILAN

                            </div>

                        </div>

                    </div>

                </div>


                <!-- KULLANICI ISTAKASI -->

                <div
                    class="
                        real-okey-player
                        real-okey-player-bottom
                        ${
                            this.state.currentPlayer === 0
                            ? "active"
                            : ""
                        }
                    "
                >

                    <div
                        class="real-okey-avatar"
                    >
                        👤
                    </div>

                    <div
                        class="real-okey-name"
                    >
                        Sen
                    </div>

                    <div
                        class="
                            real-okey-player-status
                        "
                    >
                        ${
                            players[0].hand.length
                        } taş
                    </div>

                </div>


                <div
                    class="real-okey-rack-area"
                >

                    <div
                        class="real-okey-rack"
                        id="real-okey-rack"
                    >

                        ${
                            players[0].hand
                            .map(
                                (tile,index)=>
                                    this.tileHTML(
                                        tile,
                                        index,
                                        true
                                    )
                            )
                            .join("")
                        }

                    </div>


                    <div
                        class="real-okey-controls"
                    >

                        <button
                            class="
                                real-okey-button
                            "
                            id="real-okey-draw"
                        >
                            🀄 Taş Çek
                        </button>

                        <button
                            class="
                                real-okey-button
                            "
                            id="real-okey-discard"
                            disabled
                        >
                            🗑 Taş At
                        </button>

                        <button
                            class="
                                real-okey-button
                            "
                            id="real-okey-sort"
                        >
                            ↕ Sırala
                        </button>

                    </div>

                </div>


                <!-- SOHBET -->

                <div
                    class="real-okey-chat"
                >

                    <div
                        class="
                            real-okey-chat-title
                        "
                    >

                        💬 Oyun Sohbeti

                    </div>

                    <div
                        id="
                            real-okey-chat-messages
                        "
                        class="
                            real-okey-chat-messages
                        "
                    >

                        <div
                            class="
                                real-okey-chat-message
                            "
                        >

                            <strong>
                                Sistem:
                            </strong>

                            Oyuna hoş geldin.

                        </div>

                    </div>

                    <div
                        class="
                            real-okey-chat-input
                        "
                    >

                        <input
                            id="
                                real-okey-chat-input
                            "
                            type="text"
                            maxlength="120"
                            placeholder="
                                Mesaj yaz...
                            "
                        >

                        <button
                            id="
                                real-okey-chat-send
                            "
                        >
                            Gönder
                        </button>

                    </div>

                </div>

            </div>

        `;

        this.bindEvents();

    },


    /* ========================================================
       OYUN ALANI BUL
       ======================================================== */

    findGameArea: function(){

        let area =
            document.querySelector(
                "#gameArea"
            );

        if(area){
            return area;
        }

        area =
            document.querySelector(
                ".game-area"
            );

        if(area){
            return area;
        }

        area =
            document.querySelector(
                "[data-game-area]"
            );

        if(area){
            return area;
        }

        area =
            document.querySelector(
                "#gameModal .modal-body"
            );

        if(area){
            return area;
        }

        return null;

    },


    /* ========================================================
       EVENT BAĞLA
       ======================================================== */

    bindEvents: function(){

        const rack =
            document.getElementById(
                "real-okey-rack"
            );

        if(rack){

            rack
                .querySelectorAll(
                    "[data-okey-selectable='1']"
                )
                .forEach(
                    element => {

                        element.addEventListener(
                            "click",
                            () => {

                                this.selectTile(
                                    Number(
                                        element.dataset.okeyIndex
                                    )
                                );

                            }
                        );

                    }
                );

        }


        const draw =
            document.getElementById(
                "real-okey-draw"
            );

        if(draw){

            draw.addEventListener(
                "click",
                () => {

                    this.drawTile();

                }
            );

        }


        const discard =
            document.getElementById(
                "real-okey-discard"
            );

        if(discard){

            discard.addEventListener(
                "click",
                () => {

                    this.discardSelected();

                }
            );

        }


        const sort =
            document.getElementById(
                "real-okey-sort"
            );

        if(sort){

            sort.addEventListener(
                "click",
                () => {

                    this.sortPlayerHand();

                }
            );

        }


        const send =
            document.getElementById(
                "real-okey-chat-send"
            );

        const input =
            document.getElementById(
                "real-okey-chat-input"
            );

        if(send){

            send.addEventListener(
                "click",
                () => {

                    this.sendChat();

                }
            );

        }


        if(input){

            input.addEventListener(
                "keydown",
                event => {

                    if(
                        event.key ===
                        "Enter"
                    ){

                        this.sendChat();

                    }

                }
            );

        }

    },


    /* ========================================================
       TAŞ SEÇ
       ======================================================== */

    selectTile: function(index){

        if(
            this.state.currentPlayer !== 0
        ){

            return;

        }

        this.state.selectedTile =
            this.state.selectedTile === index
            ? null
            : index;

        this.updateSelectedVisual();

    },


    /* ========================================================
       SEÇİLİ TAŞ GÖRSELİ
       ======================================================== */

    updateSelectedVisual: function(){

        const tiles =
            document.querySelectorAll(
                "#real-okey-rack .real-okey-tile"
            );

        tiles.forEach(
            (tile,index) => {

                tile.classList.toggle(
                    "selected",
                    index ===
                    this.state.selectedTile
                );

            }
        );

        const button =
            document.getElementById(
                "real-okey-discard"
            );

        if(button){

            button.disabled =
                this.state.selectedTile === null;

        }

    },


    /* ========================================================
       TAŞ ÇEK
       ======================================================== */

    drawTile: function(){

        if(
            this.state.currentPlayer !== 0
        ){

            return;

        }

        if(
            !this.state.deck.length
        ){

            this.state.message =
                "Taş havuzu boş.";

            this.updateMessage();

            return;

        }

        const tile =
            this.state.deck.pop();

        this.state.players[0]
            .hand
            .push(tile);

        this.state.selectedTile =
            null;

        this.state.message =
            "Taş çektin. Bir taş seç ve at.";

        this.render();

    },


    /* ========================================================
       TAŞ AT
       ======================================================== */

    discardSelected: function(){

        if(
            this.state.currentPlayer !== 0
        ){

            return;

        }

        const index =
            this.state.selectedTile;

        if(index === null){

            return;

        }

        const hand =
            this.state.players[0].hand;

        if(
            !hand[index]
        ){

            return;

        }

        const tile =
            hand.splice(
                index,
                1
            )[0];

        this.state.discard.push(
            tile
        );

        this.state.selectedTile =
            null;

        this.state.message =
            "Taşı attın. Rakipler oynuyor.";

        this.render();

        setTimeout(
            () => {

                this.playBots();

            },
            800
        );

    },


    /* ========================================================
       TAŞLARI SIRALA
       ======================================================== */

    sortPlayerHand: function(){

        this.state.players[0]
            .hand
            .sort(
                this.compareTiles.bind(this)
            );

        this.state.selectedTile =
            null;

        this.state.message =
            "Taşların sıralandı.";

        this.render();

    },


    /* ========================================================
       MESAJ GÜNCELLE
       ======================================================== */

    updateMessage: function(){

        const element =
            document.getElementById(
                "real-okey-message"
            );

        if(element){

            element.textContent =
                this.state.message;

        }

    },


    /* ========================================================
       SOHBET MESAJI
       ======================================================== */

    sendChat: function(){

        const input =
            document.getElementById(
                "real-okey-chat-input"
            );

        const box =
            document.getElementById(
                "real-okey-chat-messages"
            );

        if(
            !input ||
            !box
        ){

            return;

        }

        const text =
            input.value.trim();

        if(!text){

            return;

        }

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "real-okey-chat-message";

        message.innerHTML =
            "<strong>Sen:</strong> " +
            this.escapeHTML(text);

        box.appendChild(
            message
        );

        box.scrollTop =
            box.scrollHeight;

        input.value = "";

    },


    /* ========================================================
       GÜVENLİ METİN
       ======================================================== */

    escapeHTML: function(text){

        return String(text)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    },


    /* ========================================================
       BOTLAR
       ======================================================== */

    playBots: function(){

        for(
            let i = 1;
            i < 4;
            i++
        ){

            this.state.currentPlayer =
                i;

            const player =
                this.state.players[i];

            if(
                this.state.deck.length
            ){

                player.hand.push(
                    this.state.deck.pop()
                );

            }

            if(
                player.hand.length
            ){

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        player.hand.length
                    );

                const tile =
                    player.hand.splice(
                        randomIndex,
                        1
                    )[0];

                this.state.discard.push(
                    tile
                );

            }

        }

        this.state.currentPlayer =
            0;

        this.state.message =
            "Rakipler oynadı. Sıra sende.";

        this.state.selectedTile =
            null;

        this.render();

    }

};

})();
/* ============================================================
   OKEY GERÇEK MASA - 2. PARÇA
   OYUNU AÇMA / EKRANA BAĞLAMA / BUTONLAR
   ============================================================ */

(function(){

"use strict";


/* ============================================================
   OKEY OYUNUNU AÇ
   ============================================================ */

function startRealOkey(){

    try{

        if(
            window.OYNAKAZAN_REAL_OKEY &&
            typeof window.OYNAKAZAN_REAL_OKEY.init ===
            "function"
        ){

            window.OYNAKAZAN_REAL_OKEY.init();

            return true;

        }

    }catch(error){

        console.error(
            "Gerçek Okey başlatılamadı:",
            error
        );

    }

    return false;

}


/* ============================================================
   OKEY ALANINI BUL
   ============================================================ */

function findOkeyContainer(){

    const selectors = [

        "#gameArea",

        ".game-area",

        "[data-game-area]",

        "#gameModal .modal-body",

        "#gameModal .modal-content",

        ".modal-body",

        "#game-container",

        "#games-container"

    ];

    for(
        let i=0;
        i<selectors.length;
        i++
    ){

        const element =
            document.querySelector(
                selectors[i]
            );

        if(element){

            return element;

        }

    }

    return null;

}


/* ============================================================
   ESKİ OKEY İZLERİNİ TEMİZLE
   ============================================================ */

function clearOldOkey(){

    const selectors = [

        ".okey-game",

        ".okey-table",

        ".okey-board",

        ".game-okey",

        ".okey-container",

        ".okey-wrapper",

        ".okey-area",

        "#okey-game",

        "#okey-board"

    ];

    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {

                        if(
                            element.classList.contains(
                                "real-okey-wrapper"
                            )
                        ){

                            return;

                        }

                    }
                );

        }
    );

}


/* ============================================================
   OKEY BUTONU İÇİN YARDIMCI
   ============================================================ */

function isOkeyButton(element){

    if(!element){

        return false;

    }

    const text =
        (
            element.textContent ||
            ""
        )
        .trim()
        .toLowerCase();

    const id =
        (
            element.id ||
            ""
        )
        .toLowerCase();

    const cls =
        (
            element.className ||
            ""
        )
        .toString()
        .toLowerCase();

    return (

        text.includes("okey") ||

        id.includes("okey") ||

        cls.includes("okey")

    );

}


/* ============================================================
   ESKİ OKEY BUTONLARINI BUL
   ============================================================ */

function hookOkeyButtons(){

    const elements =
        document.querySelectorAll(
            "button, .game-card, .game-item, [data-game]"
        );

    elements.forEach(
        element => {

            if(
                !isOkeyButton(element)
            ){

                return;

            }

            if(
                element.dataset.realOkeyHooked ===
                "1"
            ){

                return;

            }

            element.dataset.realOkeyHooked =
                "1";


            element.addEventListener(
                "click",
                function(event){

                    const started =
                        startRealOkey();

                    if(started){

                        event.preventDefault();

                        event.stopPropagation();

                    }

                },
                true
            );

        }
    );

}


/* ============================================================
   GENEL TIKLAMA YAKALAYICI
   ============================================================ */

document.addEventListener(
    "click",
    function(event){

        const target =
            event.target.closest(
                "button, a, div"
            );

        if(!target){

            return;

        }

        const text =
            (
                target.textContent ||
                ""
            )
            .trim()
            .toLowerCase();

        const dataGame =
            (
                target.dataset &&
                target.dataset.game
            )
            ? String(
                target.dataset.game
            ).toLowerCase()
            : "";


        if(

            text === "101 okey" ||

            text === "okey" ||

            text.includes("101 okey") ||

            dataGame === "okey" ||

            dataGame === "101okey" ||

            dataGame === "101-okey"

        ){

            const started =
                startRealOkey();

            if(started){

                event.preventDefault();

                event.stopPropagation();

            }

        }

    },
    true
);


/* ============================================================
   SAYFA YÜKLENDİĞİNDE BUTONLARI BAĞLA
   ============================================================ */

function prepareRealOkey(){

    hookOkeyButtons();

}


/* ============================================================
   DOM HAZIRSA
   ============================================================ */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        prepareRealOkey
    );

}else{

    prepareRealOkey();

}


/* ============================================================
   DİNAMİK OLARAK OLUŞAN BUTONLAR
   ============================================================ */

const observer =
    new MutationObserver(
        function(){

            hookOkeyButtons();

        }
    );


if(document.body){

    observer.observe(
        document.body,
        {
            childList:true,
            subtree:true
        }
    );

}


/* ============================================================
   GLOBAL OKEY BAŞLATMA KOMUTU
   ============================================================ */

window.startRealOkey =
    startRealOkey;


/* ============================================================
   OKEY TEST KOMUTU
   ============================================================ */

window.testRealOkey =
    function(){

        console.log(
            "Gerçek Okey test ediliyor..."
        );

        return startRealOkey();

    };


/* ============================================================
   OKEY HAZIR
   ============================================================ */

console.log(
    "101 Okey yeni motoru hazır."
);

})();
/* ============================================================
   OKEY GERÇEK MASA - 3. PARÇA
   MODAL + GAME-AREA BAĞLANTISI + ATILAN TAŞI AL
   ============================================================ */

(function () {
  "use strict";

  const okey = window.OYNAKAZAN_REAL_OKEY;

  if (!okey) {
    console.error("Gerçek Okey sistemi bulunamadı.");
    return;
  }

  /* ------------------------------------------------------------
     DOĞRU GAME AREA
     Mevcut index.html içindeki #game-area'yı kullanır.
     ------------------------------------------------------------ */

  okey.findGameArea = function () {
    return (
      document.getElementById("game-area") ||
      document.getElementById("gameArea") ||
      document.querySelector(".game-area") ||
      document.querySelector("[data-game-area]")
    );
  };

  /* ------------------------------------------------------------
     OKEY MODALINI AÇ
     ------------------------------------------------------------ */

  const eskiInit = okey.init.bind(okey);

  okey.init = function () {
    const modal = document.getElementById("game-modal");
    const area = document.getElementById("game-area");
    const title = document.getElementById("modal-game-title");
    const category = document.getElementById("modal-category");

    if (modal) {
      modal.classList.remove("hidden");
      modal.style.display = "";
    }

    if (title) {
      title.textContent = "101 Okey";
    }

    if (category) {
      category.textContent = "MASA OYUNU";
    }

    if (area) {
      area.innerHTML = "";
    }

    eskiInit();
  };

  /* ------------------------------------------------------------
     ATILAN TAŞI AL
     ------------------------------------------------------------ */

  okey.takeDiscard = function () {
    const state = okey.state;

    if (!state) return;

    if (state.currentPlayer !== 0) {
      state.message = "Şu anda senin sıran değil.";
      okey.render();
      return;
    }

    if (!state.discard || state.discard.length === 0) {
      state.message = "Ortada alınacak taş yok.";
      okey.render();
      return;
    }

    if (!state.players[0] || !state.players[0].hand) {
      return;
    }

    const tile = state.discard.pop();

    if (tile) {
      state.players[0].hand.push(tile);
      state.selectedTile = null;
      state.message =
        "Ortadaki taşı aldın. Şimdi bir taş seçip AT.";
    }

    okey.render();
  };

  /* ------------------------------------------------------------
     RENDER'I GELİŞTİR
     ATILAN TAŞI AL BUTONU EKLE
     ------------------------------------------------------------ */

  const eskiRender = okey.render.bind(okey);

  okey.render = function () {
    eskiRender();

    const controls = document.querySelector(".real-okey-controls");

    if (!controls) return;

    if (document.getElementById("real-okey-take-discard")) {
      return;
    }

    const button = document.createElement("button");

    button.id = "real-okey-take-discard";
    button.className = "real-okey-control-btn";
    button.type = "button";
    button.innerHTML = "⬅️ Atılanı Al";

    button.addEventListener("click", function () {
      okey.takeDiscard();
    });

    const drawButton =
      controls.querySelector("#real-okey-draw");

    if (drawButton) {
      controls.insertBefore(button, drawButton);
    } else {
      controls.appendChild(button);
    }
  };

  /* ------------------------------------------------------------
     EK GÖRSEL DÜZENLEMELER
     ------------------------------------------------------------ */

  const extraStyle = document.createElement("style");

  extraStyle.textContent = `
    .real-okey-control-btn {
      min-height: 48px !important;
      padding: 10px 16px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255,255,255,.18) !important;
      background: linear-gradient(180deg,#243447,#162331) !important;
      color: #fff !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
      box-shadow: 0 5px 14px rgba(0,0,0,.25) !important;
      transition: .18s ease !important;
    }

    .real-okey-control-btn:hover {
      transform: translateY(-2px) !important;
      filter: brightness(1.12) !important;
    }

    .real-okey-control-btn:active {
      transform: translateY(0) !important;
    }

    .real-okey-controls {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      justify-content: center !important;
      align-items: center !important;
    }

    .real-okey-table {
      min-height: 680px !important;
    }

    .real-okey-center {
      z-index: 5 !important;
    }

    .real-okey-rack-area {
      z-index: 20 !important;
    }

    .real-okey-player-bottom {
      z-index: 10 !important;
    }

    @media (max-width: 800px) {
      .real-okey-table {
        min-height: 760px !important;
      }

      .real-okey-controls {
        padding: 8px !important;
      }

      .real-okey-control-btn {
        font-size: 13px !important;
        min-height: 42px !important;
        padding: 8px 11px !important;
      }
    }
  `;

  document.head.appendChild(extraStyle);

  /* ------------------------------------------------------------
     GLOBAL BAŞLATMA
     ------------------------------------------------------------ */

  window.startRealOkey = function () {
    try {
      okey.init();
      return true;
    } catch (error) {
      console.error("101 Okey başlatılırken hata:", error);
      return false;
    }
  };

  /* ------------------------------------------------------------
     HAZIR
     ------------------------------------------------------------ */

  console.log(
    "✅ GERÇEK 101 OKEY MASASI HAZIR. 4 OYUNCU + TAŞLAR + ÇEK + AT + ATILANI AL + SOHBET."
  );

})();
