const winCounterContainer = document.querySelector('.winCounter-container');
const boxContainer = document.querySelector('.box-container');
const buttonResetContainer = document.querySelector('.button-reset');
const colors = ['aqua', 'crimson', 'blue'];
let colorsPickList = [...colors, ...colors]; //combine array into a signle one
const boxCount = colorsPickList.length;

//Game state
let revealedCount = 0; //user score (how many boxex opened)
let activeBox: HTMLElement = null; //cliked box
let awaitingEndOfMove = false; //if true that user awaits the two clicked boxes to be reversed
let winCounter = 0;
startGame();

//start game button add
function startGame() {
    const startElement = document.createElement('div');
    const startContainer = document.querySelector('.start-container'); //button container to append
    startElement.classList.add('start-button'); //button class
    startElement.textContent = 'Start Game'; //button text

    startElement.addEventListener('click', () => {
        gameInitializer(); //game creation
        startContainer.remove(); //remove start game button
    });

    if (startContainer) {
        startContainer.appendChild(startElement); //put button into container
    } else {
        console.error('Container not founnd'); //error if no container
    }
}

//build new box and return it to for loop below
function buildBox(color: string) {
    const element = document.createElement('div');

    element.classList.add('box');
    //sets the data-color attribute on the element and sets its color to (color)
    element.setAttribute('data-color', color);
    element.setAttribute('data-revealed', 'false');

    //when clicked then reveal color to the user
    element.addEventListener('click', () => {
        //variable for box status (data-revealed true/false)
        const revealed = element.getAttribute('data-revelead');

        //validation before event
        //element === activeBox check if one box clicked two times
        if (awaitingEndOfMove || revealed === 'true' || element === activeBox) {
            return;
        }

        element.style.backgroundColor = color;

        //if there is no click, set the current item as opened
        if (!activeBox) {
            activeBox = element;
            //cancel entire function, box actived
            return;
        }

        //match logic 
        //colorToMatch refer to box which was clicked first, NOT second box
        const colorToMatch = activeBox.getAttribute('data-color');

        //check for color match
        if (colorToMatch === color) {
            //in order NOT to press already active box (flagged as active)
            activeBox.setAttribute('data-revealed', 'true');
            element.setAttribute('data-revealed', 'true');

            awaitingEndOfMove = false; //clear game state
            activeBox = null; //clear game state
            revealedCount += 2;

            if (revealedCount === boxCount) {
                window.alert("You win! Press 'reset' to play again.");
                increaseWinCounter();
            }

            return;
        } 
        
        //box attempts to match against
        awaitingEndOfMove = true; // preventing other clicks

        //after 1 sec set boxes to closed, clear variables
        setTimeout(() => {
            element.style.backgroundColor = null;
            activeBox.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeBox = null;
        }, 1000);
    });
    return element;
}

function resetGame() {
    //clear games state
    revealedCount = 0;
    activeBox = null;
    awaitingEndOfMove = false;

    //delete all boxes
    boxContainer.innerHTML = '';
    buttonResetContainer.innerHTML = '';

    gameInitializer();
}


function gameInitializer() {
    // Build up boxes
    colorsPickList = [...colors, ...colors]; //after reset create array once again, because (splice) used for previous array
    for (let i = 0; i < boxCount; i++) {
        //pick random color from colorsPickList
        const randomIndex = Math.floor(Math.random() * colorsPickList.length);
        //get random color from colorsPickList
        const color = colorsPickList[randomIndex];
        //call function in order to add color
        const box = buildBox(color);

        colorsPickList.splice(randomIndex, 1);
        boxContainer.appendChild(box);
    }

    // create 'reset' button
    const resetButton = document.createElement('div');
    resetButton.classList.add('reset');
    resetButton.textContent = 'Reset';

    if (buttonResetContainer) {
        buttonResetContainer.appendChild(resetButton);
    } else {
        console.error('Button container not found');
    }

    resetButton.addEventListener('click', resetGame);
}

function initializeWinCounter() {
    // eslint-disable-next-line prefer-template
    winCounterContainer.textContent = 'Victory count: ' + winCounter;
}

//after win update counter and save to local storage
function updateWinCounter() {
    localStorage.setItem('winCounter', winCounter.toString());
}

//increase win counter
function increaseWinCounter() {
    winCounter++;
    initializeWinCounter();
    updateWinCounter();
}

