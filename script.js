// Size recomended: 682, 505

function onloadDo() {
    window.addEventListener('resize', adjustButtonLayout);
    window.addEventListener('load', adjustButtonLayout);
    genNumberInRange(96);
    applyNumberToButtons();
    applyFunctionToButtons();
    startGameBySettingRandomPlayerColor();
    updateLivesCounter();
    answear = generateMathProblem();
    addListeners();
    add1PointToBlue();
    add1PointToRed();
    startTime();
}




function adjustButtonLayout() {
    const buttonRow = document.getElementById('button-row');
    const buttons = buttonRow.children;

    buttonRow.style.width = `auto`;

    let totalWidth = 0;
    let rowWidth = buttonRow.offsetWidth;


    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        totalWidth += button.offsetWidth + parseInt(window.getComputedStyle(button).marginRight);

        if (totalWidth > rowWidth) {
            buttonRow.style.width = rowWidth + 'px';
            totalWidth = button.offsetWidth + parseInt(window.getComputedStyle(button).marginRight);
        }
    }
}


function RandomNumber(min, max) {
    return Math.floor((Math.random() + min) * (max + 1) / 2);
}


function nextPlayerColorTurn(currentColor) {
    let list = {
        'red': 'blue', 
        'blue': 'red',
    }

    let nextColor = list[currentColor];


    if (nextColor) {
        return nextColor
    }
}


function randomNumberForButton(button) {
    let Number = RandomNumber(1, 64);

    if (button) {
        button.textContent = Number;
    }
}


function applyNumberToButtons() {
    const row = document.getElementById('button-row');
    const buttons = row.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        
        if (button) {
            randomNumberForButton(button)
        }
    }
}


function getNumberFromString(string) {
    return parseInt(string);
}


let alreadyPlayed = false;
let lives = 3;

function applyFunctionToButtons() {
    const row = document.getElementById('button-row');
    const buttons = row.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        if (button) {
            button.id = 'colorButton' + i;
            button.addEventListener('click', function(){
                console.log(alreadyPlayed);
                if (alreadyPlayed === false) {
                    const colorSelected = document.getElementById('colorCircleDisplay');
                    const buttonThis = document.getElementById('colorButton' + i);
                    let enabled = true;

                    if (buttonThis.style.backgroundColor === `rgb(128, 128, 128)` || buttonThis.style.backgroundColor === '' && onAnswearCorrect(buttonThis)) {
                        alreadyPlayed = true;
                        enabled = false;
                        if (colorSelected) {
                            buttonThis.style.backgroundColor = colorSelected.style.backgroundColor;

                            if (colorSelected.style.backgroundColor === 'rgb(255, 0, 0)') {
                                add1PointToRed();
                            } else if (colorSelected.style.backgroundColor === 'rgb(0, 0, 255)') {
                                add1PointToBlue();
                            }
                        } else {
                            console.warn(`Missing color display!`)
                        }
                        console.log('bruh')
                        button.removeEventListener('click', button)
                        onButtonAnswearCorrect();
                        return
                    } else {
                        console.log('removing 1 life')
                        remove1Life();
                    }
                } else {
                    console.log('removing 1 life')
                    remove1Life();
                }
            })
        }
    }
}


function startGameBySettingRandomPlayerColor() {
    const colorContainer = document.getElementById('colorCircleDisplay');
    const list = {
        [1]: 'rgb(255, 0, 0)',
        [2]: 'rgb(0, 0, 255)',
    }
    const random = RandomNumber(1, 2);
    const color = list[random];

    console.log(color, random);


    colorContainer.style.backgroundColor = color;
}


function remove1Life() {  
    lives -= 1;
    onLiveTextChanged();
    updateLivesCounter();
}

function add1Life() {
    lives += 1;
    updateLivesCounter();
}

function setLives(num) {
    lives = num;
    updateLivesCounter();
}

function getLivesEmoji() {
    return '❤️';
}

function getBrokenLivesEmoji() {
    return '💔';
}

let defaultTime = 15;

