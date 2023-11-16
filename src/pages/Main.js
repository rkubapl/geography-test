import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteCookie, setCookie} from "../utils/cookies";
// import tests from "../data.js";
import {getUserInfo, handleUserAPI, getTests} from "../utils/api.ts";

export const Main = () => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState("")
    const [tests, setTests] = useState([])

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
        <div className="container">
            <div>
                <h1>Geografia testy</h1>
                {/*<span className="medium">Dostępne testy:</span>*/}
                <div>
                    {!loaded && <span>Ładowanie testów...</span>}
                    {(loaded && error) &&<span>{error}</span>}
                    {(loaded && tests && !error) &&
                        (
                            <div>
                                <span>Wyróżnione testy</span>
                                {
                                    tests.filter(t => t.distinguishPoints > 0).map(test => (
                                        <div>
                                            <Link to={"/test/" + test.id}>{test.name}</Link> (<Link to={"/leaderboard/" + test.id}>Tablica wyników</Link>)
                                        </div>
                                    ))
                                }
                                <span>Inne testy</span>
                                {
                                    tests.filter(t => t.distinguishPoints === 0).map(test => (
                                        <div>
                                            <Link to={"/test/" + test.id}>{test.name}</Link> (<Link to={"/leaderboard/" + test.id}>Tablica wyników</Link>)
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    <br/>
                    <Link to={"/create"}>Stwórz własny test</Link>
                    <br/>
                    <Link to="/poradnik">Poradnik</Link>
                </div>
            </div>
            {/*<h1>Geografia testy</h1>*/}
            {/*<span className="medium">Dostępne testy:</span>*/}
            {/*<div>*/}
            {/*    {!loaded && <span>Ładowanie testów...</span>}*/}
            {/*    {(loaded && error) &&<span>{error}</span>}*/}
            {/*    {(loaded && tests && !error) && tests.map(test => (*/}
            {/*        <div>*/}
            {/*            <Link to={"/test/" + test.id}>{test.name}</Link> (<Link to={"/leaderboard/" + test.id}>Tablica wyników</Link>)*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*    <br/>*/}
            {/*    <Link to={"/create"}>Stwórz własny test</Link>*/}
            {/*    <br/>*/}
            {/*    <Link to="/poradnik">Poradnik</Link>*/}
            {/*</div>*/}
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
                    <div className="col-5">
                        <h2 className="font-weight-bold">Logowanie/Rejestracja</h2>
                            <div className="mb-3">
                                <label className="form-label">Nickname</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={nickname} onChange={e => setNickname(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Hasło</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-primary" onClick={() => handleUser('login')}>Zaloguj</button>
                                <button type="submit" className="btn btn-secondary" onClick={() => handleUser('register')}>Zarejestruj</button>
                            </div>
                            <br />
                            {errorMessage && <span>{errorMessage}</span>}
                    </div>
                )
            }
            < br/>
        </div>
    )
}