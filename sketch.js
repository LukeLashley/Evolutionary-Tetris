
let population;
let newGen;
let next = false; // Determines if it should load (numGenToRunOnNext) more generation(s)
const numGenToRunOnNext = 1;
let count =0;
function setup() {
    createCanvas(375, 400);
    population = new Population(.05,150); //Mutate chance, Population size
    newGen = createButton("Next Generation");
    console.log(population);
    newGen.mousePressed(nextGame);
    //nextPiece = new Piece(L);

}
function draw() {
    background(220);
        let curPopGame = population.bestChild;
        fill(0,0,0)
        //Score Values
        text("score: " + curPopGame.bestScorer.score, 205, 10);
        text("level: " + curPopGame.bestScorer.level, 205, 20);
        text("Cleared: " + curPopGame.bestScorer.totalCleared, 205, 30);
        text("Generation: " + population.generationNumber,205, 40);
        text("next piece: ", 205, 50);
        text("Hole weight: " + curPopGame.holeWeight, 205, 150);
        text("Height STD weight: " + curPopGame.heightWeight, 205, 160);
        text("Max Height weight: " + curPopGame.maxHWeight, 205, 170);
        text("Rows weight: " + curPopGame.rWeight, 205, 180);
        text("Total moves: " + curPopGame.bestScorer.totalMoves, 205, 190);

    if(next) {
        if(count > numGenToRunOnNext) {
            next = false;
            count =0 ;
        }
        population.newGen();
        count++;
    }

    //vertical lines
    for (let i = 0; i <= 10; i++) {
        line(i * 20, 0, i * 20, 400)
    }
    //horizontal lines
    for (let i = 0; i <= 20; i++) {
        line(0, i * 20, 200, i * 20)
    }
    
    curPopGame.bestScorer.currentPiece.show();
    curPopGame.bestScorer.displayPiece.show();
    curPopGame.bestScorer.displayRows();

}

function nextGame() {
    next = true;
}


function keyPressed() { //Control for playing when a user is playing, I designed this for testing.
    // if (!population.games[0].end) {
    //     if (keyCode === UP_ARROW)
    //         population.games[0].currentPiece.rotation()
    //     if (keyCode === RIGHT_ARROW) {
    //         population.games[0].currentPiece.moveRight();
    //     }
    //     if (keyCode === LEFT_ARROW)
    //         population.games[0].currentPiece.moveLeft();
    //     if (keyCode === DOWN_ARROW) {
    //         population.games[0].score++;
    //         population.games[0].applyGravity()
    //     }
    //     if (keyCode === 32) {
    //         while (population.games[0].currentPiece.moveDown()) {
    //             population.games[0].score += 2;
    //         }
    //         population.games[0].getNewPiece();


    //     }
    // }

    

}