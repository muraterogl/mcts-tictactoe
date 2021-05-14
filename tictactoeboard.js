class TicTacToeBoard{
    constructor(cells, turn, winner, is_terminal){
        this.cells = cells;
        this.turn = turn;
        this.winner = winner;
        this.terminal = is_terminal;
    }
    
    find_children = (board=this) => {
        if (board.is_terminal()) {
            return [];
        }
        return board.cells.map((c,i) => c===null ? i : "a")
                          .filter(c => c!=="a")
                          .map(i => board.make_move(board,i));
    };

    find_random_child = (board=this) => {
        if (board.terminal){
            return null;
        }
        const empty_spots = board.cells.map((c,i) => c===null ? i : "a")
                                       .filter(c => c!=="a");
        const randomIndex = Math.floor(Math.random() * empty_spots.length);
        return board.make_move(board, empty_spots[randomIndex]);

    };

    reward = (board=this) => {
        if (board.turn === board.winner){
            console.log("IMPOSSIBLE");
        }
        if (board.winner === null){
            return 0.5;
        }
        else if (board.turn !== board.winner){
            return 0;
        }
    };

    is_terminal = () => {
        this.terminal = this._find_winner(this.cells)!==null || !this.cells.some(c => c===null);
        return this.terminal;
    }

    make_move = (board, index) => {
        let cells = board.cells.map((c, i) => i===index ? board.turn : c);
        let turn = !board.turn;
        let winner = this._find_winner(cells);
        let is_terminal = winner !== null || !cells.some(c => c===null);
        return new TicTacToeBoard(cells, turn, winner, is_terminal);
    };

    _find_winner = (cells) => {
        const winners = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        for (let winner of winners){
            if (false === cells[winner[0]] && cells[winner[0]]===cells[winner[1]] && cells[winner[1]]===cells[winner[2]]){
                return false;
            }
            else if (true === cells[winner[0]] && cells[winner[0]]===cells[winner[1]] && cells[winner[1]]===cells[winner[2]]){
                return true;
            }
        }
        return null;
    };

}