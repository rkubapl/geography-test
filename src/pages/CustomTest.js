import {useSearchParams} from "react-router-dom";
import {GeoTest} from "../components/GeoTest";
import {isJson} from "../utils";
import {decode} from "base-64";
import {useEffect, useState} from "react";

export const CustomTest = () => {
    const [test, setTest] = useState()
    const [error, setError] = useState("")

    const [searchParams] = useSearchParams()
    const data = searchParams.get('data');

    useEffect(() => {
        if(data) {
            const decoded = decode(data);
            if(isJson(decoded)) {
                const json = JSON.parse(decoded);
                setTest(json)
            } else {
                setError("Dane w linku są nieprawidłowe!")
            }
        } else {
            setError("Nieprawidłowy link!")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (test ? <GeoTest imageURL={test.i} points={test.p} /> : <span>{error ? {error} : "Ładowanie danych..."}</span>)
}