function maxForLivesAndDoOnLivesLost() {
    if (lives < 0) {
        lives = 0;
        onButtonAnswearCorrect();
    } 
    updateLivesCounter();
}


function updateLivesCounter() {
    const livesDisplay = document.getElementById('livesCounter');

    if (livesDisplay) {
        if (livesToggled == true) {
            livesDisplay.textContent = '';

            for (let i = 0; i < lives; i++) {
                livesDisplay.textContent += getLivesEmoji();
            }

            for (let i = 0; i < (-lives + 3); i++) {
                livesDisplay.textContent += getBrokenLivesEmoji();
            }

            console.log(lives, lives - 3)

            livesDisplay.textContent += ` - Lives: ${lives}`;
        } else {
            livesDisplay.textContent = '🔒Disabled by Host';
            lives = 3;
        }
    } else {
        console.warn(`Missing LivesCounter!`)
    }
}

function doStringMath(num1, sym, num2) {
    if (sym == '+') {
        return num1 + num2
    } else if (sym == '-') {
        return num1 - num2
    } else if (sym == '*') {
        return num1 * num2
    }
}


let answear;

function generateMathProblem() {
    while (true) {
        const symbolList = {
            [1]: '+',
            [2]: '-',
        }
        let randomNumber = RandomNumber(1, 2);
        const symbol = symbolList[randomNumber];
        const displayLabel = document.getElementById('nextTurnAndProblemDisplay');
        const [num1, num2] = (function(){
            const num1 = RandomNumber(1, 24);
            const num2 = RandomNumber(1, 24);

            return [num1, num2];
        })();

        displayLabel.textContent = (num1) + ' ' + symbol + ' ' + (num2);

        const number = doStringMath(num1, symbol, num2);


        if (doesNumberButtonExsist(number)) {
            return number
        } else {
            continue;
        }
    }
}


function addListeners() {
    const livesDisplay = document.getElementById('livesCounter');
    const questionButton = document.getElementById('nextTurnAndProblemDisplay');

    const livesObserver = new MutationObserver(function(muntains) {
        console.log(muntains.length);
    });


    livesObserver.observe(livesDisplay, {
        characterData: true,
        subtree: false,
        childList: false,
    });
}

function onLiveTextChanged() {
    maxForLivesAndDoOnLivesLost();
}

function genNumberInRange(amount) {
    if (amount) {
        for (let i = 0; i < amount; i++) {
            const instance = document.createElement('button');
            const container = document.getElementById('button-row');

            container.appendChild(instance);
        }
    }
}


function onAnswearCorrect(button) {
    if (button) {
        if (parseInt(button.textContent) == answear) {
            return true;
        }
    }
}


function buttonCooldownToNextTeam(currentColor) {
    const list = {
        'rgb(255, 0, 0)': 'red',
        'rgb(0, 0, 255)': 'blue',
    }

    const listE = list[currentColor];
    console.log(currentColor, listE);

    if (listE) {
        if (listE == 'red') {
            return 'rgb(0, 0, 255)'; // this is Blue
        } else if (listE == 'blue') {
            return 'rgb(255, 0, 0)'; // this is Red
        }
    }
}



function doesNumberButtonExsist(num) {
    const buttonContainer = document.getElementById('button-row');
    const buttons = buttonContainer.children;


    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        if (parseInt(button.textContent) === num && (button.style.backgroundColor == 'rgb(128, 128, 128)' || button.style.backgroundColor == '')) {
            return true;
        }
    }

    return false;
}


function toggleAlreadyPlayed() {
    alreadyPlayed = false;
}

function onButtonAnswearCorrect() {
    stopTime();
    let times = 0;
    const ID = setInterval(() => {
        if (times > 0) {
            console.log('waited!')
            clearInterval(ID);
        }

        times++;
    }, 1100)
    const dis = document.getElementById('colorCircleDisplay');
    setLives(3);
    answear = generateMathProblem();
    toggleAlreadyPlayed();
    const newColor = buttonCooldownToNextTeam(dis.style.backgroundColor)
    dis.style.backgroundColor = newColor;
    setTime(defaultTime || 15);
    startTime();
}




let bluePoints = 0;
let redPoints = 0;

