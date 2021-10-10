const game = document.getElementById("game-cont");
const gamepoints = document.getElementById("game-points")
const gameesit = document.getElementById("game-esit")
var points = 0;
const retrybutton = document.getElementById("retry-button");
var url = new URL(location.href);
var playerid = url.searchParams.get("id");

const gamehosturl = url.origin; //since the game is hosted in the same telegram bot server, express module will route request '/' at public/index.html by default

gamepoints.innerHTML = points;
game.addEventListener('click', newGame);
retrybutton.addEventListener('click', newGame);

function newGame() {
    points = 0;
    game.removeEventListener('click', newGame);
    game.addEventListener('click', addPoints);
    myFunction();
}

function addPoints() {
    console.log('points added');
    points++;
    gamepoints.innerHTML = 'POINTS: ' + points;
}

function gameEnd() {
    gameesit.innerHTML = "Time Expired! <br>Hai totalizzato " + points + " punti!";
    retrybutton.innerHTML = "Retry";
    setHighScore(points);
}


function myFunction() {
    setTimeout(stopFunc, 3000);
}

function stopFunc() {
    console.log('stop');
    game.removeEventListener('click', addPoints);
    gameEnd();
}

function setHighScore(score) {
    // Submit highscore to Telegram Bot Server
    var xmlhttp = new XMLHttpRequest();
    let url = gamehosturl + "/highscore/" + score +
        "?id=" + playerid;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}