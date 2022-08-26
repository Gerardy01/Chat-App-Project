import { useEffect, useState } from 'react'
import style from './registerPageOne.module.css'



export default function RegisterPageOne() {

    const [usernameInput, setUsernameInput] = useState("");

    return (
        <div className={style.registerForm}>
            <div className={style.inputHolder}>
                <p className={style.inputLabel}>USERNAME</p>
                <input className={style.input} onChange={(e) => setUsernameInput(e.target.value)} />
            </div>

            <div className={style.inputHolder}>
                <p className={style.inputLabel}>EMAIL</p>
                <input className={style.input} />
            </div>
        </div>
    )
}