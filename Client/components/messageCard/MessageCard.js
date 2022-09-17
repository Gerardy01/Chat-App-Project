import { useEffect, useState } from 'react';
import style from './messageCard.module.css';
import Image from 'next/image';

import jwtDecode from 'jwt-decode';
import getCookie from '../../utils/getCookie';

import unknownUser from '../../public/unknownUser.png'



export default function MessageCard(props) {

    const [data, setData] = useState(null);
    const [isSender, setIsSender] = useState(false);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = getCookie("token");
        if (props && token) {
            const decode = jwtDecode(token);
            if (props.data.senderId === decode.id) {
                setIsSender(true);
            }
            setData(props.data);
        }
    }, [props])

    useEffect(() => {
        if (data) {
            fetch(`http://localhost:8000/api/v1/users/${data.senderId}`, {
                method: 'GET',
                mode: 'cors'
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setUserData(data.data)
                    });
                }

                if (res.status === 500) {
                    throw Error("Server Error")
                }
            }).catch(err => {
                console.log(err);
                alert("Try Again");
            });
        }
    }, [data])

    if (!userData || !data) {
        return (
            <div>loading</div>
        )
    }

    return (
        <>
            {isSender ?
                <>
                    <li className={style.messageCardSender}>
                        <div className={style.messageBoxSender}>
                            <p className={style.messageBoxName}>{userData.name}</p>
                            <p>{data.text}</p>
                        </div>
                        <div className={style.profilePictHolder}>
                            <Image 
                                src={userData.profilePicture !== "" ?
                                    userData.profilePicture :
                                    unknownUser
                                } 
                                alt={'user profie picture'}
                                layout='responsive'
                            />
                        </div>
                    </li>
                </> : <>
                    <li className={style.messageCard}>
                        <div className={style.profilePictHolder}>
                            <Image 
                                src={userData.profilePicture !== "" ?
                                    userData.profilePicture :
                                    unknownUser
                                } 
                                alt={'user profie picture'}
                                layout='responsive'
                            />
                        </div>
                        <div className={style.messageBoxReciver}>
                            <p className={style.messageBoxName}>{userData.name}</p>
                            <p>{data.text}</p>
                        </div>
                    </li>
                </>
                
            }
        </>
    )
}