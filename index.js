const display = document.getElementById("display");
const speed = document.getElementById("speed");
const play = document.getElementById("playPause");
const back = document.getElementById("back");
const skip = document.getElementById("skip");
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

const exampleText = 
`
Test File for No Eye Movement Reader

This is a test file.

It is important to know that this text will not be presented normally, but will instead be shown one word at a time.
This is to aid in reading speed as one off the handicaps of our reading speed is the movement of the eye!

Hope you see that you are reading much faster now, and that this does not feel like too much of a loss.

The text is still available as a whole, so you can still read it when you like, but maybe read it like this first.

You can pause and play this reader with space or "k", as well as skip and go back with "l" and "j" respectively.

Choose and text file on your computer and start reading, but remember that this is still a proof of concept. The file size should not be to big. 

`;

window.onload = () => {
    fileDisplay.innerHTML = view(parse(exampleText));
}

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


let req; // holds the current request frame, used to start/cancel animation
let page; // holds a parsed version off the file. used to display and progress the reader

let speedValue = 500; // the speed of the reader

// Dynamically change reading speed
speed.oninput = ev => {
    speedValue = ev.target.value;
}

// STOP/START on button press and when user presses space
play.onclick = togglePlay;
back.onclick = moveBack;
skip.onclick = moveForward;
window.addEventListener("keypress", ev => {
    if (ev.key === " " || ev.key === "k") {
        togglePlay();
    } else if (ev.key === "j") {
        moveBack();
    } else if (ev.key === "l") {
        moveForward();
    }
})

function moveBack() {
    const diff = page.wordIx - 5;
    if (diff >= 0) {
        page.wordIx -= 5;
    } else if (diff < 0 && page.ix !== 0) {
        page.ix--;
        page.wordIx = page.sentences[page.ix].length + diff;
    } else {
        page.wordIx = 0;
    }

    fileDisplay.innerHTML = view(page);
}

function moveForward() {
    const diff = (page.sentences[page.ix].length-1) - page.wordIx;
    if (diff >= 5) {
        page.wordIx += 5;
        console.log("first");
    } else if (diff < 5 && page.ix !== page.sentences.length-1) {
        page.ix++;
        page.wordIx = (5 - diff) - 1;
        console.log("second");
    } else {
        page.wordIx = page.sentences[page.ix].length-1;
        console.log("third");
    }

    fileDisplay.innerHTML = view(page);
}

function toggleDisplay() {
    if (play.textContent === "play") {
        play.textContent = "pause";
    } else {
        play.textContent = "play";
    }
}

function togglePlay() {
    if (page === undefined) return;
    if (play.textContent === "pause") {
        window.cancelAnimationFrame(req);
    } else {
        req = window.requestAnimationFrame(step);
    }
    toggleDisplay();
}


// Animation
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

