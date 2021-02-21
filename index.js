const display = document.getElementById("display");
const speed = document.getElementById("speed");
const play = document.getElementById("playPause");
const fileDisplay = document.getElementById("fileDisplay");
const fileSelect = document.getElementById("fileSelect");

fileSelect.onchange = ev => {
    const reader = new FileReader();
    reader.onloadend = () => {
        fileDisplay.innerHTML = view(parse(reader.result)); 
    };
    reader.onerror = () => {
        fileDisplay.textContent = "error reading file";
    };
    reader.readAsText(ev.target.files[0]);
};

/* 
    page = {
        sentences : array sentence,
        ix: number,
        wordIx: number
    }

    sentence : array string
*/

function view(page) {
    return page.sentences.map((s, ix) => {
        const words = s.map((w, wordIx) => {
            if (page.ix === ix && page.wordIx === wordIx) {
                return `<span class="wordsHighlight">${w}</span>`;
            }
            return w;
        }).join(' ');

        if (page.ix === ix) {
            return `<p class="highlight">${words}</p>`;
        }
        return `<p>${words}</p>`;
    }).join('');
}

function parse(text) {
    const sentences = text.split(/\n/).filter(v => v !== "").map(v => v.split(' '));
    page = {
        sentences,
        ix: 0,
        wordIx: 0
    };
    return page;
}

function nextWord() {
    if (page.wordIx === page.sentences[page.ix].length) {
        page.wordIx = 0;
        page.ix++;
    } 
    if (page.ix === page.sentences.length) {
        window.cancelAnimationFrame(req);
        page = {...page, ix: 0, wordIx: 0};
        togglePlay();
    }
    
    fileDisplay.innerHTML = view(page);
    display.textContent = page.sentences[page.ix][page.wordIx++];
}


// Reader
let req; // holds the current request frame, used to start/cancel animation
let page; // holds a parsed version off the file. used to display and progress the reader

let speedValue = 500;

// Dynamically change reading speed
speed.oninput = ev => {
    speedValue = ev.target.value;
}

// STOP/START on button press and when user presses space
play.onclick = togglePlay;
window.addEventListener("keypress", ev => {
    if (ev.key === " ") {
        togglePlay();
    }
})

function toggleDisplay() {
    if (play.textContent === "play") {
        play.textContent = "pause";
    } else {
        play.textContent = "play";
    }
}

function togglePlay() {
    if (play.textContent === "pause") {
        window.cancelAnimationFrame(req);
    } else {
        req = window.requestAnimationFrame(step);
    }
    toggleDisplay();
}

let start;
function step(timestamp) {
    req = window.requestAnimationFrame(step);
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    if (elapsed > speedValue) {
        nextWord();
        start = timestamp;
    }
}

