import { Player } from '../types'
import './turn.css'
import Icon from './icon'

type Props = {
    player?: Player
}

export default function Turn(props: Props){
    return (
        <div key={props.player?.name} className="turn">
        {props.player ? 
            <>
                <Icon {...props.player} />
                <p className={props.player.color}>{props.player.name}, you're up!</p>
            </>
            : ''}
        </div>
    )
}