import React from 'react'
import "./Input.css"

const Input = params => {
    const {data, value, handleUpdateInput, showAnswer} = params;

    return (
        <div className="question">
            <label htmlFor="fname">{data.label}.</label>
            <input className={showAnswer && ((value === data.correctAnswer) ? "correct" : "invalid") } disabled={showAnswer} autoComplete="off" type="text" id="fname" name="Nazwa" value={value} onChange={e => handleUpdateInput(data.label, e.target.value)} />
            { showAnswer && (value === data.correctAnswer ?
                <span className="answer">Prawidłowa odpowiedź</span> :
                <span className="answer">Błędna odpowiedź - {data.correctAnswer}</span>)
            }
        </div>
    )
}

export default Input