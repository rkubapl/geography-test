import React, {useRef, useEffect, useCallback} from 'react'

const Canvas = params => {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        drawStuffFn(canvas, context)

        window.addEventListener('resize', drawStuff, false);
        return () => window.removeEventListener('resize', drawStuff);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.points])

    const drawStuff = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        drawStuffFn(canvas, ctx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.points]);

    function drawStuffFn(canvas, ctx) {
        canvas.width = window.innerWidth/2;
        canvas.height = window.innerHeight;

        const img = new Image();
        img.src = "mapa.png";

        img.onload = () => {
            var hRatio = canvas.width / img.width;
            var vRatio = (canvas.height) / img.height;
            var ratio = Math.min(hRatio, vRatio);

            // alert(canvas.height)
            const yOffset = (canvas.height - (img.height * ratio))/2

            function printMousePos(event) {
                const x = Math.floor(event.clientX/ratio);
                if(x > 3000) return;

                document.getElementById("coords").innerHTML = "x: " + x + ", y: " + Math.floor((event.clientY-yOffset)/ratio);
                // alert(event.clientX);
            }
            document.addEventListener("click", printMousePos);


            // console.log(yOffset)
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, yOffset, img.width * ratio, img.height * ratio);

            params.points.forEach(point => {
                // console.log(point)
                ctx.font = "900 24px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(point.label, point.x*ratio, point.y*ratio+yOffset);
            });
        }
    }
    // useEffect(() => {
    //     // alert("UPDATE")
    //     const canvas = canvasRef.current
    //     const context = canvas.getContext('2d')
    //
    //     canvas.width = window.innerWidth/2;
    //     canvas.height = window.innerHeight;
    //
    //     drawStuff(canvas, context)
    //
    //     // window.removeEventListener('resize', drawStuff)
    // }, [params.points])

    // function drawStuff(canvas, ctx) {
    //     console.log("PARAMETRY")
    //     console.log(params)
    //     // points = params.points;
    //     // alert(JSON.stringify(params.points))
    //     canvas.width = window.innerWidth/2;
    //     canvas.height = window.innerHeight;
    //
    //     const img = new Image();
    //     img.src = "mapa.png";
    //
    //     img.onload = () => {
    //         var hRatio = canvas.width / img.width;
    //         var vRatio = (canvas.height) / img.height;
    //         var ratio = Math.min(hRatio, vRatio);
    //
    //         // alert(canvas.height)
    //         const yOffset = (canvas.height - (img.height * ratio))/2
    //         // console.log(yOffset)
    //         ctx.drawImage(img, 0, 0, img.width, img.height, 0, yOffset, img.width * ratio, img.height * ratio);
    //
    //         params.points.forEach(point => {
    //             // console.log(point)
    //             ctx.font = "900 24px Arial";
    //             ctx.fillStyle = "red";
    //             ctx.fillText(point.label, point.x*ratio, point.y*ratio+yOffset);
    //         });
    //     }
    //
    //     return true;
    // }

    // function printMousePos(event) {
    //     alert("clientX: " + event.clientX/ratio + " - clientY: " + event.clientY/ratio);
    // }
    //
    // document.addEventListener("click", printMousePos);
    // var ratio = 1;

    // const yOffset = (canvas.height - img.height * ratio)/2

    return <canvas ref={canvasRef} />
}

export default Canvas