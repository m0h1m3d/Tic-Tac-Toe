console.log('game start!');
const board = (() => {
  const positions = ['', '', '', '', '', '', '', '', ''];
  let display;

  return { positions, display };
})();

const playerOne = (() => {
  const name = 'Player One';
  const sign = '';
  const moves = [];
  const roundWins = 0;
  const color = '#f7b844';

  return { name, sign, moves, roundWins, color };
})();

const playerTwo = (() => {
  const name = 'Player Two';
  const sign = '';
  const moves = [];
  const roundWins = 0;
  const color = '#33B9B9';

  return { name, sign, moves, roundWins, color };
})();

const cpu = (() => {
  const name = 'CPU';
  const sign = '';
  const moves = [];
  const roundWins = 0;
  const color = '#33B9B9';

  return { name, sign, moves, roundWins, color };
})();

const game = (() => {
  const boardEl = document.querySelector('.board');
  const btnRestartRound = document.querySelector('.btn-restart');
  const btnRestartGame = document.querySelector('.restartGame');

  let round = 1;
  let tie = 0;

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
  let handleClick;

  const pick = document.querySelector('.pick-container');
  pick.addEventListener('click', (e) => {
    if (e.target.className.includes('user')) {
      if(playerOne.sign === '') return;

      nextPlayer = playerTwo;
      init(currentPlayer, nextPlayer);

    } else if (e.target.className.includes('cpu')) {
      if(playerOne.sign === '') return;

      nextPlayer = cpu;
      init(currentPlayer, nextPlayer);

    }else if(e.target.className.includes('mark-x')){

      playerOne.sign = 'X';
      playerTwo.sign = 'O';
      cpu.sign = 'O';

    }else if(e.target.className.includes('mark-o')){
      
      playerOne.sign = 'O';
      playerTwo.sign = 'X';
      cpu.sign = 'X';

    }
  });

  btnRestartGame.addEventListener('click', ()=>{
    resetCurrentGame(currentPlayer, nextPlayer);
  })
  btnRestartRound.addEventListener('click', ()=>{
    resetCurrentGame(currentPlayer, nextPlayer);
  })

  function init(currentPlayer, nextPlayer) {
    playRound(currentPlayer, nextPlayer);
  };

  function playRound(player, nextPlayer) {
    domDisplay.switchTurns(player);
    domDisplay.setScore(nextPlayer);

    let playerMove;
    renderMove(player, (move) => {
      playerMove = move;

      if (!validMove(playerMove)) {        
        playRound(player, nextPlayer);
        return;
      };

      addMove(player, playerMove);
      getRoundWinner(player, nextPlayer);
      checkGameWinner(player, nextPlayer);

      if (winCondition(player.moves) || boardFull()) {

        resetBoard(player, nextPlayer);
        round++;
        domDisplay.renderRounds(round);
        currentPlayer = playerOne;
        playRound(currentPlayer, nextPlayer);
    
      }else {

        currentPlayer = switchPlayers(player, nextPlayer);
        playRound(currentPlayer, nextPlayer);

      }
    });
  };

  function renderMove(player, callback) {
  if (player.name === 'CPU') {
    let move = getCpuMove();
    const cell = document.querySelector(`[data-position = "${move}"]`);

    domDisplay.renderMark(cell, player);
    setTimeout((player)=>{
      callback(move);
      domDisplay.switchTurns(player);
    }, 500)
  } else {
    handleClick = (e) => {
      if (e.target.tagName === 'BUTTON') {
        let move = +e.target.dataset.position;

        if (validMove(move)) {
          domDisplay.renderMark(e.target, player)
        } else {
          domDisplay.renderInvalid(e.target);
        };

        boardEl.removeEventListener('click', handleClick);
        callback(move);
      }
    };
    boardEl.addEventListener('click', handleClick);
  };
};

  function getCpuMove(){
    let validMoves = board.positions.reduce((acc,position,index)=>{
      if(position === '') acc.push(index);
      return acc;
    },[]);

      let randomIndex = Math.floor(Math.random()*validMoves.length);
      let move = validMoves[randomIndex];
      return move;
  };

  
  function addMove(player, move) {
    board.positions[move] = player.sign;
    player.moves.push(move);
  };
  
  function validMove(move) {
    return board.positions[move] === '';
  };
  
  function winCondition(playerMoves) {
    return winingMoves.some((arr) => {
      return arr.every((pos) => playerMoves.includes(pos));
    });
  };

  function getRoundWinner(player, nextPlayer) {
    if (winCondition(player.moves)) {
      player.roundWins++;
      
      domDisplay.renderWinningUi(player, winingMoves);

      domDisplay.resetCells();
    } else if (boardFull()) {
      tie++
      domDisplay.setTie(tie);
      domDisplay.renderTie();
      domDisplay.resetCells();
    };
    
  };

  function checkGameWinner(player, nextPlayer) {
    if (player.roundWins === 5) {
      round--;
      domDisplay.renderGameOver(player);
    } else if (nextPlayer.roundWins === 5) {
      round--;
      domDisplay.renderGameOver(nextPlayer);
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

  function resetCurrentGame(currentPlayer, nextPlayer) {
    board.positions = ['', '', '', '', '', '', '', '', ''];
    currentPlayer.moves = [];
    currentPlayer.roundWins = 0;
    nextPlayer.moves = [];
    nextPlayer.roundWins = 0;
    round = 1;
    tie = 0;

    domDisplay.resetCells();
    domDisplay.resetScores();
    switchPlayers(currentPlayer, nextPlayer);
    domDisplay.switchTurns(playerOne);

  };

  function restartGame(){    
    boardEl.removeEventListener('click', handleClick);

    board.positions = ['', '', '', '', '', '', '', '', ''];
    playerOne.moves = [];
    playerOne.sign = '';
    playerOne.roundWins = 0;
    playerTwo.moves = [];
    playerTwo.sign = '';
    playerTwo.roundWins = 0;
    cpu.moves = [];
    cpu.sign = '';
    cpu.roundWins = 0;
    round = 1;
    tie = 0;

    domDisplay.resetCells();
    domDisplay.resetScores();
    domDisplay.switchTurns(playerOne);
  };

  function switchPlayers(player, nextPlayer) {
    if (winCondition(player.moves)) {
      return playerOne;
    } else {
      domDisplay.switchTurns(nextPlayer);
      return player === playerOne ? nextPlayer : playerOne;
    }
  };

  return { btnRestartRound,restartGame }
})();

const domDisplay= (()=>{
  const cpuBtn = document.querySelector('.cpu');
  const pLayerTwoBtn = document.querySelector('.user');
  const gameContainer = document.querySelector('.game-container');
  const boardEl = document.querySelector('.board');
  const boardcells = boardEl.querySelectorAll('button');
  const pick = document.querySelector('.pick-container');
  const h1 = pick.querySelector('h1');
  const btnsPickOp = document.querySelector('.btns-pick-op');
  const btnMarkX = document.querySelector('.mark-x');
  const btnMarkO = document.querySelector('.mark-o');
  const currentTurn = document.querySelector('.current-turn');
  const opponentName = document.querySelector('.opponent');
  const opponentScore = document.querySelector('.opScore');
  const playerName = document.querySelector('.player');
  const playerScore = document.querySelector('.plScore');
  const tieScore = document.querySelector('.tScore');
  const round = document.querySelector('.round');
  const results = document.querySelector('.results');
  const btnMenu = document.querySelector('.menu');
  const btnRestartGame = document.querySelector('.restartGame');
  const winner = document.querySelector('.winner');

  btnMenu.addEventListener('click', ()=>{
    game.restartGame();
    btnMarkO.classList.remove('highlight');
    btnMarkX.classList.remove('highlight');
    toggleHide([results,pick,btnsPickOp,btnMarkX,btnMarkO]);
  });

  btnRestartGame.addEventListener('click', ()=>{
    toggleHide([results]);
    toggleHide([gameContainer]);
  });

  function init(){
    
    clickEffect(cpuBtn, 'rgb(25, 56, 56)');
    clickEffect(pLayerTwoBtn, 'rgb(114, 86, 35)');
    clickEffect(game.btnRestartRound, 'rgb(139, 139, 139)');
    clickEffect(btnMenu, 'rgb(25, 56, 56)');
    clickEffect(btnRestartGame, 'rgb(114, 86, 35)');


    pick.addEventListener('click', (e)=>{
      if (e.target.className.includes('user') || e.target.className.includes('cpu')) {
        if(playerOne.sign === ''){
          notify();
          return;
        };
  
        toggleHide([pick,btnsPickOp,btnMarkX,btnMarkO,gameContainer]);      
  
      }else if(e.target.className.includes('mark-x')){
  
        e.target.classList.add('highlight');
        toggleHighLight([btnMarkO]);
  
      }else if(e.target.className.includes('mark-o')){
        
        e.target.classList.add('highlight');
        toggleHighLight([btnMarkX]);
  
      }
    });    
  };

  function clickEffect(el, color){
    el.addEventListener('click', () => {
      el.style.boxShadow = `0 1px 0 ${color}`;
      el.style.transform = 'translateY(9px)';
      setTimeout(() => {
        el.style.transform = 'translateY(0px)';
        el.style.boxShadow = `0 5px 0 ${color}`;
      }, 100);
    });
  };

  function notify(){
    h1.style.transform = 'rotate(3deg)';

   setTimeout(()=>{
       h1.style.transform = 'rotate(-3deg)';
         setTimeout(()=>{
            h1.style.transform = 'rotate(0deg)';
       },300);            
    },300);
  }

  function toggleHide(els){
    els.forEach(el => {
      setTimeout(()=>{
        el.classList.toggle("hidden");
      },350);      
    });
  };

  function toggleHighLight(els){
    els.forEach(el => {
      el.classList.remove('highlight');
    });
  };
  
  function resetCells(){
    boardcells.forEach(cell => {
      setTimeout(()=>{
        cell.style.opacity = 0;
      setTimeout(() => {
          cell.textContent = '';
          cell.style.opacity = '';
          cell.style.color = '';
          cell.style.background = '';
          cell.style.transform = '';
          cell.classList.remove("winning-cell");
      }, 500);
      },500)
  });
  };

  function renderWinningUi(player,winingMoves){
    winingMoves.forEach(combo=> {
        wincombo = combo.every(position=> player.moves.includes(position));
        
        if(wincombo){
          combo.forEach((position)=>{
            const winingCell = document.querySelector(`[data-position= "${position}"]`);
              
            winingCell.classList.add("winning-cell");
              setTimeout(() => {
                winingCell.style.transform = 'scale(1)';
              }, 300);
          });
        };
      });
  };

  function renderTie(){
    boardcells.forEach(cell => {
      cell.style.transform = 'rotate(5deg)';

      setTimeout(()=>{
      cell.style.transform = '';
      },350);
    })
  }

  function renderMark(el, player){
    if(player.name === 'CPU'){
      setTimeout(()=>{
        render(el,player);
      },500)
    }else{
      render(el,player);
    }
  };

  function render(el, player){
    el.style.color = player.color;
    el.textContent = player.sign;
    el.style.transform = 'scale(1.05)';
    setTimeout(()=>{
     el.style.transform = '';
    },200);
  }
  
  function renderInvalid(el){
   el.classList.add('invalid');
   setTimeout(()=>{
    el.classList.remove('invalid');
    },300);
  };

  function switchTurns(player){
    currentTurn.textContent = player.sign;
    currentTurn.style.color = player.color;
  };

  function renderRounds(rounds){
    round.textContent = rounds;
  }

  function setScore(secondPlayer){
    playerName.textContent = playerOne.name;
    playerScore.textContent = playerOne.roundWins;
    opponentName.textContent = secondPlayer.name;
    opponentScore.textContent = secondPlayer.roundWins;
  };

  function setTie(tieRounds){
    tieScore.textContent = tieRounds;
  };

  function resetScores(){
    playerScore.textContent = 0;
    opponentScore.textContent = 0;
    tieScore.textContent = 0;
    round.textContent = 1;
  };

  function renderGameOver(player){
    toggleHide([gameContainer,results]);
    winner.textContent = player.name;
    winner.style.color = player.color;
    winner.style.fontSize = '2rem';
  }

  return { init, clickEffect, resetCells,renderWinningUi,renderInvalid, renderMark,renderTie,renderRounds, switchTurns,setScore, setTie, resetScores, renderGameOver }

})();
domDisplay.init();