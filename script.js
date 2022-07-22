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

// const begin = (() => {
//     const form = document.querySelector("form");
//     const startGame = document.querySelector(".start");
//     const modal = document.querySelector(".modal");
  
//     startGame.addEventListener("click", () => {
//       modal.showModal();
//     });
  
//       let p1, p2, s1, s2;
//       form.addEventListener("submit", () => {
//           p1 = document.querySelector(`input[name='name1']`).value;
//           p2 = document.querySelector(`input[name='name2']`).value;
//           s1 = document.querySelector(`#signs-1`).value;
//           s2 = document.querySelector(`#signs-2`).value;
//         });

//        const  player1 = Player(p1, s1);
//        const  player2 = Player(p2, s2);
        
//         return {player1, player2}
//   })()



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
  

  document.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target;
    const isCell = target.classList.contains("cell");
    const isDisable = target.classList.contains("disabled");

    if(GameController.getIsOver() === true) return;
    // console.log(GameController.getIsOver())
    if (isCell && !isDisable) {
      const cellIndex = target.dataset.index;
      target.innerHTML = `<p>${GameController.getCurrentPlayerSign()}</p>`;
      GameController.playTurn(parseInt(cellIndex));
      
    }
  });

  const updateGameboard = () => {
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = ``
      }
  }

  const setResultMessage = (winner) => {
    setInfo(winner);
        
  };

  const setInfo = (message) => {
    info.textContent = message;
  };

  return {setResultMessage, updateGameboard}
})();

const GameController = (() => { 
    const startGame = document.querySelector(".start");
    const form = document.querySelector("form");
    const modal = document.querySelector(".modal");

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

      GameDisplay.setResultMessage(`${getCurrentPlayerName()}'s turn to play`);
      startGame.style.display = "none";
      isOver = false;
      resetGame();
      GameBoard.resetBoard();
      GameDisplay.updateGameboard();
    }
  
    // startGame.addEventListener("click", () => {
    //     GameDisplay.setResultMessage(`${getCurrentPlayerName()}'s turn to play`);
    //     startGame.style.display = "none";
    //     isOver = false;
    //     resetGame();
    //     GameBoard.resetBoard();
    //     GameDisplay.updateGameboard();
    // }); 
    
    // const player1 = Player("Benaiah", "X")
    // const player2 = Player("Temitope", "O")
  
    let turn = 1;
    let isOver = true;

    const playTurn = (index) => {
      // const currentPlayerSign = getCurrentPlayerSign();
    //   const currentPlayerName = getCurrentPlayerName();
      GameBoard.setSign(getCurrentPlayerSign(), index);
      if(checkWinner(index)){
      GameDisplay.setResultMessage(`${getCurrentPlayerName()} has won the Game`);
        isOver = true;
        startGame.textContent = "Restart";
        startGame.style.display = "block";

        return;
      }
      if(turn === 9){
      GameDisplay.setResultMessage("Its a Draw Game");
        isOver = true;
        startGame.textContent = "Restart";
        startGame.style.display = "block";
        return;
      }
      turn++
      GameDisplay.setResultMessage(`${getCurrentPlayerName()}'s turn to play`);
      
    };

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