import React, {useCallback, useEffect, useState} from 'react'
import "./Creator.css"
import {Map, Marker} from "react-canvas-map";
import {encode,decode} from 'base-64';

export const Creator = () => {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState([]);

    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [existingTestURL, setExistingTestURL] = useState("");

    const [points, setPoints] = useState([])
    const [pointSize, setPointSize] = useState(300)
    const [highlightPoint, setHighlightPoint] = useState(-1)

    const [creatingPointCoords, setCreatingPointCoords] = useState({})
    const [creatingPointName, setCreatingPointName] = useState("")

    const [creatingPointStep, setCreatingPointStep] = useState(0)

    const mode = (
        <div>
            <h1>Kreator testów</h1>
            <button onClick={() => setStep(1)}>Stwórz nowy test</button>
            <br />
            <span>Lub załaduj istniejący</span>
            <br />
            <input type="text" value={existingTestURL} onChange={e => setExistingTestURL(e.target.value)} />
            <br />
            <button onClick={() => loadExistingTest()}>Załaduj</button>
            <br />
            {errors.length > 0 && errors.map((error, i) => <span key={i}>{error}</span>)}
        </div>
    )
    const initialData = (
        <div>
            <label htmlFor="fname">Nazwa testu</label><br />
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <br/>
            <label htmlFor="lname">Link do zdjęcia</label><br />
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <br />
            <button onClick={() => verifyStep0()}>Dalej</button>
            <br />
            {errors.length > 0 && errors.map((error, i) => <span key={i}>{error}</span>)}
        </div>
    )

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function loadExistingTest() {
        if(existingTestURL.length === 0) {
            setErrors(["Podaj link!"])
            return
        }
        const split = existingTestURL.split("?data=")
        if(split.length === 2) {
            const base64 = split[1]
            const data = decode(base64);
            if(isJson(data)) {
                const json = JSON.parse(data)
                setName(json.n)
                setImageUrl(json.i)
                setPoints(json.p)
                setStep(1)
            } else {
                setErrors(["Nieprawidłowe dane testu!"])
            }
        } else {
            setErrors(["Link jest nieprawidłowy"])
        }
    }

    function verifyStep0() {
        let errs = []

        const image = new Image()
        image.src = imageUrl
        image.onload = () => {
            resolveStep0(errs)
        }
        image.onerror = () => {
            errs.push("Nie udało się załadować zdjęcia!")
            resolveStep0(errs)
        }

    }

    function resolveStep0(errs) {
        if(errs.length === 0) {
            setStep(2)
        } else {
            setErrors(errs)
        }
    }

    useEffect(() => {
        setErrors([])
    }, [step])

    useEffect(() => {
        setHighlightPoint(-1)
    }, [points])

    const [encodedDataURL, setEncodedDataURL] = useState();

    function generateLink() {
        setEncodedDataURL(`${window.location.origin}/customTest?data=${encode(JSON.stringify({n: name, s: pointSize, i: imageUrl, p: points}))}`)
        setStep(3)
    }

    const handleMapClick = useCallback(coords => {
        if(creatingPointStep === 1) {
            setCreatingPointCoords({x: Math.floor(coords.x), y: Math.floor(coords.y)})
            setCreatingPointStep(2)
            return true
        }
    }, [creatingPointStep])

    function createPoint() {
        if(creatingPointName.length < 4 || creatingPointName.length > 32) {
            setErrors(["Nazwa punktu musi mieć od 4 do 32 znaków!"])
            return;
        }
        setPoints(prevState => [...prevState, {...creatingPointCoords, n: creatingPointName}])
        setCreatingPointStep(0)
        setCreatingPointName("")
        setCreatingPointCoords({})
        setErrors([])
    }

    function loadImage(src) {
        const image = new Image()
        image.src = src
        return image
    }

    const [pointDot] = useState(() => loadImage('/svg/point.svg'))

    function removePoint(index) {
        setPoints(prevState => prevState.filter((p, i) => i !== index))
    }

    function cancel() {
        setCreatingPointStep(0)
        setCreatingPointName("")
        setCreatingPointCoords({})
        setErrors([])
    }

    const map = (
        <div style={{"height": "100vh"}}>
            { creatingPointStep === 1 && <div className="modal">Kliknij na mapie w miejsce, gdzie ma być punkt</div>}
            { creatingPointStep === 2 &&
                <div className="modal">
                    <span>Podaj nazwę punktu</span>
                    <br />
                    <input type="text" value={creatingPointName} onChange={e => setCreatingPointName(e.target.value)}/>
                    <br/>
                    {errors.length === 1 && <span>{errors[0]}</span>}
                    <br/>
                    <button onClick={() => createPoint()}>Stwórz punkt</button>
                    <button onClick={() => cancel()}>Anuluj</button>
                </div>
            }
            <div className="pointsCard">
                <div className="pointsList">
                    <h2 className="center pointsTitle">Lista punktów na mapie</h2>
                    {points.map((point, i) => <div key={i} className="pointOnList"><span className={highlightPoint === i && "highlight"}>{point.n}</span> <button onClick={() => removePoint(i)} className="removeButton">Usuń</button> </div>)}
                    {points.length === 0 && <span className="center">Brak punktów! Stwórz klkając "Dodaj punkt"</span>}
                </div>
                <div className="pointControl">
                    <span>Rozmiar punktów</span>
                    <div className="pointControlInputs">
                        <input type="text" value={pointSize} size="1" onChange={e => setPointSize(e.target.value)} />
                        <input type="range" min="20" max="500" value={pointSize} onChange={e => setPointSize(e.target.value)} />
                    </div>
                </div>
                <div className="controls">
                    <button className="listButton" disabled={creatingPointStep !== 0} onClick={() => setCreatingPointStep(1)}>Dodaj punkt</button>
                    <button className="listButton" onClick={() => generateLink()}>Zapisz</button>
                </div>
            </div>
            <Map
                image={imageUrl}
                onClick={handleMapClick}
            >
                {points.map((point, index) => (
                    <Marker
                        key={index}
                        size={pointSize}
                        markerKey={`marker-${index}`}
                        coords={{x: point.x, y: point.y}}
                        image={pointDot}
                        onClick={() => setHighlightPoint(index)}
                    />
                ))
                }
            </Map>
        </div>
    )

    const save = (
        <div>
            <a onClick={() => setStep(2)}>Powrót do edytowania testu</a>
            <h1>Użyj poniższego linku aby skorzystać z testu!</h1>
            <input style={{"width": "90vw"}} value={encodedDataURL} />
            <br />
            <button onClick={() => navigator.clipboard.writeText(encodedDataURL)}>Skopiuj link</button>
            <br />
            <span>UWAGA! Skopiuj ten link i zapisz go gdzieś. Test nie jest zapisywany nigdzie poza Twoim komputerem, dane do testu znajdują się w linku powyżej.</span>
        </div>
    )

    return (
        <div>
            {
                step === 0 ? mode : (step === 1 ? initialData : (step === 2 ? map : save))
            }
        </div>
    )
}
