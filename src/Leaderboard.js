import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getLeaderboardData} from "./utils/api.ts";

export const Leaderboard = () => {
    const { testId } = useParams()

    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        getLeaderboardData(testId)
            .then(resp => resp.json())
            .then(json => {
                console.log(json.results)
                if(json.success) setLeaderboardData(json.results)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Link to="/">Strona główna</Link>
            <h1>Tablica wyników dla testu "{testId}"</h1>
            <table>
                <tr>
                    <th>Miejsce</th>
                    <th>Nazwa użytkownika</th>
                    <th>Ilość punktów</th>
                    <th>Czas</th>
                    <th>Dokładność</th>
                </tr>
                {leaderboardData.map((result, index) => (
                    <tr>
                        <td>{index+1}</td>
                        <td>{result.user}</td>
                        <td>{result.points.toString()}</td>
                        <td>{(result.time).toString()}s</td>
                        <td>{(result.accuracy).toString()}%</td>
                    </tr>
                ))
                }
            </table>
        </div>
    )
}