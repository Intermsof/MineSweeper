let container = document.getElementById('container');

class Cell {
    constructor(isMine){
        this.revealed = false;
        this.isMine = isMine;
        this.minesContact = 0;
    }

    toString(){
        return this.isMine;
    }
}

class MineField {
    constructor(numRows, numCols, mineRate){
        this.numRows = numRows;
        this.numCols = numCols;
        this.mineRate = mineRate
        this.state = [...Array(numRows)].map(e => {
            return [...Array(numCols)].map(e => {
                return new Cell(Math.random() < mineRate);
            });
        });
        

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

        for(let i = 0; i < this.numRows; ++i){
            let row = document.createElement('div');
            row.classList.add('row');

            for(let j = 0; j < numCols; ++j){
                let cellView = document.createElement('div');
                cellView.classList.add('cell');
                let cellModel = this.state[i][j];

                cellView.classList.add('cell-normal');    

                let minesContactView = document.createElement('div');
                minesContactView.classList.add('mines-contact');
                minesContactView.classList.add(`mines-contact-${cellModel.minesContact}`);
                minesContactView.innerHTML = cellModel.minesContact;
                
                minesContactView.style.opacity = 0;
                

                cellView.appendChild(minesContactView);

                cellView.addEventListener('click',(e, ev)=>{
                    let cellModel = this.state[i][j];
                    if(cellModel.isMine){
                        container.innerHTML = 'YOU LOSE';
                    }
                    else{
                        this.initBFS();
                        this.BFS(i,j);
                        this.draw();
                    }
                });

                cellModel.view = cellView;
                cellModel.innerNode = minesContactView;
                row.appendChild(cellView);
            }
        
            container.appendChild(row);
        }
    }

    BFS(i,j){
        console.log('bfs called ', i , j);
        this.state[i][j].revealed = true;
        this.searchedMap[i][j] = true;
        if(this.state[i][j].minesContact === 0){
            const topRow = i === 0? 0 : i - 1;
            const leftCol = j === 0? 0 : j - 1;
            const botRow = i === this.numRows - 1? this.numRows - 1 : i + 1;
            const rightCol = j === this.numCols - 1? this.numCols - 1 : j + 1;

            for(let a = topRow; a <= botRow; ++a){
                for(let b = leftCol; b <= rightCol; ++b){
                    if(!this.searchedMap[a][b]){
                        this.searchedMap[a][b] = true;
                        this.queue.push([a,b]);
                    }
                }
            }
        }

        if(this.queue.length !== 0){
            let tuple = this.queue.shift();
            this.BFS(tuple[0],tuple[1]);
        }
    }

    draw(){
        console.log('in draw');
        for(let i = 0; i < this.numRows; ++i){
            for(let j = 0; j < this.numCols; ++j){
                let col = this.state[i][j];
                if(col.revealed){
                    col.view.classList.remove('cell-normal');
                    col.view.classList.add('cell-revealed');
                    if(col.minesContact !== 0){
                        col.innerNode.style.opacity = 1;
                    }
                }
            }
        }
    }

    initBFS(){
        this.searchedMap = [...Array(this.numRows)].map(e => {
            return Array(this.numCols).fill(false);
        });
        this.queue = [];
    }
}

let mineField = new MineField(15,25,0.1);