import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteCookie, setCookie} from "../utils/cookies";
// import tests from "../data.js";
import {getUserInfo, handleUserAPI, getTests} from "../utils/api.ts";

export const Main = () => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState("")
    const [tests, setTests] = useState([])

    const errors = {
        "NOT_FIND": "Nie znaleziono!"
    }


    const [userData, setUserData] = useState(undefined)

    const [nickname, setNickname] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        getTests()
            .then(resp => resp.json())
            .then(json => {
                setLoaded(true)

                if(json.success) {
                    setTests(json.results)
                } else {
                    setError("Błąd: " + json.message)
                }
            }).catch(err => {
                setLoaded(true)
                setError("Błąd: " + err.message)
            })

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
            {!loaded && <span>Ładowanie testów...</span>}
            {(loaded && error) &&<span>{error}</span>}
            {(loaded && tests && !error) && tests.map(test => (
                <div>
                    <Link to={"/test/" + test.id}>{test.name}</Link> (<Link to={"/leaderboard/" + test.id}>Tablica wyników</Link>)
                </div>
            ))}
            <br />
            <Link to={"/create"}>Stwórz własny test</Link>
            <br />
            <Link to="/poradnik">Poradnik</Link>
            <br />
            { userData ?
                (
                    <div>
                        <h2>Zalogowano!</h2>
                        <label>Nickname: {userData.nickname}</label>
                        <br />
                        <Link to={`/user/${userData.nickname}`}>Statystyki</Link>
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