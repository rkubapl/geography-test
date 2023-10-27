import React, {useRef, useEffect, useCallback} from 'react'

const Input = params => {
    // const [value, setValue] =
    const {data, value, handleUpdateInput, showAnswer} = params;

    return (
        <div>
            <label htmlFor="fname">{data.label}</label>
            <input autocomplete="off" type="text" id="fname" placeholder={data.correctAnswer} name="Nazwa" value={data.value} value={value} onChange={e => handleUpdateInput(data.label, e.target.value)} />
            { showAnswer && (value === data.correctAnswer ? "Prawidłowa odpowiedź" : "Błędna odpowiedź") }
        </div>
    )
}

export default Input