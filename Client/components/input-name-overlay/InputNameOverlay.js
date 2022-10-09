import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import style from './inputNameOverlay.module.css';

import getCookie from '../../utils/getCookie';



export default function InputNameOverlay(props) {

    const navigate = useRouter();

    const [btnLoading, setBtnLoading] = useState(false);
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setBtnLoading(true);

        const token = getCookie('token');

        if (name === "") {
            alert("the field cannot be empty");
            setBtnLoading(false)
            return
        }

        if (token) {
            fetch("http://localhost:8000/api/v1/users/change-name", {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newName: name
                })
            }).then(res => {
                if (res.status === 200) {
                    setBtnLoading(false);
                    props.setInputNameOverlay(false);
                    res.json().then(data => {
                        document.cookie = `token=${data.access_token}`
                    });
                    return
                }

                if (res.status === 401) {
                    navigate.push('/login');
                    return
                }

                throw Error("something wrong")
            }).catch(err => {
                console.log(err);
                alert('something wrong. try again');
            });
        } else {
            alert('something wrong. try again');
            setBtnLoading(false);
        }
    }

    return (
        <div className={props.inputNameOverlay ? style.inputNameOverlayActive : style.inputNameOverlayDisabled}>
            <form className={style.inputNamePage} onSubmit={e => handleSubmit(e)}>
                <p>Input your name :</p>
                <input 
                className={style.input} 
                type='text' 
                placeholder='name'
                onChange={e => setName(e.target.value)}
                />
                <div className={style.btnHolder}>
                    {btnLoading ?
                        <div className={'submitBtnLoad'}>
                            <div className={'loader'} />
                        </div> :
                        <button type='submit' className={'submitBtn'}>SUBMIT</button>
                    }
                </div>
            </form>
        </div>
    )
}