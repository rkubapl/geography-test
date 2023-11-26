import GeoTest from "../../components/GeoTest";
import {getTest} from "../../utils/api.ts";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Head from "next/head";

export default function TestId() {
    const { testId } = useRouter().query
    const router = useRouter();
    console.log(testId)

    const [test, setTest] = useState({})
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    // const test = tests[testId]

    useEffect(() => {
        if(!router.isReady) return;

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
    }, [router.isReady])

    return (
        <div>
            <Head>
                <title>Test {testId}</title>
            </Head>
            {(loaded && test) ?
                // <p>essa</p>
                <GeoTest testId={testId} imageURL={test.imageURL} points={test.points} pointSize={test.pointSize} />
                :
                <span>{error ? error : "Ładowanie testu..."}</span>
            }
        </div>
    )
}