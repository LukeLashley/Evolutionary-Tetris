let weights = [];
const moveLimit = 500;
class Child {
    constructor(weights) {
        this.holeWeight = Math.random() - .5;
        this.heightWeight = Math.random() - .5;
        this.maxHWeight = Math.random() - .5;
        this.rWeight = Math.random();
        this.pWeight = Math.random();
        if(weights != null) {
            this.weights = weights;
        }else {
            this.weights = [this.holeWeight, this.heightWeight, this.maxHWeight, this.rWeight, this.pWeight]
        }
        this.averageScores = 0;
        this.bestScorer;
        this.bestScore = 0;
        this.scores = [];
       
    }


    runGame() {
        for(let i = 0; i < 10; i++) {
            this.game = new Game();
            console.log("game" + i);
            while(!this.game.end) {
                this.chooseBestMove();    
            }
            this.scores[i] =  this.game.score;
            if(this.game.score > this.bestScore) {
                this.bestScorer = this.game;
                this.bestScore = this.game.score;
            }
        }
        for(let i = 0; i < this.scores.length; i++) {
            this.averageScores += this.scores[i];
        }
        this.averageScores = this.averageScores/10;
        this.game = this.bestScorer;
    }
    getScore(hole, heightS, mHeight, rClear) {
        return this.holeWeight * hole
            + this.heightWeight * heightS
            + this.maxHWeight * mHeight
            + this.rWeight * rClear;
            // + this.pWeight * pInc;
    }
    mutate(rate) {
        for(let x = 0; x < weights.length;x++) {
            if (Math.random() < rate) {
                if (Math.random() < .5) {
                    weights[x] += Math.random() * (1 - weights[x]);
                }
                else {
                    weights[x] -= Math.random() * (1 - weights[x]);
    
                }
            }
    
        }
    }

    crossover(parent2) {
        let child = new Child();
        for (let i = 0; i < weights.length; i++) {
            if (Math.random() < .5) {
                child.weights[i] = parent2.weights[i];
            } else {
                child.weights[i] = this.weights[i];
            }
        }
        return child;
    }

    fitness() {
        return this.averageScores;
    }

