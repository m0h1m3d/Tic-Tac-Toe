console.log(
  'game preview:\nchoose number for positioning\nfirst to 3 rounds wins the game!\n\n  0  |  1  |  2  \n-----------------\n  3  |  4  |  5  \n-----------------\n  6  |  7  |  8'
);

const styles = (() => {
  function init() {
    const cpuBtn = document.querySelector('.cpu');
    const pLayerTwoBtn = document.querySelector('.user');

    cpuBtn.addEventListener('click', () => {
      cpuBtn.style.boxShadow = '0 1px 0 rgb(25, 56, 56)';
      cpuBtn.style.transform = 'translateY(9px)';
      setTimeout(() => {
        cpuBtn.style.transform = 'translateY(0px)';
        cpuBtn.style.boxShadow = '0 10px 0 rgb(25, 56,  56)';
      }, 100);
    });

    pLayerTwoBtn.addEventListener('click', () => {
      pLayerTwoBtn.style.boxShadow = '0 1px 0 rgb(114, 86, 35)';
      pLayerTwoBtn.style.transform = 'translateY(9px)';
      setTimeout(() => {
        pLayerTwoBtn.style.transform = 'translateY(0px)';
        pLayerTwoBtn.style.boxShadow = '0 10px 0 rgb(114, 86, 35)';
      }, 100);
    });
  };

  function toggleHide(els){
    els.forEach(el => {
      setTimeout(()=>{
        el.classList.toggle("hidden");
      },350);      
    });
  };

  return { init, toggleHide };
})();
styles.init();

const board = (() => {
  const positions = ['', '', '', '', '', '', '', '', ''];
  let display;

  return { positions, display };
})();
const playerOne = (() => {
  const name = 'Player One';
  const sign = 'X';
  const moves = [];
  const roundWins = 0;

  return { name, sign, moves, roundWins };
})();

const playerTwo = (() => {
  const name = 'Player Two';
  const sign = playerOne.sign === 'X' ? 'O' : 'X';
  const moves = [];
  const roundWins = 0;

  return { name, sign, moves, roundWins };
})();

const cpu = (() => {
  const name = 'CPU';
  const sign = playerOne.sign === 'X' ? 'O' : 'X';
  const moves = [];
  const roundWins = 0;

  return { name, sign, moves, roundWins };
})();

const game = (() => {
  const boardEl = document.querySelector('.board');
  const winingMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let currentPlayer = playerOne;
  let nextPlayer;
  const pick = document.querySelector('.pick');
  const btnsPick = document.querySelector('.btns-pick');
  
  pick.addEventListener('click', (e) => {
    if (e.target.className.includes('user')) {
      styles.toggleHide([pick,btnsPick,boardEl]);      

      nextPlayer = playerTwo;
      init(currentPlayer, nextPlayer);
    } else if (e.target.className.includes('cpu')) {
      styles.toggleHide([pick,btnsPick,boardEl]);      
     
      
      nextPlayer = cpu;
      init(currentPlayer, nextPlayer);
    }
  });

  function init(currentPlayer, nextPlayer) {
    playRound(currentPlayer, nextPlayer);
  };

  function playRound(player, nextPlayer) {
    let playerMove;
    setMove(player, (move) => {
      playerMove = move;

      if (!validMove(playerMove)) {
        console.log('position taken');
        playRound(player, nextPlayer);
        return;
      };

      displayMove(player, playerMove);
      getRoundWinner(player, nextPlayer);
      checkGameWinner(player, nextPlayer);

      if (gameOver(player)) {
        
        resetGame(player, nextPlayer);

      } else if (winCondition(player.moves) || boardFull()) {

        resetBoard(player, nextPlayer);
        currentPlayer = playerOne;
        playRound(currentPlayer, nextPlayer);
    
      }else {

        currentPlayer = switchPlayers(player, nextPlayer);
        playRound(currentPlayer, nextPlayer);

      }
    });
  };

  function setMove(player, callback) {
    if (player.name === 'CPU') {
      let validMoves = board.positions.reduce((acc,position,index)=>{
        if(position === '') acc.push(index);
        return acc;
      },[]);

        let randomIndex = Math.floor(Math.random()*validMove.length);
        let move = validMoves[randomIndex];
        callback(move);
    } else {
      const handleClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
          let move = +e.target.dataset.position;
          boardEl.removeEventListener('click', handleClick);
          callback(move);
        }
      };
      boardEl.addEventListener('click', handleClick);
    }
  };

  function validMove(move) {
    return board.positions[move] === '';
  };

  function displayMove(player, move) {
    board.positions[move] = player.sign;
    player.moves.push(move);

    console.clear();

    board.display = `${board.positions[0]}     |     ${board.positions[1]}     |     ${board.positions[2]}\n------------------------\n${board.positions[3]}     |    ${board.positions[4]}      |     ${board.positions[5]}\n------------------------\n${board.positions[6]}     |     ${board.positions[7]}     |     ${board.positions[8]}`;

    console.log(board.display);
  };
  
  function winCondition(playerMoves) {
    return winingMoves.some((arr) => {
      return arr.every((pos) => playerMoves.includes(pos));
    });
  };

  function getRoundWinner(player, nextPlayer) {
    if (winCondition(player.moves)) {
      player.roundWins++;
      
      console.log(
        `${playerOne.name}:${playerOne.roundWins}\n${nextPlayer.name}:${
          nextPlayer.roundWins
        }\n ${player.roundWins < 3 ? 'next rounds begins!' : 'Game over'}`
      );
    } else if (boardFull()) {
      console.log("It's a tie!\n next round begins!");
    };
    
  };

  function checkGameWinner(player, nextPlayer) {
    if (player.roundWins === 3) {
      console.log(`${player.name} wins the match!`);
    } else if (nextPlayer.roundWins === 3) {
      console.log(`${nextPlayer.name} wins the match!`);
    }
  };
  
  function boardFull() {
    return board.positions.every((el) => el !== '');
  };  

  function resetBoard(player, nextPlayer) {
    board.positions = ['', '', '', '', '', '', '', '', ''];
    player.moves = [];
    nextPlayer.moves = [];
  };

  function gameOver(player) {
    return player.roundWins === 3;
  };

  function resetGame(currentPlayer, nextPlayer) {
    board.positions = ['', '', '', '', '', '', '', '', ''];
    currentPlayer.moves = [];
    currentPlayer.roundWins = 0;
    nextPlayer.moves = [];
    nextPlayer.roundWins = 0;
  };

  function switchPlayers(player, nextPlayer) {
    if (winCondition(player.moves)) {
      console.log(player.moves);
      return playerOne;
    } else {
      return player === playerOne ? nextPlayer : playerOne;
    }
  };
})();
