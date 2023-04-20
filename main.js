import View from "/view.js"
import Game from "/game.js"

const players = {
  player1: { id: 1, name: "Player 1", icon: "fa-x", color: "turquoise" },
  player2: { id: 2, name: "Player 2", icon: "fa-o", color: "yellow" },
};

function init() {
  const view = new View()
  const game = new Game("Tikky-Takky-Token", players)

  function initView() {
    view.hideAll()
    view.resetSquares()
    view.setTurnIndicator(game.currentPlayer)
    view.updateScoreboard(
      game.stats.playerStats.player1.wins, 
      game.stats.playerStats.player2.wins,
      game.stats.playerStats.ties
    )
    view.initializeMoves(game.moves)
  }

  window.addEventListener('storage', () => {
    "another window has made a move"
    initView()
  })

  initView()

  view.bindGameResetEvent(event => {
    console.log("Game Reset")
    game.resetGame()
    initView()
  })

  view.bindNewRoudEvent(event => {
    console.log("New Round")
    game.resetRound()
    initView()
  })

  view.bindPlayerMoveEvent(square => {

    const existingMove = game.moves.find(move => move.squareId === square.id)
    if (existingMove) return

    console.log("Player Move")

    view.handlerPlayerMove(square, game.currentPlayer)
    game.makeMove(+square.id)

    if (game.status.status === "complete") {
      view.revealModal(game.status.winner)
      return
    }

    view.setTurnIndicator(game.currentPlayer)
  })
}

document.addEventListener("DOMContentLoaded", init)