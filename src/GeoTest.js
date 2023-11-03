import React, {useCallback, useEffect, useState} from 'react'
import { Map, Marker } from 'react-canvas-map'
import "./GeoTest.css"
import {useParams} from "react-router-dom";
import {getCookie} from "./utils/cookies";
import tests from "./dane";
import {sendResultAPI} from "./utils/api.ts";


export const GeoTest = () => {
    const debugMode = false;
    const { testId } = useParams()

    const test = tests[testId] || []

    const [createdPoints, setCreatedPoints] = useState([])

    const [startTime, setStartTime] = useState(0);
    const [finishTime, setFinishTime] = useState(0);

    const [isGameOver, setIsGameOver] = useState(false)
    const [nowPoint, setNowPoint] = useState(0)
    const [invalidAttempts, setInvalidAttempts] = useState(0)

    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [finalPoints, setFinalPoints] = useState(0)

    const [resultUploaded, setResultUploaded] = useState(false)
    const [errWhenUploading, setErrWhenUploading] = useState(false)


    const [points, setPoints] = useState([]);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        setPoints(shuffleArray(JSON.parse(JSON.stringify(test.points))));
        setStartTime(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    useEffect(() => {
        if(isGameOver) {
            const finTime = Date.now()
            setFinishTime(finTime)
            countPoints(finTime)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameOver])


    function handleClick(index) {
        if(isGameOver) return;

        let state;

        if(nowPoint === index) {
            if(invalidAttempts === 0) state = "correct"
            else if(invalidAttempts < 3) state = "kinda"
            else state = "invalid"

            setInvalidAttempts(0)

            if(points.length === nowPoint+1) {
                setIsGameOver(true)
            } else {
                setNowPoint(prevNowPoint => prevNowPoint+1);
            }
        } else {
            if(invalidAttempts+1 < 3) {
                setInvalidAttempts(attempts => attempts+1);
            } else if(invalidAttempts+1 === 3) {
                state = "highlight"
                setInvalidAttempts(attempts => attempts+1);
            } else {
                return;
            }
        }

        setPoints(prevPoints => prevPoints.map((point, pointIndex) => nowPoint === pointIndex ? {...point, state} : point))
    }

    function countPoints(finTime) {
        let correctAnswers = 0;

        points.forEach(point => {
            if(point.state === "correct") correctAnswers++;
        })

        setCorrectAnswersCount(correctAnswers)

        const finPoints = calculatePoints((finTime-startTime)/1000, correctAnswers/points.length, 150, 5000);
        setFinalPoints(finPoints)

        sendResult(finPoints, (finTime-startTime)/1000, correctAnswers/points.length);
    }

    function loadImage(src) {
        const image = new Image()
        image.src = src
        return image
    }

    const [point] = useState(() => loadImage('/svg/point.svg'))
    const [correctPoint] = useState(() => loadImage('/svg/point-correct.svg'))
    const [invalidPoint] = useState(() => loadImage('/svg/point-invalid.svg'))
    const [highlightPoint] = useState(() => loadImage('/svg/point-highlight.svg'))
    const [kindaPoint] = useState(() => loadImage('/svg/point-kinda.svg'))

    function chooseImage(state) {
        if(state === "highlight") return highlightPoint;
        if(state === "correct") return correctPoint;
        if(state === "kinda") return kindaPoint;
        if(state === "invalid") return invalidPoint;
        else return point;
    }

    function reset() {
        setPoints(shuffleArray(JSON.parse(JSON.stringify(test.points))));
        setIsGameOver(false)
        setInvalidAttempts(0)
        setNowPoint(0)
        setCorrectAnswersCount(0)
        setStartTime(Date.now())
        setResultUploaded(false)
        setErrWhenUploading(false)
    }

    const handleMapClick = useCallback(coords => {
        const prompt = window.prompt("Podaj nazwę");

        const point = {x: Math.floor(coords.x), y: Math.floor(coords.y), name: prompt}

        setCreatedPoints(prevPoints => [...prevPoints, point])
        // alert(JSON.stringify(coords))
    }, [])

    function calculatePoints(time, accuracy, timeLimit, maxPoints) {
        if(time > timeLimit) return 0;

        const points = (maxPoints*(timeLimit-time)^2)/timeLimit^2;
        return Math.round(points*accuracy)
    }


    function sendResult(finPoints, time, accuracy) {
        const token = getCookie('token');
        if(!token) return;

        sendResultAPI(token, testId, finPoints, time, accuracy*100)
            .then(resp => resp.json())
            .then(json => {
                if(json.success) {
                    setResultUploaded(true)
                }
            }).catch(() => setErrWhenUploading(true))
    }

    return (
        <div style={{height: '100vh'}}>
            {debugMode && JSON.stringify(createdPoints)}
            { !isGameOver && points.length > 0
                &&
                (<div className={`card ${flip ? 'flip' : ""}`} onClick={() => setFlip(prevFlip => !prevFlip)}>
                    <span className="medium">Kliknij w</span>
                    <h1 className="pointName">{points[nowPoint].name}</h1>
                    <span className="tries">Próba {invalidAttempts}/3</span>
                    <br />
                    <span className="small">Klinij w kartę aby przenieść ją na drugą stronę ekranu</span>
                </div>)
            }
            {
                isGameOver &&
                (<div className="card">
                    <span>Liczba prawidłowych odpowiedzi</span>
                    <h1>{correctAnswersCount}/{points.length}</h1>
                    <span>{Math.floor((correctAnswersCount/points.length)*100)}% - {Math.round((finishTime-startTime)/1000*10)/10}s - {finalPoints} punktów</span>
                    <br />
                    {getCookie("token") !== "" && <div><span>{resultUploaded ? "Przesłano wyniki!" : (errWhenUploading ? "Błąd podczas przesyłania wyniku" : "Przesyłanie wyniku...")}</span><br /></div>}
                    <span onClick={reset} className="link">Kliknij aby zresetować</span>
                </div>)
            }
            <Map
                image={"/maps/" + test.map}
                onClick={debugMode && handleMapClick}
            >
                {points.map((point, index) => (
                        <Marker
                            size={test.pointSize}
                            markerKey={`marker-${index}`}
                            coords={{x: point.x, y: point.y}}
                            image={chooseImage(point.state)}
                            onClick={() => handleClick(index)}
                        />
                    ))
                }
            </Map>
        </div>
    )
}
