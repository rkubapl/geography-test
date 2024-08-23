import React, {useCallback, useEffect, useState, useRef} from 'react'
import { Map, Marker } from 'react-canvas-map'
import "./GeoTest.css"
import {Link} from "react-router-dom";
import {getCookie} from "../utils/cookies";
import {sendResultAPI} from "../utils/api.ts";


export const GeoTest = params => {
    const creatorMode = false;

    const modes = ["Nauka", "Kliknij", "Wpisz"]

    function start() {
        setStartTime(Date.now())
        setSetup(false)
        setCurPoint(0)

        if(mode == 2) {
            updateState(0, "highlight")
            setTimeout(() => document.getElementById("input").focus(), 100) //:)
        }
    }
    
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
    const [flip, setFlip] = useState(params.f || false);

    const [learnMode, setLearnMode] = useState(false)
    const [learnModeIndex, setLearnModeIndex] = useState(-1)

    const input = useRef(null)


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    //Start of a game
    //Shuffle points and start a timer
    useEffect(() => {
        reset()
    }, [])

    useEffect(() => {
        if(isGameOver) {
            setTime(((Date.now()-startTime)/1000).toFixed(2))
            setCorrectAnswersCount(points.reduce((acc, val) => acc + (val.state == "correct"), 0))
        }
    }, [isGameOver])


    useEffect(() => {
        reset()
    }, [learnMode])

    function updateState(index, state) {
        setPoints(prevP => prevP.map((p, pIndex) => index === pIndex ? {...p, state} : p))
    }

    function handleClick(index) {
        if(setup) return

        if(mode == 0) { // Nauka
            return setCurPoint(index)
        }

        if(mode == 1) { //Kliknij
            if(curPoint == index) { //user clicked correct point
                if(invalidAttempts === 0) updateState(index, "correct")
                else if(invalidAttempts < 3) updateState(index, "kinda")
                else updateState(index, "invalid")
                setPoints(prevPoints => prevPoints.map(p => p.state == "highlight" ? {...p, state: "point"} : p)) //clear highlighted points

                setInvalidAttempts(0)

                if(curPoint+1 < points.length) {
                    setCurPoint(prevState => prevState+1);
                } else {
                    setIsGameOver(true)
                }
            } else {
                setInvalidAttempts(attempts => attempts+1);
                updateState(index, "highlight")
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
        
        if(normalizeString(value) === normalizeString(points[curPoint].n)) {
            updateState(curPoint, "correct")
            setInputValue("")

            if(curPoint+1 < points.length) {
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
        updateState(curPoint, "invalid")

        if(curPoint < points.length) {
            setCurPoint(prevState => prevState+1);
            updateState(curPoint+1, "highlight")
        } else {
            setIsGameOver(true)
        }
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

    function reset() {
        setPoints(prevPoints => prevPoints.map(point => ({...point, state: "p"})))
        setPoints(shuffleArray(JSON.parse(JSON.stringify(params.points))));
        
        setInvalidAttempts(0)
        setCurPoint(undefined)

        setIsGameOver(false)
        setSetup(true)
    }

    const handleMapClick = useCallback(coords => {
        const prompt = window.prompt("Podaj nazwę");

        const point = {x: Math.floor(coords.x), y: Math.floor(coords.y), name: prompt}

        setCreatedPoints(prevPoints => [...prevPoints, point])
        setPoints(prevPoints => [...prevPoints, point])
    }, [])

    return (
        <div style={{height: '100vh'}}>
            <div className="fixed gap-2">
                <Link to="/" className="link">Strona główna</Link> - <a onClick={() => reset()}>Resetuj/Zmień tryb gry</a>
            </div>
            {creatorMode && JSON.stringify(createdPoints)}
            
            { setup &&
                <div className={`card`} >
                    <span className="text-2xl font-bold">Wybierz tryb gry</span>
                    <div className="flex flex-row justify-center gap-5 mt-2">
                        {modes.map((m, i) => <a className={`text-teal-500 text-lg ${i == mode ? 'underline' : 'no-underline'}`} onClick={() => setMode(i)}>{m}</a>)}
                    </div>
                    <a className='text-teal-700 block mt-3' onClick={() => start()}>Start</a>
                </div>
            }

            { !setup && mode == 0 &&
                <div className={`card ${flip ? 'flip' : ""}`} onClick={() => setFlip(prev => !prev)}>
                    <span className='text-base block font-light'>Aktualny punkt</span>
                    <span className="text-2xl block font-bold">{curPoint !== undefined ? points[curPoint].n : "Kliknij w punkt"}</span>
                    {/* <span className="text-xs block mt-1">Klinij w kartę aby przenieść ją na drugą stronę ekranu</span> */}
                </div>
            }

            { !setup && mode == 1 &&
                <div className={`card ${flip ? 'flip' : ""}`} onClick={() => setFlip(prev => !prev)}>
                    <span className='text-base block font-light'>Kliknij w</span>
                    <span className="text-3xl font-bold">{points[curPoint].n}</span>
                    {/* <span className='block text-sm flex justify-center gap-2'><a>Resetuj</a> <a>Zmień tryb</a></span> */}
                </div>
            }

            { !setup && mode == 2 &&
                <div className={`card`} >
                    <input id="input" className="w-full h-7 rounded-lg border-gray-600 border-2" placeholder="Wpisz niebieski punkt" value={inputValue} onChange={handleInputChange} />
                    <span className='block text-sm flex justify-center gap-2'>
                        <a onClick={() => skip()}>Skip</a>
                    </span>
                </div>
            }

            {
                isGameOver &&
                (<div className="card">
                    <span className='text-xl block font-bold'>Wynik</span>
                    <span className='text-base'>{correctAnswersCount}/{points.length} - {time}s - {Math.floor((correctAnswersCount/points.length)*100)}%</span>
                    <span className='block text-sm flex justify-center gap-2'><a onClick={() => reset()}>Resetuj/Zmień tryb gry</a></span>
                </div>)
            } 
            
            <Map
                image={params.imageURL}
                onClick={creatorMode && handleMapClick}
            >
                {points.map((point, index) => (
                        <Marker
                            size={params.pointSize}
                            markerKey={`marker-${index}`}
                            coords={{x: point.x, y: point.y}}
                            image={chooseImage(point.state, index)}
                            onClick={() => handleClick(index)}
                        />
                    ))
                }
            </Map>
        </div>
    )
}
