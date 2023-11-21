// const timeLimit = 180;
// const acc = 0.9
//
// const time = 5;
// const maxPoints = 5000;
//

function calculatePoints(time, accuracy, timeLimit, maxPoints) {
    const points = (maxPoints*(timeLimit-time)^2)/timeLimit^2;

    return Math.round(points*accuracy)
}

const fn = (maxPoints*(timeLimit-time)^2)/timeLimit^2;

console.log(fn*acc)