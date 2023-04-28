import classNames from 'classnames'
import { Player } from '../types'

export default function Icon(player: Player) {
    return (
        <i className={classNames('fa-solid', player.color, player.icon)}></i>
    )
}