import style from './navMenu.module.css';
import Image from 'next/image';

import leftArrowBtn from '../../public/arrowLeft.png';



export default function NavMenu(props) {



    return (
        <div className={props.navMenuActive ? style.navMenu : style.navMenuDisabled}>
            <div className={style.navMenuHeader}>
                <div className={style.backBtnHolder} onClick={() => props.handleNavMenuClick()}>
                    <Image src={leftArrowBtn} layout='responsive' />
                </div>
            </div>
        </div>
    )
}