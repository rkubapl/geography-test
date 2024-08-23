import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteCookie, setCookie} from "../utils/cookies";
import {getUserInfo, handleUserAPI, getTests} from "../utils/api.ts";

export const Main = () => {
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const req = await fetch("/tests.json");
                if(!req.ok) throw new Error()
                
                setTests(await req.json())
                setLoading(false)
            } catch(err) {
                setLoading(false)
                setError("Nie udało się pobrać listy testów :(")
            }
        }

        fetchTests()
    }, [])

   
    return (
        <div className="max-w-screen-xl m-auto text-center flex justify-between flex-col min-h-screen">
            <div>
                <h1 className="text-3xl font-bold block mt-3">Geografia - Nauka map</h1>
                {/* <a href="https://dev-geography-test.vercel.app/" target="_blank" rel="noreferrer">Wersja BETA (więcej opcji testów)</a> */}
                <div className="mt-3">
                    {loading && <span>Ładowanie danych...</span> }
                    {error && <span>{error}</span> }
                    { tests && tests.map(test => <Link to={`/test/${test.id}`}>{test.name}</Link>)}
                    {/* <br/>
                    <br/> */}
                    {/* <Link to={"/create"}>Stwórz własny test</Link>
                    <br/> */}
                    <br /><br />
                    <Link to="/poradnik">Poradnik</Link> 
                </div>
            </div>
            <div className="text-center mb-5">
                <span>Strona stworzona przez <a href="https://github.com/rkubapl" target="_blank" rel="noreferrer">rkubapl</a>. Kod źródłowy projektu jest otwarty i znajduje się <a href="https://github.com/rkubapl/geography-test" target="_blank" rel="noreferrer">tutaj</a>.</span>
            </div>
        </div>
    )
}
