import React, { useRef, useEffect, useState } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { DrawMesh } from "../../helper/Utilities";
import * as tf from "@tensorflow/tfjs";
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import styles from "../../styles/documentUpload.module.css"
import { Message } from 'primereact/message';

function FaceLandmark(props) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const msgs = useRef(null);


    const { setImageHolder, setShowImageModal } = props;

    const [rightEyeBlinkCounter, setRightEyeBlinkCounter] = useState(0);
    const [leftEyeBlinkCounter, setLeftEyeBlinkCounter] = useState(0);

    const leftEyeBlinkCounterRef = useRef(leftEyeBlinkCounter);
    const rightEyeBlinkCounterRef = useRef(rightEyeBlinkCounter);

    const [isFlipped, setIsFlipped] = useState(true);
    const [capturedImage, setCapturedImage] = useState(null); // State to store the captured image data URL

    const [isLoading, setIsLoading] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const [captureIntervalId, setCaptureIntervalId] = useState(null);

    const holdingArraySize = 7;
    const maxValue = 3;
    const blinkThreshold = 8; // Adjust this threshold as needed

    const [leftEyeBlinkArray, setLeftEyeBlinkArray] = useState(
        Array(holdingArraySize).fill(0)
    );

    const [rightEyeBlinkArray, setRightEyeBlinkArray] = useState(
        Array(holdingArraySize).fill(0)
    );

    // const [leftEyeBlinkCounter, setLeftEyeBlinkCounter] = useState(0);
    // const [rightEyeBlinkCounter, setRightEyeBlinkCounter] = useState(0);

    const toggleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    function captureSnapshot() {
        if (webcamRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const webcam = webcamRef.current.getCanvas();

            // Ensure both the webcam and canvas are ready
            if (webcam && canvas) {
                const ctx = canvas.getContext("2d");
                const video = webcam;

                // Draw the current frame from the webcam onto the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Create an Image object to display the snapshot
                const image = new Image();
                image.src = canvas.toDataURL("image/png");

                // Set the captured image in the state
                setCapturedImage(image.src);
                setImageHolder(image.src);
            }
        }
    }


    const pushToLeftArray = (array, value, maxSize) => {
        setLeftEyeBlinkArray((arr) => {
            // console.log(
            //   "LEFT=>ARRAY",
            //   arr,
            //   value,
            //   arr.some((val) => val <= blinkThreshold)
            // );
            if (Array.isArray(arr) && arr.length >= maxSize) {
                arr.shift(); // Remove the oldest element if the array is at max size
            }
            if (
                value > blinkThreshold ||
                //  && !arr.some((val) => val === value)
                (value <= blinkThreshold &&
                    arr.filter((val) => val <= blinkThreshold).length <= 1)
            ) {
                return [...arr, value];
            } else {
                return arr;
            }
        });
    };

    const pushToRightArray = (array, value, maxSize) => {
        setRightEyeBlinkArray((arr) => {
            // console.log(
            //   "RIGHT=> ARRAY",
            //   arr,
            //   value,
            //   arr.some((val) => val <= blinkThreshold)
            // );
            if (Array.isArray(arr) && arr.length >= maxSize) {
                arr.shift(); // Remove the oldest element if the array is at max size
            }
            if (
                value > blinkThreshold ||
                //  && !arr.some((val) => val === value)
                (value <= blinkThreshold &&
                    arr.filter((val) => val <= blinkThreshold).length <= 1)
            ) {
                return [...arr, value];
            } else {
                return arr;
            }
        });
    };

    const runFacemesh = async () => {
        setIsLoading(true);
        setPredicting(true);
        const net = await facemesh.load(
            facemesh.SupportedPackages.mediapipeFacemesh,
            {
                maxFaces: 1,
                useWasm: true,
                iouThreshold: 0.2,
                scoreThreshold: 0.2,
            }
        );
        const intervalId = setInterval(() => {
            detect(net);
        }, 100);
        setCaptureIntervalId(intervalId);
    };

    const stopFacemesh = () => {
        // setRightEyeBlinkCounter(0);
        // setLeftEyeBlinkCounter(0);
        setIsLoading(false);
        if (captureIntervalId) {
            clearInterval(captureIntervalId);
            setCaptureIntervalId(null);
        }
    };

    var leftEyeCenterPointDistance;
    const detect = async (net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const face = await net.estimateFaces({ input: video });
            if (face.length > 0) {
                face.forEach((prediction) => {
                    const rightEyeUpper0 = prediction.annotations.rightEyeUpper0;
                    const rightEyeLower0 = prediction.annotations.rightEyeLower0;
                    const leftEyeUpper0 = prediction.annotations.leftEyeUpper0;
                    const leftEyeLower0 = prediction.annotations.leftEyeLower0;

                    const rightEyeCenterPointDistance = Math.abs(
                        rightEyeUpper0[3][1] - rightEyeLower0[4][1]
                    ).toFixed();

                    leftEyeCenterPointDistance = Math.abs(
                        leftEyeUpper0[3][1] - leftEyeLower0[4][1]
                    ).toFixed();

                    pushToRightArray(
                        rightEyeBlinkArray,
                        rightEyeCenterPointDistance,
                        holdingArraySize
                    );

                    pushToLeftArray(
                        leftEyeBlinkArray,
                        leftEyeCenterPointDistance,
                        holdingArraySize
                    );

                    // const lastLeftEyeQueueValue = getLastLeftEyeQueueValue(
                    //   leftEyeBlinkArray
                    // );

                    // if (lastLeftEyeQueueValue !== leftEyeCenterPointDistance) {
                    //   if (
                    //     (leftEyeCenterPointDistance <= blinkThreshold &&
                    //       leftEyeBlinkArray.every((val) => val > blinkThreshold)) ||
                    //     leftEyeCenterPointDistance > blinkThreshold
                    //   ) {
                    //     pushToLeftArray(
                    //       leftEyeBlinkArray,
                    //       leftEyeCenterPointDistance,
                    //       holdingArraySize
                    //     );
                    //   }
                    // }
                });
            }

            setPredicting(false);

            const ctx = canvasRef.current.getContext("2d");

            requestAnimationFrame(() => {
                DrawMesh(
                    leftEyeBlinkCounterRef.current,
                    rightEyeBlinkCounterRef.current,
                    face,
                    ctx,
                    maxValue
                );
            });
        }
    };


    useEffect(() => {
        setIsLoading(true)
    }, [])


    useEffect(() => {
        if (isLoading) {
            runFacemesh();
        }
    }, [isLoading]);

    useEffect(() => {
        leftEyeBlinkCounterRef.current = leftEyeBlinkCounter;
    }, [leftEyeBlinkCounter]);

    useEffect(() => {
        rightEyeBlinkCounterRef.current = rightEyeBlinkCounter;
    }, [rightEyeBlinkCounter]);

    useEffect(() => {
        if ((leftEyeBlinkCounter >= maxValue) && (rightEyeBlinkCounter >= maxValue)) {
            stopFacemesh();
            // captureSnapshot();
            setTimeout(captureSnapshot, 2000);
        }
    }, [leftEyeBlinkCounter, rightEyeBlinkCounter])

    useEffect(() => {
        if (Array.isArray(leftEyeBlinkArray)) {
            if (leftEyeBlinkArray.every((val) => val > 0)) {
                if (leftEyeBlinkArray.some((val) => val <= blinkThreshold)) {
                    setLeftEyeBlinkArray(() => Array(holdingArraySize).fill(0));
                    setLeftEyeBlinkCounter((prev) => Math.min( prev + 1, 3));
                }
            }
        }
    }, [leftEyeBlinkArray]);

    useEffect(() => {
        if (Array.isArray(rightEyeBlinkArray)) {
            if (rightEyeBlinkArray.every((val) => val > 0)) {
                if (rightEyeBlinkArray.some((val) => val <= blinkThreshold)) {
                    setRightEyeBlinkArray(() => Array(holdingArraySize).fill(0));
                    setRightEyeBlinkCounter((prev) => Math.min(prev + 1, 3));
                }
            }
        }
    }, [rightEyeBlinkArray]);

    return (
        <div className={styles.faceLandmarkWrapper}>
            <div >
                {/* <button onClick={() => setIsLoading(true)}>Start</button> */}
         

                    <Button className={styles.closeButton}
                
                        onClick={() => {
                            stopFacemesh();
                            setShowImageModal(false);
                        }}
                    > {capturedImage ? "Back" : "X"}</Button>

                    {
                        predicting && <>
                            <span>Please wait loading Model </span>
                            <ProgressBar mode="indeterminate" style={{ height: '2px' }}></ProgressBar>
                        </>
                    }
                    {
                        !predicting && capturedImage &&


                        <span style={{display:'inline-block' ,marginBottom:'20px'}}>
                            <Message severity="success" text=" User validated and Image Captured Successfully" />

                        </span>

                    }

      


                {!predicting && !capturedImage && (
                    <>
                        <span>
                            Blink Thrice to capture image
                        </span>

 
                        <span
                            style={{
                                color: leftEyeBlinkCounter >= maxValue ? "green" : "black",
                                fontWeight: leftEyeBlinkCounter >= maxValue ? "bold" : "",
                                fontSize: '12px'

                            }}
                        >
                            {" "}
                            Left Eye Blink {leftEyeBlinkCounter}{" "}
                        </span>
                        <span
                            style={{
                                color: rightEyeBlinkCounter >= maxValue ? "green" : "black",
                                fontWeight: rightEyeBlinkCounter >= maxValue ? "bold" : "",
                                fontSize: '12px'
                            }}
                        >
                            {" "}
                            Right eye Blink Count {rightEyeBlinkCounter}{" "}
                        </span>
                    </>
                )}
                {/* <button onClick={stopFacemesh}>Stop</button> */}

            </div>


            <header className={styles.webCamWrapper}>
                {
                    predicting && <ProgressSpinner style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: "50%",
                        top: "50%",
                    }} />
                }
                <div id="snapshot-container" className={styles.webCamWrapper} >
                    {capturedImage && <img
                        className={styles.webcam}

                        src={capturedImage} alt="Captured" />}

                </div>

                <Webcam
                    mirrored={isFlipped}
                    ref={webcamRef}
                    className={styles.webcam}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        top: '50px',
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zIndex: 9,
                        // width: 640,
                        // height: 480,
                        opacity: predicting ? 0.5 : '',
                        display: capturedImage ? 'none' : ''

                    }}
                />

                <canvas
                    ref={canvasRef}
                    className={styles.webcam}
                    style={{
                        transform: isFlipped ? "scaleX(-1)" : "",
                        display: capturedImage ? 'none' : '',
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        top: '50px',
                        textAlign: "center",
                        zIndex: 9,
                        // width: 640,
                        // height: 480
                    }}
                />
            </header>
            {!capturedImage && <button onClick={toggleFlip} style={{
                // float: "right",
                position: 'absolute', bottom: 0, right: 0, zIndex: 99
            }}>
                {isFlipped ? "Unflip" : "Flip"} Video
            </button>}
        </div>
    );
}

export default FaceLandmark;
