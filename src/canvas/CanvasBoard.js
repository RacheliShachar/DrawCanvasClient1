import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";


const CanvasBoard = (props) => {
    const [inputValue, setInputValue] = useState("");
    const canvasRef = useRef();
    let context;
    const { name } = props
    const [selectedColor, setSelectedColor] = useState("black");
    const [channelState, setChannelState] = useState(null);
    const user = useState({ id: 0, name: "Racheli" })
    const [socketState, setSocketState] = useState(null)
    let participantsArr = [];
    let sssss;
    let isConnect = false;
    var color;


    useEffect(() => {
        loadChannels();
        configureSocket();
    }, []);

    const loadChannels = async () => {
        fetch('http://localhost:8080/getChannel').then(async response => {
            let data = await response.json();
            setChannelState(data.channel)
        })
    }

    const configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', (channel) => {
            debugger
            console.log(`I'm connected with the back-end`);
            if (!isConnect) {
                setChannelState(channel)
                isConnect = true
            }
        });

        socket.on('add-participant-channel', channel => {
            setChannelState(channel)

        });
        socket.on('message', c => {
            setChannelState(c)
        });
        socket.on('drawing', c => {
            debugger;
            context = canvasRef.current.getContext('2d')
            c.drawings.map(drawing => {
                drawing.points.forEach((point, i) => {
                    if (drawing.points.length - 1 != i || drawing.points.length == 2) {
                        context.beginPath();
                        context.moveTo(point.x, point.y);
                        if (drawing.points[i + 1]) {
                            context.lineTo(drawing.points[i + 1].x, drawing.points[i + 1].y);
                        }
                        debugger
                        context.strokeStyle = color ? color : 'black'  //selectedColor ? selectedColor : 'black';
                        context.lineWidth = 1;
                        context.stroke();
                        context.closePath();
                    }

                });
            });


        });
        socket.on('clear-canvas', (c) => {
            setChannelState(c)
        })
      
        sssss = socket
        setSocketState(socket)
    }

    const handleSendMessage = (text) => {
        debugger
        if (sssss) {
            sssss.emit('send-message', { text: text, senderName: sssss.id, id: Date.now() })
        } else {
            socketState.emit('send-message', { text: text, senderName: sssss.id, id: Date.now() })

        }

        ;
    }
    const handleSendDrawing = (startPoint, endPoint, selectedColor) => {
        debugger
        if (sssss) {
            sssss.emit('send-drawing', { startPoint: startPoint, endPoint: endPoint, name: user.name, selectedColor: selectedColor, id: user.id });
        } else {
            socketState.emit('send-drawing', { startPoint: startPoint, endPoint: endPoint, name: user.name, selectedColor: selectedColor, id: user.id });

        }
        debugger
    }
  

    useEffect(() => {
        debugger
        color = selectedColor
        let mouseDown = false;
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let canvasOffsetLeft = 0;
        let canvasOffsetTop = 0;

        function handleMouseDown(evt) {
            context = canvasRef.current.getContext('2d')
            debugger;
            mouseDown = true;

            start = {
                x: evt.clientX - evt.currentTarget.offsetLeft,//  canvasOffsetLeft,
                y: evt.clientY - evt.currentTarget.offsetTop//canvasOffsetTop,
            };

            end = {
                x: evt.clientX - evt.currentTarget.offsetLeft,//canvasOffsetLeft,
                y: evt.clientY - evt.currentTarget.offsetTop,//canvasOffsetTop,
            };
        }

        function handleMouseUp(evt) {
            mouseDown = false;
            // setChannelState()

        }

        function handleMouseMove(evt) {
            if (mouseDown && context) {
                start = {
                    x: end.x,
                    y: end.y,
                };

                end = {
                    x: evt.clientX - evt.currentTarget.offsetLeft, //canvasOffsetLeft,
                    y: evt.clientY - evt.currentTarget.offsetTop//canvasOffsetTop,
                };

                // Draw our path
                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                debugger;
                context.strokeStyle = color ? color : 'black';//`#${randomColor()}`
                context.lineWidth = 1;
                context.stroke();
                context.closePath();
                // onSendDrawing(start, end, color)
                handleSendDrawing(start, end, color)

            }
        }



        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext('2d');

            if (renderCtx) {
                canvasRef.current.addEventListener('mousedown', handleMouseDown);
                canvasRef.current.addEventListener('mouseup', handleMouseUp);
                canvasRef.current.addEventListener('mousemove', handleMouseMove);

                canvasOffsetLeft = canvasRef.current.offsetLeft;
                canvasOffsetTop = canvasRef.current.offsetTop;

                context = renderCtx
                //   setContext(renderCtx);
            }
        }
    }, [context, selectedColor])
    
    useEffect(() => {
        console.log(selectedColor)
    }, [selectedColor])
    // const saveParticipant = (name) => {
    //     participantsArr.pop({ id: participantsArr.length, name: name })
    //     setIsLogin(false)
    // }
    const chooseColor = (e) => {
        setSelectedColor(e.target.value)
    }
    const deleteDrawing = () => {
        if (sssss) {
            sssss.emit('delete-drawings')
        } else {
            socketState.emit('delete-drawings')

        }
    }
    return (
        <>
         
            
            <div className="draw-app">
                <div className="canvas-panel ">
                    <h1 style={{color:"blue"}}>Hello {name}</h1>
                    <input type="color" style={{ width: "200px" }} onChange={(e) => { debugger; chooseColor(e) }} />
                    <br /><br />

                    ‍<canvas ref={canvasRef} className="canvas" id="drawCanvas" style={{ height: "200px", width: "200px", border: "solid black 2px" }} ></canvas>   ‍
                    <br />

                </div>
            </div>

        </>


    )
}
export default CanvasBoard;