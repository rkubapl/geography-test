import React, {useCallback, useEffect, useRef, useState} from 'react'
import "./Creator.css"
import {Map, Marker} from "react-canvas-map";
import {allowedDomains, isAllowedDomain, isURL} from "../utils";
import {Base64} from "js-base64";
import {Link} from "react-router-dom";

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
    // const pointNameRef = useRef(null);

    const [creatingPointStep, setCreatingPointStep] = useState(1)

    const mode = (
        <div className="container">
            <div className="col-5">
                <Link className="link" to="/">Strona główna</Link>
                <h1 className="h1">Kreator testów</h1>
                <div>
                    <button className="btn btn-primary" onClick={() => setStep(1)}>Stwórz nowy test</button>
                </div>
                <br />
                <p className="h4">Lub załaduj istniejący</p>
                <div className="mb-3">
                    <label className="form-label">Link do testu</label>
                    <input className="form-control" type="text" value={existingTestURL} onChange={e => setExistingTestURL(e.target.value)} />
                </div>
                <button className="btn btn-secondary" onClick={() => loadExistingTest()}>Załaduj</button>
                <br />
                {errors.length > 0 && errors.map((error, i) => <span key={i}>{error}</span>)}
            </div>
        </div>
    )
    const initialData = (
        <div className="container">
            <div className="col-6">
                <Link className="link" to="/">Strona główna</Link>
                <br/>
                <div className="mb-3">
                    <label className="form-label">Nazwa testu</label>
                    <input className="form-control" type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Link do zdjęcia</label>
                    <input className="form-control" type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => verifyStep0()}>Dalej</button>
                <br />
                {errors.length > 0 && errors.map((error, i) => <span key={i}>{error}</span>)}
            </div>
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
            const data = Base64.decode(base64);
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

        if(!isURL(imageUrl)) {
            setErrors([`Nieprawidłowy link do zdjęcia!`])
            return
        }

        const url = new URL(imageUrl);

        if(!isAllowedDomain(url.hostname)) {
            setErrors([`Zdjęcie pochodzi z niedozwolonej domeny! Dozwolone domeny to: ${allowedDomains.join(", ")}`])
            return
        }

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
    const [jsonData, setJsonData] = useState();

    function generateLink() {
        const json = JSON.stringify({n: name, s: pointSize, i: imageUrl, p: points})
        setJsonData(json)
        setEncodedDataURL(`${window.location.origin}/customTest?data=${Base64.encode(json)}`)
        setStep(3)
    }

    const handleMapClick = useCallback(coords => {
        if(creatingPointStep === 1) {
            setCreatingPointCoords({x: Math.floor(coords.x), y: Math.floor(coords.y)})
            setCreatingPointStep(2)
            // pointNameRef.current.focus()

            return true
        }
    }, [creatingPointStep])

    const createPoint = () => {
        if(creatingPointName.length < 3 || creatingPointName.length > 32) {
            setErrors(["Nazwa punktu musi mieć od 3 do 32 znaków!"])
            return;
        }
        setPoints(prevState => [...prevState, {...creatingPointCoords, n: creatingPointName}])
        setCreatingPointStep(1)
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
        setCreatingPointStep(1)
        setCreatingPointName("")
        setCreatingPointCoords({})
        setErrors([])
    }

    const NameModal = (props) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const nameRef = useRef(null);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            nameRef.current.focus()
        }, [])

        return (
            <div className="modalTop">
                <span className="h6">Podaj nazwę punktu</span>
                <input className="form-control mt-2 mb-2" ref={nameRef} onKeyDown={e => (e.key === 'Enter' && createPoint())} type="text" value={creatingPointName} onChange={e => setCreatingPointName(e.target.value)}/>
                {/*<br/>*/}
                {errors.length === 1 && <span>{errors[0]}</span>}
                <div className="btn-group mt-2">
                    <button className="btn btn-success" onClick={() => createPoint()}>Stwórz punkt</button>
                    <button className="btn btn-danger" onClick={() => cancel()}>Anuluj</button>
                </div>
            </div>
        )
    }

    const map = (
        <div style={{"height": "100vh"}}>
            { creatingPointStep === 1 && <div className="modalTop">Kliknij na mapie w miejsce, gdzie ma być punkt</div>}
            { creatingPointStep === 2 && <NameModal></NameModal>}
            <div className="pointsCard">
                <div className="pointsList">
                    <h2 className="h3 font-weight-bold">Lista punktów na mapie</h2>
                    <div className="scroll">
                        {points.map((point, i) => <div key={i} className="pointOnList"><span className={highlightPoint === i && "highlight"}>{point.n}</span> <button onClick={() => removePoint(i)} className="btn btn-danger">Usuń</button> </div>)}
                        {points.length === 0 && <span className="center">Brak punktów! Stwórz klkając "Dodaj punkt"</span>}
                    </div>
                </div>
                <div className="pointControl">
                    <span>Rozmiar punktów</span>
                    <div className="pointControlInputs">
                        <input className="form  -control" type="text" value={pointSize} size="1" onChange={e => setPointSize(e.target.value)} />
                        <input type="range" min="20" max="500" value={pointSize} onChange={e => setPointSize(e.target.value)} />
                    </div>
                </div>
                <div className="controls">
                    <button className="btn btn-primary" onClick={() => generateLink()}>Zapisz</button>
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
            <span className="link" onClick={() => setStep(2)}>Powrót do edytowania testu</span>
            <h1>Użyj poniższego linku aby skorzystać z testu!</h1>
            <input className="form-control mb-2" style={{"width": "90vw"}} value={encodedDataURL} />
            <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(encodedDataURL)}>Skopiuj link</button>
            <br />
            <span>UWAGA! Skopiuj ten link i zapisz go gdzieś. Test nie jest zapisywany nigdzie poza Twoim komputerem, dane do testu znajdują się w linku powyżej.</span>
            <input className="form-control mb-2" style={{"width": "90vw"}} value={jsonData} />
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
