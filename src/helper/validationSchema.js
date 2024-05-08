import * as Yup from "yup";


export  const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d*$/, "Invalid Phone number ")
    .matches(/^\d{10}$/, "We need exactly 10 digits")
    .required("Phone Number is required"),
  aadhaarNumber: Yup.string()
    .matches(/^\d{12}$/, "Invalid Aadhaar Number") // Regex for 12-digit Aadhaar numbers
    .required("Aadhaar Number is required"),
});
