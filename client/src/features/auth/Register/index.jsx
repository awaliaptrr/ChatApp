import styles from "./register.module.scss";
import { DefaultProfileImage } from "../../../assets";
import {
  Gap,
  Input,
  Button,
  Select,
  RadioButton,
  ImageBorder,
  ImageCropper,
} from "../../../components";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCheckMutation, useRegisterMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import { setIsLogged } from "../../main/metaSlice";
import { generateArrayOfYears } from "../../../utils/Years";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [change, setChange] = useState(false);
  const [date, setDate] = useState("Date");
  const [month, setMonth] = useState("Month");
  const [year, setYear] = useState("Year");
  const [gender, setGender] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(DefaultProfileImage);
  const [completedCrop, setCompletedCrop] = useState("");
  const [filePayload, setFilePayload] = useState({});
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRef = useRef();
  const boxRef = useRef();

  let content;

  useEffect(() => {
    userRef.current.focus();
  }, [change]);

  const [check] = useCheckMutation();
  const [register] = useRegisterMutation();

  const submit1 = async (e) => {
    e.preventDefault();
    try {
      const { success } = await check({ email, username, password }).unwrap();
      if (success) {
        setChange(true);
        boxRef.current.className = styles.success;
      }
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const submit2 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("birthDate", `${year}-${date}-${month}`);
    formData.append("profileImage", completedCrop);

    try {
      const { token } = await register(formData).unwrap();
      setErrMsg("");
      setEmail("");
      setUsername("");
      setPassword("");
      setName("");
      dispatch(setCredentials(token));
      dispatch(setIsLogged(true));
      navigate("/");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile.type.match(/image\/(png|jpg|jpeg)/i)) {
      alert("Image mime type is not valid");
      return;
    }
    setFilePayload({
      name: selectedFile.name,
      url: window.URL.createObjectURL(selectedFile),
    });
    setToggle(true);
    e.target.value = "";
  };

  content = (
    <div className={styles.container}>
      <div id={styles.box} ref={boxRef}>
        {change ? (
          <div className={styles.second_content}>
            <form onSubmit={submit2}>
              <Gap height={10} />
              <label htmlFor="image" className={styles.imageLabel}>
                <ImageBorder
                  src={fileDataURL}
                  alt="image"
                  width="180px"
                  height="180px"
                />
              </label>
              <input
                className={styles.image}
                type="file"
                id="image"
                accept=".png, .jpg, .jpeg"
                onChange={changeHandler}
              />
              {toggle && (
                <ImageCropper
                  setUrl={setFileDataURL}
                  url={fileDataURL}
                  setFile={setCompletedCrop}
                  payload={filePayload}
                  setToggle={setToggle}
                />
              )}
              <Gap height={80} />
              <Input
                label="Name"
                onChange={(e) => setName(e.target.value)}
                ref={userRef}
                width="18em"
                model={1}
              />
              <Gap height={20} />
              <p>Date of Birth</p>
              <Gap height={2} />
              <div className={styles.selector}>
                <Select
                  value={date}
                  height="238.5px"
                  list={Array.from({ length: 31 }, (_, index) => index + 1)}
                  onClick={(value) => setDate(value)}
                />
                <Select
                  value={month}
                  height="204.5px"
                  list={[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ]}
                  listOverflow="hidden"
                  onClick={(value) => setMonth(value)}
                />
                <Select
                  value={year}
                  height="272.5px"
                  list={generateArrayOfYears(100)}
                  onClick={(value) => setYear(value)}
                />
              </div>
              <Gap height={20} />
              <p>Gender</p>
              <Gap height={2} />
              <div className={styles.selector}>
                <RadioButton
                  value="Male"
                  onClick={() => setGender("male")}
                  isClicked={gender === "male"}
                />
                <RadioButton
                  value="Female"
                  onClick={() => setGender("female")}
                  isClicked={gender === "female"}
                />
                <RadioButton
                  value="Other"
                  onClick={() => setGender("other")}
                  isClicked={gender === "other"}
                />
              </div>
              <Gap height={80} />
              <Button model="button1" value="Submit" />
            </form>
          </div>
        ) : (
          <div className={styles.first_content}>
            <h1 className={styles.title}>Register</h1>
            <Gap height={48} />
            <form onSubmit={submit1}>
              <Input
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                ref={userRef}
                model={1}
              />
              <Gap height={20} />
              <Input
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
                model={1}
              />
              <Gap height={20} />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                model={1}
              />
              <Gap height={68} />
              <Button model="button1" value="Register" />
            </form>
            <Gap height={30} />
            <p style={{ color: "red", textAlign: "center" }}>{errMsg}</p>
            <Gap height={37} />
            <p>
              Have an account?{" "}
              <Link to="/login" className={styles.reg}>
                Login here.
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return content;
};

export default Register;
