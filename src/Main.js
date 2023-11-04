import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteCookie, setCookie} from "./utils/cookies";
import tests from "./dane";
import {getUserInfo, handleUserAPI} from "./utils/api.ts";

export const Main = () => {
    const [userData, setUserData] = useState(undefined)

    const [nickname, setNickname] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const token = getCookie("token")

        if(token !== "") {
            getUserInfo(token)
                .then(resp => resp.json())
                .then(json => {
                    if(json.success) {
                        setUserData(json.data)
                    }
                })
                .catch(() => setErrorMessage("System punktacji jest wyłączony."))
        }
    }, [])

    function handleUser(mode) {
        handleUserAPI(mode, nickname, password)
            .then(resp => resp.json())
            .then(json => {
                if(json.success) {
                    setUserData(json.user)
                    setCookie("token", json.data, 14)
                } else {
                    setErrorMessage(json.message)
                }
            })
            .catch(err => setErrorMessage("System punktacji jest wyłączony."))
    }


    function logout() {
        deleteCookie("token")
        setUserData(undefined)
    }

    function getCookie(key) {
        const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }


    return (
        <div>
            <h1>Geografia testy</h1>
            <span>Dostępne testy:</span>
            <br />
            {Object.keys(tests).map((key, _) => (
                <div>
                    <Link to={"/test/" + key}>{tests[key].name}</Link> (<Link to={"/leaderboard/" + key}>Tablica wyników</Link>)
                </div>
            ))}
            <br />
            <Link to="/poradnik">Poradnik</Link>
            <br />
            { userData ?
                (
                    <div>
                        <h2>Zalogowano!</h2>
                        <label>Nickname: {userData.nickname}</label>
                        <br />
                        <button onClick={logout}>Wyloguj</button>
                    </div>
                )   :
                (
                    <div>
                        <div>
                            <h2>Logowanie</h2>
                            <span>Umożliwia zapisywanie twoich wyników pod nickiem.<br />Wyniki niezalogowanych użytkowników widnieją w tablicach wyników jako "Anonim".</span>
                            <br />
                            <label>Nickname: </label>
                            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} />
                            <br />
                            <label>Hasło: </label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <br />
                            <button onClick={() => handleUser('login')}>Zaloguj</button>
                            <button onClick={() => handleUser('register')}>Zarejestruj</button>
                            <br />
                            {errorMessage && <span>{errorMessage}</span>}
                        </div>
                    </div>
                )
            }
            < br/>
        </div>
    )
}