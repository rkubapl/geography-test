const array = [true, true, true, true]

let bitValue = toBitmap(array)
console.log(bitValue)
console.log(fromBitmap(bitValue, 20))

function toBitmap(arr) {
    let number = 0;

    for(let i = 0; i < array.length; i++) {
        if(array[i]) number = (number | (1 << i))
    }

    return number
}

function fromBitmap(number, size) {
    const arr = []

    for(let i = 0; i < size; i++) {
        arr.push((number & (1 << i)) === 0 ? 0 : 1)
    }

    return arr
}