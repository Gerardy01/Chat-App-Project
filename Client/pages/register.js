import { useEffect, useState } from 'react'
import styles from '../styles/register.module.css'

import Link from 'next/link';

import { isMobile } from 'react-device-detect'

import RegisterPageOne from '../components/register-page-one/registerPageOne';



export default function Register() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [])



    if (loading) {
        return <div>loading</div>
    }

    function renderedComponent() {
        if (!isMobile) {
            return (
                <section className={styles.registerPage}>
                    <div className={styles.registerDesktopHolder}>
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

                            <RegisterPageOne />

                            <div className={styles.redirectHolder}>
                                <p>Already have account?</p>
                                <Link href={'/login'}>
                                    <p className={styles.redirectBtn}>Login</p>
                                </Link>
                            </div>
                        </div>
                    </div>
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