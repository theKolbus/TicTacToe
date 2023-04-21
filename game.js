const initialValue = {
    moves: [],
    history: {
        currentRound: [],
        allTime:[]
    }
}

export default class Game extends EventTarget {

    constructor(key, players) {
        super()
        this.storageKey = key
        this.players = players
    }

    get currentPlayer(){
        const state = this.#getState()
        if (state.moves.length === 0){
            let playerkeys = Object.keys(this.players)
            let randomPlayer = playerkeys[playerkeys.length * Math.random() << 0]
            return this.players[randomPlayer]
        }else{ 
            return state.moves.at(-1).player.id === 1 ? this.players.player2 : this.players.player1;
        }
    }

    get moves(){
        const state = this.#getState()
        return state.moves
    }
    
    get status() {
        const state = this.#getState()

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

        for (const key in this.players){
            let player = this.players[key]
            let currentPlayersMoves = state.moves.filter((move) => move.player.id === player.id).map(move => move.squareId)
            for (const pattern of winningPatterns){
                if (pattern.every(el => currentPlayersMoves.includes(el))) winner = player
            }
        }
    
        return {
          playable: winner != null || state.moves.length >= 9 ? 'complete' : 'incomplete',
          winner
        }
        
    }

    get isComplete(){
        return this.status.playable === 'complete'
    }

    get stats(){
        const state = this.#getState()
        const  playerStats = {}
        for (const key in this.players) {
            const player = this.players[key]
            const wins = state.history.currentRound.filter(game => game.status.winner?.id === player.id).length
            playerStats[key] = {...player, wins}
        }
        return {
            playerStats: playerStats,
            ties: state.history.currentRound.filter(game => game.status.winner === null).length
        }

    }

    makeMove(squareId){
        const stateClone = structuredClone(this.#getState())

        stateClone.moves.push({squareId: squareId, player: this.currentPlayer})

        this.#saveState(stateClone)

        console.log(JSON.parse(window.localStorage.getItem(this.storageKey)))
    }

    resetGame(){
        const stateClone = structuredClone(this.#getState())
        // const {status, moves} = stateClone
        if (this.isComplete){
            console.log('Game Pushed to History')
            stateClone.history.currentRound.push({status: this.status, moves: stateClone.moves})
        }

        stateClone.moves = []

        this.#saveState(stateClone)

        console.log(this.stats)
    }

    resetRound(){
        const stateClone = structuredClone(this.#getState())
        this.resetGame()
        stateClone.history.allTime.push(...stateClone.history.currentRound)
        stateClone.history.currentRound = []
        this.#saveState(stateClone)
    }

    #getState(){
        const item = window.localStorage.getItem(this.storageKey)
        return item ? JSON.parse(item) : initialValue
    }

    #saveState(stateOrFn){
        const prevState = this.#getState()

        let newState

        switch (typeof stateOrFn){
            case "function":
                newState = stateOrFn(prevState)
                break
            case "object":
                newState = stateOrFn
                break;
            default:
                throw new Error("Ivalid argument passed to saveState")
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(newState))
        this.dispatchEvent(new Event('statechange'))
    }
}