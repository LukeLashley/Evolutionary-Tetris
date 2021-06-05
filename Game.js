class Game {
    constructor() {
        this.mean = 0;
        this.num = 0;
        this.score = 0;
        this.started = false;
        this.currentPiece;
        this.nextPiece;
        this.displayPiece;
        this.end = false;
        this.level = 1;
        this.score = 0;
        this.oldScore = 0;
        this.totalCleared = 0;
        this.totalMoves = 0;
        this.pieces = [O, L, I, J, S, T, Z];
        this.colors = [blue, green, yellow, orange, red]
        this.levels = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3];
        this.g = new Grid();
        this.getNewPiece();
        //var timerObj1 = setInterval(this.applyGravity(), 1000);
        //this.timer = new Timer(this.applyGravity(), (this.levels[this.level] / 60) * 1000);
        this.started = true;

    }
    applyGravity() {
        if (!this.currentPiece.moveDown()) {
            this.getNewPiece();
        }

    }



    getNewPiece() {
        this.totalMoves++;
        if(this.totalMoves >= moveLimit ) {
            this.end = true;
        }
        if (!this.end) {
            let p = this.pieces[Math.floor(Math.random() * this.pieces.length)];
            if (!this.nextPiece) {
                this.nextPiece = new Piece(p, 60, 0, color = this.colors[0], this.num, this.g)
            }
            this.num++;
            this.checkForRows();
            this.nextPiece.shape.forEach((x, i) => x.forEach((e, j) => {
                if (e) {
                    if (this.g.pointExist(e.y,e.x,e)) {
                        this.gameOver();

                    }
                }
            }))
            this.currentPiece = this.nextPiece;
            let cind = Math.floor(Math.random() * this.colors.length);
            this.nextPiece = new Piece(p, 60, 0, this.colors[cind], this.num, this.g)
            this.displayPiece = new Piece(p, 225, 60, this.colors[cind], this.num, this.g);
        }
        //console.log(this.g.grid);
        return this.nextPiece;
    }



    checkForRows() {
        this.rowsCleared = 0;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.g.getGrid()[i][j] == 0) {
                    break;
                }
                if (j == 9) {
                    this.rowsCleared++;
                    for (let j = 0; j < 10; j++) {
                        this.g.getGrid()[i][j] = 0;
                    }

                    for (let i1 = i; i1 > 0; i1--) {
                        for (let j1 = 0; j1 < 10; j1++) {
                                this.g.getGrid()[i1][j1] = this.g.getGrid()[i1 - 1][j1];
                                if(this.g.grid[i1][j1] != 0) {
                                    this.g.grid[i1][j1].y += 20;

                                }

                        }
                    }
                }
            }
        }
        switch (this.rowsCleared) {
            case 1:
                this.score += 40*this.level;
                break;
            case 2:
                this.score += 100*this.level;
                break;
            case 3:
                this.score += 300*this.level;
                break;
            case 4:
                this.score += 1200*this.level;
                break;
        }
        this.tempRowsCleared = this.rowsCleared;
        this.totalCleared += this.rowsCleared;
        if (this.totalCleared / this.level > 10) {
            this.level++;
        }
    }

    displayRows() {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.g.getGrid()[i][j] != 0) {
                    this.g.getGrid()[i][j].show();
                }
            }
        }
    }

    gameOver() {
        this.end = true;
    }

    


}

function Timer(fn, t) {

    var timerObj = setInterval(fn, t);

    this.stop = function () {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }

    // start timer using current settings (if it's not already running)
    this.start = function () {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    }

    // start with new or original interval, stop current interval
    this.reset = function (newT = t) {
        t = newT;
        return this.stop().start();
    }
}
