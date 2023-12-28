import styles from "./imageButton.module.scss";

const ImageButton = ({ image, ...rest }) => {
  return (
    <button className={styles.button} {...rest}>
      <img src={image} alt="image" />
    </button>
  );
};

export default ImageButton;
