import { Player } from '../types'
import './square.css'
import {useState} from 'react'
import Icon from './icon'

type Props = {
    player?: Player,
    onClick(): void
}

export default function Square(props: Props){

    return(
        <div className="square shadow" onClick={props.onClick}>
            { props.player ? <Icon {...props.player} /> : ''}
        </div>
    )
}