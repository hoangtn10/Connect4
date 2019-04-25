var BOARD = []

var PLAYER          = 0;
var WIDTH           = 0;
var CURR_HOVER_COL  = 0;
var IN_TRANSITION   = false;

const UP        = 0;
const DOWN      = 1;
const LEFT      = 2;
const RIGHT     = 3;
const UPLEFT    = 4;
const UPRIGHT   = 5;
const DOWNLEFT  = 6;
const DOWNRIGHT = 7;

const NUM_COL       = 7;
const NUM_ROW       = 7;
const NUM_HOVER_ROW = 1;
const CONNECT_NUM   = 4;

const GAP   = 7;
const SPEED = 200;

const PLAYER_0_COLOR  = 'rgb(60, 72, 89)';
const PLAYER_1_COLOR  = 'rgb(89, 60, 72)';
const CELL_COLOR      = 'rgb(206, 209, 214)'

for (var row = 0; row < NUM_ROW; row++) {
  var list = []
  for (var col = 0; col < NUM_COL; col++) {
    list.push(-1)
  }
  BOARD.push(list)
}

function load() {
  var cell          = document.getElementById("cell");
  cell.onmouseover  = function() { cellHover(0) };
  cell.onclick      = function() { cellClick(0) };

  for (var i = 1; i < (NUM_COL * NUM_ROW); i++) {
    var cln = cell.cloneNode(true);
    cell.parentNode.insertBefore(cln, cell);
  }

  var list = document.getElementsByClassName("square");
  for (var row = 0; row < NUM_ROW; row++) {
    for (var col = 0; col < NUM_COL; col++) {
      var cell = list[row * NUM_COL + col];

      
      if (row != 0) {
        cell.style.borderColor = CELL_COLOR;
        cell.style.backgroundColor = CELL_COLOR;   
      }

      cell.onmouseover = (function(col) {
        return function() { 
          cellHover(col) 
        };
      })(col);

      cell.onclick = (function(col) {
        return function() { 
          cellClick(col) 
        };
      })(col);
    }
  }

  cellHover(0)
  resize();
  window.addEventListener("resize", resize);
}

function cellHover(col) {
  var cell         = document.getElementById("cell");
  var prevHeadCell = cell.parentNode.childNodes[CURR_HOVER_COL + 1];
  prevHeadCell.style.backgroundColor  = "white";
  prevHeadCell.style.border           = "";

  CURR_HOVER_COL = col;

  var headCell = cell.parentNode.childNodes[col+1];
  headCell.style.backgroundColor  = PLAYER === 0 ? PLAYER_0_COLOR : PLAYER_1_COLOR;
}

function cellClick(col) {
  var row = getFree(col);
  if (row == -1 || IN_TRANSITION == true) {
    return;
  }

  IN_TRANSITION = true

  BOARD[row][col] = createFreeCell(col);
  var move = getMove();

  if (PLAYER == 0) {
    animate(row, col, null, null);
  }
  else {
    animate(row, col, null, null)
  }
}

function animate(row, col, callback, callback_col) {
  $("square").finish()

  if (BOARD[row][col] == -1) {
    return;
  }

  var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + $(".controller").position().left + 'px';
  var cellY = ((WIDTH / NUM_COL) * row) + $(".controller").position().top + 'px';
  var cell = BOARD[row][col];

  $(cell).css({
    'left': cellX,
    'top': $(".controller").position().top
  });

  $(cell).animate({
    left: cellX,
    top: cellY
  }, SPEED, function() { 
    // Completed animation
    IN_TRANSITION = false; 
    
    if(isWon(PLAYER, BOARD)) {
      console.log('PLAYER ' + PLAYER + ' WON!')
    }
    
    PLAYER = PLAYER == 1 ? 0 : 1;
    
    $(':hover').trigger('mouseover');
    
    if (callback) {
      callback(callback_col);
    }
   });

  $(cell).css({
    'left': cellX,
    'top': cellY
  });
}

function resize() {
  WIDTH = $(".controller").outerWidth(true);
  var cellWidth = ((WIDTH / NUM_COL) - GAP) + 'px';

  $(".controller").css({
    "height": WIDTH * (NUM_ROW / NUM_COL) + 'px'
  });
  $(".square").css({
    "width": cellWidth,
    "height": cellWidth,
    "line-height": cellWidth
  });

  var list = document.getElementsByClassName("square");
  for (var row = 0; row < NUM_ROW; row++) {
    for (var col = 0; col < NUM_COL; col++) {
    
      var cell = list[row * NUM_COL + col];
      var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + $(".controller").position().left + 'px';
      var cellY = ((WIDTH / NUM_COL) * row) + $(".controller").position().top + 'px';
      $(cell).css({
        'left': cellX,
        'top': cellY
      });
      if (BOARD[row][col] != -1) {
        cell = BOARD[row][col];
        $(cell).css({
          'left': cellX,
          'top': cellY
        });
      }
    }
  }
}

