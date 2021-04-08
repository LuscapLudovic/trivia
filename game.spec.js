require('./game.js');

/**
 * Test pour voir si les tests se lancent correctement
 */
describe("The test environment", function() {
    it("should pass", function() {
        expect(true).toBe(true);
    });
});

/**
 * Test de creation d'un jeu
 * @param Boolean true
 */
describe("Game creation", function(techno = true) {
    game = new Game(techno)

    it("should create a game with techno questions ", function() {
        expect(game).toBeDefined();
    })
});

/**
 * Test de creation d'un jeu
 * @param Boolean false
 */
describe("Game creation", function(techno = false) {
    game = new Game(techno)

    it("should create a game with rock questions ", function() {
        expect(game).toBeDefined();
    })
});




/**
 * Test de creation d'un joueur avec un nom
 *  * @param String name
 */
describe("Player creation", function(name) {
    jackie = new Player(name)

    it("should create a player named ", function() {
        expect(jackie.name).toBe(name);
    })
});

/**
 * Test de creation d'un joueur sans nom
 */
describe("Player creation", function() {
    jackie = new Player()

    it("should create a player not named ", function() {
        expect(jackie.name).toBeUndefined();
    })
});