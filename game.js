exports = typeof window !== "undefined" && window !== null ? window : global;

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
        return !(purses[currentPlayer] === 6)
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

    this.add = function(playerName){
        players.push(playerName);
        places[this.howManyPlayers() - 1] = 0;
        purses[this.howManyPlayers() - 1] = 0;
        inPenaltyBox[this.howManyPlayers() - 1] = false;

        console.log(playerName + " was added");
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
        console.log(players[currentPlayer] + " is the current player");
        console.log("They have rolled a " + roll);

        if(inPenaltyBox[currentPlayer]){
            if(roll % 2 != 0){
                isGettingOutOfPenaltyBox = true;

                console.log(players[currentPlayer] + " is getting out of the penalty box");
                places[currentPlayer] = places[currentPlayer] + roll;
                if(places[currentPlayer] > 11){
                    places[currentPlayer] = places[currentPlayer] - 12;
                }

                console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
                console.log("The category is " + currentCategory());
                askQuestion();
            }else{
                console.log(players[currentPlayer] + " is not getting out of the penalty box");
                isGettingOutOfPenaltyBox = false;
            }
        }else{

            places[currentPlayer] = places[currentPlayer] + roll;
            if(places[currentPlayer] > 11){
                places[currentPlayer] = places[currentPlayer] - 12;
            }

            console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
            console.log("The category is " + currentCategory());
            askQuestion();
        }
    };

    this.wasCorrectlyAnswered = function(){
        if(inPenaltyBox[currentPlayer]){
            if(isGettingOutOfPenaltyBox){
                console.log('Answer was correct!!!!');
                purses[currentPlayer] += 1;
                console.log(players[currentPlayer] + " now has " +
                    purses[currentPlayer]  + " Gold Coins.");

                var winner = didPlayerWin();
                currentPlayer += 1;
                if(currentPlayer == players.length)
                    currentPlayer = 0;

                return winner;
            }else{
                currentPlayer += 1;
                if(currentPlayer == players.length)
                    currentPlayer = 0;
                return true;
            }



        }else{

            console.log("Answer was correct!!!!");

            purses[currentPlayer] += 1;
            console.log(players[currentPlayer] + " now has " +
                purses[currentPlayer]  + " Gold Coins.");

            var winner = didPlayerWin();

            currentPlayer += 1;
            if(currentPlayer == players.length)
                currentPlayer = 0;

            return winner;
        }
    };

    this.wrongAnswer = function(){
        console.log('Question was incorrectly answered');
        console.log(players[currentPlayer] + " was sent to the penalty box");
        inPenaltyBox[currentPlayer] = true;

        currentPlayer += 1;
        if(currentPlayer == players.length)
            currentPlayer = 0;
        return true;
    };
};

var notAWinner = false;

let input;

// while the user didn't input the selected theme
do{
    // ask to the user to input the selected theme
    input = prompt("Voulez-vous choisir la catégorie Rock ou Techno ?");
}while(input.toLowerCase() !== "Rock".toLowerCase() && input.toLowerCase() !== "Techno".toLowerCase())

let isTechno = (input.toLowerCase() === 'techno')

let game = new Game(isTechno);

game.add('Chet');
game.add('Pat');
game.add('Sue');

// if the game is playable
if (game.isPlayable()) {
    do{

        game.roll(Math.floor(Math.random()*6) + 1);

        if(Math.floor(Math.random()*10) == 7){
            notAWinner = game.wrongAnswer();
        }else{
            notAWinner = game.wasCorrectlyAnswered();
        }

    }while(notAWinner);

} else {
    console.log("Le nombre de joueur est incorrect, il doit etre compris entre 2 et 6.");
}
