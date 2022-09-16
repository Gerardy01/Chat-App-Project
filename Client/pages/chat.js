import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from "../styles/chat.module.css"

import getCookie from '../utils/getCookie';
import { isMobile } from 'react-device-detect';
import jwtDecode from 'jwt-decode';

import Navbar from '../components/navbar/Navbar';
import ConversationCard from '../components/conversationCard/ConversationCard';

import robotImg from '../public/robot.png';



export default function Chat() {

    const navigate = useRouter();

    const [loading, setLoading] = useState(true);
    const [conversationData, setConversationData] = useState([]);

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



    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            const decode = jwtDecode(token);
            fetch(`http://localhost:8000/api/v1/chat/conversation/${decode.id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 404) {
                    setConversationData(false);
                    return
                }
                
                if (res.status === 200) {
                    res.json().then(data => {
                        setConversationData(data.data);
                    });
                }
            }).catch(err => {
                console.log(err);
                alert("Try Again");
            });
        }
    }, [])



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
                        <div className={styles.chatPageContentMain}>
                            <div className={styles.conversationListComponent}>
                                <Navbar />
                                {conversationData.length === 0 ?
                                    <>
                                        <div className={styles.conversationLoading}>
                                            <div className={'loader2'} ></div>
                                        </div>
                                    </> : !conversationData ?
                                    <>
                                        <div className={styles.conversationFail}>
                                            <div className={styles.conversationFailContent}>
                                                <div className={styles.robotImgHolder}>
                                                    <Image src={robotImg} layout='responsive' />
                                                </div>
                                                <p>You don't have any conversations</p>
                                            </div>
                                        </div>
                                    </> : <>
                                        <ul className={styles.conversationListHolder}>
                                            {conversationData.map((data, i) => {
                                                return (
                                                    <ConversationCard data={data} key={i} />
                                                )
                                            })}
                                        </ul>
                                    </>
                                }
                            </div>
                            <div className={styles.messageComponent}>
                                
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }

    return <>{renderedComponent()}</>
}