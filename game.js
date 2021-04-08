exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Player = class {
    name;
    gold = 0;
    place = 0;
    isOnPrison = false;
    isPresent = true;
    hasJoker = true;

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

    let popQuestions     = [];
    let scienceQuestions = [];
    let sportsQuestions  = [];
    let rockQuestions    = [];
    let technoQuestions = [];

    let currentPlayer    = 0;

    let winner = false;
    let goldToWin;

    let didPlayerWin = function(){
        return (players[currentPlayer].gold >= goldToWin)
    };

    this.hasWinner = function () {
        return winner;
    }

    this.setGoldToWin = function(_goldToWin){
        goldToWin = _goldToWin
    }

    this.playersIsPresent = function() {
        let aPlayerIsPresent = false;
        players.forEach((player) => {
            if (player.isPresent) aPlayerIsPresent = true;
        });
        return aPlayerIsPresent;
    }

    let launchDice = function() {
        return Math.floor(Math.random()*10);
    }

    /**
     * Return the theme of the question ask to the current player
     * @returns {string} the theme of the question
     */
    let currentCategory = function(){

        // the number of theme of questions
        let nbTypeQuestions = 4;

        switch (players[currentPlayer].place % nbTypeQuestions) {
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
        if (players[currentPlayer].isPresent) {

            console.log(players[currentPlayer].name + " is the current player");
            if (confirm('Voulez-vous continuer a jouer ?')) {
                console.log("They have rolled a " + roll);

                if(players[currentPlayer].isOnPrison){
                    if(roll % 2 !== 0){
                        players[currentPlayer].isOnPrison = false;

                        this.move(roll);
                    }else{
                        console.log(players[currentPlayer].name + " is not getting out of the penalty box");
                    }
                }else{
                    this.move(roll)
                }

                if (players[currentPlayer].hasJoker && confirm("Voulez-vous utiliser votre joker")) {
                    players[currentPlayer].hasJoker = false;
                    winner = this.wasCorrectlyAnswered(false);
                } else {
                    if(launchDice() === 7){
                        this.wrongAnswer();
                    }else{
                        winner = this.wasCorrectlyAnswered(true);
                    }
                }

            } else {
                console.log(players[currentPlayer].name + " stop playing");
                players[currentPlayer].isPresent = false;
            }

        } else {
            this.nextPlayer();
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

    this.wasCorrectlyAnswered = function(earnGold = true){
        if(players[currentPlayer].isOnPrison) {
            this.nextPlayer();
            return false;
        } else {
            console.log('Answer was correct!!!!');
            if (earnGold) {
                players[currentPlayer].gold += 1;
                console.log(players[currentPlayer].name + " now has " +
                    players[currentPlayer].gold  + " Gold Coins.");

            } else {
                console.log("no gold win");
            }

            let winner = didPlayerWin();

            if (winner) {
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
    };

    this.nextPlayer = function() {
        currentPlayer += 1;
        if(currentPlayer === players.length)
            currentPlayer = 0;

    }

};

let input;
let inputGold;

setTimeout(() => {

     // while the user didn't enter necessary gold to win
    do{
        // ask to the user to input the number of gold 
        inputGold = prompt("Entrez le nombre de gold nécessaire (minimum 6)");
        parseInt(inputGold);
    }while(inputGold < 6 )

    // while the user didn't input the selected theme
    do{
        // ask to the user to input the selected theme
        input = prompt("Voulez-vous choisir la catégorie Rock ou Techno ?");
    }while(input.toLowerCase() !== "Rock".toLowerCase() && input.toLowerCase() !== "Techno".toLowerCase())

    let isTechno = (input.toLowerCase() === 'techno')

    let game = new exports.Game(isTechno);
    game.setGoldToWin(inputGold)
    let names = ["Chet", "Pat", "Sue", "Pierre", "Paul", "Jacques", "Jean", "Tom"];
    let players = [];
    for (let i=0; i < 3 ; i++) {
        let player = new Player(names[i]);
        players.push(player);
    }

    players.forEach((player) => {
        game.add(player)
    })
    

// if the game is playable
    if (game.isPlayable()) {
        do{

            if (game.playersIsPresent()){
                game.roll(Math.floor(Math.random()*6) + 1);
            } else {
                console.log("All players has left the game.");
                break;
            }

        }while(!game.hasWinner());

    } else {
        console.log("Le nombre de joueur est incorrect, il doit etre compris entre 2 et 6.");
    }
}, 100);

