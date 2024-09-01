import {useParams} from "react-router-dom";
import {GeoTest} from "../components/GeoTest";
import {getTest} from "../utils/api.ts";
import {useEffect, useState} from "react";
import {getUserInfo, handleUserAPI, getTests} from "../utils/api.ts";

const API_URL = process.env.REACT_APP_API

export const Test = () => {
    const [test, setTest] = useState({})
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState("")

    const { shortId } = useParams()
    
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const req = await fetch(API_URL + "/test/" + shortId + "/");
                
                switch (req.status) {
                    case 200:
                        const test = await req.json();
                        setTest(test)
                        setLoaded(true)
                        break
                    case 404:
                        setError("Nie znaleziono testu!")
                        setLoaded(false)
                        break
                    default:
                        setError(`Wystąpił błąd serwera :( [${req.status}]`)
                        setLoaded(false)
                }
            } catch(err) {
                setError(`Nie udało się pobrać testu :( [CLIENT]`)
                setLoaded(false)
            }
        }

        fetchTest()
    }, [])

    return (
        (loaded && test) ?
            <GeoTest testId={shortId} imageUrl={test.imageUrl} points={test.points} pointSize={test.pointSize} />
        :
            <span>{error ? error : "Ładowanie testu..."}</span>
    )
}