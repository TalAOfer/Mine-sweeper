function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// function returnFalse () {
//     return false
// }

function getRandomLocations(level) {
    var allLocations = []

    for (var i = 0; i < level.size; i++) {
        for (var j = 0; j < level.size; j++) {
            var location = {i, j}
            allLocations.push(location)
        }
    }
    shuffle(allLocations)

    return(allLocations)
    
}


function begginer() {
    gLevel.difficulty = 'begginer'
    gLevel.size = 4
    gLevel.mines = 2
    initGame()
}

function medium() {
    gLevel.difficulty = 'medium'
    gLevel.size = 8
    gLevel.mines = 12
    initGame()
}

function expert() {
    gLevel.difficulty = 'expert'
    gLevel.size = 12
    gLevel.mines = 30
    initGame()
}



function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


///stopwatch


var seconds = 0;
var minutes = 0;

var displaySeconds = 0;

var interval = null;

function stopWatch() {

    seconds++;

    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;
    }

    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds;
    }

    

    document.querySelector(".stopwatch").innerHTML = minutes + ":" + displaySeconds;

}




function resetTimer() {

    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    document.querySelector('.stopwatch').innerHTML = "0:00";

}

function startClock () {
    interval = window.setInterval(stopWatch, 1000);
}

function stopClock () {
    window.clearInterval(interval);
}