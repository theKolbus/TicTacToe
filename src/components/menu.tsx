import { createRef, useEffect, useState } from 'react'
import './menu.css'
import classNames from 'classnames'

type Props = {
    onAction(action: 'reset' | 'new-round'): void
}

export default function Menu({onAction}: Props){

    // Creating Off Click Event to Close Menu
    const menuRef = createRef<HTMLDivElement>()
    useEffect(() => {
        let handler = (e: { target: any }) => {
            if (!menuRef.current) return
            if (!menuRef.current.contains(e.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => { document.removeEventListener('mousedown', handler)}
    })

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="menu" ref={menuRef}>
            <button className="menu-btn" onClick={() => setMenuOpen((prev) => !prev)}>
                Actions
                <i className={classNames('fa-solid', menuOpen ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
            </button>

            {menuOpen && (
                <div className="items border">
                    <button onClick={() => {onAction('reset'); setMenuOpen(false) }}>Reset</button>
                    <button onClick={() => {onAction('new-round'); setMenuOpen(false) }}>New Round</button>
                </div>
            )}
        </div>
    )
}