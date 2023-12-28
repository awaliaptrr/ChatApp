import styles from "./newFriend.module.scss";
import { withinSideBar } from "../../hoc";
import { useState } from "react";
import {
  useGetStrangersQuery,
  useSendRequestMutation,
} from "../../../features/main/friendshipApiSlice";
import { ImageBorder, Button } from "../../atoms";
import { Searchbar } from "../../molecules";
import { SocketConnection } from "../../../utils/SocketConnection";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../../features/auth/authSlice";

const NewFriend = () => {
  const token = useSelector(selectCurrentToken);
  const username = jwtDecode(token).person.username;
  const [searchName, setSearchName] = useState("");
  const [searchNameFetch, setSearchNameFetch] = useState("");
  const [strangerSkip, setStrangerSkip] = useState(true);

  const getStrangers = useGetStrangersQuery(searchNameFetch, {
    skip: strangerSkip,
  });

  const [sendRequest] = useSendRequestMutation();

  const socketConnection = SocketConnection.getConnection();

  const sendRequestEvent = async (target) => {
    await sendRequest({ targetUsername: target });
    socketConnection.emit("send_notification", {
      targetUsername: target,
      sentAt: new Date(),
      username,
    });
  };

  const searchEvent = async (e) => {
    e.preventDefault();
    setSearchNameFetch(searchName);
    setStrangerSkip(false);
  };

  return (
    <div className={styles.newFriend}>
      <div className={styles.searchBar}>
        <Searchbar
          buttonEvent={searchEvent}
          onChange={(e) => setSearchName(e.target.value)}
          model={1}
        />
      </div>
      <div className={styles.stranger}>
        <ul>
          {getStrangers?.data?.map((data) => {
            return (
              <li key={data.username}>
                <div className={styles.profileImage}>
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
                </div>
                <div className={styles.info}>
                  <p>{data.name}</p>
                </div>
                <div className={styles.add}>
                  <Button
                    model={"button4"}
                    event={() => sendRequestEvent(data.username)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default withinSideBar(NewFriend);
