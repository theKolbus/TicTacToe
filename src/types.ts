export type Player = {
    id: number, 
    name: string, 
    icon: string, 
    color: string
}

export type Move = {
    squareId: number,
    player: Player
}
export type GameStatus = {
    isComplete: boolean,
    winner: Player | null
}
export type singleGame = {
    moves: Move[],
    status: GameStatus,
}

export type GameState = {
    moves: Move[],
    history: {
        currentRound: singleGame[],
        allTime: singleGame[]
    }
}