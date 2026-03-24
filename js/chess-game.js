/* Logic with Stockfish.js */

$(document).ready(function() {
  let board = null;
  let game = new Chess();
  const $status = $('#status');
  const $pgn = $('#pgn');
  const $difficulty = $('#difficulty');
  let engine = null;

  // Initialize Stockfish with a blob workaround to avoid CORS Worker issues
  function initEngine() {
    try {
      const sfUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
      
      fetch(sfUrl)
        .then(r => r.text())
        .then(code => {
          const blob = new Blob([code], { type: 'application/javascript' });
          engine = new Worker(URL.createObjectURL(blob));
          
          engine.onmessage = function(e) {
            const line = e.data;
            if (line.indexOf('bestmove') > -1) {
              const match = line.match(/bestmove\s([a-h][1-8][a-h][1-8][qrbn]?)/);
              if (match) {
                const moveStr = match[1];
                makeMove(moveStr);
                highlightLastMove(moveStr.substring(0, 2), moveStr.substring(2, 4));
              }
            }
          };

          engine.postMessage('uci');
          updateDifficulty(); // Set initial skill level
          engine.postMessage('ucinewgame');
          $status.html('Prêt ! À vous de jouer.');
        })
        .catch(err => {
          console.error("Stockfish init failed:", err);
          $status.html('Erreur moteur (IA indisponible)');
        });
    } catch (e) {
      $status.html('Erreur système');
    }
  }

  function updateDifficulty() {
    if (!engine) return;
    const level = $difficulty.val();
    engine.postMessage(`setoption name Skill Level value ${level}`);
  }

  function highlightLastMove(from, to) {
    // Remove previous highlights
    $('#myBoard .square-55d63').removeClass('highlight-move');
    
    // Add current highlights
    $('#myBoard .square-' + from).addClass('highlight-move');
    $('#myBoard .square-' + to).addClass('highlight-move');
  }

  function makeMove(moveStr) {
    const move = game.move({
      from: moveStr.substring(0, 2),
      to: moveStr.substring(2, 4),
      promotion: 'q'
    });

    if (move === null) return;

    board.position(game.fen());
    updateStatus();
  }

  function askEngine() {
    if (game.game_over()) return;
    engine.postMessage('position fen ' + game.fen());
    // Depth 10 is usually fast but enough for these levels
    engine.postMessage('go depth 10');
  }

  function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    // Only white pieces for human
    if (piece.search(/^b/) !== -1) return false;
  }

  function onDrop(source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    // Illegal move
    if (move === null) return 'snapback';

    highlightLastMove(source, target);
    updateStatus();
    window.setTimeout(askEngine, 250);
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  function updateStatus() {
    let status = '';
    const moveColor = (game.turn() === 'b') ? 'Noirs (Bot)' : 'Blancs';

    if (game.in_checkmate()) {
      status = 'MAT ! ' + moveColor + ' a perdu.';
    } else if (game.in_draw()) {
      status = 'Match nul.';
    } else {
      status = 'Trait aux ' + moveColor;
      if (game.in_check()) status += ' (ÉCHEC)';
    }

    $status.html(status);
    $pgn.html(game.pgn());
  }

  const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  };

  setTimeout(() => {
    if (typeof Chessboard !== 'undefined') {
      board = Chessboard('myBoard', config);
      initEngine();
      updateStatus();
    } else {
      $status.html('Erreur: Chessboard non chargé');
    }
  }, 300);

  // Event Listeners
  $difficulty.on('change', function() {
    updateDifficulty();
    $status.html('Difficulté mise à jour. Continuez !');
  });

  $('#resetBtn').on('click', function() {
    game.reset();
    board.start();
    updateStatus();
    $('#myBoard .square-55d63').removeClass('highlight-move');
    if (engine) engine.postMessage('ucinewgame');
  });

  $('#undoBtn').on('click', function() {
    game.undo(); // Undo Bot
    game.undo(); // Undo User
    board.position(game.fen());
    updateStatus();
    // Highlight the previous move before the undo
    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      highlightLastMove(last.from, last.to);
    } else {
      $('#myBoard .square-55d63').removeClass('highlight-move');
    }
  });

  $(window).resize(() => { if (board) board.resize(); });
});
