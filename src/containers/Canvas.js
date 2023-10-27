import React, {useRef, useEffect} from 'react'

const Canvas = params => {
    const canvasRef = useRef(null)

    function drawStuff() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')

        canvas.width = window.innerWidth/2;
        canvas.height = window.innerHeight;

        const img = new Image();
        img.src = "mapa.png";

        img.onload = () => {
            const hRatio = canvas.width / img.width;
            const vRatio = (canvas.height) / img.height;
            const ratio = Math.min(hRatio, vRatio);

            const yOffset = (canvas.height - (img.height * ratio))/2

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, yOffset, img.width * ratio, img.height * ratio);

            params.points.forEach(point => {
                ctx.font = "900 24px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(point.label, point.x*ratio, point.y*ratio+yOffset);
            });
        }
    }

    useEffect(() => {
        window.addEventListener('resize', drawStuff, false);
        return () => window.removeEventListener('resize', drawStuff);
    }, []);

    useEffect(() => {
        console.log("POINTS UPDATED")
        console.log(params.points)
        drawStuff()
    }, [params.points])


    return <canvas ref={canvasRef} />
}

export default Canvas