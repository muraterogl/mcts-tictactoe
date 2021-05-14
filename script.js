const bot_starts = true;
const status_display = document.querySelector('.game--status');
const html_cells = document.querySelectorAll('.cell')
new_tictactoe_board = () => new TicTacToeBoard([null, null, null, null, null, null, null, null, null], !bot_starts, null, false);
let tree = new MCTS();
let board = new_tictactoe_board();

draw_board = (board) => {
    for (let i = 0; i < 9; i++){
        if(board.cells[i] === true){
            html_cells[i].innerHTML = "X";
        }
        else if(board.cells[i] === false){
            html_cells[i].innerHTML = "O";
        }
        else{
            html_cells[i].innerHTML = "";
        }
    }
};

handle_cell_click = (clicked_cell_event) => {
    const clicked_cell = clicked_cell_event.target;
    const clicked_cell_index = parseInt(clicked_cell.getAttribute('data-cell-index'));

    if (board.cells[clicked_cell_index] !== null || board.is_terminal()) {
        return;
    }

    board = board.make_move(board, clicked_cell_index);
    draw_board(board);
    if(board.is_terminal()){
        if (board.winner !== null){
            status_display.innerHTML = `GAME OVER YOU ${board.turn ? "LOST": "WON"}`;
        }
        return;
        
    }
    bot_make_a_move();
    draw_board(board);
    if(board.is_terminal()){
        if (board.winner !== null){
            status_display.innerHTML = `GAME OVER YOU ${board.turn ? "LOST": "WON"}`;
        }
        return;  
    }
};

handle_restart_game = () => {
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    tree = new MCTS();
    board = new_tictactoe_board();
    status_display.innerHTML = "";
};

bot_make_a_move = () => {
    for (let i = 0; i < 1000; i++){
        tree.do_rollout(board);
    }
    board = tree.choose(board);
};

html_cells.forEach(cell => cell.addEventListener('click', handle_cell_click));
document.querySelector('.game--restart').addEventListener('click', handle_restart_game);
if(bot_starts){
    bot_make_a_move();
    draw_board(board);
}

