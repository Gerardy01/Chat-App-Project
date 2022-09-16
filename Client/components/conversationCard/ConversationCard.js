import { useEffect, useState } from 'react';
import style from './conversationCard.module.css';

import Image from 'next/image';

import unknownUser from '../../public/unknownUser.png';



export default function ConversationCard(props) {

    const [data, setData] = useState(null);
    const [conversationData, setConversationData] = useState(null);
    const [chatSourceId, setChatSourceId] = useState(null);

    const [msgData, setMsgData] = useState(null);

    const [isGroup, setIsGroup] = useState(null);

    useEffect(() => {
        if (props) {
            setData(props.data);
        }
    }, [props])

    useEffect(() => {
        if (data && data.isGroup) {
            setChatSourceId(data.groupId);
        }

        if (data && !data.isGroup) {
            setIsGroup(false);
            fetch(`http://localhost:8000/api/v1/users/${data.displayedUserId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setConversationData(data.data)
                    });
                }

                if (res.status === 500) {
                    throw Error("Server Error")
                }
            }).catch(err => {
                console.log(err);
                alert("Try Again")
            });
            setChatSourceId(data.privateMessageId);
        }
    }, [data])

    useEffect(() => {
        if (chatSourceId) {
            fetch(`http://localhost:8000/api/v1/chat/message/${chatSourceId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {
                if (res.status === 204) {
                    setMsgData(" ");
                    return
                }

                res.json().then(data => {
                    setMsgData(data.data[0].text);
                });
            }).catch(err => {
                console.log(err);
                alert("Try Again");
            });
        }
    }, [chatSourceId])

    useEffect(() => {
        if (conversationData) {
            // console.log(conversationData);
        }
    }, [conversationData])

    return (
        <li className={style.conversationCard}>
            {conversationData && msgData && (
                <>
                    <div className={style.profilePictHolder}>
                        <Image 
                            src={conversationData.profilePicture !== "" ? 
                                    conversationData.profilePicture : 
                                    unknownUser
                                } 
                            alt={'user profie picture'}
                            layout='responsive'
                        />
                    </div>
                    <div className={style.conversationCardContent}>
                        <div className={style.conversationCardMain}>
                            <h2>{conversationData.username}</h2>
                            <p>{msgData}</p>
                        </div>
                        <div className={style.rightSideContent}>
                            <p>Time?</p>
                        </div>
                    </div>
                </>
                
            )}
        </li>
    )
}
