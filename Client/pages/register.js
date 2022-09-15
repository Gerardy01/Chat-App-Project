import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/register.module.css'

import Link from 'next/link';

import { isMobile } from 'react-device-detect'
import getCookie from '../utils/getCookie';

import RegisterPageOne from '../components/register-page-one/registerPageOne';
import RegisterPageTwo from '../components/register-page-two/RegisterPageTwo';
import SubmitedCard from '../components/submited-card/SubmitedCard';



export default function Register() {

    const navigate = useRouter();

    const [loading, setLoading] = useState(true);
    const [registerPage, setRegisterPage] = useState(1);
    const [formSubmited, setFormSubmited] = useState(false);
    const [registerActive, setRegisterActive] = useState(false);

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
                    setTimeout(() => {
                        setRegisterActive(true);
                    }, 200);
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
            setTimeout(() => {
                setRegisterActive(true);
            }, 200);
        }
    }, [])



    function handleRegisterPage(page) {
        setRegisterPage(page);
    }

    function handleFormSubmited(isSubmited) {
        if (isSubmited) {
            setFormSubmited(true);
            return
        }
        setFormSubmited(false);
    }



    if (loading) {
        return <div>loading</div>
    }

    function renderedComponent() {
        if (!isMobile) {
            return (
                <section className={styles.registerPage}>
                    {!formSubmited ? 
                        <>
                            <div className={registerActive ? styles.registerDesktopHolder : styles.registerDesktopHolderDisabled}>
                                <div className='topSideBar' style={{ backgroundColor: 'rgb(224, 157, 33)' }}>
                                    <div className='btnDecoyHolder' style={{ backgroundColor: 'rgb(224, 157, 33)' }}>
                                        <div className='btnDecoy' style={{ backgroundColor: 'red' }} />
                                        <div className='btnDecoy' style={{ backgroundColor: 'rgb(255, 255, 77)' }} />
                                        <div className='btnDecoy' style={{ backgroundColor: 'lightgreen' }} />
                                    </div>
                                </div>
                                <div className={styles.registerContent}>
                                    <div className={styles.registerTitleHolder}>
                                        <h1>Register</h1>
                                    </div>
                                    
                                    { registerPage === 1 ?
                                        <RegisterPageOne handleRegisterPage={handleRegisterPage} /> :
                                        <RegisterPageTwo
                                            handleRegisterPage={handleRegisterPage} 
                                            handleFormSubmited={handleFormSubmited}
                                        />
                                    }

                                    <div className={styles.redirectHolder}>
                                        <p>Already have account?</p>
                                        <Link href={'/login'}>
                                            <p className={styles.redirectBtn}>Login</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <SubmitedCard formSubmited={formSubmited} />
                        </>
                    }
                </section>
            )
        }

        return (
            <section className={styles.registerPage}>
                register mobile
            </section>
        )
    }
    return <>{renderedComponent()}</>
}