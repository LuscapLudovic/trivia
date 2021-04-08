exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Player = class {
    name;
    gold = 0;
    place = 0;
    isOnPrison = false;

    constructor(name) {
        this.name = name;
    }
}

/**
 * setup a game
 * @param isTechno if the theme selected is 'Techno' else it's the 'Rock' theme
 * @constructor
 */
exports.Game = function(isTechno = false) {
    let players          = [];
    let places           = new Array(6);
    let purses           = new Array(6);
    let inPenaltyBox     = new Array(6);

    let popQuestions     = [];
    let scienceQuestions = [];
    let sportsQuestions  = [];
    let rockQuestions    = [];
    let technoQuestions = [];

    let currentPlayer    = 0;
    let isGettingOutOfPenaltyBox = false;

    let didPlayerWin = function(){
        return !(players[currentPlayer].gold === 6)
    };

    /**
     * Return the theme of the question ask to the current player
     * @returns {string} the theme of the question
     */
    let currentCategory = function(){

        // the number of theme of questions
        let nbTypeQuestions = 4;

        switch (places[currentPlayer] % nbTypeQuestions) {
            case 0:
                return 'Pop';
            case 1:
                return 'Science';
            case 2:
                return 'Sports';
            default :
                return (isTechno) ? 'Techno' : 'Rock';
        }
    };

    // generate all question for each theme used in this game
    for(let i = 0; i < 50; i++){
        popQuestions.push("Pop Question "+i);
        scienceQuestions.push("Science Question "+i);
        sportsQuestions.push("Sports Question "+i);
        if (isTechno) {
            technoQuestions.push("Techno Question "+i);
        }else {
            rockQuestions.push("Rock Question "+i);
        }
    }

    /**
     * Return if the game respect the constraint to launch a game
     * @returns {boolean} if constraints is correct
     */
    this.isPlayable = function(){
        let numberPlayers = this.howManyPlayers()
        return numberPlayers >= 2 && numberPlayers <=6;
    };

    this.add = function(player){
        players.push(player);

        console.log(player.name + " was added");
        console.log("They are player number " + players.length);

        return true;
    };

    /**
     * Return the number of players
     * @returns {number} number of players
     */
    this.howManyPlayers = function(){
        return players.length;
    };

    // Print the current question
    let askQuestion = function(){
        switch (currentCategory()) {
            case 'Pop':
                console.log(popQuestions.shift());
                break;
            case 'Science':
                console.log(scienceQuestions.shift());
                break;
            case 'Sports':
                console.log(sportsQuestions.shift());
                break;
            case "Rock":
                console.log(rockQuestions.shift());
                break;
            case "Techno":
                console.log(technoQuestions.shift());
        }
    };

    this.roll = function(roll){
        console.log(players[currentPlayer].name + " is the current player");
        console.log("They have rolled a " + roll);

        if(players[currentPlayer].isOnPrison){
            if(roll % 2 != 0){
                players[currentPlayer].isOnPrison = false;

                this.move(roll);
            }else{
                console.log(players[currentPlayer].name + " is not getting out of the penalty box");
            }
        }else{
            this.move(roll)
        }
    };

    this.move = function(roll) {
        players[currentPlayer].place += roll;
        if(players[currentPlayer].place > 11){
            players[currentPlayer].place -= - 12;
        }

        console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
        console.log("The category is " + currentCategory());
        askQuestion();
    }

    this.wasCorrectlyAnswered = function(){
        if(players[currentPlayer].isOnPrison) {
            this.nextPlayer();
            return true;
        } else {
            console.log('Answer was correct!!!!');
            players[currentPlayer].gold += 1;
            console.log(players[currentPlayer].name + " now has " +
                players[currentPlayer].gold  + " Gold Coins.");

            let winner = didPlayerWin();

            if (!winner) {
                console.log(players[currentPlayer].name + " has won !!!! ")
            }

            this.nextPlayer();

            return winner;
        }
    };

    this.wrongAnswer = function(){
        console.log('Question was incorrectly answered');
        console.log(players[currentPlayer].name + " was sent to the penalty box");
        players[currentPlayer].isOnPrison = true;

        this.nextPlayer();

        return true;
    };

    this.nextPlayer = function() {
        currentPlayer += 1;
        if(currentPlayer === players.length)
            currentPlayer = 0;

    }

};

let notAWinner = false;

let input;

// while the user didn't input the selected theme
do{
    // ask to the user to input the selected theme
    input = prompt("Voulez-vous choisir la catégorie Rock ou Techno ?");
}while(input.toLowerCase() !== "Rock".toLowerCase() && input.toLowerCase() !== "Techno".toLowerCase())

let isTechno = (input.toLowerCase() === 'techno')

let game = new Game(isTechno);

let names = ["Chet", "Pat", "Sue", "Pierre", "Paul", "Jacques", "Jean", "Tom"];
let players = [];
for (let i=0; i < 3 ; i++) {
    let player = new Player(names[i]);
    players.push(player);
}

players.forEach( (player) => {
    game.add(player);
})

// if the game is playable
if (game.isPlayable()) {
    do{

        game.roll(Math.floor(Math.random()*6) + 1);

        if(Math.floor(Math.random()*10) === 7){
            notAWinner = game.wrongAnswer();
        }else{
            notAWinner = game.wasCorrectlyAnswered();
        }

    }while(notAWinner);

} else {
    console.log("Le nombre de joueur est incorrect, il doit etre compris entre 2 et 6.");
}
