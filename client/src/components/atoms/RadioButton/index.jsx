import { useEffect, useState } from "react";
import styles from "./radioButton.module.scss";

const RadioButton = ({ value, onClick, isClicked }) => {
  const [clicked, setClicked] = useState(false);

  const event = (e) => {
    e.preventDefault();
    onClick();
  };

  useEffect(() => {
    isClicked ? setClicked(true) : setClicked(false);
  }, [isClicked]);

  return (
    <button className={styles.radioButton} onClick={event}>
      {value}
      <div
        className={
          clicked ? `${styles.circle} ${styles.circleBlack}` : styles.circle
        }
      ></div>
    </button>
  );
};

export default RadioButton;
