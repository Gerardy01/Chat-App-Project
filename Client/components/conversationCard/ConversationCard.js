import { useEffect, useState } from 'react';
import style from './conversationCard.module.css';

import Image from 'next/image';

import unknownUser from '../../public/unknownUser.png';
import unavailableGroupPict from '../../public/chatbot.png';



export default function ConversationCard(props) {

    const [data, setData] = useState(null);
    const [conversationData, setConversationData] = useState(null);
    const [chatSourceId, setChatSourceId] = useState(null);

    const [msgData, setMsgData] = useState(null);

    const [isGroup, setIsGroup] = useState(null);
    const [groupMemberCount, setGroupMemberCount] = useState(0);

    useEffect(() => {
        if (props) {
            setData(props.data);
        }
    }, [props])

    useEffect(() => {
        if (data && data.isGroup) {
            setIsGroup(true);
            fetch(`http://localhost:8000/api/v1/group/${data.groupId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {

                if (res.status === 201) {
                    res.json().then(data => {
                        setConversationData(data.data);
                        setGroupMemberCount(data.data.members.length);
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
                alert("Try Again");
            });
            setChatSourceId(data.privateMessageId);
        }
    }, [data])

    useEffect(() => {
        if (chatSourceId) {
            fetch(`http://localhost:8000/api/v1/chat/message/latest/${chatSourceId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {
                if (res.status === 200) {
                    setMsgData(" ");
                    return
                }

                res.json().then(data => {
                    setMsgData(data.data.text);

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
        <div className={style.conversationCard}>
            {conversationData && msgData && (
                <>
                    {isGroup ?
                        <>
                            <div className={style.profilePictHolder}>
                                <Image 
                                    src={conversationData.groupProfilePict !== "" ? 
                                            conversationData.groupProfilePict : 
                                            unavailableGroupPict
                                        } 
                                    alt={'user profie picture'}
                                    layout='responsive'
                                    priority={true}
                                />
                            </div>
                            <div className={style.conversationCardContent}>
                                <div className={style.conversationCardMain}>
                                    <div className={style.groupNameHolder}>
                                        <h3 className={style.groupNameMain}>{conversationData.groupName}</h3>
                                        <h3>&#40;{groupMemberCount}&#41;</h3>
                                    </div>
                                    <p>{msgData}</p>
                                </div>
                                <div className={style.rightSideContent}>
                                    <p>Time?</p>
                                </div>
                            </div>
                        </> : <>
                            <div className={style.profilePictHolder}>
                                <Image 
                                    src={conversationData.profilePicture !== "" ? 
                                            conversationData.profilePicture : 
                                            unknownUser
                                        } 
                                    alt={'user profie picture'}
                                    layout='responsive'
                                    priority={true}
                                />
                            </div>
                            <div className={style.conversationCardContent}>
                                <div className={style.conversationCardMain}>
                                    <h2>{conversationData.name}</h2>
                                    <p>{msgData}</p>
                                </div>
                                <div className={style.rightSideContent}>
                                    <p>Time?</p>
                                </div>
                            </div>
                        </>
                    }
                </>
                
            )}
        </div>
    )
}
