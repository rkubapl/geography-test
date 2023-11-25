import {useEffect, useState} from "react";
import {getLeaderboardData} from "../../utils/api.ts";
import {useRouter} from "next/router";
import Link from 'next/link'

export default function Leaderboard() {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState()
    const { testId } = useRouter().query

    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        getLeaderboardData(testId)
            .then(resp => resp.json())
            .then(json => {
                if(json.success) {
                    setLoaded(true)
                    setLeaderboardData(json.results)
                } else {
                    setError("Brak danych!")
                }
            })
            .catch(err => {
                setError(err.message)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Link href="/">Strona główna</Link>
            <h1>Tablica wyników dla testu "{testId}"</h1>
            {
                loaded ?
                    <table>
                        <tr>
                            <th>Miejsce</th>
                            <th>Nazwa użytkownika</th>
                            <th>Ilość punktów</th>
                            <th>Czas</th>
                            <th>Dokładność</th>
                        </tr>
                        {leaderboardData.length === 0 && <tr><td>Brak danych!</td></tr>}
                        {leaderboardData.map((result, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{result.anonym ? <span>{result.user}</span> : <Link className="link" href={`/user/${result.user}`}>{result.user}</Link>}</td>
                                <td>{result.points.toString()}</td>
                                <td>{(result.time).toString()}s</td>
                                <td>{(result.accuracy).toString()}%</td>
                            </tr>
                        ))
                        }
                    </table>
                :
                    <span>{error ? `Wystąpił błąd: ${error}` : "Ładowanie danych..."}</span>
            }
        </div>
    )
}