import {Link, useParams} from "react-router-dom";
import tests from "../data.js";
import {GeoTest} from "../components/GeoTest";

export const Test = () => {
    const { testId } = useParams()
    const test = tests[testId]

    return (
        test ? <GeoTest testId={testId} imageURL={test.i} points={test.p} pointSize={test.s} /> : <span>Test nie istnieje!</span>
    )
}