import { useEffect, useState } from "react";
import style from "./submitedCard.module.css";

import Link from "next/link";

import Image from "next/image";

import checkmark from "../../public/correct.png";



export default function SubmitedCard(props) {

    const [cardActive, setCardActive] = useState(false);

    useEffect(() => {
        if (props.formSubmited) {
            setTimeout(() => {
                setCardActive(true);
            }, 200)
        }
    }, [props])

    return (
        <div className={cardActive ? style.submitedCard : style.submitedCardDisabled}>
            <div className='topSideBar' style={{ backgroundColor: 'brown' }}>
                <div className='btnDecoyHolder' style={{ backgroundColor: 'brown' }}>
                    <div className='btnDecoy' style={{ backgroundColor: 'lightgray' }} />
                    <div className='btnDecoy' style={{ backgroundColor: 'rgb(255, 255, 77)' }} />
                    <div className='btnDecoy' style={{ backgroundColor: 'lightgreen' }} />
                </div>
            </div>

            <div className={style.submitedCardMain}>
                <div className={style.checkmarkHolder}>
                    <Image src={checkmark} layout='responsive' />
                </div>
                <div className={style.submitedCardContent}>
                    <h2>Submited!</h2>
                    <p>Welcome</p>
                </div>
                <div className={style.submiedCardFooter}>
                    <Link href={'/login'}>
                        <p className={style.redirectBtn}>Login Page</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}