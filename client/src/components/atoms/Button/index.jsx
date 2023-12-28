import styles from "./button.module.scss";
import { useState } from "react";

const Button = ({ model, value, event, accept, ...rest }) => {
  const [afClicked, setAfClicked] = useState(false);

  const button4Event = () => {
    setAfClicked(true);
    event();
  };

  let content;

  if (model == "button4") {
    content = (
      <button
        className={afClicked ? styles.button4Clicked : styles[model]}
        onClick={button4Event}
        {...rest}
        disabled={afClicked}
      >
        {accept
          ? afClicked
            ? "Accepted"
            : "Accept"
          : afClicked
          ? "Request Sent"
          : "Add Friend"}
      </button>
    );
  } else if (model == "button1" || model == "button2") {
    content = (
      <button className={`${styles.button} ${styles[model]}`} {...rest}>
        {value}
      </button>
    );
  } else {
    content = (
      <button className={styles[model]} {...rest}>
        {value}
      </button>
    );
  }

  return content;
};

export default Button;
