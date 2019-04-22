var BOARD = []

var PLAYER         = 0;
var WIDTH          = 0;
var CURR_HOVER_COL = 0;

var UP        = 0;
var DOWN      = 1;
var LEFT      = 2;
var RIGHT     = 3;
var UPLEFT    = 4;
var UPRIGHT   = 5;
var DOWNLEFT  = 6;
var DOWNRIGHT = 7;

var NUM_COL       = 7;
var NUM_ROW       = 7;
var NUM_HOVER_ROW = 1;

var GAP   = 5;
var SPEED = 200;

var PLAYER_0_COLOR = 'rgb(255, 111, 105)';
var PLAYER_1_COLOR = 'rgb(255, 238, 173)';

var IN_TRANSITION = false;
var CONNECT_NUM   = 4;

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

      if (row == 0) {
        cell.style.backgroundColor = "white";
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
  headCell.style.border           = "thick solid #555555";
}

function cellClick(col) {
  var row = getFree(col);
  if (row == -1 || IN_TRANSITION == true) {
    return;
  }

  IN_TRANSITION = true

  BOARD[row][col] = createFreeCell(col);

  PLAYER = PLAYER == 1 ? 0 : 1;
  if (PLAYER == 1) {
    animate(row, col, cellClick, 0);
  }
  else {
    animate(row, col, null, null)
  }
  $(':hover').trigger('mouseover');
}

function animate(row, col, callback, callback_col) {
  $("square").finish()

  if (BOARD[row][col] == -1) {
    return;
  }

  var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + 'px';
  var cellY = ((WIDTH / NUM_COL) * row) + 'px';
  var cell = BOARD[row][col];

  $(cell).css({
    'left': cellX,
    'top': 0
  });

  $(cell).animate({
    left: cellX,
    top: cellY
  }, SPEED, function() { 
    IN_TRANSITION = false; 
    if (callback) {
      callback(callback_col);
    }
    $(':hover').trigger('mouseover');
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
      var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + 'px';
      var cellY = ((WIDTH / NUM_COL) * row) + 'px';
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
  freeCell.style.border           = "thick solid #555555";
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
  if (cell.style.backgroundColor == PLAYER_1_COLOR) {
    return 1;
  }
  else if (cell.style.backgroundColor == PLAYER_0_COLOR) {
    return 0;
  }
  else {
    console.log("ERROR getting PLAYER from cell");
  }
}

/*******************/
/** MINIMAX AI    **/
/*******************/

function validMoves() {
  var valid_move_list = []
  for (var col = 0; col < NUM_COL; col++) {
    if (getFree(col) != -1) {
      valid_move_list.push(col);
    }
  }
  return valid_move_list;
}
