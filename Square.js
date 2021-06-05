let sqColor;
class Square {
    constructor(x, y, color = {r:0,g:0,b:0}, parent) {
        this.sqColor = color;
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
    show() { //Displays this square on the board.
        fill(this.sqColor.r,this.sqColor.g,this.sqColor.b);
        square(this.x,this.y,20)
    }
}