function createFreeCell(col) {
  var cell                        = document.getElementById("cell");
  var freeCell                    = cell.cloneNode(true);
  freeCell.style.backgroundColor  = PLAYER == 1 ? PLAYER_1_COLOR : PLAYER_0_COLOR;
  freeCell.onmouseover            = function() { cellHover(col) }
  freeCell.onclick                = function() { cellClick(col) }
  cell.parentNode.appendChild(freeCell);
  return freeCell;
}

function newGame() {
  for (var row = 0; row < NUM_ROW; row++) {
    for (var col = 0; col < NUM_COL; col++) {
      if (BOARD[row][col] == -1) {
        continue;
      }
      var cell = BOARD[row][col];
      cell.parentNode.removeChild(cell);
      BOARD[row][col] = -1
    }
  }
}

/*******************/
/** INTERACT API  **/
/*******************/

function getFree(col) {
  for (var row = NUM_ROW - NUM_HOVER_ROW; row >= 1; row--) {
    if (BOARD[row][col] == -1) {
      return row;
    }
  }
  return -1;
}

function getUser(cell) {
  if (isNaN(cell)) {
    if (cell.style.backgroundColor == PLAYER_1_COLOR) {
      return 1;
    }
    else if (cell.style.backgroundColor == PLAYER_0_COLOR) {
      return 0;
    }
  }
  return -1;
}

function getMove() {
  var validMoves = getValidMoves()
  var randomMoveIndex = Math.floor(Math.random() * validMoves.length)
  return validMoves[randomMoveIndex];
}

/*******************/
/** MINIMAX AI    **/
/*******************/

function getValidMoves() {
  var valid_move_list = []
  for (var col = 0; col < NUM_COL; col++) {
    if (getFree(col) != -1) {
      valid_move_list.push(col);
    }
  }
  return valid_move_list;
}

function isWon(player, board) {
  for (var row = 0; row < NUM_ROW; row++) {
    for (var col = 0; col < NUM_COL; col++) {
      if (getPointDirection(player, board, row, col, DOWN, true, true) >= CONNECT_NUM ||
          getPointDirection(player, board, row, col, RIGHT, true, true) >= CONNECT_NUM ||
          getPointDirection(player, board, row, col, UPRIGHT, true, true) >= CONNECT_NUM ||
          getPointDirection(player, board, row, col, DOWNRIGHT, true, true) >= CONNECT_NUM) {
        return 1;
      }
    }
  }
  return 0;
}

function getIncValue(direction) {
  var row_inc_val = 0, col_inc_val = 0;

  switch (direction) {
    case UP:
      row_inc_val = -1;
      break;
    case DOWN:
      row_inc_val = 1;
      break;
    case LEFT:
      col_inc_val = -1;
      break;
    case RIGHT:
      col_inc_val = 1;
      break;
    case UPLEFT:
      row_inc_val = -1;
      col_inc_val = -1;
      break;
    case UPRIGHT:
      row_inc_val = -1;
      col_inc_val = 1;
      break;
    case DOWNLEFT:
      row_inc_val = 1;
      col_inc_val = -1;
      break;
    case DOWNRIGHT:
      row_inc_val = 1;
      col_inc_val = 1;
      break;
  }

  return [row_inc_val, col_inc_val];
}

function isInRange(row, col) {
  return row >= 0 && row < NUM_ROW && col >= 0 && col < NUM_COL;
}

function getPointDirection(user, board, row, col, direction, isBreak, isInRangeOnly) {
  var point = 0;
  var row_cur_val = 0, col_cur_val = 0;

  var inc_val = getIncValue(direction)
  var row_inc_val = inc_val[0];
  var col_inc_val = inc_val[1];

  if (isInRangeOnly) {
    var row_max_val = row + (row_inc_val * (CONNECT_NUM - 1));
    var col_max_val = col + (col_inc_val * (CONNECT_NUM - 1)); 
    if (!isInRange(row_max_val, col_max_val)) {
      return 0;
    }
  }

  for (var i = 0; i < CONNECT_NUM; i++) {
    row_cur_val = row + (row_inc_val * i);
    col_cur_val = col + (col_inc_val * i);
    if (isInRange(row_cur_val, col_cur_val)) {
      if (board[row_cur_val][col_cur_val] == -1) {
        if (isBreak) {
          break;
        }
        continue;
      }
      else if (getUser(board[row_cur_val][col_cur_val]) == user) {
        point++;
      }
      else {
        break;
      }
    }
    else {
      break;
    }
  }
  return point;
}