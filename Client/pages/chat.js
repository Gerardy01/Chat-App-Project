import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from "../styles/chat.module.css"

import getCookie from '../utils/getCookie';
import { isMobile } from 'react-device-detect';



export default function Chat() {

    const navigate = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            fetch("http://localhost:8000/api/v1/token", {
                method: 'GET',
                mode: 'cors',
                headers: {
                    authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        document.cookie = `token=${data.access_token}`
                    });
                    setLoading(false);
                    return
                }
                if (res.status === 401) {
                    navigate.push('/login');
                }
            }).catch(err => {
                alert("try again");
            });
        } else {
            navigate.push('/login');
        }
    }, []);



    if (loading) {
        return <div>loading</div>
    }

    function renderedComponent() {
        if (!isMobile) {
            return (
                <section className={styles.chatPage}>
                    <div className={styles.chatPageContent}>
                        <div className='topSideBar' style={{ backgroundColor: 'lightgreen' }}>
                            <div className='btnDecoyHolder'>
                                <div className='btnDecoy' style={{ backgroundColor: 'red' }} />
                                <div className='btnDecoy' style={{ backgroundColor: 'orange' }} />
                                <div className='btnDecoy' style={{ backgroundColor: 'blue' }} />
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }

    return <>{renderedComponent()}</>
}