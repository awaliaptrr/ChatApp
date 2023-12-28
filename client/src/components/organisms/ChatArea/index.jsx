import styles from "./chatArea.module.scss";
import { ImageBorder, TextBox } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../../features/auth/authSlice";
import { useEffect } from "react";
import { SocketConnection } from "../../../utils/SocketConnection";
import { chatApiSlice } from "../../../features/main/chatApiSlice";

const ChatArea = ({ targetData, messagesEndRef, messages }) => {
  const token = useSelector(selectCurrentToken);
  const username = jwtDecode(token).person.username;
  const dispatch = useDispatch();

  const socketConnection = SocketConnection.getConnection();

  useEffect(() => {
    socketConnection.on("receive_message", (data) => {
      dispatch(
        chatApiSlice.util.updateQueryData(
          "getMessagesPerUser",
          data.sender,
          (draft) => {
            draft.push({
              key: [data.sender, username],
              message: data.message,
              sentAt: new Date(),
            });
          }
        )
      );
    });
  }, []);

  const timeStamp = (time) => {
    return `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.profile}>
          {targetData && (
            <ImageBorder
              src={`http://localhost:3060/images/${targetData.profileImage}`}
              alt="image"
              width="50px"
              height="50px"
            />
          )}
          <p>{targetData.name}</p>
        </div>
        <div className={styles.navigation}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.chatBox}>
          <ul>
            {messages?.map((data) => {
              let content;
              if (data.key[0] == username) {
                content = (
                  <li
                    className={styles.currentUser}
                    key={new Date(data.sentAt).getTime()}
                  >
                    <p>
                      {data.message}
                      <span>{timeStamp(new Date(data.sentAt))}</span>
                    </p>
                  </li>
                );
              } else {
                content = (
                  <li
                    className={styles.targetUser}
                    key={new Date(data.sentAt).getTime()}
                  >
                    <p>
                      {data.message}
                      <span>{timeStamp(new Date(data.sentAt))}</span>
                    </p>
                  </li>
                );
              }
              return content;
            })}
          </ul>
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.textBox}>
          {targetData && <TextBox targetUsername={targetData.username} />}
        </div>
      </div>
    </>
  );
};

export default ChatArea;
