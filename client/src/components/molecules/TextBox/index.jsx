import styles from "./textBox.module.scss";
import { Send } from "../../../assets";
import { Input, ImageButton } from "../../atoms";
import { useState, useEffect } from "react";
import { useSendMessageMutation } from "../../../features/main/chatApiSlice";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../../features/auth/authSlice";
import { SocketConnection } from "../../../utils/SocketConnection";

const TextBox = ({ targetUsername }) => {
  const token = useSelector(selectCurrentToken);
  const username = jwtDecode(token).person.username;
  const [message, setMessage] = useState("");

  const [sendMessage] = useSendMessageMutation();
  const socketConnection = SocketConnection.getConnection();

  useEffect(() => {
    if (targetUsername) {
      console.log(stringJoiner(username, targetUsername));
      socketConnection.emit(
        "join_room",
        stringJoiner(username, targetUsername)
      );

      return () => {
        socketConnection.emit(
          "leave_room",
          stringJoiner(username, targetUsername)
        );
      };
    }
  }, [targetUsername]);

  function stringJoiner(...strings) {
    const copiedStrings = [...strings];
    const join = copiedStrings.sort().join("");

    return join;
  }

  const sendEvent = (e) => {
    e.preventDefault();
    socketConnection.emit("send_message", {
      message,
      room: stringJoiner(username, targetUsername),
      sender: username,
    });

    sendMessage({ targetUsername, message });
    setMessage("");
  };

  return (
    <form className={styles.textBoxForm} onSubmit={sendEvent}>
      <Input
        model={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <ImageButton image={Send} />
    </form>
  );
};

export default TextBox;
