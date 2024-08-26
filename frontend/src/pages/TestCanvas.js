import { Stage, Layer, Image, Star, Line, Text, Circle } from 'react-konva';
import { useEffect, useState, useRef } from 'react';

export default function TestCanvas(props) {
  const {points, handleClick, mapUrl, pointSize} = props


  const [mapImage, setMapImage] = useState(null)
  const [scale, setScale] = useState(0)
  const [mapProps, setMapProps] = useState({width: 0, height: 0, x: 0, y: 0})
  

  useEffect(() => {
    const img = new window.Image();
    img.src = mapUrl;
    img.addEventListener('load', e => {
        let s = Math.min(window.innerHeight/e.target.height, window.innerWidth/e.target.width)
        setScale(s)

        setMapImage(e.target)

        const width = e.target.width*s;
        const height = e.target.height*s;

        setMapProps({
            width, 
            height,
            x: window.innerWidth > width ? (window.innerWidth - width) / 2 : 0,
            y: window.innerHeight > height ? (window.innerHeight - height) / 2 : 0
        })
    });
  }, [mapUrl])

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

    const [lastSavedDist, setLastSavedDist] = useState(0);
    const [lastCenter, setLastCenter] = useState();
    const [dragStopped, setDragStopped] = useState(false);

    const [stagePos, setStagePos] = useState({scale: 1, x: 0, y: 0})

    function touchmove(e) {
        const st = e.target

        e.evt.preventDefault();
        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];

        // we need to restore dragging, if it was cancelled by multi-touch
        if (touch1 && !touch2 && !st.isDragging()) { //&& dragStopped
            st.startDrag();
            setDragStopped(false);
        }

        if (touch1 && touch2) {
            // if the stage was under Konva's drag&drop
            // we need to stop it, and implement our own pan logic with two pointers
            // alert(st.isDragging())

            if (st.isDragging()) {
              setDragStopped(true);
              st.stopDrag();
            }

            var p1 = {
              x: touch1.clientX,
              y: touch1.clientY,
            };
            var p2 = {
              x: touch2.clientX,
              y: touch2.clientY,
            };

            var newCenter = getCenter(p1, p2);

            if (!lastCenter) {
                setLastCenter(getCenter(p1, p2));
                return;
            }

            var dist = getDistance(p1, p2);

            let lastDist = lastSavedDist

            if (!lastSavedDist) {
              lastDist = dist
              setLastSavedDist(dist)
            }

            // local coordinates of center point
            var pointTo = {
            x: (newCenter.x - stage.current.x()) / stage.current.scaleX(),
            y: (newCenter.y - stage.current.y()) / stage.current.scaleX(),
            };

            var scale = stage.current.scaleX() * (dist / lastDist);

            // calculate new position of the stage
            var dx = newCenter.x - lastCenter.x;
            var dy = newCenter.y - lastCenter.y;

            setStagePos({
              scale,
              x: newCenter.x - pointTo.x * scale + dx,
              y: newCenter.y - pointTo.y * scale + dy,
            })

            setLastSavedDist(dist);
            setLastCenter(newCenter);
        }
    };

    function touchend(e) {
        setLastSavedDist(0);
        setLastCenter(null)
    };
    
    function mouseEnter(index) {
      stage.current.container().style.cursor = 'pointer';
    }

    function mouseLeave(index) {
      stage.current.container().style.cursor = 'default';
    }

    function wheel(e)  {
      e.evt.preventDefault();
  
      const st = e.target.getStage();
      const scaleBy = 1.075;
      const oldScale = st.scaleX();

      const mousePointTo = {
        x: st.getPointerPosition().x / oldScale - st.x() / oldScale,
        y: st.getPointerPosition().y / oldScale - st.y() / oldScale
      };
  
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      setStagePos({
        scale: newScale,
        x: -(mousePointTo.x - st.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - st.getPointerPosition().y / newScale) * newScale
      })

    };

    function getColor(state) {
      switch (state) {
        case "active":
        case "correct":
          return "#a3b18a"
        case "disabled":
        case "invalid":
          return "#780000"
        case "highlight":
          return "#219ebc"
        case "superhighlight":
          return "#120078"
        case "kinda":
          return "#ffbe0b"
        default:
          return "#000"
      }
    }

    const stage = useRef(null)
    
    return (
        <>
            <Stage width={window.innerWidth} height={window.innerHeight} onTouchMove={touchmove} onTouchEnd={touchend} onWheel={wheel} ref={stage} scaleY={stagePos.scale} scaleX={stagePos.scale} x={stagePos.x} y={stagePos.y}>
                <Layer x={mapProps.x} y={mapProps.y} >
                    <Image image={mapImage} height={mapProps.height} width={mapProps.width} />
                    {points.map((point, index) => (
                      <Circle 
                        id={`point-${index}`}
                        x={point.x*scale} 
                        y={point.y*scale} 
                        radius={pointSize*scale*(point.state == "superhighlight" ? 2 : 1)} 
                        fill={getColor(point.state)}
                        stroke="black" 
                        strokeWidth={4} 
                        onMouseEnter={() => mouseEnter(index)} 
                        onMouseLeave={() => mouseLeave(index)} 
                        onClick={evt => handleClick(index, evt)}
                      />
                    ))}
                    {/* <Line points={[5, 70, 140, 23, 250, 60, 300, 20]} stroke='red' strokeWidth={15} /> */}
                </Layer>
            </Stage>
        </>
    )
}