import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from "../styles/chat.module.css"

import getCookie from '../utils/getCookie';
import { isMobile } from 'react-device-detect';
import jwtDecode from 'jwt-decode';

import Navbar from '../components/navbar/Navbar';
import ConversationCard from '../components/conversationCard/ConversationCard';
import MessageCard from '../components/messageCard/MessageCard';

import robotImg from '../public/robot.png';
import unknownUser from '../public/unknownUser.png';
import chatBot from '../public/chatbot.png';
import sendImg from '../public/send.png';



export default function Chat() {

    const navigate = useRouter();

    const [loading, setLoading] = useState(true);
    const [conversationData, setConversationData] = useState([]);

    const [chatOpen, setChatOpen] = useState(false);
    const [msgData, setMsgData] = useState(null);
    const [userData, setUserData] = useState(null);

    const [isGroup, setIsGroup] = useState(false);

    const [message, setMessage] = useState("");

    const [userId, setUserId] = useState(null);
    const [sourceId, setSourceId] = useState(null);

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
                        setUserId(decode.id);
                    });
                }
            }).catch(err => {
                console.log(err);
                alert("Try Again");
            });
        }
    }, [])

    useEffect(() => {
        if (loading) {

        }
    }, [loading])



    function handleConverastionClick(conversationData) {
        setChatOpen(true);
        console.log(conversationData);
        fetch(`http://localhost:8000/api/v1/chat/message/${conversationData.isGroup ? 
            conversationData.groupId :
            conversationData.privateMessageId
            }`, {
            method: 'GET',
            mode: 'cors'
        }).then(res => {
            if (res.status === 204) {
                setMsgData(0);
                return
            }

            res.json().then(data => {
                setMsgData(data.data);
            });
        }).catch(err => {
            console.log(err);
            alert("Try Again");
        });

        if (conversationData.isGroup) {
            setSourceId(conversationData.groupId);
            fetch(`http://localhost:8000/api/v1/group/${conversationData.groupId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {

                if (res.status === 201) {
                    res.json().then(data => {
                        setUserData(data.data);
                    });
                    return;
                }

                if (res.status === 500) {
                    throw Error("Server Error");
                }
                
            }).catch(err => {
                console.log(err);
                alert("Try Again");
            });
            setIsGroup(true);
            return;
        }
        
        setSourceId(conversationData.privateMessageId);
        fetch(`http://localhost:8000/api/v1/users/${conversationData.displayedUserId}`, {
            method: 'GET',
            mode: 'cors'
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    setUserData(data.data);
                });
            }

            if (res.status === 500) {
                throw Error("Server Error")
            }
        }).catch(err => {
            console.log(err);
            alert("Try Again");
        });
        setIsGroup(false);
    }

    function handleSubmitMsg(e) {
        e.preventDefault();

        if (message.length === 0) {
            return
        }

        const newMesage = {
            sourceId: sourceId,
            senderId: userId,
            text: message
        }

        fetch('http://localhost:8000/api/v1/chat/message', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMesage)
        }).then(res => {
            if (res.status === 404) {
                throw Error("source not found")
            }

            if (res.status === 500) {
                throw Error("Server Error")
            }

            res.json().then(data => {
                setMsgData(msgData.concat(data.data))
                setMessage("");
            })

        }).catch(err => {
            console.log(err);
            alert("Try Again");
        });
    }

    

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
                                                    <li key={i} onClick={() => handleConverastionClick(data)} >
                                                        <ConversationCard data={data} key={i} />
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </>
                                }
                            </div>
                            {chatOpen ?
                                <>
                                    {userData && (
                                        <div className={styles.messageComponent}>
                                            <div className={styles.messageHeader}>
                                                <div className={styles.messageHeaderRight}>
                                                    {!isGroup ?
                                                        <>
                                                            <div className={styles.messageHeaderPict}>
                                                                <Image src={userData.profilePicture !== "" ?
                                                                    userData.profilePicture :
                                                                    unknownUser
                                                                } layout='responsive' />
                                                            </div>
                                                            <p>{userData.name}</p>
                                                        </> : <>
                                                            <div className={styles.messageHeaderPict}>
                                                                <Image src={userData.groupProfilePict !== "" ?
                                                                    userData.groupProfilePict :
                                                                    chatBot
                                                                } layout='responsive' />
                                                            </div>
                                                            <p>{userData.groupName} &#40;{userData.members?.length}&#41;</p>
                                                        </>
                                                    }
                                                </div>
                                            </div>

                                            {msgData && msgData !== 0 ? (
                                                <ul className={styles.messageListHolder}>
                                                    {msgData.map((data, i) => {
                                                        return (
                                                            <MessageCard data={data} key={i} />
                                                        )
                                                    })}
                                                </ul>
                                            ) : (
                                                <div>
                                                    no msg
                                                </div>
                                            )}

                                            <form className={styles.messageFooter} onSubmit={e => handleSubmitMsg(e)}>
                                                <input className={styles.chatInput} 
                                                    placeholder='Message...'
                                                    onChange={e => setMessage(e.target.value)} 
                                                    value={message}
                                                />
                                                <div className={styles.footerRight}>
                                                    <button className={styles.sendBtn}
                                                        type='submit'
                                                    >
                                                        <div className={styles.sendImg}>
                                                            <Image src={sendImg} layout='responsive' />
                                                        </div>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </> : <>
                                    <div className={styles.messageComponentClosed}>
                                        aaa
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </section>
            )
        }
    }

    return <>{renderedComponent()}</>
}