function add1PointToBlue() {
    const counter = document.getElementById('BluePoints');

    bluePoints += 1;
    counter.textContent = `🏳️‍⚧️ Blue: ${bluePoints}`;
}

function add1PointToRed() {
    const counter = document.getElementById('RedPoints');

    redPoints += 1;
    counter.textContent = `🏳️‍🌈 Red: ${redPoints}`;
}



function setTime(t) {
    time = t;
}

let timerEnabled = false;
let time = 15; // Example starting time in seconds
let intervalId = null; // Variable to store the interval ID

function startTime() {
    if (intervalId !== null) {
        clearInterval(intervalId); // Clear any existing interval
    }

    timerEnabled = true;
    const timerElement = document.getElementById('Timer');

    intervalId = setInterval(() => {
        if (timeToggled == true) {
            if (!timerEnabled) {
                clearInterval(intervalId);
                intervalId = null; // Reset the interval ID when stopped
                return;
            }

            if (time > 0) {
                timerElement.textContent = '⏱️ Time left: ' + time;
                time--;
            } else {
                clearInterval(intervalId); // Stop the timer when time reaches 0
                intervalId = null; // Reset the interval ID when timer ends
                stopTime();
                onButtonAnswearCorrect();
            }
        } else {
            timerElement.textContent = '🔒Disabled By Host'
        }
    }, 1000); // Interval of 1000ms (1 second)
}

function stopTime() {
    timerEnabled = false; // This will stop the interval in startTime
    if (intervalId !== null) {
        clearInterval(intervalId); // Clear the interval when stopping the timer
        intervalId = null; // Reset the interval ID
    }
}



let livesToggled = true;
let timeToggled = true;


function HostPanel() {
    const HostPanel = document.getElementById('hostPanel-Panel');
    const Module = {}


    Module.ToggleLives = function(on_off) {
        livesToggled = on_off;
    }

    Module.Start = function() {
        HostPanel.style.visibility = 'Hidden';
        onloadDo();
    }

    Module.ToggleTime = function(on_off) {
        timeToggled = on_off;
    }


    return Module
}


function setUpHostPanel() {
    const LivesToggle = document.getElementById('LivesToggle');
    const StartButton = document.getElementById('StartButton-Button');
    const TimeToggle = document.getElementById('TimeToggle');

    const TimerLabel = document.getElementById('Timer');
    const timeInput = document.getElementById('hostPanel-TimeInput');
    const confirmInputButton = document.getElementById('hostPanel-TimeInput-Button');



    LivesToggle.addEventListener('click', function() {
        if (LivesToggle.textContent === 'Toggle Lives: ON') {
            LivesToggle.textContent = 'Toggle Lives: OFF';
            HostPanel().ToggleLives(false);
        } else {
            LivesToggle.textContent = 'Toggle Lives: ON';
            HostPanel().ToggleLives(true);
        }
    });

    TimeToggle.addEventListener('click', function() {
        if (TimeToggle.textContent === 'Toggle Time: ON') {
            TimeToggle.textContent = 'Toggle Time: OFF';
            HostPanel().ToggleTime(false);
            TimerLabel.style.width = `20.5%`;
            timeInput.style.visibility = `Hidden`;
            confirmInputButton.style.visibility = `Hidden`;
        } else {
            TimeToggle.textContent = 'Toggle Time: ON';
            HostPanel().ToggleTime(true);
            TimerLabel.style.width = `16.5%`;
            timeInput.style.visibility = `unset`;
            confirmInputButton.style.visibility = `unset`;
        }
    })


    confirmInputButton.addEventListener('click', function() {
        if (parseInt(timeInput.value)) {
            const time = parseInt(timeInput.value);

            if ((time < 5) || (time > 30)) {
                alert('The input must be between: more than 5 and less than 30');
                return;
            }
            setTime(time);
            defaultTime = time;
        } else {
            alert('The input must be a Number')
        }
    })


    StartButton.addEventListener('click', function(){
        HostPanel().Start();
    })
}



document.addEventListener('DOMContentLoaded', () => {
    setUpHostPanel();
})