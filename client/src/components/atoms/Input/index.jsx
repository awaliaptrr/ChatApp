import { useRef, forwardRef, useImperativeHandle } from "react";
import { Eye, Line, Edit, Checklist } from "../../../assets";
import styles from "./input.module.scss";

const Input = forwardRef(
  ({ model, type, label, width, onSubmit, other, ...rest }, ref) => {
    const inputRef = useRef(null);
    const lineRef = useRef(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      },
    }));

    const visibleEvent = () => {
      const className = lineRef.current.className;
      lineRef.current.className =
        className === styles.in ? styles.vi : styles.in;
      inputRef.current.type = className === styles.in ? "text" : "password";
    };

    const updateProfileEvent = (e) => {
      e.preventDefault();
      onSubmit();
      other[1](false);
    };

    let content;

    switch (model) {
      case 1:
        content = (
          <div className={styles.container1}>
            <input
              className={styles.input}
              type={type}
              autoComplete="off"
              placeholder=" "
              id={label}
              ref={inputRef}
              style={{ width: width ?? "16em" }}
              {...rest}
            />
            <label className={styles.label} htmlFor={label}>
              {label}
            </label>
            {type === "password" && (
              <div className={styles.visible} onClick={visibleEvent}>
                <img
                  className={styles.in}
                  src={Line}
                  alt="line"
                  ref={lineRef}
                />
                <img className={styles.eye} src={Eye} alt="eye" />
              </div>
            )}
          </div>
        );
        break;

      case 2:
        content = (
          <div className={styles.container2}>
            <input
              className={styles.input}
              type="text"
              autoComplete="off"
              placeholder={label}
              spellCheck="false"
              style={{ width: width ?? "16em" }}
              {...rest}
            />
          </div>
        );
        break;

      case 3:
        content = (
          <div className={styles.container3}>
            <form onSubmit={updateProfileEvent}>
              <input
                ref={inputRef}
                type="text"
                disabled={!other[0]}
                spellCheck="false"
                maxLength={25}
                autoComplete="off"
                value={other[2]}
                onChange={(e) => other[3](e.target.value)}
              />
            </form>
            <img
              className={styles.edit}
              src={Edit}
              alt="edit"
              onClick={() => other[1](true)}
              style={{ display: other[0] ? "none" : "block" }}
            />
            <img
              className={styles.checklist}
              src={Checklist}
              alt="checklist"
              onClick={updateProfileEvent}
              style={{ display: other[0] ? "block" : "none" }}
            />
          </div>
        );
        break;

      case 4:
        content = (
          <div className={styles.container4}>
            <label className={styles.label} htmlFor="search"></label>
            <input
              className={styles.input}
              id="search"
              type="text"
              placeholder="Search"
              autoComplete="off"
              {...rest}
            />
          </div>
        );
        break;

      case 5:
        content = (
          <div className={styles.container5}>
            <input
              className={styles.input}
              type="text"
              placeholder=" Write message"
              autoComplete="off"
              {...rest}
            />
          </div>
        );
        break;
    }

    return content;
  }
);

export default Input;