    chooseBestMove() {

        if(this.game.end) {
            return;
        }
        let movesToTry = [];
        let finishedMoves = [];
        let numRot = 4;
        this.game.g.getHeights();
        let max = this.game.g.maxHeight();
        let gamePiece = this.game.currentPiece;
        if (gamePiece.originalShape == O) {
            numRot = 1;
        } else if (gamePiece.originalShape == I || gamePiece.originalShape == S || gamePiece.originalShape == Z) {
            numRot = 2;
        }
        
        for (let m = 1; m <= numRot; m++) {
            let tempGridCopy = new Grid();
            tempGridCopy.copy(this.game.g);
            let tempPiece = new Piece(gamePiece.originalShape, 0, 60, this.game.currentPiece.color, this.game.currentPiece.num, tempGridCopy, m)
            tempPiece.shape.forEach((x, i) => x.forEach((e, j) => {
                if (e) {
                    tempPiece.grid.removePoint(e.y, e.x);
                }
            }))
            for (let row = 19; row >= 0; row--) {
                for (let col = 0; col < 10; col++) {
                    this.revert = false;
                    let tempGridCopy2 = new Grid();
                    tempGridCopy2.copy(tempPiece.grid);
                    let currPiece = new Piece(this.game.currentPiece.originalShape, 0, 60, this.game.currentPiece.color, this.game.currentPiece.num, tempGridCopy2, m);
                    currPiece.shape.forEach((x, i) => x.forEach((e, j) => {
                        if (e) {
                            //if (currPiece.grid.pointExist(row * 20 + (currPiece.y - e.y), col * 20 + (currPiece.x - e.x), e)) {
                            if (currPiece.grid.pointExist(row * 20 + (e.y - currPiece.y), col * 20 + (e.x - currPiece.x), e)) {
                                this.revert = true;
                            }
                        }
                    }))
                    currPiece.shape.forEach((x, i) => x.forEach((e, j) => {
                        if (e) {
                           currPiece.grid.removePoint(e.y, e.x);
                        }
                    }))
                    if (!this.revert) {
                        currPiece.shape.forEach((x, i) => x.forEach((e, j) => {
                            if (e) {
                                //e.x = col * 20 + (currPiece.x - e.x);
                                //e.y = row * 20 + (currPiece.y - e.y);
                                e.x = col * 20 + (e.x - currPiece.x);
                                e.y = row * 20 + (e.y - currPiece.y);
                                currPiece.grid.addPoint(e.y, e.x, e);
                            }
                        }))

                        currPiece.y = row * 20;
                        currPiece.x = col * 20;
                        
                        if (!currPiece.moveDown())
                            finishedMoves.push(currPiece);
                    }
                }
            }
        }
        
        let paths = []
        
        // find path from move to starting location.
        let current = null
        let path = null
        let reachedTop = false
        let found = false
        let aGrid = new Grid()
        
        function findPath() {
            current.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                if (e.y - 20 < 0) {
                    //found = true
                    reachedTop = true
                }
            }}))
            if (found) { //(revert)
                return
            }
            
            if (reachedTop) {
                let furthestLeftX = current.x
                current.shape.forEach( (x, i) => x.forEach( (e, j) => { if (e) {
                    if (e.x < furthestLeftX)
                        furthestLeftX = e.x
                }}))
                
                if (furthestLeftX == 60) {
                    found = true
                    return
                }
                else if (furthestLeftX > 60) {
                    if (current.moveLeft()) {
                        path.push(2)
                        findPath()
                    }
                }
                else {
                    if (current.moveRight()) {
                        path.push(3)
                        findPath()
                    }
                }
                return
            }
            
            if (current.moveUp()) {
                path.push(1)
                findPath()
            } 
            else {
                let tempPath = []
                let pathGrid = new Grid();
                pathGrid.copy(current.grid);
                let tempPieceMoving = new Piece(current.originalShape,current.x,current.y,current.color,current.num,pathGrid)//, current.numRotate);
                tempPieceMoving.copy(current);
                let validPathLeft = false;
                let validPathRight = false;
                
                while (!validPathLeft && tempPieceMoving.moveLeft()) {
                    tempPath.push(2)
                    if (tempPieceMoving.moveUp()) {
                        tempPath.push(1)
                        validPathLeft = true
                    }
                }
                
                if (validPathLeft) {
                    path.concat(tempPath) // the temp path was CORRECT. add its moves to the path.
                    current = tempPieceMoving // current piece NEEDS TO HAVE TAKEN THE PATH OF THE TEMP PIECE.
                }
                else {
                    while (!validPathRight && current.moveRight()) {
                        path.push(3)
                        if (current.moveUp()) {
                            path.push(1)
                            validPathRight = true
                        }
                    }
                }
                if (validPathLeft || validPathRight) {
                    findPath()
                }
            }
        }
        
        function doFindPath(thePiece) {
            aGrid = new Grid();
            aGrid.copy(thePiece.grid);
            current = new Piece(thePiece.originalShape,thePiece.x,thePiece.y,thePiece.color,thePiece.num,aGrid) //,thePiece.numRotate);
            current.copy(thePiece);
            try{
            current.numRotate = thePiece.numRotate
            } catch(err) {
                console.log(err);
                console.log(current);
                console.log(thePiece);
                console.log(current.numRotate);
                console.log(thePiece.numRotate);
                while(this.game.currentPiece.moveDown());
                this.game.getNewPiece();
                this.chooseBestMove();
                return;

            }
            path = []
            reachedTop = false
            found = false
            findPath()
        }
                
        for (let x = 0; x < finishedMoves.length; x++) {
            doFindPath(finishedMoves[x])
            paths[x] = path
            if (!found) {
                finishedMoves[x] = null
                //paths[x] = null
            }
        }
        for(let x = 0; x < finishedMoves.length; x++) {
            let exist = false;
            if(finishedMoves[x] != null) {
                exist = true;
                break;
            }
            while(this.game.currentPiece.moveDown());
            this.game.getNewPiece();
            this.chooseBestMove();
            return;

        }
        // use only finishedMoves with valid paths before picking the best move
        
        let maxScore = 0;
        let maxScoreLoc = -1;
        
        for(let x = 0; x < finishedMoves.length; x++) {
            if (finishedMoves[x] != null) {
                let current = finishedMoves[x].grid;
                current.getHeights();
                let holes = current.countHoles()
                let result = this.getScore(holes,
                current.heightSTD(),
                current.maxHeight(),
                current.countRowsCleared())
                current.value = result;
                if (current.value > maxScore || maxScoreLoc == -1) {
                    //console.log(current.value + ">" + maxScore);
                    maxScoreLoc = x;
                    maxScore = result;
                    //console.log(finishedMoves[maxScoreLoc]);
                }
            }
        }
        
        //current = finishedMoves[maxScoreLoc]
        
        path = paths[maxScoreLoc]
        try {
        for (let i = 0; i < finishedMoves[maxScoreLoc].numRotate - 1; i++) {
            this.game.currentPiece.rotation();
        }
    } catch(err) {
        console.log(err);
        console.log(finishedMoves);
        console.log(finishedMoves[maxScoreLoc])
        while(this.game.currentPiece.moveDown());
        this.game.getNewPiece();
        this.chooseBestMove();
        return;
    }
                
        
        for(let x = path.length -1 ; x >= 0; x--) {
            let c = path[x];
            if(c == 1) {
                this.game.currentPiece.moveDown();
                this.game.score++;
            } else if(c == 3) {
                this.game.currentPiece.moveLeft();
            } else if(c == 2) {
                this.game.currentPiece.moveRight();
            }
        }
        this.game.currentPiece.moveDown();
        if(!this.game.currentPiece.moveDown()) {
            this.game.getNewPiece();
            this.chooseBestMove();
            // setTimeout(() => { this.chooseBestMove(); }, 10);
            
        }
        //console.log(maxScoreLoc+","+maxScore);
    }
    
}

