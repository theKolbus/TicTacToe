import View from "/view.js"
import Game from "/game.js"

const players = {
  player1: { id: 1, name: "Player 1", icon: "fa-x", color: "turquoise" },
  player2: { id: 2, name: "Player 2", icon: "fa-o", color: "yellow" },
};

function init() {
  const view = new View()
  const game = new Game("Tikky-Takky-Token", players)

  game.addEventListener('statechange', () => {
    view.render(game)
  })

  window.addEventListener('storage', () => {
    "another window has made a move"
    view.render(game)
  })

  view.render(game)

  view.bindGameResetEvent(event => {
    console.log("Game Reset")
    game.resetGame()
  })

  view.bindNewRoudEvent(event => {
    console.log("New Round")
    game.resetRound()
  })

  view.bindPlayerMoveEvent(square => {

    const existingMove = game.moves.find(move => move.squareId === +square.id)
    if (existingMove) return

    console.log("Player Move")

    game.makeMove(+square.id)
  })
}

document.addEventListener("DOMContentLoaded", init)