import styles from "./home.module.scss";
import { useSendLogoutMutation } from "../../auth/authApiSlice";
import { useCurrentProfileQuery } from "../userApiSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Peoples, Bell, Options, Chat } from "../../../assets";
import {
  Input,
  ImageBorder,
  TextBox,
  Gap,
  Profile,
  FriendRequest,
  NewChat,
  Notification,
  NewFriend,
  ChatArea,
} from "../../../components";
import useComponentVisible from "../../../hooks/useComponentVisible";
import {
  useGetMessagesPerUserQuery,
  useGetSortedMessagesQuery,
} from "../chatApiSlice";
import { SocketConnection } from "../../../utils/SocketConnection";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../auth/authSlice";

const Home = () => {
  const token = useSelector(selectCurrentToken);
  const username = jwtDecode(token).person.username;
  const [profileSection, setProfileSection] = useState(false);
  const [frSection, setFrSection] = useState(false);
  const [chatSection, setChatSection] = useState(false);
  const [notificationSection, setNotificationSection] = useState(false);
  const [newFriendSection, setNewFriendSection] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [targetData, setTargetData] = useState("");
  const [messageSkip, setMessageSkip] = useState(true);

  const navRef = useRef();
  const optionButtonRef = useRef();
  const mainRef = useRef();
  const messagesEndRef = useRef();

  const [optionRef, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false, setDropDown, optionButtonRef);

  const { data } = useCurrentProfileQuery();
  const { data: sortedMessages } = useGetSortedMessagesQuery();
  const { data: messages } = useGetMessagesPerUserQuery(targetData.username, {
    skip: messageSkip,
  });

  const [sendLogout] = useSendLogoutMutation();

  const socketConnection = SocketConnection.getConnection();

  useEffect(() => {
    socketConnection.emit("add_user", username);

    // window.addEventListener("beforeunload", () => {
    //   socketConnection.emit("delete_user", username);
    // });

    return () => {
      // window.removeEventListener("beforeunload", () => {});
      socketConnection.emit("delete_user", username);
      socketConnection.disconnect();
      SocketConnection.connection = null;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const optionVisibleEvent = () => {
    setDropDown((value) => !value);
    dropDown ? setIsComponentVisible(false) : setIsComponentVisible(true);
  };

  const openChatEvent = useCallback((data) => {
    setChatSection(false);
    setTargetData(data);
    setMessageSkip(false);
  }, []);

  const sectionEvent = (username) => {
    setTargetData({ ...sortedMessages.payload[username], username });
    setMessageSkip(false);
  };

  const timeStamp = (time) => {
    return `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Profile
          visible={profileSection}
          setVisible={setProfileSection}
          value="Profile"
          data={data}
        />
        <FriendRequest
          visible={frSection}
          setVisible={setFrSection}
          value="Friend Request"
        />
        <NewChat
          visible={chatSection}
          setVisible={setChatSection}
          value="New Chat"
          event={openChatEvent}
        />
        <Notification
          visible={notificationSection}
          setVisible={setNotificationSection}
          value="Notification"
        />
        <NewFriend
          visible={newFriendSection}
          setVisible={setNewFriendSection}
          value="New Friend"
        />
        <nav ref={navRef}>
          <div className={styles.up}>
            <div className={styles.profile}>
              <div onClick={() => setProfileSection((value) => !value)}>
                {data && (
                  <ImageBorder
                    src={`http://localhost:3060/images/${data.profileImage}`}
                    alt="image"
                    width="50px"
                    height="50px"
                  />
                )}
              </div>
            </div>
            <div className={styles.navigation}>
              <img
                className={styles.peoplesImg}
                src={Peoples}
                alt="Friend Request"
                onClick={() => setFrSection((value) => !value)}
              />
              <img
                className={styles.chat}
                src={Chat}
                alt="Chat"
                onClick={() => setChatSection((value) => !value)}
              />
              <img
                className={styles.bell}
                src={Bell}
                alt="Bell"
                onClick={() => setNotificationSection((value) => !value)}
              />
              <img
                className={styles.options}
                ref={optionButtonRef}
                src={Options}
                alt="Options"
                onClick={optionVisibleEvent}
              />
            </div>
            {isComponentVisible && (
              <div ref={optionRef} className={styles.dropDown}>
                <ul onClick={optionVisibleEvent}>
                  <li>Settings</li>
                  <li onClick={() => setNewFriendSection((value) => !value)}>
                    New Friend
                  </li>
                  <li onClick={sendLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
          <div className={styles.down}>
            <Input
              model={4}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </nav>
        <main ref={mainRef}>
          {targetData && (
            <ChatArea
              targetData={targetData}
              messagesEndRef={messagesEndRef}
              messages={messages}
            />
          )}
        </main>
        <section>
          <ul>
            {sortedMessages?.messages?.map((data) => {
              const message = data.payload.message;
              return (
                <li
                  key={data.username}
                  onClick={() => sectionEvent(data.username)}
                >
                  <div className={styles.image}>
                    <ImageBorder
                      src={`http://localhost:3060/images/${
                        sortedMessages.payload[data.username].profileImage
                      }`}
                      alt="image"
                      width="55px"
                      height="55px"
                    />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.up}>
                      <p className={styles.name}>
                        {sortedMessages.payload[data.username].name}
                      </p>
                      <p className={styles.timestamp}>
                        {timeStamp(new Date(data.payload.sentAt))}
                      </p>
                    </div>
                    <Gap height={11} />
                    <div className={styles.down}>
                      <p className={styles.message}>
                        {message.length > 33
                          ? message.slice(0, 33) + "..."
                          : message}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
