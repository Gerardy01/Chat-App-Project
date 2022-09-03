import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/login.module.css';

import { isMobile } from 'react-device-detect'
import getCookie from '../utils/getCookie';



export default function Login() {

    const navigate = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [inputLabelWrong, setInputLabelWrong] = useState(false);
    const [userLabel, setUserLabel] = useState('USERNAME OR EMAIL');

    const [passwordLabelWrong, setPasswordLabelWrong] = useState(false);
    const [passwordLabel, setPasswordLabel] = useState('PASSWORD');

    const [loginData, setLoginData] = useState({
        user: "",
        password: ""
    });

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
                if (res.status === 401) {
                    setLoading(false);
                    return
                }
                if (res.status === 200) {
                    res.json().then(data => {
                        document.cookie = `token=${data.access_token}`
                    });
                    navigate.push('/chat');
                }
            }).catch(err => {
                alert("try again");
            });
        } else {
            setLoading(false);
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setBtnLoading(true)

        if (loginData.user === '' || loginData.password === '') {
            if(loginData.user === '') {
                setInputLabelWrong(true);
                setUserLabel('USERNAME OR EMAIL - this field is required');
            }
    
            if(loginData.password === '') {
                setPasswordLabelWrong(true);
                setPasswordLabel('PASSWORD - this field is required');
            }
            setBtnLoading(false);
            return
        }

        fetch("http://localhost:8000/api/v1/users/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: loginData.user,
                password: loginData.password
            })
        }).then(res => {
            if (res.status === 404) {
                setInputLabelWrong(true);
                setUserLabel('USERNAME OR EMAIL - username or email does not exist');

                setPasswordLabelWrong(false);
                setPasswordLabel('PASSWORD');
            }

            if (res.status === 403) {
                setPasswordLabelWrong(true);
                setPasswordLabel('PASSWORD - wrong password');

                setInputLabelWrong(false);
                setUserLabel('USERNAME OR EMAIL');
            }

            if (res.status === 200) {
                res.json().then(data => {
                    setPasswordLabelWrong(false);
                    setPasswordLabel('PASSWORD');
                    setInputLabelWrong(false);
                    setUserLabel('USERNAME OR EMAIL');

                    document.cookie = `token=${data.access_token}`
                    navigate.push('/chat')
                });
            }
            setBtnLoading(false);
        }).catch(err => {
            alert("try again");
            console.log(err);
            setBtnLoading(false);
        });

    }


    if (loading) {
        return <div>loading</div>
    }

    function renderedComponent() {
        if (!isMobile) {
            return (
                <section className={styles.loginPage}>
                    <div className={styles.loginDesktopHolder}>
                        <div className='topSideBar' style={{ backgroundColor: 'rgb(237, 53, 237)' }}>
                            <div className='btnDecoyHolder'>
                                <div className='btnDecoy' style={{ backgroundColor: 'red' }} />
                                <div className='btnDecoy' style={{ backgroundColor: 'rgb(255, 255, 77)' }} />
                                <div className='btnDecoy' style={{ backgroundColor: 'lightgreen' }} />
                            </div>
                        </div>
                        <form className={styles.loginForm} onSubmit={e => handleSubmit(e)}>
                            <div className={styles.loginTitleHolder}>
                                <h1>Login</h1>
                            </div>
                            <div className={styles.inputHolder}>
                                <p className={inputLabelWrong ? styles.inputLabelWrong : styles.inputLabel}>{userLabel}</p>
                                <input className={styles.input} onChange={(e) => setLoginData({
                                    user: e.target.value,
                                    password: loginData.password
                                })} />
                            </div>

                            <div className={styles.inputHolder}>
                                <p className={passwordLabelWrong ? styles.inputLabelWrong : styles.inputLabel}>{passwordLabel}</p>
                                <input type='password' className={styles.input} onChange={(e) => setLoginData({
                                    user: loginData.user,
                                    password: e.target.value
                                })} />
                            </div>
                            <div className={styles.loginBtnHolder}>
                                <Link href={'/'}>
                                    <p className={styles.backBtn}>Back</p>
                                </Link>
                                {btnLoading ?
                                    <div className={'submitBtnLoad'}>
                                        <div className={'loadDots'} />
                                        <div className={'loadDots'} />
                                        <div className={'loadDots'} />
                                    </div> :
                                    <button type='submit' className={'submitBtn'}>SUBMIT</button>
                                }
                            </div>
                            <div className={styles.redirectHolder}>
                                <p>Don't have any account?</p>
                                <Link href={'/register'}>
                                    <p className={styles.redirectBtn}>Register</p>
                                </Link>
                            </div>
                        </form>
                    </div>
                </section>
            )
        }

        return (
            <section className={styles.loginPage}>
                from Mobile
            </section>
        )
    }
    return <>{renderedComponent()}</>
}