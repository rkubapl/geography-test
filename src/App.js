import './App.css';
import Canvas from "./containers/Canvas";
import {useEffect, useState} from "react";
import Input from "./containers/Input";

function App() {
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

    const [randomly, setRandomly] = useState([])
    const [correctAnswersCount, setCorrectAnswersCount] = useState([])
    const [showAnswer, setShowAnswer] = useState(false)
    const [inputs, setInputs] = useState({})

    const [points] = useState(JSON.parse(JSON.stringify(originalPoints)));

    useEffect(() => {
        let correctAnswers = 0;

        randomly.forEach(mapPoint => {
            if(mapPoint.name === inputs[mapPoint.label]) {
                correctAnswers++;
            }
        })

        setCorrectAnswersCount(correctAnswers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnswer])


    //Generate points
    useEffect(() => {
        let copyPoints = points;

        const randomPoints = [];

        for (let i = 0; i < originalPoints.length+1; i++) {
            if(copyPoints.length === 0) break;
            let randomPoint = Math.floor(Math.random()*copyPoints.length);

            const splicedPoint = copyPoints.splice(randomPoint, 1)[0]

            randomPoints.push({label: i+1, ...splicedPoint})
        }

        setRandomly(randomPoints)
    }, [])

    function input(label, input) {
        setInputs(prevInputs => ({...prevInputs, [label]: input}))
    }

  return (
    <div className="App">
        <div style={{display: "flex"}}>
            <Canvas points={randomly} />
            <div className="questions">
                <h1>Test z krain geograficznych w Polsce</h1>
                <span>Wpisz w pole tekstowe nazwy krain geograficznych odpowiadające podanym cyfrom na mapie po lewej stronie!<br/> Jeśli cyfry na mapie się nie załadowały odśwież stronę.</span>
                <div className="inputs">
                    {randomly.map(point =>
                        <Input showAnswer={showAnswer} data={{correctAnswer: point.name, label: point.label}} value={inputs[point.label]} handleUpdateInput={input} />
                    )
                    }
                </div>
                <button onClick={() => setShowAnswer(true)} >Pokaż odpowiedzi</button>
                {showAnswer && (<p className="results">Uzyskano {correctAnswersCount}/{randomly.length} punktów!<br/>Aby zagrać ponownie odśwież stronę.</p>)}
            </div>
        </div>
    </div>
  );
}

export default App;
