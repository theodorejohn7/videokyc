import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import styles from "../styles/personalDetails.module.css";
import { useState } from "react";

const PersonalDetails = (props) => {

    const { setCurrentScreen } = props;

    const [date, setDate] = useState(null)

    return <div className={styles.container}>

        <p className={styles.pageTitle}>
            Kindly enter below details to complete KYC
        </p>

        <div className={styles.formWrapper}>
            <p className={styles.fieldLabel}>
                Full Name
            </p>
            <InputText id="username" aria-describedby="username-help"

                placeholder="Enter your Full Name"
            />
            <p className={styles.fieldLabel}>
                Date of Birth
            </p>
            <Calendar
                className={styles.calendar}
                value={date} onChange={(e) => setDate(e.value)} showIcon />


            <p className={styles.fieldLabel}>
                Phone Number
            </p>
            <InputText id="username" aria-describedby="username-help"
                placeholder="Enter your Phone Number"
            />

            <p className={styles.fieldLabel}>
                Aadhaar Number
            </p>
            <InputText id="username" aria-describedby="username-help"
                placeholder="Enter your Aadhaar Number"
            />

            <div className={styles.buttonContainer} >
                <Button label="Initiate KYC" className={styles.button} onClick={() => setCurrentScreen(1)} />
            </div>

        </div>

    </div>
}

export default PersonalDetails