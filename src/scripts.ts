const boxContainer = document.querySelector('.box-container');
const colors = ['aqua', 'crimson', 'blue'];
const colorsPickList = [...colors, ...colors]; //combine array into a signle one
const boxCount = colorsPickList.length;

//Game state
let revealedCount = 0; //user score (how many boxex opened)
let activeBox: HTMLElement = null; //cliked box
let awaitingEndOfMove = false; //if true that user awaits the two clicked boxes to be reversed


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
                console.log('WIN! Refresh to play again.');
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

// Build up boxes
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
    

