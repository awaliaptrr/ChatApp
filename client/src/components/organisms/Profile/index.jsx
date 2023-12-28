import styles from "./profile.module.scss";
import { useState, useEffect, useRef } from "react";
import { useUpdateMutation } from "../../../features/main/userApiSlice";
import { withinSideBar } from "../../hoc";
import { Gap, Input, ImageBorder } from "../../atoms";

const Profile = ({ data }) => {
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [fileDataURL, setFileDataURL] = useState("");
  const [completedCrop, setCompletedCrop] = useState("");
  const [filePayload, setFilePayload] = useState({});
  const [toggle, setToggle] = useState(false);
  const [nameInputActive, setNameInputActive] = useState(false);
  const [infoInputActive, setInfoInputActive] = useState(false);

  const nameRef = useRef();
  const infoRef = useRef();

  const [update] = useUpdateMutation();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setInfo(data.info);
      setFileDataURL(`http://localhost:3060/images/${data?.profileImage}`);
    }
  }, [data]);

  useEffect(() => {
    if (nameInputActive) {
      nameRef.current.focus();
    }
  }, [nameInputActive]);

  useEffect(() => {
    if (infoInputActive) {
      infoRef.current.focus();
    }
  }, [infoInputActive]);

  const updateProfileEvent = async () => {
    await update({ name, info });
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

  return (
    <div className={styles.profile}>
      <Gap height="20px" />
      {data && (
        <>
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
        </>
      )}
      <Gap height="30px" />
      <div className={styles.info}>
        <p>Name</p>
        <Input
          ref={nameRef}
          model={3}
          onSubmit={updateProfileEvent}
          other={[nameInputActive, setNameInputActive, name, setName]}
        />
      </div>
      <Gap height="20px" />
      <div className={styles.info}>
        <p>Info</p>
        <Input
          ref={infoRef}
          model={3}
          onSubmit={updateProfileEvent}
          other={[infoInputActive, setInfoInputActive, info, setInfo]}
        />
      </div>
    </div>
  );
};

export default withinSideBar(Profile);
