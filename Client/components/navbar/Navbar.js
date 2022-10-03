import { useEffect, useState } from 'react';
import style from './navbar.module.css';
import Image from 'next/image';

import hamMenu from '../../public/hammenu.png';
import search from '../../public/search.png';
import close from '../../public/close.png';



export default function Navbar(props) {

    const [searchOpen, setSearchOpen] = useState(false);
    const [closeActive, setCloseActive] = useState(false);

    const [searchValue, setSearchValue] = useState("");

    function handleChange(e) {
        if (e.target.value !== "") {
            setCloseActive(true);
        } else {
            setCloseActive(false);
        }
        setSearchValue(e.target.value);
    }

    useEffect(() => {
        if (searchValue !== "") {
            
        }
    }, [searchValue])

    return (
        <section className={style.navbar}>
            <div className={style.hamMenuHolder} onClick={() => props.handleNavMenuClick()}>
                <Image src={hamMenu} layout='responsive' />
            </div>
            <div className={searchOpen ? style.searchBox : style.searchBoxClosed}>
                <div className={style.searchMainHolder}>
                    <div className={searchOpen ? style.searchHolder : style.searchHolderClosed}>
                        <Image 
                            src={search} 
                            layout='responsive' 
                            onClick={() => setSearchOpen(!searchOpen)}
                        />
                    </div>
                    <input className={searchOpen ? style.input : style.inputDisabled}
                        placeholder='search...'
                        onChange={e => handleChange(e)}
                        value={searchValue}
                    />
                </div>
                <div className={closeActive ? style.closeHolder : style.closeHolderDisabled}>
                    <Image 
                        src={close} 
                        layout='responsive' 
                        onClick={() => {setSearchValue(""), setCloseActive(false)}}
                    />
                </div>
            </div>
        </section>
    )
}