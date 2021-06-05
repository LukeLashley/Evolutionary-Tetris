//Constants to store the various shapes.
const O = [ [1, 1], 
                [1, 1] 
              ]

const I = [ [0, 1, 0, 0], 
                [0, 1, 0, 0],
                [0, 1, 0, 0], 
                [0, 1, 0, 0]
              ]

const S = [ [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],   
              ]

const Z = [ [1, 1, 0], 
                [0, 1, 1],
                [0, 0, 0]
              ]

const L = [ [1, 0, 0], 
                [1, 0, 0],
                [1, 1, 0]
              ]

const J = [ [0, 0, 1], 
                [0, 0, 1],
                [0, 1, 1]
              ]

const T = [     [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0]
              ]
//Constants for the various tetris colors.
const blue = {r: 3, g:65, b:174}
const green = {r: 114, g:203, b:59}
const yellow = {r:255 , g:213, b:0}
const orange = {r: 255, g:151, b:28}
const red = {r: 255, g:50, b:19}
let pieceColor;
// let colors = [blue,green,yellow,orange,red];

class Piece {
    constructor(originalShape = [[]], x = 0, y = 0, color, num, grid,numRotate = 1) {
        this.originalShape = originalShape; // Original shape is one of those constants above.
        this.pieceColor = color; // Again one of the colors above.
        this.x = x; // The x is the x location of the entire piece, each square builds off of this.
        this.y = y; // The y is the y location of the entire piece, each square builds off of this.
        this.pieceNumber = num; // Stores the piece number to differentiate between various different shapes.
        this.grid = grid; // The grid that this piece is on.
        this.shape = this.fillPiece(originalShape.length);
        this.numRotate = 1 // numRotate;
        for(let i = 0; i < numRotate - 1; i++) {
            this.rotation(); // Rotates however many times as needed.
        }
    }

    copy(piece) { // Copy function for pieces so it wont just be a reference.
        this.shape = [];
        for(let i = 0; i < piece.shape.length; i++) {
            this.shape[i] = piece.shape[i].slice();
        }
    }
    
    fillPiece(pieceLength) { // Fills the piece based off of where there are 1s in the array.
        return Array.from(new Array(pieceLength), (x, i) => 
            Array.from(new Array(pieceLength), (x, j) =>  
            this.originalShape[i][j] === 1 ? new Square(this.x + j * 20, this.y + i * 20, this.pieceColor, this.pieceNumber) : null)
        )
    }

    show() { // Shows this piece on the board.
        this.shape.forEach( x => x.filter( j => j != null).forEach(square => square.show()))
    }
    rotation() { // Rotates this piece. Does show by a reversal and then a transpose.
        this.numRotate++
        this.transpose()
        this.rotate90Degrees()
        this.revert = false;
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
            this.currentX = this.x + j * 20;
            this.currentY = this.y + i * 20;
            if(this.grid.pointExist(this.currentY,this.currentX,e)) {
                this.revert = true;
            }
        }}))
        if(!this.revert) {
            this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                this.grid.removePoint(e.y,e.x);
                e.x = this.x + j * 20; 
                e.y = this.y + i * 20;
                this.grid.addPoint(e.y,e.x,e);
            }}))
        }
        return !this.revert;
    }

    transpose() {
        let dimension = this.shape.length
        let aux = Array.from(new Array(dimension), e => Array.from(new Array(dimension), x => null) )        
        this.shape.forEach( (x, i) => x.forEach( (e, j) => aux [j][i] = e))
        this.shape = aux
    }

    rotate90Degrees() {
        this.shape.reverse()[0].map((column, index) => 
            this.shape.map(row => row[index])
          )
    }

    moveDown() { // Moves the piece down
        this.revert = false;
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
            if(this.grid.pointExist(e.y+20,e.x,e)) { // Checks to see if a piece can go in that location
                this.revert = true;
            }
        }}))
        if(!this.revert) { //If a piece can go in this location
            this.y+=20;
            this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                this.grid.removePoint(e.y,e.x);
                e.y+= 20; 
                this.grid.addPoint(e.y,e.x,e);
            }}))
            
        }

        return !this.revert;
        
    }

    moveUp() { //Moves the piece left
        this.revert = false;
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
            if(this.grid.pointExist(e.y-20,e.x,e)) {
                this.revert = true;
            }
        }}))
        if(!this.revert) {
            this.y-=20;
            this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                this.grid.removePoint(e.y,e.x);
                e.y-= 20;
                this.grid.addPoint(e.y,e.x,e);
            }}))
        }

        return !this.revert;
        
    }

    moveRight() { //Moves the piece right
        this.revert = false;
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
            if(this.grid.pointExist(e.y,e.x+20,e)) {
                this.revert = true;
            }
        }}))
        if(!this.revert) {
            this.x+=20;
            this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                this.grid.removePoint(e.y,e.x);
                e.x+= 20;
                this.grid.addPoint(e.y,e.x,e);
            }}))
       }
        return !this.revert;
    }

    moveLeft() {
        this.revert = false;
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
            if(this.grid.pointExist(e.y,e.x-20,e)) {
                this.revert = true;
            }
        }}))
        if(!this.revert) {
            this.x-=20;
            this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) {
                this.grid.removePoint(e.y,e.x);
                e.x-= 20;
                this.grid.addPoint(e.y,e.x,e);
            }}))
        }
        return !this.revert;
    }

}