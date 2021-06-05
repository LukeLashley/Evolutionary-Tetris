class Grid {
    constructor() {
        this.rowHeights = [];
        this.grid = [];
        this.tempRowsCleared = 0;
        this.fillGrid();
        this.mean = 0;
        this.maxVal = 0;
        this.value = 0;
    }


    copy(grid2) {
        this.rowHeights = [];
        for(let i = 0; i < 20; i ++) {
            for(let j = 0; j < 10; j++) {
                this.grid[i][j] = grid2.grid[i][j];
            }
        }
    }
    addPoint(x, y, p) {
        this.grid[x / 20][y / 20] = p;
    }
    removePoint(x, y) {
        this.grid[x / 20][y / 20] = 0;
    }
    pointExist(x, y, e) {
        if (x < 0 || x > 380 || y < 0 || y > 180) {
            return true;
        }
        if (this.grid[x / 20][y / 20] != 0) {
            if (this.grid[x / 20][y / 20].parent != e.parent)
                return true;
        }
        return false;
    }

    fillGrid() {
        for (let i = 0; i < 20; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 10; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    getGrid() {
        return this.grid;
    }

    countHoles() {
        // Copy the grid to a temporary array
        let temp = [];
        let emptyArea = true

        for (let i = 0; i < 20; i++)
            temp[i] = this.grid.slice()

        // Marks all squares in a hole as -1 to count them
        function floodFill(i, j) {
            if (i < 0 || i >= 20 || j < 0 || j >= 10 || temp[i][j] !== 0)
                return

            temp[i][j] = -1
            if (emptyArea)
                temp[i][j] = -2

            floodFill(i, j - 1)
            floodFill(i + 1, j)
            floodFill(i, j + 1)
            floodFill(i - 1, j)
        }

        let holecount = 0

        // Upon finding an empty, uncounted square, flood fill the hole.
        // Count all squares that are part of a hole.
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (temp[i][j] === 0) {
                    floodFill(i, j)
                    emptyArea = false
                }
                if (temp[i][j] == -1)
                    holecount++
            }
        }

        return holecount
    }

    getHeights() {
        for (let i = 0; i < 10; i++) {
            this.rowHeights[i] = 0;
            for (let j = 0; j < 20; j++) {
                if (this.grid[j][i] != 0) {
                    this.rowHeights[i] = 19 - j;
                    this.mean += 19 - j;
                    if((19 - j) > this.maxVal) {
                        this.maxVal = 19 - j;
                    }
                    break;
                }
            }
        }
        this.mean = this.mean / 10;
    }

    heightSTD() {
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += Math.pow(this.rowHeights[i] - this.mean, 2.0);
        }
        return sum / 10;
    }

    maxHeight() {
        return this.maxVal;
    }

    countRowsCleared() {
        let rowsCleared = 0;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.grid[i][j] == 0) {
                    break;
                }
                if (j == 9) {
                    rowsCleared++;
                    for (let j = 0; j < 10; j++) {
                        this.grid[i][j] = 0;
                    }
                }
            }
        }
        return rowsCleared;
    }

}