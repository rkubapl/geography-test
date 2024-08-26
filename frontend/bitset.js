const array = [true, true, true, true, true, false, true, true, false, true, true, false, true, false, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true,]
console.log(array.length)
let bitValue = toBitmap(array)
console.log(bitValue)
console.log(numHex(bitValue))
console.log(fromBitmap(bitValue, 20))

function numHex(s)
{
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}

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