import styles from "./select.module.scss";
import { Arrow } from "../../../assets";
import { useEffect, useRef, useState } from "react";
import useComponentVisible from "../../../hooks/useComponentVisible";

const Select = ({ value, height, list, listOverflow, onClick }) => {
  const [rotate, setRotate] = useState(false);
  const [buttonWidth, setButtonWidth] = useState("");

  const buttonRef = useRef(null);
  const [optionRef, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false, setRotate, buttonRef);

  useEffect(() => {
    setButtonWidth(buttonRef.current.getBoundingClientRect().width);
  }, []);

  const event = (e) => {
    e.preventDefault();
    setRotate((value) => !value);
    rotate ? setIsComponentVisible(false) : setIsComponentVisible(true);
  };

  return (
    <div className={styles.container}>
      {isComponentVisible && (
        <div
          className={styles.optionShow}
          style={{
            width: buttonWidth,
            height,
            top: `calc(-${height} - 2px)`,
          }}
          ref={optionRef}
        >
          <ul className={styles.lists} style={{ overflow: listOverflow }}>
            {list &&
              list.map((value, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      onClick(value);
                      setRotate((value) => !value);
                      rotate
                        ? setIsComponentVisible(false)
                        : setIsComponentVisible(true);
                    }}
                  >
                    <p className={styles.p}>{value}</p>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      <button ref={buttonRef} className={styles.button} onClick={event}>
        {value}
        <img
          className={rotate && isComponentVisible ? styles.clicked : ""}
          src={Arrow}
          alt="arrow"
        />
      </button>
    </div>
  );
};

export default Select;
