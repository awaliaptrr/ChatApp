import styles from "./imageBorder.module.scss";

const ImageBorder = ({ src, alt, width, height }) => {
  return (
    <div className={styles.border} style={{ width, height }}>
      <img src={src} alt={alt} />
    </div>
  );
};

export default ImageBorder;
