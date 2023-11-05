import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUserData} from "../utils/api.ts";

export const User = () => {
    const { nickname } = useParams()

    const [data, setData] = useState();
    const [error, setError] = useState("");

    useEffect(() => {
        getUserData(nickname)
            .then(resp => resp.json())
            .then(json => {
                if(json.success) {
                    setData(json)
                } else {
                    setError(json.message)
                }
            }).catch(() => setError("Network error"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Link to="/">Strona główna</Link>
            <h1>Dane użytkownika {nickname}</h1>
            { data ?
                <div>
                    <h2>Rekordy</h2>
                    <table>
                        <tr>
                            <th>Test</th>
                            <th>Ilość punktów</th>
                            <th>Czas</th>
                            <th>Dokładność</th>
                        </tr>
                        {Object.keys(data.records).map(key => (
                            <tr>
                                <td>{key}</td>
                                <td>{data.records[key].points}</td>
                                <td>{data.records[key].time}s</td>
                                <td>{data.records[key].accuracy}%</td>
                            </tr>
                        ))
                        }
                    </table>
                    <h2>Ostatnie 10 testów</h2>
                    <table>
                        <tr>
                            <th>Test</th>
                            <th>Ilość punktów</th>
                            <th>Czas</th>
                            <th>Dokładność</th>
                        </tr>
                        {data.data.map(result => (
                            <tr>
                                <td>{result.testId}</td>
                                <td>{result.points}</td>
                                <td>{result.time}s</td>
                                <td>{result.accuracy}%</td>
                            </tr>
                        ))
                        }
                    </table>
                </div>
                :
                error ?
                    <span>{error}</span> :
                    <span>ładowanie danych...</span>

            }
        </div>
    )
}