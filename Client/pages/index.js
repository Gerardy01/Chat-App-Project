import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/home.module.css'

import getCookie from '../utils/getCookie';

import LoadingScreen from '../components/loadingScreen/LoadingScreen';



function Home() {

  const navigate = useRouter();

  const [loading, setLoding] = useState(true);

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
          setLoding(false);
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
      setLoding(false);
      return
    }
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.contentHolder}>
        <h1>GROWL CHAT</h1>
        <div className={styles.btnHolder}>
          <Link href={'/register'}>
            <button className={styles.signinBtn}>Sign In</button>
          </Link>
          <Link href={'/login'}>
            <div className={styles.loginBtnHolder}>
              <button className={styles.loginBtn}>LOGIN</button>
              <div className={styles.loginShadow} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
