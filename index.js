const canvas = document.getElementById('canvas');
const greenOne = '#00ff00';
const greenTwo = '#00e600';
const dirtOne = '#ccccb3';
const dirtTwo = '#c2c2a3';

class Cell {
    constructor(isMine){
        this.revealed = false;
        this.isMine = isMine;
        this.minesContact = 0;
    }

    draw(ctx, i, j, cellSize){
        if( (i + j) % 2 === 0){
            ctx.fillStyle = this.revealed ? dirtOne : greenOne;
        }
        else{
            ctx.fillStyle = this.revealed ? dirtTwo : greenTwo;
        }

        ctx.fillRect(j * 30, i * 30, cellSize, cellSize);
        if(this.revealed && !this.isMine && this.minesContact !== 0){
            switch(this.minesContact){
                case 1 :
                    ctx.fillStyle = 'blue';
                    break;
                case 2 :
                    ctx.fillStyle = 'green';
                    break;
                case 3 :
                    ctx.fillStyle = 'red';
                    break;
                case 4 :
                    ctx.fillStyle = 'purple';
                    break;
                case 5 :
                    ctx.fillStyle = 'crimson';
                    break;
                case 6 :
                    ctx.fillStyle = 'Turquoise';
            }
            ctx.font = 'bold 20px serif';
            ctx.fillText(this.minesContact.toString(),j * 30 + 10, i * 30 + 22);
        }
    }
}

class MineField {
    constructor(numRows, numCols, mineRate, ctx){
        this.numRows = numRows;
        this.numCols = numCols;
        this.mineRate = mineRate;
        this.ctx = ctx;
        this.cellSize = 30;

        this.state = [...Array(numRows)].map(e => {
            return [...Array(numCols)].map(e => {
                return new Cell(Math.random() < mineRate);
            });
        });
        
        //loop through all cells and count the contacting number of mines
        for(let i = 0; i < this.numRows; ++i){
            for(let j = 0; j < this.numCols; ++j){
                if(this.state[i][j].isMine){
                    const topRow = i === 0? 0 : i - 1;
                    const leftCol = j === 0? 0 : j - 1;
                    const botRow = i === this.numRows - 1? this.numRows - 1 : i + 1;
                    const rightCol = j === this.numCols - 1? this.numCols - 1 : j + 1;

                    for(let a = topRow; a <= botRow; a++){
                        for(let b = leftCol; b <= rightCol; ++b){
                            this.state[a][b].minesContact += 1;
                        }
                    }
                }
            }
        }

        canvas.setAttribute('width', this.cellSize * numCols);
        canvas.setAttribute('height',  this.cellSize * numRows);

        this.draw();

        canvas.addEventListener('click', ev => {
            const i = Math.floor((ev.y - canvas.offsetLeft) / this.cellSize);
            const j = Math.floor((ev.x - canvas.offsetTop) / this.cellSize);

            const cell = this.state[i][j];
            
            if(cell.isMine){
                this.mineClicked();
            }
            else if(!cell.revealed){
                this.BFS(i, j);
                this.draw();
            }
        });
    }

    mineClicked(){

    }

    BFS(i, j){
        let queue = [[i,j]];
        let seen = new Set();
        seen.add(this.state[i][j]);

        while(queue.length !== 0){
            const coords = queue.pop();
            const x = coords[0];
            const y = coords[1];
            const cell = this.state[x][y];
            cell.revealed = true;

            if(cell.minesContact === 0){
                const topRow = x === 0? 0 : x - 1;
                const leftCol = y === 0? 0 : y - 1;
                const botRow = x === this.numRows - 1? this.numRows - 1 : x + 1;
                const rightCol = y === this.numCols - 1? this.numCols - 1 : y + 1;

                for(let a = topRow; a <= botRow; a++){
                    for(let b = leftCol; b <= rightCol; ++b){
                        const nextCell = this.state[a][b];
                        if(!seen.has(nextCell)){
                            queue.push([a,b]);
                            seen.add(nextCell);
                        }
                    }
                }
            }
        }

    }

    draw(){
        for(let i = 0; i < this.numRows; ++i){
            for(let j = 0; j < this.numCols; ++j){
                this.state[i][j].draw(this.ctx, i, j, this.cellSize);
            }
        }
    }

}

const ctx = canvas.getContext('2d');
let mineField = new MineField(20, 25, 0.1, ctx);