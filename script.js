(() => {
  const Player = (name, sign) => {
    const getName = () => {
      return name;
    };
  
    const getSign = () => {
      return sign;
    };
  
    return { getName, getSign };
  };

const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const setSign = (sign, index) => {
    board[index] = sign;
  };

  const getSign = (index) => {
    return board[index];
  };

  const resetBoard = () => {
    board.forEach((cell) => (cell = ""));
    for (let i = 0; i < board.length; i++) {
        board[i] = ``
      }
  };

  return { setSign, getSign, resetBoard, };
})();

const GameDisplay = (function () {
  const cells = document.querySelectorAll(".cell");
  const info = document.querySelector(".message");
  const gameInfo = document.querySelector(".win-draw");
  

  document.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target;
    const isCell = target.classList.contains("cell");
    const isDisable = target.classList.contains("disabled");

    if(GameController.getIsOver() === true) return;
    if (isCell && !isDisable) {
      const cellIndex = target.dataset.index;
      target.innerHTML = `<img src="./img/${GameController.getCurrentPlayerSign()}" class="player-img">`;
      GameController.playTurn(parseInt(cellIndex));
      
    }
  });

  const updateGameboard = () => {
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = ``
      }
  }

  const setResultMessage = (info) => {
    if (info == 'winner') {
      setInfo(`${GameController.getCurrentPlayerName()}  has won the game`);
      setGameInfo(`Congratulations!!! ${GameController.getCurrentPlayerName()} you won!!`);
    } else if(info == 'draw'){
      setInfo(`It's a draw`);
      setGameInfo(`Oops!!! It's a draw. Play again`);
    }else{
      setInfo(`${GameController.getCurrentPlayerName()}'s turn to play`);
    }
        
  };

  const setInfo = (message) => {
    info.textContent = message;
  };
  
  const setGameInfo = (message) => {
    gameInfo.textContent = message;

  }

  return {setResultMessage, updateGameboard}
})();

const GameController = (() => { 
    const startGame = document.querySelector(".start");
    const restart = document.querySelector("#restart");
    const form = document.querySelector("form");
    const modal = document.querySelector(".modal");
    const modal1 = document.querySelector(".modal-1");

    let player1, player2, p1, p2, s1, s2;

    const init = () => {
      startGame.addEventListener('click',()=>{
        modal.showModal();
      })

      form.addEventListener('submit', gameStartup);

    }

    function gameStartup(){
      p1 = document.querySelector(`input[name='name1']`).value;
      p2 = document.querySelector(`input[name='name2']`).value;
      s1 = document.querySelector(`#signs-1`).value;
      s2 = document.querySelector(`#signs-2`).value;

      player1 = Player(p1, s1);
      player2 = Player(p2, s2);

      GameDisplay.setResultMessage('playerturn');
      startGame.style.display = "none";
      isOver = false;
      resetGame();
      GameBoard.resetBoard();
      GameDisplay.updateGameboard();
    }
  
    restart.addEventListener("click", () => {
        GameDisplay.setResultMessage('playerturn');
        modal1.style.display = "none";
        isOver = false;
        resetGame();
        GameBoard.resetBoard();
        GameDisplay.updateGameboard();
    }); 
  
  
    let turn = 1;
    let isOver = true;

    const playTurn = (index) => {
      GameBoard.setSign(getCurrentPlayerSign(), index);
      if(checkWinner(index)){
      GameDisplay.setResultMessage('winner');
        reload();
      }
      if(turn === 9 && checkWinner(index) == false){
      GameDisplay.setResultMessage('draw');
        reload();
      }
      turn++
      GameDisplay.setResultMessage(`playerturn`);
      
    };

    const reload = () => {
      isOver = true;
      modal1.style.display = 'flex';
      restart.style.display = "block";
      return;
    }

    const getCurrentPlayerSign = () => {
      return turn % 2 === 1 ? player1.getSign() : player2.getSign();
    };
    const getCurrentPlayerName = () => {
      return turn % 2 === 1 ? player1.getName() : player2.getName();
    };

    const checkWinner = (fieldIndex) => {
      const winConditions = [
        //Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        //Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        //Diagonals
        [0, 4, 8],
        [2, 4, 6],
      ];

      return winConditions
        .filter((combination) => combination.includes(fieldIndex))
        .some((possibleCombination) =>
          possibleCombination.every(
            (index) => GameBoard.getSign(index) === getCurrentPlayerSign()
          )
        );
    };

    const getIsOver = () => {
        return isOver;
    }

    const resetGame = () => {
        turn = 1;
        isOver = false;
    }

    return { playTurn, getCurrentPlayerSign, getCurrentPlayerName, getIsOver, init };
})()

GameController.init();

})()