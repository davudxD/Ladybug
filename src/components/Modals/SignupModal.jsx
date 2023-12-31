import {
  Box,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./SignupModal.css";
import { GlobalContext } from "../../App";
import { Formik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { userDb } from "../../firebase";

import { useDispatch } from "react-redux";
import { signInUser } from "../../store/userSlice";

// Signup Schema
const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("Please enter username")
    .min(2, "Username must have at least 2 characters")
    .max(30, "Username must have max 30 characters"),
  email: Yup.string()
    .required("Email is required")
    .min(10, "Email must have at least 10 characters")
    .max(30, "Email must have max 30 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must have at least 8 characters")
    .max(30, "Password must have max 30 characters"),
});

const SignupModal = () => {
  // Open Modal
  const { openSignup, setOpenSignup } = useContext(GlobalContext);
  const isXsScreen = useMediaQuery("(max-width:600px)");

  // Sign up in data
  const initialState = { username: "", email: "", password: "" };

  // Styles
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: !isXsScreen ? 550 : "100vw",
    height: !isXsScreen ? 540 : "100vh",
    backgroundColor: "#fff",
    borderRadius: "11px",
    boxShadow: 15,
  };

  // Redux
  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      onSubmit={(values, { resetForm }) => {
        createUserWithEmailAndPassword(userDb, values.email, values.password)
          .then((userCredential) => {
            updateProfile(userDb.currentUser, {
              displayName: values.username,
            });
            dispatch(
              signInUser({
                username: values.username,
                email: values.email,
                uid: userCredential.user.uid,
              })
            );
            console.log(userCredential);

            resetForm();
            setOpenSignup(!openSignup);
          })
          .catch((error) => alert(error));
      }}
      validationSchema={signupSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Modal
          open={openSignup}
          onClose={() => {
            setOpenSignup(!openSignup);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {" "}
            <CloseIcon
              onClick={() => setOpenSignup(!openSignup)}
              sx={{ fontSize: "32px", padding: "10px", cursor: "pointer" }}
            />
            <form>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    marginTop: "20px",
                    marginLeft: "58px",
                    fontWeight: "bold",
                  }}
                >
                  Create your account
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "80%",
                    }}
                  >
                    <TextField
                      placeholder="Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                    />
                    <Typography
                      variant="body2"
                      style={{ marginTop: "7px", color: "red" }}
                    >
                      {errors.username && touched.username && errors.username}
                    </Typography>
                    <TextField
                      placeholder="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      sx={{ marginTop: "15px" }}
                    />
                    <Typography
                      variant="body2"
                      style={{ marginTop: "7px", color: "red" }}
                    >
                      {errors.email && touched.email && errors.email}
                    </Typography>
                    <TextField
                      sx={{ marginTop: "15px" }}
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                    />
                    <Typography
                      variant="body2"
                      style={{ marginTop: "7px", color: "red" }}
                    >
                      {errors.password && touched.password && errors.password}
                    </Typography>
                  </Box>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="modal-signup"
                  >
                    Sign up
                  </button>
                </Box>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </Formik>
  );
};

export default SignupModal;
