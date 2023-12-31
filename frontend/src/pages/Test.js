import {useParams} from "react-router-dom";
import {GeoTest} from "../components/GeoTest";
import {getTest} from "../utils/api.ts";
import {useEffect, useState} from "react";

export const Test = () => {
    const [test, setTest] = useState({})
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const { testId } = useParams()
    // const test = tests[testId]

    useEffect(() => {
        getTest(testId)
            .then(resp => resp.json())
            .then(json => {
                setLoaded(true)
                if(json.success) {
                    setTest(json.result)
                } else {
                    setError(json.message)
                }
            })
            .catch(err => setError(err.message))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        (loaded && test) ?
            <GeoTest testId={testId} imageURL={test.imageURL} points={test.points} pointSize={test.pointSize} />
        :
            <span>{error ? error : "Ładowanie testu..."}</span>
    )
}