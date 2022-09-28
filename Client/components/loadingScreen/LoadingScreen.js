import style from "./loadingScreen.module.css"



export default function LoadingScreen() {
    return (
        <div className={style.loadingScreen}>
            <div className={style.loadingHolder}>
                <div className={'loader'}></div>
            </div>
        </div>
    )
}