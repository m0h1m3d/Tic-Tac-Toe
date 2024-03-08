console.log(
  'game preview:\nchoose number for positioning\nfirst to 3 rounds wins the game!\n\n  0  |  1  |  2  \n-----------------\n  3  |  4  |  5  \n-----------------\n  6  |  7  |  8'
);

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

  function init(currentPlayer, nextPlayer) {
    playRound(currentPlayer, nextPlayer);
  };

  function playRound(player, nextPlayer) {
    let playerMove;
    renderMove(player, (move) => {
      playerMove = move;

      if (!validMove(playerMove)) {        
        console.log('position taken');
        playRound(player, nextPlayer);
        return;
      };

      addMove(player, playerMove);
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

  function renderMove(player, callback) {
    if (player.name === 'CPU') {
     let move = getCpuMove();
     const cell = document.querySelector(`[data-position = "${move}"]`);

     domDisplay.renderMark(cell, player);

      callback(move);
    } else {
      const handleClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
          let move = +e.target.dataset.position;

          if(validMove(move)){
            domDisplay.renderMark(e.target, player)
          }else{
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

      let randomIndex = Math.floor(Math.random()*validMove.length);
      let move = validMoves[randomIndex];
      return move;
  };

  
  function addMove(player, move) {
    board.positions[move] = player.sign;
    player.moves.push(move);
      
        
    console.clear();
    
    board.display = `${board.positions[0]}     |     ${board.positions[1]}     |     ${board.positions[2]}\n------------------------\n${board.positions[3]}     |    ${board.positions[4]}      |     ${board.positions[5]}\n------------------------\n${board.positions[6]}     |     ${board.positions[7]}     |     ${board.positions[8]}`;

    console.log(board.display);
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

      console.log(
        `${playerOne.name}:${playerOne.roundWins}\n${nextPlayer.name}:${
          nextPlayer.roundWins
        }\n ${player.roundWins < 3 ? 'next rounds begins!' : 'Game over'}`
      );

      domDisplay.resetCells();
    } else if (boardFull()) {
      domDisplay.renderTie();
      console.log("It's a tie!\n next round begins!");
      domDisplay.resetCells();
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
      return playerOne;
    } else {
      return player === playerOne ? nextPlayer : playerOne;
    }
  };
})();

const domDisplay= (()=>{
  const cpuBtn = document.querySelector('.cpu');
  const pLayerTwoBtn = document.querySelector('.user');
  const boardEl = document.querySelector('.board');
  const boardcells = boardEl.querySelectorAll('button');
  const pick = document.querySelector('.pick-container');
  const h1 = pick.querySelector('h1');
  const btnsPickOp = document.querySelector('.btns-pick-op');
  const btnMarkX = document.querySelector('.mark-x');
  const btnMarkO = document.querySelector('.mark-o');

  function init(){
    
    clickEffect(cpuBtn, 'rgb(25, 56, 56)');
    clickEffect(pLayerTwoBtn, 'rgb(114, 86, 35)');

    pick.addEventListener('click', (e)=>{
      if (e.target.className.includes('user') || e.target.className.includes('cpu')) {
        if(playerOne.sign === ''){
          notify();
          return;
        };
  
        hide([pick,btnsPickOp,btnMarkX,btnMarkO,boardEl]);      
  
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
        el.style.boxShadow = `0 10px 0 ${color}`;
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

  function hide(els){
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
          cell.style.opacity = 1;
          cell.style.background = '';
          cell.style.transform = '';
          cell.classList.remove("winning-cell");
      }, 1000);
      },1000)
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
        el.style.color = player.color;
        el.textContent = player.sign;
       el.style.transform = 'scale(1.05)';
       setTimeout(()=>{
          el.style.transform = '';
        },200);
      },500)
    }else{
      el.style.color = player.color;
      el.textContent = player.sign;
      el.style.transform = 'scale(1.05)';
      setTimeout(()=>{
        el.style.transform = '';
      },200);
    }
  };
  
  function renderInvalid(el){
   el.classList.add('invalid');
   setTimeout(()=>{
    el.classList.remove('invalid');
    },300);
  };

  return { init,resetCells,renderWinningUi,renderInvalid, renderMark,renderTie }

})();
domDisplay.init();