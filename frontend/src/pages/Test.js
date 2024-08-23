import {useParams} from "react-router-dom";
import {GeoTest} from "../components/GeoTest";
import {getTest} from "../utils/api.ts";
import {useEffect, useState} from "react";
import {getUserInfo, handleUserAPI, getTests} from "../utils/api.ts";

export const Test = () => {
    const [test, setTest] = useState({})
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState("")

    const { testId } = useParams()

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const req = await fetch("/tests.json");
                if(!req.ok) throw new Error()
                
                const tests = await req.json();

                const jsonTest = tests.find(t => t.id == testId)
                
                if (jsonTest) {
                    setTest(jsonTest)
                    setLoaded(true)
                } else {
                    setError("Nie znaleziono testu!")
                }
            } catch(err) {
                setError("Nie udało się pobrać testów :(")
            }
        }

        fetchTest()
    }, [])

    return (
        (loaded && test) ?
            <GeoTest testId={testId} imageURL={test.imageURL} points={test.points} pointSize={test.pointSize} />
        :
            <span>{error ? error : "Ładowanie testu..."}</span>
    )
}