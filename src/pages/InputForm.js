import { Steps } from 'primereact/steps';

import { Card } from 'primereact/card';
import styles from "../styles/InputForm.module.css";
import { tabs } from '../data/inputFormData';
import { useState } from 'react';
import PersonalDetails from '../components/PersonalDetails';
import DocumentUpload from '../components/DocumentsUpload';
import ValidationScreen from '../components/Validation';

const InputForm = () => {

    const [currentScreen, setCurrentScreen] = useState(0);
    const [formData, setFormData] = useState(null)

    return <div className={styles.container}>
        <Card>
            <div className={styles.cardContainer}>

                <div className={styles.imageWrapper}>

                    <p className={styles.imageText}>
                        Few click away on
                        KYC.
                    </p>
                    <img src={"/assets/getStarted.png"} alt={"get started"} width="300px" />
                </div>

                <div className={styles.stepsContainer}>
                    <Steps model={tabs} 
                    className={styles.stepsBox}

                    onSelect={(e) => setCurrentScreen(e.index)} readOnly={false}

                    activeIndex={currentScreen} />


                    {
                        currentScreen === 0 && <PersonalDetails
                            formData={formData}
                            setFormData={setFormData}
                            setCurrentScreen={setCurrentScreen} />
                    }

                    {
                        currentScreen === 1 && <DocumentUpload
                            formData={formData}
                            setFormData={setFormData}
                            setCurrentScreen={setCurrentScreen} />

                    }
                    {
                        currentScreen === 2 && <ValidationScreen
                            formData={formData}
                            setFormData={setFormData}
                            setCurrentScreen={setCurrentScreen} />

                    }


                </div>
            </div>
        </Card>
    </div>


}



export default InputForm