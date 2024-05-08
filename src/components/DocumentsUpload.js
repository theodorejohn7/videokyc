import { useState } from "react";
import styles from "../styles/documentUpload.module.css";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

import OtpInput from 'react-otp-input';

import AadharValidationModal from "./AadharValidationModal";
import FaceLandmark from "./faceLandMark/FaceLandMark";
import Webcam from "react-webcam";
import ImageModal from "./ImageModal";

const DocumentUpload = (props) => {

    const { formData, setFormData } = props;

    console.log("@$#77 formData", formData)

    const [showCamera, setShowCamera] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(formData?.phoneNumber);
    const [otp, setOtp] = useState('');

    const [showImageModal, setShowImageModal] = useState(false);
    const [showAadharModal, setShowAadhaarModal] = useState(false);
    const [imageHolder, setImageHolder] = useState(false);
    // const [confirmMobile, setConfirmMobile] = useState(false);

    const imageUploadUI =
        <div className={styles.uploadModalContainer}
        style={{ width: '640px', 
            height: '520px',
        overflow:'hidden'
        }}
        >
            <FaceLandmark setImageHolder={setImageHolder} 
            setShowImageModal={setShowImageModal}
            />
        </div>



    return <div className={styles.container}>

        <div className={styles.imageContainer} >
            <div className={styles.imageCaptureWrapper}>
                <div className={styles.cameraWrapper} onClick={() => {
                    setShowAadhaarModal(false);
                    setShowImageModal(true);
                    // setShowCamera(prevVal => !prevVal)
                }
                }>
                    {
                        !showCamera && <img
                            src={imageHolder ? imageHolder : "/assets/camera.svg"}
                            alt={"default"}
                            width={imageHolder ? '130px' : ''}
                            height={imageHolder ? '130px' : ''}

                        />
                    }

                    {showCamera && <Webcam
                        width={150}
                        height={150}
                    />}

                    {!imageHolder && <p>Image </p>}
                </div>
            </div>

            <ImageModal
                visible={showImageModal}
                setVisible={setShowImageModal}
                // header={"Image Upload"}
                content={imageUploadUI}
            />


            <div className={styles.cardCaptureWrapper}>
                <div className={styles.cardCameraWrapper} onClick={() => {

                    setShowImageModal(false);
                    setShowAadhaarModal(true);
                    // setShowCamera(prevVal => !prevVal)
                }
                }>
                    {
                        !showCamera && <img src="/assets/camera.svg" alt={"default"} />
                    }

                    {showCamera && <Webcam
                        width={150}
                        height={150}
                    />}

                    <p>Aadhaar Card</p>
                </div>
            </div>

            <ImageModal
                visible={showAadharModal}
                setVisible={setShowAadhaarModal}
                header={"Aadhar Validation"}
                content={<AadharValidationModal
                    showCamera={showCamera}
                    Webcam={Webcam}
                    setShowAadhaarModal={setShowAadhaarModal}

                />}
            />
        </div>

        <p className={styles.notificText}>
            Verify if the provided Mobile number matches with the one in the Aadhaar card, and if not,
            update the mobile number as registered in the Aadhaar card.
        </p>
        <div className={styles.otpContainer}>

            <div className={styles.mobileVerification} >
                <div>

                    <InputText id="username"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)} />
                    <div> <span className={styles.resendOtp}> Resend OTP</span>
                    </div>
                </div>
                <Button label="Generate OTP" className={styles.buttonStyle} />


            </div>

            <div className={styles.otpInputWrapper}>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                />
                <Button label="Validate OTP" className={styles.buttonStyle} />

            </div>

            <div style={{ marginTop: '10px' }}>
                {/* <Checkbox inputId="ingredient1"
                    name="pizza"
                    value={true}
                    onChange={() => setConfirmMobile(prevVal => !prevVal)}
                    checked={confirmMobile} />
                <label style={{marginLeft:'20px'}}>
                    Confirm that the mobile number corresponds to the same in Aadhar card.
                </label> */}



            </div>
        </div>
    </div>
}


export default DocumentUpload