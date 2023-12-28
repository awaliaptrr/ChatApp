import styles from "./searchBar.module.scss";
import { Input, Button } from "../../atoms";

const Searchbar = ({ onChange, buttonEvent, value, model }) => {
  let content;

  if (model == 1) {
    content = (
      <form className={styles.searchBarForm} onSubmit={buttonEvent}>
        <Input
          label="Name"
          model={2}
          maxLength={25}
          onChange={onChange}
          value={value}
        />
        <Button model="button3" value="Search" />
      </form>
    );
  }

  return content;
};

export default Searchbar;
