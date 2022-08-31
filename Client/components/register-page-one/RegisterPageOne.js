import { useEffect, useState } from 'react'
import Link from 'next/link';
import style from './registerPageOne.module.css'

import { useDispatch } from 'react-redux'
import { setRegisterBirth, setRegisterEmail, setRegisterUsername } from '../../redux/features/registerDataSlice';



export default function RegisterPageOne(props) {

    const dispatch = useDispatch();

    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [dateInput, setDateInput] = useState("");

    const [usernameLabelWrong, setUsernameLabelWrong] = useState(false);
    const [usernameLabel, setUsernameLabel] = useState("USERNAME");

    const [emailLabelWrong, setEmailLabelWrong] = useState(false);
    const [emailLabel, setEmailLabel] = useState("EMAIL");

    const [birthLabelWrong, setBirthLabelWrong] = useState(false);
    const [birthLabel, setBirthLabel] = useState("DATE OF BIRTH");

    async function handleNext(e) {
        e.preventDefault();

        let usernameReady = false;
        let emailReady = false;
        let birthReady = false;
        
        if (usernameInput === '') {
            setUsernameLabelWrong(true);
            setUsernameLabel("USERNAME - this field is required");
            usernameReady = false;
        } else if (usernameInput.length < 5) {
            setUsernameLabelWrong(true);
            setUsernameLabel("USERNAME - less than 5 characters");
            usernameReady = false;
        } else {
            setUsernameLabelWrong(false);
            setUsernameLabel("USERNAME");
        }

        if (emailInput === '') {
            setEmailLabelWrong(true);
            setEmailLabel("EMAIL - this field is required");
            emailReady = false;
        } else {
            setEmailLabelWrong(false);
            setEmailLabel("EMAIL");
        }

        if (dateInput === '') {
            setBirthLabelWrong(true);
            setBirthLabel("DATE OF BIRTH - this field is required");
            birthReady = false;
        } else {
            setBirthLabelWrong(false);
            setBirthLabel("DATE OF BIRTH");
            dispatch(setRegisterBirth(dateInput));
            birthReady = true;
        }

        try {

            if (usernameInput !== '' && usernameInput.length >= 5) {
                const usernameRes = await fetch(`http://localhost:8000/api/v1/users/username/${usernameInput}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (usernameRes.status === 200) {
                    setUsernameLabelWrong(true);
                    setUsernameLabel("USERNAME - username already exist");
                    usernameReady = false;
                }
    
                if (usernameRes.status === 204) {
                    dispatch(setRegisterUsername(usernameInput));
                    usernameReady = true;
                }
            }

            if (emailInput !== '') {
                const emailRes = await fetch(`http://localhost:8000/api/v1/users/email/${emailInput}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (emailRes.status === 200) {
                    setEmailLabelWrong(true);
                    setEmailLabel("EMAIL - email already used");
                    emailReady = false;
                }
    
                if (emailRes.status === 400) {
                    setEmailLabelWrong(true);
                    setEmailLabel("EMAIL - not a well formed email address");
                    emailReady = false;
                }

                if (emailRes.status === 204) {
                    dispatch(setRegisterEmail(emailInput));
                    emailReady = true;
                }
            }

            if (usernameReady && emailReady && birthReady) {
                props.handleRegisterPage(2);
            }

        } catch(err) {
            console.log(err);
            alert('Try Again')
        }
    }

    return (
        <form className={style.registerForm} onSubmit={e => handleNext(e)}>
            <div className={style.inputHolder}>
                <p className={usernameLabelWrong ? style.inputLabelWrong : style.inputLabel}>{usernameLabel}</p>
                <input placeholder='username' type='text' className={style.input} onChange={e => setUsernameInput(e.target.value)} />
            </div>

            <div className={style.inputHolder}>
                <p className={emailLabelWrong ? style.inputLabelWrong : style.inputLabel}>{emailLabel}</p>
                <input placeholder='example@mail.com' type='email' className={style.input} onChange={e => setEmailInput(e.target.value)} />
            </div>

            <div className={style.inputHolder}>
                <p className={birthLabelWrong ? style.inputLabelWrong : style.inputLabel}>{birthLabel}</p>
                <input type='date' className={style.input} onChange={e => setDateInput(e.target.value)} />
            </div>

            <div className={style.registerOneBtnHolder}>
                <Link href={'/'}>
                    <p className={style.backBtn}>Back</p>
                </Link>

                <button type='submit' className={style.nextBtn}>Next</button>
            </div>
        </form>
    )
}