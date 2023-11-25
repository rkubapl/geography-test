import {useSearchParams} from "react-router-dom";
import GeoTest from "../components/GeoTest";
import {isAllowedDomain, isJson, isURL} from "../utils";
import {useEffect, useState} from "react";
import {Base64} from "js-base64";

export default function CustomTest() {
    const [test, setTest] = useState()
    const [error, setError] = useState("")

    const [searchParams] = useSearchParams()
    const data = searchParams.get('data');

    useEffect(() => {
        if(data) {
            const decoded = Base64.decode(data);
            if(isJson(decoded)) {
                const json = JSON.parse(decoded);
                setTest(json)

                const imageURL = json.i

                if(!isURL(imageURL)) {
                    setError("Dane w linku są nieprawidłowe!")
                    return
                }

                const url = new URL(imageURL)

                if(!isAllowedDomain(url.hostname)) {
                    setError("Dane w linku są nieprawidłowe!")
                }
            } else {
                setError("Dane w linku są nieprawidłowe!")
            }
        } else {
            setError("Nieprawidłowy link!")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return ((test && error.length === 0) ? <GeoTest imageURL={test.i} points={test.p} pointSize={test.s} /> : <span>{error ? error : "Ładowanie danych..."}</span>)
}