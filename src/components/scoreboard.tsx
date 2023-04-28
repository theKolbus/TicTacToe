import "./scoreboard.css"

type Props = {p1wins: number, p2wins:number, ties:number}

export default function ScoreBoard(props: Props){
    return (
                <>
                   <div id="scoreboard-p1" className="score shadow">
                       <p>Player 1</p>
                       <span>{props.p1wins} Wins</span>
                   </div>
                   <div id="scoreboard-tie" className="score shadow">
                       <p>Ties</p>
                       <span>{props.ties}</span>
                   </div>
                   <div id="scoreboard-p2" className="score shadow">
                       <p>Player 2</p>
                       <span>{props.p2wins} Wins</span>
                   </div>
                </>
    )
}