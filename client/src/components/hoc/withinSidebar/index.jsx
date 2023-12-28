import styles from "./withinSideBar.module.scss";
import { LeftArrow } from "../../../assets";

const WithinSidebar = (OriginalComponent) => {
  const NewComponent = (props) => {
    return (
      <div
        className={styles.sideBar}
        style={{
          width: 428,
          marginLeft: -428,
          left: props.visible ? 428 : 0,
        }}
      >
        <div className={styles.header}>
          <div>
            <img
              src={LeftArrow}
              alt="left_arrow"
              onClick={() => props.setVisible((v) => !v)}
            />
            <p>{props.value}</p>
          </div>
        </div>
        <OriginalComponent {...props} />
      </div>
    );
  };

  return NewComponent;
};

export default WithinSidebar;
