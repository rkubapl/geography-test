import React, {useEffect, useState} from 'react'
import { Map, Marker } from 'react-canvas-map'
import "./App2.css"

export const App2 = () => {
    const originalPoints = [
        {x: 1252, y: 528, name: "Pobrzeże Koszalińskie"},
        {x: 2426, y: 800, name: "Pojezierze Mazurskie"},
        {x: 1223, y: 947, name: "Pojezierze Pomorskie"},
        {x: 2890, y: 1107, name: "Nizina Północnopodlaska"},
        {x: 685, y: 1444, name: "Pojezierze Lubuskie"},
        {x: 2250, y: 1420, name: "Nizina Mazowiecka"},
        {x: 2812, y: 1469, name: "Nizina Południowopodlaska"},
        {x: 2814, y: 2097, name: "Wyżyna Lubelska"},
        {x: 2278, y: 2171, name: "Wyżyna Małopolska"},
        {x: 1750, y: 2458, name: "Wyżyna Śląska"},
        {x: 1975, y: 2350, name: "Wyżyna Krakowsko-Częstochowska"},
        {x: 1025, y: 2506, name: "Sudety"},
        {x: 2139, y: 2907, name: "Karpaty"},
        {x: 1810, y: 634, name: "Żuławy Wiślane"},
        {x: 1297, y: 1378, name: "Pojezierze Wielkopolskie"},
        {x: 1600, y: 1764, name: "Nizina Południowowielkopolska"},
        {x: 1259, y: 2302, name: "Nizina Śląska"},
        {x: 2660, y: 2397, name: "Kotlina Sandomierska"},
    ]

    const [isGameOver, setIsGameOver] = useState(false)
    const [nowPoint, setNowPoint] = useState(0)
    const [invalidAttempts, setInvalidAttempts] = useState(0)

    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [inputs, setInputs] = useState({})

    const [points, setPoints] = useState(shuffleArray(JSON.parse(JSON.stringify(originalPoints))));

    useEffect(() => {
        // setPoints(shuffleArray(JSON.parse(JSON.stringify(originalPoints))));

        // alert(points.length)
        // alert("Kliknij " + points[nowPoint].name)
    }, [])

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    useEffect(() => {
        if(isGameOver) countPoints()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameOver])
    //
    //
    // //Generate points
    // useEffect(() => {
    //     let copyPoints = points;
    //
    //     const randomPoints = [];
    //
    //     for (let i = 0; i < originalPoints.length+1; i++) {
    //         if(copyPoints.length === 0) break;
    //         let randomPoint = Math.floor(Math.random()*copyPoints.length);
    //
    //         const splicedPoint = copyPoints.splice(randomPoint, 1)[0]
    //
    //         randomPoints.push({label: i+1, ...splicedPoint})
    //     }
    //
    //     setRandomly(randomPoints)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // function input(label, input) {
    //     setInputs(prevInputs => ({...prevInputs, [label]: input}))
    // }

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


        // if(nowPoint === index) {
        //     alert("Dobrze!")
        //     setPoints(prevPoints => prevPoints.map((point, pointIndex) => pointIndex === index ? {...point, correct} : point))
        // } else {
        //     alert("Źle!")
        // }


        // alert(points[index].name)
    }

    function countPoints() {
        let correctAnswers = 0;

        points.forEach(point => {
            if(point.state === "correct") correctAnswers++;
        })

        setCorrectAnswersCount(correctAnswers)
    }


    const [point] = useState(() => {
        const image = new Image()
        image.src = '/point.svg'
        return image
    })

    const [correctPoint] = useState(() => {
        const image = new Image()
        image.src = '/point-correct.svg'
        return image
    })

    const [invalidPoint] = useState(() => {
        const image = new Image()
        image.src = '/point-invalid.svg'
        return image
    })

    const [highlightPoint] = useState(() => {
        const image = new Image()
        image.src = '/point-highlight.svg'
        return image
    })

    const [kindaPoint] = useState(() => {
        const image = new Image()
        image.src = '/point-kinda.svg'
        return image
    })

    const [markerOneCoords, setMarkerOneCoords] = useState({x: 100, y: 200})
    const [markerTwoCoords, setMarkerTwoCoords] = useState({x: 500, y: 500})
    return (
        <div style={{height: '100vh'}}>
            { !isGameOver
                &&
                (<div className="card">
                    <span>Kliknij w</span>
                    <h1>{!isGameOver && points[nowPoint].name}</h1>
                    <span>Próba {invalidAttempts}/3</span>
                </div>)
            }
            {
                isGameOver &&
                (<div className="card">
                    <span>Liczba prawidłowych odpowiedzi</span>
                    <h1>{correctAnswersCount}/{points.length}</h1>
                    <span>{Math.floor((correctAnswersCount/points.length)*100)}%</span>
                </div>)
            }
            <Map
                image="/mapa.png"
            >
                {points.map((point, index) => (
                        <Marker
                            size={300}
                            markerKey={`marker-${index}`}
                            coords={{x: point.x, y: point.y}}
                            onDragTick={setMarkerTwoCoords}
                            onDragEnd={setMarkerTwoCoords}
                            image={chooseImage(point.state)}
                            onClick={() => handleClick(index)}
                        />
                    ))
                }
            </Map>
        </div>
    )

    function chooseImage(state) {
        if(state === "highlight") return highlightPoint;
        if(state === "correct") return correctPoint;
        if(state === "kinda") return kindaPoint;
        if(state === "invalid") return invalidPoint;
        else return point;
    }
}
