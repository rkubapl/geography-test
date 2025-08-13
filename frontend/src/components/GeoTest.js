import React, {useCallback, useEffect, useState, useRef} from 'react'
import { Map, Marker } from 'react-canvas-map'
import "./GeoTest.css"
import {Link, useSearchParams } from "react-router-dom";
import {getCookie} from "../utils/cookies";
import {sendResultAPI} from "../utils/api.ts";
import TestCanvas from "../pages/TestCanvas.js"
import { Animation } from 'konva/lib/Animation';

export const GeoTest = params => {
    let [searchParams, setSearchParams] = useSearchParams();

    const creatorMode = false;

    const modes = ["Nauka", "Kliknij", "Wpisz"]

    function start() {
        reset(false)
        setSetup(false)

        if(mode == 0) {
            setCurPoint(undefined)
        }

        if(mode == 1) {
            setStartTime(Date.now())
            setCurPoint(0)
        }

        if(mode == 2) {
            setCurPoint(0)

            updateState(0, "highlight")
            setTimeout(() => document.getElementById("input").focus(), 100) //:)
        }
    }
    
    const [editMode, setEditMode] = useState(false)

    const [asActive, setAsActive] = useState(true)

    const [setup, setSetup] = useState(true)
    const [mode, setMode] = useState(0)

    const [curPoint, setCurPoint] = useState()
    const [inputValue, setInputValue] = useState("")


    const [createdPoints, setCreatedPoints] = useState([])

    const [startTime, setStartTime] = useState(0);
    const [time, setTime] = useState();

    const [isGameOver, setIsGameOver] = useState(false)
    const [nowPoint, setNowPoint] = useState(0)
    const [invalidAttempts, setInvalidAttempts] = useState(0)

    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)

    const [points, setPoints] = useState([]);
    const [gamePoints, setGamePoints] = useState([]);
    const [pointsBeforeImprove, setPointsBeforeImprove] = useState(undefined)

    const [flip, setFlip] = useState(params.f || false);

    const [skippedPoint, setSkippedPoint] = useState(undefined)
    

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }


    function isNum(num) {
        if (num === null || num.trim() === '') {
            return false;
        } else if (isFinite(num)) {
            return true;
        } else {
            return false;
        }
    }

    //Start of a game
    useEffect(() => {
        let pointsArr = JSON.parse(JSON.stringify(params.points));
        pointsArr = pointsArr.map(point => ({...point, state: "active"}))


        //TODO: Saving active points to query, I though about using bitset for this but it is limited to 32 bits :(

        // const mapPointsActive = searchParams.get("map-points-active");

        // if(mapPointsActive && isNum(mapPointsActive)) {
            
            // const number = Number.parseInt(mapPointsActive)
            
            // pointsArr = pointsArr.map((point, i) => {
            //     return ({...point, active: (number & (1 << i)) === 0 ? false : true})
            // })
        // }

        setPoints(pointsArr);

        setGamePoints(pointsArr.filter(point => point.state == "active"))

        reset(false)
    }, [])


    useEffect(() => {
        if(isGameOver) {
            setTime(((Date.now()-startTime)/1000).toFixed(2))
            setCorrectAnswersCount(gamePoints.reduce((acc, val) => acc + (val.state == "correct"), 0))
        }
    }, [isGameOver])



    function updateState(index, state) {
        setGamePoints(prevP => prevP.map((p, pIndex) => index === pIndex ? {...p, state} : p))
    }

    function handleClick(index, evt) {
        if(setup) return

        if(editMode) {
            return setPoints(prev => prev.map((point, i) => i == index ? {...point, state: asActive ? "active" : "disabled"} : point))
        }

        if(mode == 0) { // Nauka
            updateState(curPoint, undefined)
            updateState(index, "highlight")
            setCurPoint(index)
        }

        if(mode == 1) { //Kliknij
            if(curPoint == index) { //user clicked correct point
                if(invalidAttempts === 0) updateState(index, "correct")
                else if(invalidAttempts < 3) updateState(index, "kinda")
                else updateState(index, "invalid")

                setGamePoints(prevPoints => prevPoints.map(p => p.state == "highlight" ? {...p, state: undefined} : p)) //clear highlighted points
                setInvalidAttempts(0)

                if(curPoint+1 < gamePoints.length) {
                    setCurPoint(prevState => prevState+1);
                } else {
                    setIsGameOver(true)
                }
            } else {
                if(invalidAttempts > 2) return

                if(invalidAttempts == 2) {
                    updateState(index, "highlight")
                    updateState(curPoint, "superhighlight")
                } else {
                    updateState(index, "highlight")
                }
                setInvalidAttempts(attempts => attempts+1);
            }
        }
    }

    const polChars = ["ą", "ć", "ę", "ł", "ń", "ó", "ś", "ż", "ź"]
    const norChars = ["a", "c", "e", "l", "n", "o", "s", "z", "z"]

    function normalizeString(str) {
        str = str.toLowerCase();

        for (let i = 0; i < polChars.length; ++i) {
            str = str.replaceAll(polChars[i], norChars[i]);
        }

        return str;
    }
        
    function handleInputChange(e) {
        const { value } = e.target;
        
        if(normalizeString(value) === normalizeString(gamePoints[curPoint].n)) {
            if(skippedPoint != undefined) {
                updateState(curPoint, "invalid")
            } else updateState(curPoint, "correct")

            setInputValue("")

            if(curPoint+1 < gamePoints.length) {
                setSkippedPoint(undefined)
                setCurPoint(prevState => prevState+1);
                updateState(curPoint+1, "highlight")
            } else {
                setIsGameOver(true)
            }
        } else {
            setInputValue(value)
        }
    }

    function skip() {
        setSkippedPoint(gamePoints[curPoint].n)
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

    function chooseImage(state, index) {
        if(setup) return point;

        if(editMode) {
            if(points[index].active) return correctPoint;
            return invalidPoint;
        }

        if(mode == 0) { //Nauka
            if(index === curPoint) return highlightPoint;
            else return point;
        }

        if(state === "highlight") return highlightPoint;
        if(state === "correct") return correctPoint;
        if(state === "kinda") return kindaPoint;
        if(state === "invalid") return invalidPoint;
        else return point;
    }

    function reset(trueReset) {
        setGamePoints(prevPoints => {
            if(trueReset && pointsBeforeImprove) {
                console.log("FOUND POINTS!!!!")   
                prevPoints = pointsBeforeImprove;
            }

            prevPoints = prevPoints.map(point => ({...point, state: undefined}));
            return shuffleArray(prevPoints)
        })

        setInvalidAttempts(0)
        setCurPoint(undefined)

        setIsGameOver(false)
        setSetup(true)

        if(trueReset) setPointsBeforeImprove(undefined)
    }

    function goToEditMode() {
        setSetup(false)
        setEditMode(true)
    }

    
    function setAll(toState) {
        setPoints(prev => prev.map(point => ({...point, state: toState ? "active" : "disabled"})))
    }


    function saveGamePoints() {
        setSetup(true)
        setEditMode(false)

        setGamePoints(prev => {
            prev = points.filter(point => point.state == "active")
            return prev.map(point => ({...point, state: undefined}))
        })
    }

    function improve() {
        if(pointsBeforeImprove == undefined) {
            console.log(gamePoints)
            setPointsBeforeImprove(gamePoints);
        }

        setGamePoints(prev => prev.filter(point => point.state != "correct"));
        start()
    }

    return (
        <div style={{height: "100vh", maxHeight: '100vh'}}>
            <div className="fixed gap-2">
                <Link to="/" className="link">Strona główna</Link> - <a onClick={() => reset(true)}>Resetuj/Zmień tryb gry</a>
            </div>
            {creatorMode && JSON.stringify(createdPoints)}
            
            { setup &&
                <div className={`card`} >
                    <span className="text-2xl font-bold">Wybierz tryb gry</span>
                    <div className="flex flex-row justify-center gap-5 mt-2">
                        {modes.map((m, i) => <a className={`text-teal-500 text-lg ${i == mode ? 'underline' : 'no-underline'}`} onClick={() => setMode(i)}>{m}</a>)}
                    </div>
                    <div className="flex justify-center gap-4">
                        <a className='text-teal-950 block mt-3' onClick={() => start()}>Start</a>
                        <a className='text-teal-700 block mt-3' onClick={() => goToEditMode()}>Edytuj punkty</a>
                    </div>
                </div>
            }

            { editMode &&
                <div className={`card`} >
                    <span className="text-2xl font-bold">Edytuj punkty na mapie</span>
                    <span className='block text-base mt-2'>Aktualny tryb:</span>
                    <div className="flex gap-5 justify-center mt-2">
                        <div className='flex gap-2 cursor-pointer' onClick={() => setAsActive(true)} >
                            <input type="radio" checked={asActive} onChange={() => setAsActive(true)} />
                            <label for="huey">Włącz</label>
                        </div>
                        <div className='flex gap-2' onClick={() => setAsActive(false)}>
                            <input type="radio" checked={!asActive} onChange={() => setAsActive(false)} />
                            <label for="huey">Wyłącz</label>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <a className='text-teal-700 block mt-3' onClick={() => setAll(false)}>Wyłącz wszystkie</a>
                        <a className='text-teal-700 block mt-3' onClick={() => setAll(true)}>Włącz wszystkie</a>
                        <a className='text-teal-950 block mt-3' onClick={() => saveGamePoints()}>Zapisz</a>
                    </div>
                </div>
            }

            { !setup && !editMode && mode == 0 &&
                <div className={`card ${flip ? 'flip' : ""}`} onClick={() => setFlip(prev => !prev)}>
                    <span className="text-2xl block font-bold">{curPoint !== undefined ? gamePoints[curPoint].n : "Kliknij w punkt"}</span>
                </div>
            }

            { !setup && !editMode && !isGameOver && mode == 1 &&
                <div className="card" onClick={() => setFlip(prev => !prev)}>
                    <span className="text-3xl font-bold">{gamePoints[curPoint].n}</span>
                </div>
            }

            { !setup && !editMode && !isGameOver && mode == 2 &&
                <div className={`card`} >
                    <input id="input" className="w-full h-7 rounded-lg border-gray-600 border-2" placeholder="Wpisz niebieski punkt" value={inputValue} onChange={handleInputChange} />
                    <span className='block text-sm flex justify-center gap-2'>
                        <a onClick={() => skip()}>Pomiń</a>
                    </span>
                    {skippedPoint && <span className='text-sm'>Pominięty punkt to {skippedPoint}. Wpisz aby przejść dalej</span>}
                </div>
            }

            {
                isGameOver &&
                (<div className="card">
                    <span className='text-xl block font-bold'>Wynik</span>
                    <span className='text-base'>{correctAnswersCount}/{gamePoints.length} - {time}s - {Math.floor((correctAnswersCount/gamePoints.length)*100)}%</span>
                    <span className='block text-sm flex justify-center gap-2'>
                        <a onClick={() => reset(true)}>Resetuj/Zmień tryb gry</a>
                        {gamePoints.filter(point => point.state != "correct").length > 0 &&  <a onClick={() => improve()}>Popraw</a>}
                    </span>
                </div>)
            } 
            
            <TestCanvas points={editMode ? points : gamePoints} handleClick={handleClick} mapUrl={params.imageURL} pointSize={params.pointSize} />

            {/* <Map
                image={params.imageURL}
                // onClick={handleMapClick}
            >
                {(editMode ? points : gamePoints).map((point, index) => (
                        <Marker
                            size={params.pointSize}
                            markerKey={`marker-${index}`}
                            coords={{x: point.x, y: point.y}}
                            image={chooseImage(point.state, index)}
                            onClick={() => handleClick(index)}
                        />
                    ))
                }
            </Map> */}
        </div>
    )
}
