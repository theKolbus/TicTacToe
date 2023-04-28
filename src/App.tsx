import "./App.css";
import Menu from "./components/menu";
import Modal from "./components/modal";
import ScoreBoard from "./components/scoreboard";
import Turn from "./components/turn";
import Square from "./components/square";
import type { GameState, Player, Move, GameStatus, singleGame } from "./types"
import { useLocalStorage } from "./useLocalStorage";

const players: Player[] = [
    { id: 1, name: "Player 1", icon: "fa-x", color: "turquoise" },
    { id: 2, name: "Player 2", icon: "fa-o", color: "yellow" },
  ];

  type PlayerWithStats = Player & {wins: number}

  export type DerivedStats = {
      playerStats: PlayerWithStats[],
      ties: number
  }
  
  export type DerivedGame = {
      moves: Move[],
      currentPlayer: Player,
      status: GameStatus
  }

function deriveStats(state: GameState): DerivedStats {
    const playerStats = players.map((player) => {
        const wins = state.history.currentRound.filter(
          (game) => game.status.winner?.id === player.id
        ).length; 
        return {
            ...player,
            wins,
          };
        })
    return {
        playerStats: playerStats,
        ties: state.history.currentRound.filter((game) => game.status.winner === null).length
    }

}

function deriveGame(state:GameState): DerivedGame{

    return {
        moves: state.moves,
        currentPlayer: getCurrentPlayer(state),
        status: deriveStatus(state)
        
    }

}

function deriveStatus(state:GameState): GameStatus {

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
    
    let winner = null

    for (const player of players){
        let currentPlayersMoves = state.moves.filter(move => move.player.id === player.id).map(move => move.squareId)
        for (const pattern of winningPatterns){
            if (pattern.every(el => currentPlayersMoves.includes(el))) winner = player
        }
    }

    return {
        isComplete: winner != null || state.moves.length >= 9,
        winner
    }
    
}

function getCurrentPlayer(state: GameState):Player {
    if (state.moves.length > 0) {
        const lastPlayer = state.moves[state.moves.length - 1].player
        console.log('Last Move:', lastPlayer.name)
        return lastPlayer.id === 1  ? players[1] : players[0]
    }

    const lastRoundWinner = lastWinner(state.history.currentRound)
    if (lastRoundWinner) {
        console.log('Last Round  Winner:', lastRoundWinner?.name)
        return lastRoundWinner.id === 1 ? players[1] : players[0]
    }

    const lastAllTimeWinner = lastWinner(state.history.allTime)
    if (lastAllTimeWinner) {
        console.log('Last All Time Winner:', lastAllTimeWinner?.name)
        return lastAllTimeWinner.id === 1 ? players[1] : players[0]
    }
    

    let randomPlayer = players.length * Math.random() << 0
    console.log('Random Player:', players[randomPlayer].name)
    return players[randomPlayer]
}

function lastWinner(games: singleGame[]): Player | null {
    if (games.length === 0) return null
    
    const lastWonGame = [...games].reverse().find(game => game.status.winner)
    if (lastWonGame) {return lastWonGame.status.winner}
    return null
}

export default function App() {

    const [state, setState] = useLocalStorage<GameState>('Ticcy-Tacky-Token',{
        moves: [],
        history: {
            currentRound: [],
            allTime:[]
        }
    })

    const game = deriveGame(state)
    const stats = deriveStats(state)

    function resetGame(newRound: boolean){
        const newState = structuredClone(state)
        const {status, moves} = game
        if (status.isComplete) {
            newState.history.currentRound.push({status, moves})
            newState.history.allTime.push({status, moves})
        }
        if (newRound) {
            newState.history.currentRound = []
        }
        newState.moves = []
        setState(newState)
        console.log('New Game')
    }

    function handdlePlayerMove(squareId: number, player: Player){
        const newState = structuredClone(state)
        newState.moves.push({
            squareId,
            player
        })
        setState(newState)
    }

    return (
    <>
        <main>
            <div className="grid">

            <Turn player={game.status.isComplete ? undefined : {...game.currentPlayer}} />

            <Menu onAction={action => resetGame(action === 'new-round')} />

            {/* Board */}
            {[1,2,3,4,5,6,7,8,9].map(squareId => {

                const existingMove = state.moves.find(move => move.squareId === squareId)

                function onClick(): void {
                    if (game.status.isComplete) return
                    if (existingMove) return

                    handdlePlayerMove(squareId, game.currentPlayer)
                }

                return (
                    <Square key={squareId} onClick={onClick} player={existingMove?.player} />
                )
            })}

            <ScoreBoard p1wins={stats.playerStats[0].wins}  p2wins={stats.playerStats[1].wins} ties={stats.ties}/>

            </div>
        </main>
        {game.status.isComplete && <Modal 
            message={game.status.winner ? `${game.status.winner.name} Wins!` : "It's a Tie"}
            onClick={() => resetGame(false)} 
            />}
    </>
    )
};