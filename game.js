exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Player = class {
    name;
    gold = 0;
    bonusGold = 0;
    place = 0;
    isOnPrison = false;
    casierJudiciaire = 0;

    isPresent = true;
    hasJoker = true;
    hasWin = false;

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

    let popQuestions     = 0;
    let scienceQuestions = 0;
    let sportsQuestions  = 0;
    let rockQuestions    = 0;
    let technoQuestions = 0;
    let nextQuestion = -1;

    let currentPlayer    = 0;

    let winners = [];
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

    let selectCategory = function(){
        do{
            input = prompt("Selectionner une catégorie : \n 1 - Pop \n 2 - Science \n 3 - Sports \n 4 - Techno/Rock");
        }while(input <= 1 && input >= 4)
        switch (input) {
            case "1":
                return 'Pop';
            case "2":
                return 'Science';
            case "3":
                return 'Sports';
            case "4":
                return (isTechno) ? 'Techno' : 'Rock';
            default:
                return selectCategory();
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
        let category = (nextQuestion === -1) ? currentCategory() : nextQuestion
        switch (category) {
            case 'Pop':
                console.log('Pop Question ' + ++popQuestions);
                break;
            case 'Science':
                console.log('Science Question ' + ++scienceQuestions);
                break;
            case 'Sports':
                console.log('Sports Question ' + ++sportsQuestions);
                break;
            case "Rock":
                console.log('Rock Question ' + ++rockQuestions);
                break;
            case "Techno":
                console.log('Techno Question ' + ++technoQuestions);
        }
        nextQuestion = -1
    };

    /**
     * A turn for a player
     * @param roll the value of the dice
     */
    this.roll = function(roll){
        if (players[currentPlayer].isPresent && !players[currentPlayer].hasWin) {
            console.log("------------------------------------------------------------");
            console.log(players[currentPlayer].name + " is the current player");


            if (confirm('Voulez-vous continuer a jouer ?')) {
                console.log("They have rolled a " + roll);

                // Verification for the prison Statut of the player
                if(players[currentPlayer].isOnPrison){
                    let chance = Math.floor(Math.random()*players[currentPlayer].casierJudiciaire) + 1;
                    console.log("--------chance : " + chance);
                    if( chance === 1){
                        players[currentPlayer].isOnPrison = false;
                        this.move(roll);
                    }else{
                        console.log(players[currentPlayer].name + " is not getting out of the penalty box");
                    }
                }else{
                    this.move(roll)
                }

                if(!players[currentPlayer].isOnPrison) {
                    // management of the joker
                    if (players[currentPlayer].hasJoker && confirm("Voulez-vous utiliser votre joker")) {
                        console.log("Le joker a été utilisé");
                        players[currentPlayer].hasJoker = false;
                        winner = this.wasCorrectlyAnswered(false);
                    } else {
                        if(launchDice() === 7){
                            this.wrongAnswer();
                        }else{
                            winner = this.wasCorrectlyAnswered(true);
                        }
                    }
                }else {
                    this.nextPlayer();
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
        let category = (nextQuestion === -1) ? currentCategory() : nextQuestion
        console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
        console.log("The category is " + category);
        askQuestion();
    }

    this.wasCorrectlyAnswered = function(earnGold = true){
        if(players[currentPlayer].isOnPrison) {
            this.nextPlayer();
            return false;
        } else {
            console.log('Answer was correct!!!!');
            if (earnGold) {
                players[currentPlayer].gold += players[currentPlayer].bonusGold++ + 1;
                console.log(players[currentPlayer].name + " now has " +
                    players[currentPlayer].gold  + " Gold Coins.");
            } else {
                console.log("no gold win");
                players[currentPlayer].bonusGold = 0;
            }

            let winner = didPlayerWin();

            if (winner) {
                console.log(players[currentPlayer].name + " has won !!!! ")
                players[currentPlayer].hasWin = true;
                winners.push(players[currentPlayer]);
                if (winners.length !== 3 && winners.length !== players.length) {
                    winner = false;
                }
            }
            this.nextPlayer();

            return winner;
        }
    };

    /**
     * When the user has the wrong anwser
     */
    this.wrongAnswer = function(){
        console.log('Question was incorrectly answered');
        console.log(players[currentPlayer].name + " was sent to the penalty box");
        nextQuestion = selectCategory();
        players[currentPlayer].isOnPrison = true;
        players[currentPlayer].bonusGold = 0;
        players[currentPlayer].casierJudiciaire++;
        this.nextPlayer();
    };

    /**
     * Go to the next player
     */
    this.nextPlayer = function() {
        currentPlayer += 1;
        if(currentPlayer === players.length)
            currentPlayer = 0;

    }

    this.showLeaderboard = function () {
        console.log(winners);
        console.log("--------- Leaderboard ---------")
        winners.forEach((winner, index) => {
            console.log((index + 1) + "- " + winner.name);
        })
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

    let replay;
    do {

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
        });

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

            game.showLeaderboard();

        } else {
            console.log("Le nombre de joueur est incorrect, il doit etre compris entre 2 et 6.");
        }

        replay = confirm("Rejouez ?");

    }while(replay);

}, 100);

