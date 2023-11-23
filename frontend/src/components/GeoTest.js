import React, {useEffect, useState} from 'react'
import { Map, Marker } from 'react-canvas-map'
import "./GeoTest.css"
import {Link} from "react-router-dom";
// import {getCookie} from "../utils/cookies";
// import {sendResultAPI} from "../utils/api.ts";


export const GeoTest = params => {
    const defaultPoints = params.points;

    //POINTS ON MAP
    const [points, setPoints] = useState(defaultPoints);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    function shufflePoints(correct) {
        if(correct) {
            const clearedPoints = points.filter(p => p.state !== "correct").map(p => ({...p, state: undefined}));
            setPoints(shuffleArray(clearedPoints))
        } else {
            setPoints(shuffleArray(defaultPoints));
        }
    }

    function setPointState(index, state) {
        setPoints(prevPoints => prevPoints.map((point, i) => index === i ? {...point, state} : point))
    }

    //CONFIG
    const [step, setStep] = useState("MODE-SELECT") //MODE-SELECT, GAME, FINISHED
    const [mode, setMode] = useState("CLICK") //CLICK, TYPE, LEARN

    const [caseSensitive, setCaseSensitive] = useState(false)

    const [hardMode, setHardMode] = useState(false)

    const [flip, setFlip] = useState(params.f || false);

    //MODES: CLICK, TYPE
    const [prevPointIndex, setPrevPointIndex] = useState(0)
    const [currentPointIndex, setCurrentPointIndex] = useState(0)

    //MODES: TYPE
    const [inputValue, setInputValue] = useState("")
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
    const [confirm, setConfirm] = useState(false)


    //MODES: CLICK
    const [wrongClickedIndexes, setWrongClickedIndexes] = useState([])

    //STEP: FINISHED
    const [invalidAttempts, setInvalidAttempts] = useState(0)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [finalPoints, setFinalPoints] = useState(0)


    //TIMER
    const [startTime, setStartTime] = useState(0);
    const [finishTime, setFinishTime] = useState(0);
    const [resultUploaded, setResultUploaded] = useState(false)
    const [errWhenUploading, setErrWhenUploading] = useState(false)

    useEffect(() => {
        if(step === "FINISHED") {
            const finDate = Date.now();
            setFinishTime(finDate)
            countPoints(finDate)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step])

    useEffect(() => {
        if(confirm) {
            setConfirm(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue])

    function nextPoint() {
        if(points.length === currentPointIndex+1) {
            setStep("FINISHED")
            return
        }

        setPrevPointIndex(currentPointIndex)
        setCurrentPointIndex(prevNowPoint => prevNowPoint+1);
    }

    function addInvalidAttempt() {
        setInvalidAttempts(attempts => attempts+1);
    }

    function handleClick(index, point) {
        if(step !== "GAME") return;

        if (mode === "CLICK") {
            if (currentPointIndex === index) {
                if(invalidAttempts === 0) setPointState(index, "correct")
                else if(invalidAttempts < 3) setPointState(index, "partly")
                else setPointState(index, "invalid")

                setInvalidAttempts(0)
                setWrongClickedIndexes([])
                nextPoint()
            } else {
                if (!hardMode && ["correct", "partly", "invalid"].includes(point.state)) return
                if(!hardMode && wrongClickedIndexes.includes(index)) return;

                if(invalidAttempts+1 < 3) { //less than 3 then add one
                    addInvalidAttempt()
                    setWrongClickedIndexes(prevState => [...prevState, index])
                } else if(invalidAttempts+1 === 3) { // is 3 then highlight
                    setPointState(currentPointIndex, "highlight")

                    addInvalidAttempt()
                    setWrongClickedIndexes(prevState => [...prevState, index])
                }
                return
            }
        }

        if(mode === "LEARN") {
            setCurrentPointIndex(index)
        }
    }

    function countPoints(finTime) {
        let correctAnswers = 0;

        points.forEach(point => {
            if(point.state === "correct") correctAnswers++;
        })

        setCorrectAnswersCount(correctAnswers)

        const finPoints = calculatePoints((finTime-startTime)/1000, correctAnswers/points.length, 150, 5000);
        setFinalPoints(finPoints)

        // sendResult(finPoints, (finTime-startTime)/1000, correctAnswers/points.length);
    }

    function loadImage(src) {
        const image = new Image()
        image.src = src
        return image
    }

    const [pointImg] = useState(() => loadImage('/svg/point.svg'))
    const [correctPoint] = useState(() => loadImage('/svg/point-correct.svg'))
    const [invalidPoint] = useState(() => loadImage('/svg/point-invalid.svg'))
    const [highlightPoint] = useState(() => loadImage('/svg/point-highlight.svg'))
    const [kindaPoint] = useState(() => loadImage('/svg/point-kinda.svg'))
    const [wrongPoint] = useState(() => loadImage('/svg/point-wrong.svg'))

    // const [timeoutHighlight] = useState()

    function pointImage(point, index) {
        if (step === "MODE-SELECT") return pointImg;

        if(mode === "CLICK") {
            const show = hardMode ? (step === "FINISHED" ? true : index === prevPointIndex) : true;

            if(show && wrongClickedIndexes.includes(index)) return wrongPoint;

            if(point.state === "highlight") return highlightPoint;

            if(show && point.state === "correct") return correctPoint;
            if(show && point.state ===  "partly") return kindaPoint;
            if(show && point.state ===  "invalid") return invalidPoint;
            return pointImg;
        }

        if(mode === "TYPE") {
            if(index === currentPointIndex) return highlightPoint;

            if(point.state === "correct" && !hardMode) return correctPoint;
            if(point.state ===  "partly" && !hardMode) return kindaPoint;
            if(point.state ===  "invalid" && !hardMode) return invalidPoint;
            return pointImg;
        }

        if (mode === "LEARN") {
            if(index === currentPointIndex) return highlightPoint;
            return pointImg;
        }
    }

    function initGame(correct = false) {
        setStep("GAME")
        if (mode === "LEARN") {
            setCurrentPointIndex(-1)
        } else {
            //TIMER AND RESULTS
            setStartTime(Date.now())
            setResultUploaded(false)
            setErrWhenUploading(false)

            setCorrectAnswersCount(0)
            setCurrentPointIndex(0)

            shufflePoints(correct)


            if (mode === "CLICK") {
                setInvalidAttempts(0)
            } else if (mode === "TYPE") {
                setInputValue("")
            }
        }
    }

    function calculatePoints(time, accuracy, timeLimit, maxPoints) {
        if(time > timeLimit) return 0;

        const points = (maxPoints*(timeLimit-time)^2)/timeLimit^2;
        return Math.round(points*accuracy)
    }


    // function sendResult(finPoints, time, accuracy) {
    //     const token = getCookie('token');
    //     // if(!token) return;
    //
    //     sendResultAPI(token, params.testId, finPoints, time, accuracy*100)
    //         .then(resp => resp.json())
    //         .then(json => {
    //             if(json.success) {
    //                 setResultUploaded(true)
    //             }
    //         }).catch(() => setErrWhenUploading(true))
    // }

    const polChars = ["ą", "ć", "ę", "ł", "ń", "ó", "ś", "ż", "ź"]
    const norChars = ["a", "c", "e", "l", "n", "o", "s", "z", "z"]

    function minifyString(str) {
        str = str.toLowerCase();

        for (let i = 0; i < polChars.length; ++i) {
            str = str.replaceAll(polChars[i], norChars[i]);
        }

        return str;
    }

    function checkIfInputCorrect(e) {
        const { value } = e.target;
        setInputValue(value)

        let correct = false;
        if(caseSensitive) {
            if (value === points[currentPointIndex].n) {
                correct = true;
            }
        } else {
            if(minifyString(value) === minifyString(points[currentPointIndex].n)) {
                correct = true;
            }
        }

        if (correct) {
            setPointState(currentPointIndex, showCorrectAnswer ? "invalid" : "correct")
            setInputValue("")
            setConfirm(false)
            setShowCorrectAnswer(false)
            nextPoint()
        }
    }
    function start() {
        initGame()
    }

    function skipPoint() {
        setShowCorrectAnswer(true)
        setPointState(currentPointIndex, "partly")
    }

    return (
        <div style={{height: '100vh'}}>
            <div className="fixed">
                <Link to="/" className="link">Strona główna</Link>
            </div>


            {step === "MODE-SELECT" &&
                <div className="card">
                    <span className="h4">Wybierz tryb</span>
                    <div>
                        {[["CLICK", "Kliknij"], ["TYPE", "Wpisz"], ["LEARN", "Nauka"]].map(id =>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name={id[0]} id={id[0]}
                                       checked={mode === id[0]}
                                       onChange={() => setMode(id[0])}
                                />
                                <label className="form-check-label" htmlFor={id[0]}>{id[1]}</label>
                            </div>
                        )}
                    </div>
                    {["TYPE", "CLICK"].includes(mode) &&
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" checked={hardMode} id="hardmode" onChange={e => setHardMode(e.target.checked)}/>
                                <label className="form-check-label" htmlFor="hardmode">Tryb trudny</label>
                            </div>
                        </div>
                    }
                    { mode === "TYPE" &&
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" checked={caseSensitive} id="caseSensitive" onChange={e => setCaseSensitive(e.target.checked)}/>
                                <label className="form-check-label" htmlFor="caseSensitive">Sprawdzaj wielkość i polskie litery</label>
                            </div>
                        </div>
                    }
                    <div>
                        <button type="submit" className="btn btn-primary" onClick={() => start()}>Start</button>
                    </div>
                </div>
            }

            {
                step === "GAME" &&
                <div className={`card ${flip ? 'flip' : ""}`}>
                    { mode === "CLICK" &&
                        <div>
                            <span className="medium">Kliknij w</span>
                            <h2 className="pointName mb-0">{points[currentPointIndex].n}</h2>
                            <span className="tries">Liczba prób: {invalidAttempts}/3</span>
                        </div>
                    }
                    { mode === "TYPE" &&
                        <div>
                            <span className="h5">Wpisz nazwę punktu</span>
                            <div className="mb-2">
                                <input type="email" className="form-control mt-2" id="exampleFormControlInput1" placeholder="np. kotlina slaska" value={inputValue} onChange={e => checkIfInputCorrect(e)} />
                                {showCorrectAnswer && <div id="emailHelp" className="form-text">Prawidłowa odpowiedź: {points[currentPointIndex].n}</div>}
                                {confirm && <div id="emailHelp" className="form-text">Błędna odpowiedź</div>}
                            </div>
                            <div className="btn-group mb-1">
                                <button type="submit" className="btn btn-success" onClick={() => setConfirm(true)}>Zatwierdź</button>
                                <button type="submit" className="btn btn-danger" onClick={()=> skipPoint()}>Nie wiem</button>
                            </div>
                        </div>
                    }
                    { mode === "LEARN" &&
                        <div>
                            <span className="h6">Kliknięto w</span>
                            <h3 className="pointName">{currentPointIndex !== -1 ? points[currentPointIndex].n : "Kliknij w punkt"}</h3>
                        </div>
                    }
                    <span className="small link" onClick={() => setFlip(prevFlip => !prevFlip)}>Klinij tu aby aby przenieść kartę na drugą stronę ekranu</span>
                </div>
            }
            {
                step === "FINISHED" &&
                (<div className="card">
                    <span>Liczba prawidłowych odpowiedzi</span>
                    <h1>{correctAnswersCount}/{points.length}</h1>
                    <span>{Math.floor((correctAnswersCount/points.length)*100)}% - {Math.round((finishTime-startTime)/1000*10)/10}s - {finalPoints} punktów</span>
                    <span>{resultUploaded ? "Przesłano wyniki!" : (errWhenUploading ? "Błąd podczas przesyłania wyniku" : "Przesyłanie wyniku...")}</span>

                    <div>
                        <div className="btn-group mb-1">
                            {points.length-correctAnswersCount > 0 && <button type="submit" className="btn btn-success" onClick={()=> initGame(true)}>Popraw</button>}
                            <button type="submit" className="btn btn-danger" onClick={()=> initGame()}>Od nowa</button>
                        </div>
                    </div>

                    <div>
                        <span onClick={() => setStep("MODE-SELECT")} className="link">Zmień tryb</span> - <Link className="link" to="/">Strona główna</Link>
                    </div>
                </div>)
            }


            <Map
                image={params.imageURL}
            >
                {points.map((point, index) => (
                        <Marker
                            size={params.pointSize}
                            markerKey={`marker-${index}`}
                            coords={{x: point.x, y: point.y}}
                            image={pointImage(point, index)}
                            onClick={() => handleClick(index, point)}
                        />
                    ))
                }
            </Map>
        </div>
    )
}
