import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DatePicker } from "react-rainbow-components";
import { validationSchema } from "../helper/validationSchema";
import styles from "../styles/personalDetails.module.css";


const PersonalDetails = (props) => {

  const { setFormData, setCurrentScreen } = props;

  const [date, setDate] = useState(null);


  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>
        Kindly enter below details to complete KYC
      </p>

      <div className={styles.formWrapper}>
        <Formik
          initialValues={{
            fullName: "",
            dateOfBirth: null,
            phoneNumber: "",
            aadhaarNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // Handle form submission here
            setFormData(values);
            console.log(values);
            setCurrentScreen(1); // Move to the next step
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className={styles.fieldLabel}>Full Name
                <Field
                  type="text"
                  name="fullName"
                  as={InputText}
                  placeholder="Enter your Full Name"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div className={styles.fieldLabel}>Date of Birth
                <Field
                  type="text"
                  name="dateOfBirth"
                  render={({ field, form }) => (
                    <div className={styles.calendar}>
                      <DatePicker
                        id="datePicker-1"
                        value={date}
                        onChange={(e) => {
                          form.setFieldValue("dateOfBirth", e);
                          setDate(e);
                        }}
                        formatStyle="small"
                      />
                      {form.touched.dateOfBirth && form.errors.dateOfBirth && (
                        <div className={styles.errorMessage}>
                          {form.errors.dateOfBirth}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className={styles.fieldLabel}>Phone Number
                <Field
                  type="number"
                  name="phoneNumber"
                  as={InputText}
                  placeholder="Enter your Phone Number"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div className={styles.fieldLabel}>Aadhaar Number
                <Field
                  type="text"
                  name="aadhaarNumber"
                  as={InputText}
                  placeholder="Enter your Aadhaar Number"
                />
                <ErrorMessage
                  name="aadhaarNumber"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div className={styles.buttonContainer}>
                <Button
                  label="Initiate KYC"
                  className={styles.button}
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetails;
