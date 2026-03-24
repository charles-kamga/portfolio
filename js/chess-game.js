/* Logic with Stockfish.js */

$(document).ready(function() {
  let board = null;
  let game = new Chess();
  const $status = $('#status');
  const $pgn = $('#pgn');
  const $difficulty = $('#difficulty');
  let engine = null;

  // Persistence keys
  const STORAGE_KEY_FEN = 'chess_game_fen';
  const STORAGE_KEY_DIFF = 'chess_game_diff';

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
                executeBotMove(moveStr);
              }
            }
          };

          engine.postMessage('uci');
          updateDifficulty(); 
          engine.postMessage('ucinewgame');
          
          loadSavedGame();
        })
        .catch(err => {
          console.error("Stockfish init failed:", err);
          $status.html('Erreur moteur (IA indisponible)');
        });
    } catch (e) {
      $status.html('Erreur système');
    }
  }

  function saveGameState() {
    localStorage.setItem(STORAGE_KEY_FEN, game.fen());
    localStorage.setItem(STORAGE_KEY_DIFF, $difficulty.val());
  }

  function loadSavedGame() {
    const savedFen = localStorage.getItem(STORAGE_KEY_FEN);
    const savedDiff = localStorage.getItem(STORAGE_KEY_DIFF);

    if (savedDiff !== null) {
      $difficulty.val(savedDiff);
      updateDifficulty();
    }

    if (savedFen !== null && game.load(savedFen)) {
      board.position(savedFen);
      updateStatus();
      if (game.turn() === 'b') {
        window.setTimeout(askEngine, 500);
      }
      const history = game.history({ verbose: true });
      if (history.length > 0) {
        const last = history[history.length - 1];
        highlightLastMove(last.from, last.to);
      }
    } else {
      $status.html('Prêt ! À vous de jouer.');
    }
  }

  function updateDifficulty() {
    if (!engine) return;
    const level = $difficulty.val();
    engine.postMessage(`setoption name Skill Level value ${level}`);
    saveGameState();
  }

  function highlightLastMove(from, to) {
    $('#myBoard .square-55d63').removeClass('highlight-move');
    $('#myBoard .square-' + from).addClass('highlight-move');
    $('#myBoard .square-' + to).addClass('highlight-move');
  }

  function executeBotMove(moveStr) {
    const move = game.move({
      from: moveStr.substring(0, 2),
      to: moveStr.substring(2, 4),
      promotion: 'q'
    });

    if (move === null) return;

    board.position(game.fen());
    highlightLastMove(move.from, move.to);
    updateStatus();
    saveGameState();
  }

  function askEngine() {
    if (game.game_over()) return;

    const level = parseInt($difficulty.val());
    
    // INTENTIONAL RANDOMNESS FOR LOW LEVELS
    // Level 0: 60% chance of random move
    // Level 5: 20% chance of random move
    let randomThreshold = 0;
    if (level === 0) randomThreshold = 0.6;
    else if (level === 5) randomThreshold = 0.2;

    if (Math.random() < randomThreshold) {
      const moves = game.moves({ verbose: true });
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        executeBotMove(randomMove.from + randomMove.to);
        return;
      }
    }

    // Otherwise, use Stockfish
    engine.postMessage('position fen ' + game.fen());
    
    let depth = 10;
    if (level === 0) depth = 1;
    else if (level <= 5) depth = 2;
    else if (level <= 10) depth = 5;
    else if (level <= 15) depth = 10;
    else depth = 15;
    
    engine.postMessage(`go depth ${depth}`);
  }

  function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;
  }

  function onDrop(source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';

    highlightLastMove(source, target);
    updateStatus();
    saveGameState();
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

  $difficulty.on('change', function() {
    updateDifficulty();
    $status.html('Difficulté mise à jour. Continuez !');
  });

  $('#resetBtn').on('click', function() {
    game.reset();
    board.start();
    updateStatus();
    $('#myBoard .square-55d63').removeClass('highlight-move');
    localStorage.removeItem(STORAGE_KEY_FEN);
    if (engine) engine.postMessage('ucinewgame');
  });

  $('#undoBtn').on('click', function() {
    game.undo(); 
    game.undo(); 
    board.position(game.fen());
    updateStatus();
    saveGameState();
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
