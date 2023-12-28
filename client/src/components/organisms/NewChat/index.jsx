import { withinSideBar } from "../../hoc";
import styles from "./newChat.module.scss";
import { Button, Input, ImageBorder } from "../../atoms";
import { useState } from "react";
import { useGetFriendsQuery } from "../../../features/main/friendshipApiSlice";

const NewChat = ({ event }) => {
  const [searchFriendName, setSearchFriendName] = useState("");

  const getFriends = useGetFriendsQuery();

  return (
    <div className={styles.newChat}>
      <div className={styles.search}>
        <Input
          label="Name"
          model={2}
          maxLength={25}
          onChange={(e) => setSearchFriendName(e.target.value)}
          value={searchFriendName}
          width="17em"
        />
      </div>
      <div className={styles.friends}>
        <ul>
          {getFriends?.data?.map((data) => {
            let content;
            const search = new RegExp(searchFriendName, "i");
            if (data.name.match(search) || !searchFriendName) {
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
                  <div className={styles.chat}>
                    <Button
                      model="button3"
                      value="Chat"
                      onClick={() => event(data)}
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

export default withinSideBar(NewChat);
