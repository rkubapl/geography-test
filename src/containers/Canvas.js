import React, {useRef, useEffect} from 'react'

const Canvas = params => {
    const canvasRef = useRef(null)

    const points = []


    class Canvas {
        points = []
    }

    // const circleInsideRadius = 55;
    // const circleOutsideRadius = 30;

    class Point {
        constructor(x, y, hovered) {
            this.x = x;
            this.y = y;
            this.hovered = hovered;
        }
    }


    function drawStuff() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const img = new Image();
        img.src = "mapa.png";

        img.onload = () => {
            const hRatio = canvas.width / img.width;
            const vRatio = (canvas.height) / img.height;
            const ratio = Math.min(hRatio, vRatio);

            const yOffset = (canvas.height - (img.height * ratio))/2
            const xOffset = (canvas.width - (img.width * ratio))/2

            ctx.drawImage(img, 0, 0, img.width, img.height, xOffset, 0, img.width * ratio, img.height * ratio);


            params.points.forEach(point => {
                const coords = calculatePointCoords(point.x, point.y, xOffset, ratio);

                ctx.beginPath();
                ctx.arc(coords.realCircleX, coords.realCircleY, coords.calcInsideRadius, 0, 2 * Math.PI, false);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.lineWidth = coords.calcOutsideRadius;
                ctx.strokeStyle = '#000';
                ctx.stroke();

                ctx.beginPath();
                ctx.rect(coords.rectangleX, coords.rectangleY, coords.sum, coords.sum);
                ctx.strokeStyle = "red";
                ctx.stroke();


                // drawCircle(ctx, point.x, point.y, xOffset, ratio, "#fff");
            });
        }
    }

    useEffect(() => {
        window.addEventListener('resize', drawStuff, false);
        return () => window.removeEventListener('resize', drawStuff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log("POINTS UPDATED")
        console.log(params.points)
        drawStuff()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.points])

    const cInsideRadius = 55;
    const cOutsideRadius = 30;

    function calculatePointCoords(x, y, xOffset, ratio) {
        const calcInsideRadius = cInsideRadius*ratio;
        const calcOutsideRadius = cOutsideRadius*ratio;

        const sum = calcInsideRadius + calcOutsideRadius;

        const realCircleX = x*ratio+xOffset;
        const realCircleY = y*ratio;

        const rectangleX = realCircleX-(sum/2);
        const rectangleY = realCircleY-(sum/2);

        return {calcOutsideRadius, calcInsideRadius, sum, realCircleX, realCircleY, rectangleX, rectangleY}
    }

    function drawCircle(ctx, x, y, xOffset, ratio, color) {
        const circleInsideRadius = 55*ratio;
        const circleOutsideRadius = 30*ratio;

        const sum = circleInsideRadius+circleOutsideRadius;


        const circleX = x*ratio+xOffset;
        const circleY = y*ratio;

        ctx.beginPath();
        ctx.arc(circleX, circleY, circleInsideRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = circleOutsideRadius;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(circleX-(sum/2), circleY-(sum/2), sum, sum);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    return <canvas ref={canvasRef} />
}

export default Canvas