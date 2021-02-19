const display = document.getElementById("display");
const speed = document.getElementById("speed");
const play = document.getElementById("playPause");
const fileDisplay = document.getElementById("fileDisplay");
const fileSelect = document.getElementById("fileSelect");

fileSelect.onchange = ev => {
    const reader = new FileReader();
    reader.onloadend = () => {
        fileDisplay.textContent = parse(reader.result); 
    };
    reader.onerror = () => {
        fileDisplay.textContent = "error reading file";
    }
    reader.readAsText(ev.target.files[0]);
};

function parse(value) {
    // TODO
    text = value;
    words = text.split(/[,;:]?\s|\./);
    return value
}


// Reader
let text = "This is an example text. It will be used to display words, one at a time to show how we could read differently.";
let words = text.split(/[,;:]?\s|\./);
let interval = null;
let ix = 0;
let req;

let speedValue = 500;

// Dynamically change reading speed
speed.oninput = ev => {
    speedValue = ev.target.value;
}

// STOP/START on button press and when user presses space
play.onclick = togglePlay;
window.addEventListener("keypress", ev => {
    if (ev.key == " ") {
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


function updateWordDisplay() {
    display.textContent = words[ix];
    ix++;
    if (ix === words.length) ix = 0;
}

let start;
function step(timestamp) {
    req = window.requestAnimationFrame(step);
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    if (elapsed > speedValue) {
        updateWordDisplay();
        start = timestamp;
    }
}

