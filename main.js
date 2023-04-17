document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const menuList = document.querySelector(".menu .items");
  const resetBtn = document.querySelector("#reset-btn");
  const playAgainBtn = document.querySelector("#play_again-btn");
  const newRoundBtn = document.querySelector("#new_round-btn");
  const squares = document.querySelectorAll(".square");
  const scoreTies = document.querySelector("#score-tie");
  const scoreP1 = document.querySelector("#score-p1");
  const scoreP2 = document.querySelector("#score-p2");
  const turn = document.querySelector(".turn");
  const modal = document.querySelector(".modal");
  const modalText = modal.querySelector("p");

  const players = {
    player1: { id: 1, icon: "fa-x", color: "turquoise" },
    player2: { id: 2, icon: "fa-o", color: "yellow" },
  };

  const state = {
    currentPlayer: players.player1,
    moves: { 1: [], 2: [] },
    results: {
      1: 0,
      2: 0,
      ties: 0,
    },
  };

  const switchPlayer = () => {
    state.currentPlayer =
      state.currentPlayer === players.player1
        ? players.player2
        : players.player1;
    markPlayer();
  };

  const markPlayer = () => {
    turn.innerHTML = "";
    markIcon(turn);
    let p = document.createElement("p");
    p.classList.add(state.currentPlayer.color);
    p.innerText = `Player ${state.currentPlayer.id}, you'r up!`;
    turn.appendChild(p);
  };

  const resetGame = () => {
    state.moves = { 1: [], 2: [] };
    squares.forEach((square) => {
      square.innerHTML = "";
    });
    hideModal();
  };

  const clearRound = () => {
    state.results = { 1: 0, 2: 0, ties: 0 };
    resetGame();
    scoreP1.innerHTML = `${state.results[1]} Wins`;
    scoreP2.innerHTML = `${state.results[2]} Wins`;
    scoreTies.innerHTML = `${state.results.ties}`;
  };

  const revealModal = (winner) => {
    if (winner === "tie") modalText.innerHTML = "It's a Tie";
    if (winner === 1 || winner === 2)
      modalText.innerHTML = `Player ${winner} Wins!`;
    modal.classList.remove("hidden");
  };
  const hideModal = () => {
    modal.classList.add("hidden");
  };

  const markWinner = (player) => {
    state.results[player.id] += 1;
    console.log(state.results);
    scoreP1.innerHTML = `${state.results[1]} Wins`;
    scoreP2.innerHTML = `${state.results[2]} Wins`;
    revealModal(player.id);
  };

  const markTie = () => {
    state.results.ties += 1;
    console.log(state.results);
    scoreTies.innerHTML = `${state.results.ties}`;
    revealModal("tie");
  };

  const winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const isWinningPattern = (arr) => {
    let won = false;
    if (arr.every((el) => state.moves[1].includes(el))) won = true;
    if (arr.every((el) => state.moves[2].includes(el))) won = true;
    return won;
  };

  const isWon = () => {
    let won = false;
    winningPatterns.forEach((pattern) => {
      if (isWinningPattern(pattern)) {
        won = true;
        return;
      }
    });
    return won;
  };

  const isTied = () => {
    return state.moves[1].length + state.moves[2].length >= 9;
  };

  const isSquareMarked = (square) => {
    let marked = false;
    if (state.moves[1].includes(parseInt(square.id))) marked = true;
    if (state.moves[2].includes(parseInt(square.id))) marked = true;
    return marked;
  };

  const markIcon = (square) => {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add(state.currentPlayer.icon);
    icon.classList.add(state.currentPlayer.color);
    square.appendChild(icon);
  };

  const makeMove = (square) => {
    // check if there is already a move
    if (isSquareMarked(square)) return;
    if (isWon()) return;

    // mark move in player state
    state.moves[state.currentPlayer.id].push(parseInt(square.id));
    // mark icon
    markIcon(square);

    // check if wins or ties
    if (isWon()) {
      markWinner(state.currentPlayer);
      return true;
    }
    if (isTied()) markTie();

    // switch players
    switchPlayer();
  };

  menuBtn.addEventListener("click", (event) => {
    menuList.classList.toggle("hidden");
  });

  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);

  newRoundBtn.addEventListener("click", clearRound);

  squares.forEach((square) => {
    square.addEventListener("click", (event) => {
      makeMove(square);
    });
  });
});
