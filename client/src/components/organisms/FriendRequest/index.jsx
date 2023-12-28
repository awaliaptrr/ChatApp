import styles from "./friendRequest.module.scss";
import { useState } from "react";
import {
  useGetRequestedQuery,
  useAcceptRequestMutation,
} from "../../../features/main/friendshipApiSlice";
import { Input, ImageBorder, Button } from "../../atoms";
import { withinSideBar } from "../../hoc";

const FriendRequest = () => {
  const [searchRequestName, setSearchRequestName] = useState("");

  const getRequested = useGetRequestedQuery();

  const [accept] = useAcceptRequestMutation();

  const acceptEvent = async (target) => {
    await accept({ username: target });
  };

  return (
    <div className={styles.friendRequest}>
      <div className={styles.search}>
        <Input
          label="Name"
          model={2}
          maxLength={25}
          onChange={(e) => setSearchRequestName(e.target.value)}
          value={searchRequestName}
          width="17em"
        />
      </div>
      <div className={styles.request}>
        <ul>
          {getRequested?.data?.map((data) => {
            let content;
            const search = new RegExp(searchRequestName, "i");
            if (data.name.match(search) || !searchRequestName) {
              content = (
                <li key={data.username}>
                  <div className={styles.image}>
                    {data && (
                      <ImageBorder
                        src={`http://localhost:3060/images/${data.profileImage}`}
                        alt="image"
                        width="70px"
                        height="70px"
                      />
                    )}
                  </div>
                  <div className={styles.info}>
                    <p>{data.name}</p>
                  </div>
                  <div className={styles.accept}>
                    <Button
                      model={"button4"}
                      event={() => acceptEvent(data.username)}
                      accept={true}
                    />
                  </div>
                </li>
              );
            }
            return content;
          })}
        </ul>
      </div>
    </div>
  );
};

export default withinSideBar(FriendRequest);
