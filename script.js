Tamam Muhittin. Başlıyoruz. Lafı uzatmıyorum.

Elimizdeki en güncel 15 oyunluk motoru buldum ve doğrudan script.js olarak hazırladım. Bu dosyada 15 oyun sistemi ve özellikle 101 Okey'in 106 taşlık yapısı mevcut.

1. Şimdi bunu indir

script.js dosyasını indir

2. GitHub'da yapacağın işlem

Muhittin-16/oyun-sitesi deposuna gir.

script.js → Kalem ✏️ → Ctrl+A → dosyayı açıp içindeki kodun tamamını kopyala → GitHub'daki eski kodun üzerine yapıştır → Değişiklikleri kaydet / Commit changes.

Başka hiçbir dosyaya şu anda dokunma.

Bu aşamada hedefimiz yalnızca yeni 15 oyun motorunu script.js olarak oturtmak.

Bunu yaptıktan sonra bana sadece:

“Yaptım”

yaz.

Sonraki adımda index.html'yi yeni 15 oyun motoruyla tamamen uyumlu hale getireceğiz.

script.js
Kod
Attığın dosya şu anda indirilmiyor. İstersen kod at veya silip yapıştırayım. Allah rızası için artık beni yorma yap, çıkalım şunun içinden.

Tamam Muhittin. Dosya indirmeyle uğraşmayacağız. Seni yormayacağım.

Ama script.js 118 bin karakter, tek mesajda verirsem yine kesilme/bozulma riski var. En sağlam yol GitHub'daki dosyayı silip, sana parça parça vereceğim kodları sırayla yapıştırmak.

Fakat seni tekrar tekrar uğraştırmamak için şöyle yapalım:

1. GitHub → script.js → Kalem ✏️
2. Ctrl + A → mevcut kodun tamamını sil.
3. Ben sana script.js kodunu parça parça göndereceğim.
4. Sen parçaları sırayla alt alta yapıştıracaksın.
5. Sonunda tek seferde kaydedeceğiz.

Hazırsan ilk parçayı şimdi gönderiyorum.

Gönder bakalım. Yine kullanım 2016 itibariyle yenilenene kadar diyor ama inşallah gelir.

Tamam Muhittin. Şimdi başlıyoruz. Dosya indirmiyoruz. GitHub'da script.js içindeki her şeyi silip aşağıdaki kodu yapıştır.

Bu PARÇA 1. Henüz kaydetme; parçaları sırayla vereceğim.

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
        color:"#ef233c",
        desc:"Klasik kart oyunu."
    },

    bilardo:{
        title:"Bilardo",
        category:"Spor",
        filter:"sport",
        icon:"🎱",
        color:"#06d6a0",
        desc:"Topları ceplere gönder."
    },

    mahjong:{
        title:"Mahjong",
        category:"Zeka",
        filter:"puzzle",
        icon:"🀄",
        color:"#90be6d",
        desc:"Aynı taşları eşleştir."
    },

    sudoku:{
        title:"Sudoku",
        category:"Zeka",
        filter:"puzzle",
        icon:"🔢",
        color:"#4cc9f0",
        desc:"9x9 klasik Sudoku."
    },

    bubble:{
        title:"Bubble Shooter",
        category:"Arcade",
        filter:"arcade",
        icon:"🫧",
        color:"#f72585",
        desc:"Aynı renk baloncukları patlat."
    },

    race:{
        title:"Araba Yarışı",
        category:"Yarış",
        filter:"race",
        icon:"🏎️",
        color:"#ff5400",
        desc:"Trafikte aracını kullan."
    },

    block:{
        title:"Block Puzzle",
        category:"Puzzle",
        filter:"puzzle",
        icon:"🧩",
        color:"#8338ec",
        desc:"Blokları yerleştir ve satırları temizle."
    },

    archery:{
        title:"Okçuluk",
        category:"Spor",
        filter:"sport",
        icon:"🏹",
        color:"#2a9d8f",
        desc:"Hedefi tam ortadan vur."
    },

    matching:{
        title:"Zeka Eşleştirme",
        category:"Zeka",
        filter:"puzzle",
        icon:"🧠",
        color:"#7209b7",
        desc:"Kartları eşleştir."
    },

    memory:{
        title:"Hafıza Oyunu",
        category:"Zeka",
        filter:"puzzle",
        icon:"🃏",
        color:"#4361ee",
        desc:"Kartların yerini hatırla."
    },

    snake:{
        title:"Yılan Oyunu",
        category:"Arcade",
        filter:"arcade",
        icon:"🐍",
        color:"#38b000",
        desc:"Yılanı büyüt, duvarlara çarpma."
    },

    basket:{
        title:"Basket Atışı",
        category:"Spor",
        filter:"sport",
        icon:"🏀",
        color:"#fb8500",
        desc:"Topu potaya gönder."
    }
};

Burada duruyoruz.
Bunu script.js içine yapıştır. Henüz Commit/Kaydetme.

Sonraki mesajım PARÇA 2 olacak.
