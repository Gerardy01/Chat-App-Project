import { useEffect, useState } from 'react'
import style from './registerPageTwo.module.css'

import { useRouter } from 'next/router'

import { useDispatch, useSelector } from 'react-redux'
import { setRegisterConfirm, setRegisterPassword } from '../../redux/features/registerDataSlice';



export default function RegisterPageTwo(props) {

    const dispatch = useDispatch();
    const navigate = useRouter();

    const registerData = useSelector(state => state.registerData.data);

    const [passwordInput, setPasswordInput] = useState('');
    const [confirmInput, setConfirmInput] = useState('');

    const [passwordLabel, setPasswordLabel] = useState("PASSWORD");
    const [passwordLabelWrong, setPasswordLabelWrong] = useState(false);

    const [confirmLabel, setConfirmLabel] = useState("CONFIRM PASSWORD");
    const [confirmLabelWrong, setConfirmLabelWrong] = useState(false);

    const [btnLoading, setBtnLoading] = useState(false);



    useEffect(() => {
        if (registerData.password !== '' && registerData.confirmPassword !== '') {
            setPasswordInput(registerData?.password);
            setConfirmInput(registerData?.confirmPassword);
        }
    }, [registerData])

    function handleSubmit(e) {
        e.preventDefault();

        setBtnLoading(true);

        let passwordReady = false;
        let confirmReady = false;

        if (passwordInput === '') {
            setPasswordLabel("PASSWORD - this field is required");
            setPasswordLabelWrong(true);
            passwordReady = false;
        } else if (passwordInput.length < 8) {
            setPasswordLabel("PASSWORD - must at least 8 characters");
            setPasswordLabelWrong(true);
            passwordReady = false;
        } else {
            dispatch(setRegisterPassword(passwordInput));
            setPasswordLabel("PASSWORD");
            setPasswordLabelWrong(false);
            passwordReady = true;
        }

        if (confirmInput === '') {
            setConfirmLabel("CONFIRM PASSWORD - this field is required");
            setConfirmLabelWrong(true);
            confirmReady = false;
        } else if (confirmInput !== passwordInput) {
            setConfirmLabel("CONFIRM PASSWORD - different confirmation password");
            setConfirmLabelWrong(true);
            confirmReady = false;
        } else if (confirmInput.length < 8 ) {
            setConfirmLabel("CONFIRM PASSWORD - must at least 8 characters");
            setConfirmLabelWrong(true);
            confirmReady = false;
        } else {
            dispatch(setRegisterConfirm(confirmInput));
            setConfirmLabel("CONFIRM PASSWORD");
            setConfirmLabelWrong(false);
            confirmReady = true;
        }

        if (passwordReady && confirmReady) {
            register();
            return
        }

        setBtnLoading(false);
    }



    function register() {
        fetch("http://localhost:8000/api/v1/users/register", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: registerData.username,
                email: registerData.email,
                password: passwordInput,
                confirmPassword: confirmInput,
                name: "",
                birth: registerData?.birth,
                profile_picture_url: ""
            })
        }).then(res => {
            res.json().then(data => {
                if (res.status === 500) {
                    alert('Try Again');
                    return
                }
    
                if (res.status !== 200) {
                    alert(`${data.msg}. Try Again`);
                    console.log(data.msg);
                    return
                }

                props.handleFormSubmited(true);
            });
        }).catch(err => {
            console.log(err);
            alert("Try Again")
        })
        setBtnLoading(false);
    }

    return (
        <form onSubmit={(e) => {handleSubmit(e)}}>
            <div className={style.inputHolder}>
                <p className={passwordLabelWrong ? style.inputLabelWrong : style.inputLabel}>{passwordLabel}</p>
                <input value={passwordInput} placeholder='at least 8 characters' type='password' className={style.input} onChange={e => setPasswordInput(e.target.value)} />
            </div>
            <div className={style.inputHolder}>
                <p className={confirmLabelWrong ? style.inputLabelWrong : style.inputLabel}>{confirmLabel}</p>
                <input value={confirmInput} placeholder='at least 8 characters' type='password' className={style.input} onChange={e => setConfirmInput(e.target.value)} />
            </div>

            <div className={style.registerOneBtnHolder}>
                <p className={style.backBtn} onClick={() => props.handleRegisterPage(1)}>Prev</p>

                {btnLoading ?
                    <div className={'submitBtnLoad'}>
                        <div className={'loadDots'} />
                        <div className={'loadDots'} />
                        <div className={'loadDots'} />
                    </div> :
                    <button type='submit' className={'submitBtn'}>SUBMIT</button>
                }
            </div>
        </form>
    )
}