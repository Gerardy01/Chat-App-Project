import style from './friendsOverlay.module.css';
import Image from 'next/image';

import leftArrowBtn from '../../public/arrowLeft.png';
import addFriend from '../../public/add-user.png';



export default function FriendsOverlay(props) {
    return (
        <div className={props.friendsActive ? style.friendsOverlay : style.friendsOverlayDisabled}>
            <div className={style.friendsOverlayHeader}>
                <div className={style.backBtnHolder} onClick={() => props.handleFriendsClick()}>
                    <Image src={leftArrowBtn} layout='responsive' />
                </div>
            </div>
            <div className={style.friendsOverlayContent}>
                <div className={style.searchBarHolder}>
                    <input className={style.input} placeholder='search...' />
                    <div className={style.addFriendsBtnHolder}>
                        <div className={style.addFriendsBtn}>
                            <Image src={addFriend} layout='responsive' />
                        </div>
                    </div>
                </div>
                <ul className={style.friendListHolder}>
                    <li className={style.listFriend}>
                        asds
                    </li>
                </ul>
            </div>
        </div>
    )
}