import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';


import React, { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { Button } from "primereact/button";
import styles from "../styles/documentUpload.module.css";

const AadharValidationModal = (props) => {
  const { setShowAadhaarModal, showCamera, Webcam } = props;

  const [apiProcessing, setApiProcessing] = useState(false);

  const [apiResponseData, setApiResponseData] = useState(null); // Store the API response data

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedText, setCapturedText] = useState("");
  const [uidaiNo, setUidaiNo] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [mediaStream, setMediaStream] = useState(null); // Store the media stream
  const [cameraActive, setCameraActive] = useState(false);
  const [processedImage, setProcessedImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const startWebcam = async () => {
    setIsLoading(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    // if(apiProcessing)
    // {

    //   setIsLoading(true)
    // }

    setProcessedImage(false);
    // setCapturedImage(false)
    if (cameraActive && mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      setMediaStream(null);
      setCameraActive(false);
    }
  };

  console.log("captured image", capturedImage)

  const captureImage = async () => {
    setCapturedImage(null);
    setApiProcessing(true); // Set API processing state to true

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          setCapturedImage(URL.createObjectURL(blob)); // Display the captured image

          const formData = new FormData();
          formData.append("frame", blob, "captured-image.png");

          try {
            const response = await fetch("https://e04e-171-79-54-12.ngrok-free.app/process_frame", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              setApiResponseData(data); // Store the API response data
              setIsLoading(false)
              console.log("API RESPONSE", data);
            } else {
              console.error("Error sending image to API:", response.statusText);
            }
          } catch (error) {
            console.error("Error sending image to API:", error);
          }

          setApiProcessing(false); // Set API processing state to false after response is received
          setIsLoading(false)
          stopWebcam();
        }
      }, "image/png");
    }
  };



  console.log("@$#44 isloading", isLoading)



  //  const captureImage = () => {
  //    setCapturedImage();
  //    setProcessingImage(true);

  //    if (videoRef.current && canvasRef.current) {
  //      const video = videoRef.current;
  //      const canvas = canvasRef.current;
  //      canvas.width = video.videoWidth;
  //      canvas.height = video.videoHeight;

  //      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  //      const imageDataURL = canvas.toDataURL("image/png");
  //      setCapturedImage(imageDataURL);

  //      // Perform OCR on the captured image
  //      Tesseract.recognize(imageDataURL, "eng")
  //        .then(({ data: { text } }) => {
  //          setCapturedText(text);
  //          // Filter text matching the pattern '#### #### ####' (four digits, space, four digits, space, four digits)
  //          const pattern = /\d{4} \d{4} \d{4}/g;
  //          const matches = text.match(pattern);
  //          if (matches) {
  //            const formattedMatches = matches.join("\n");
  //                setUidaiNo(formattedMatches);
  //                stopWebcam();
  //                console.log("Matching Patterns:", formattedMatches);
  //            }
  //            setProcessingImage(false);
  //            setProcessedImage(true);
  //        })
  //          .catch((error) => {
  //              stopWebcam();
  //              setProcessedImage(true);

  //          console.error("Error performing OCR:", error);
  //        });

  //    }
  //  };

  useEffect(() => {
    return () => {
      // Cleanup when the component is unmounted
      stopWebcam();
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className={styles.uploadModalContainer}>
        <div className={styles.cameraModalWrapper} onClick={() => setShowAadhaarModal(true)}>
          {isLoading ?

            <div className={styles.defaultImageContainer}>

              {!processedImage && !apiResponseData && <img src="/assets/camera.svg" alt={"default"}
              // style={{ border: '1px solid red' }} 

              />}

            </div>
            :


            <div>
              {!capturedImage && <video ref={videoRef} autoPlay playsInline width="300" height="300" />}
              {(capturedImage || processedImage || (!processingImage && uidaiNo)) && <img src={capturedImage} style={{ width: '300px' }} alt="Captured" />}
            </div>}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className={styles.buttonContainer}>
          {!cameraActive && !apiResponseData && <Button onClick={startWebcam} label={"Start Camera"} className={styles.aadharButton} />}
          {cameraActive && !processedImage && <Button onClick={captureImage} label="Capture Image and Read Text" className={styles.aadharButton} />}

          {processedImage && <Button onClick={stopWebcam} label="Retry" className={styles.aadharButton} />}

        </div>
        {
          false && <>
            {processingImage && <p>Processing Image</p>}
            {!processingImage && uidaiNo && <p>validationSuccess</p>}
            {(!processingImage && !capturedText.includes(uidaiNo) && capturedImage) && <p>Please try again</p>}
            {!processingImage && (!(!processingImage && !capturedText.includes(uidaiNo) && capturedImage)) && <p className={styles.imageModalText}>Hold the card without hiding numbers </p>}

            {uidaiNo}
          </>
        }

      </div>

      <div style={{
        width: '300px',
        marginLeft: '10px'
        // border: '1px solid red'

      }}

      >

        {apiProcessing &&

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            <Message severity="info" text="Processing Image Please Wait...." />
            <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>

          </div>


        }
        {console.log(apiResponseData)}
        {apiResponseData && 
        
        apiResponseData.detected_text.map((data) =>

          <p style={{}}> {data}</p>
        )
        }
      </div>

    </div>
  );
};

export default AadharValidationModal;


