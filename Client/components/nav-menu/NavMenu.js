import style from './navMenu.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import leftArrowBtn from '../../public/arrowLeft.png';
import unknownUser from '../../public/unknownUser.png';



export default function NavMenu(props) {

    const navigate = useRouter();

    function handleLogout() {
        let now = new Date()
        const time = now.getTime();
        const expireTime = time + 1000
        
        now.setTime(expireTime)
        document.cookie = `token=0; expires=${now.toUTCString()}`

        navigate.push("/login")
    }

    return (
        <div className={props.navMenuActive ? style.navMenu : style.navMenuDisabled}>
            <div className={style.navMenuHeader}>
                <div className={style.backBtnHolder} onClick={() => props.handleNavMenuClick()}>
                    <Image src={leftArrowBtn} layout='responsive' />
                </div>
            </div>
            <ul className={style.navMenuItemHolder}>
                <Link href={'/profile'}>
                    <li className={style.navMenuItem}>
                        <div className={style.profilePictHolder}>
                            <Image src={unknownUser} layout='responsive' />
                        </div>
                        <p className={style.profileName}>Name</p>
                    </li>
                </Link>
                <li className={style.navMenuItem} onClick={() => props.handleFriendsClick()}>Friends</li>
                <li className={style.navMenuItem} onClick={() => props.handleGroupsClick()}>Groups</li>
                <li className={style.logoutBtn} onClick={handleLogout}><p className={style.logoutText}>Logout</p></li>
            </ul>
        </div>
    )
}