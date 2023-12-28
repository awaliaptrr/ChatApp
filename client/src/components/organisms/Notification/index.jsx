import styles from "./notification.module.scss";
import { withinSideBar } from "../../hoc";
import { useGetNotificationsQuery } from "../../../features/main/notificationApiSlice";
import { ImageBorder } from "../../atoms";
import { SocketConnection } from "../../../utils/SocketConnection";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notificationApiSlice } from "../../../features/main/notificationApiSlice";

const Notification = () => {
  const notifications = useGetNotificationsQuery();
  const dispatch = useDispatch();

  const socketConnection = SocketConnection.getConnection();

  useEffect(() => {
    if (notifications) {
      console.log(notifications.data);
    }
  }, [notifications]);

  useEffect(() => {
    socketConnection.on("receive_notification", (data) => {
      console.log(data);
      dispatch(
        notificationApiSlice.util.updateQueryData(
          "getNotifications",
          undefined,
          (draft) => {
            draft.unshift({
              _id: data._id,
              message: data.message,
              createdAt: data.createdAt,
              image: data.image,
            });
          }
        )
      );
    });
  }, []);

  const getTime = (time) => {
    const currentTime = new Date().toISOString();
    const sentAt = new Date(time);
    const now = new Date(currentTime);

    const timeDiffInMillis = now - sentAt;
    const timeDiffInSeconds = timeDiffInMillis / 1000;

    let timeReturn;
    const minutesDiff = Math.floor(timeDiffInSeconds / 60);
    const hoursDiff = Math.floor(timeDiffInSeconds / 3600);
    const daysDiff = Math.floor(timeDiffInSeconds / 86400);

    if (minutesDiff < 1) {
      timeReturn = "a few seconds ago";
    } else if (minutesDiff >= 1 && minutesDiff <= 59) {
      timeReturn = `${minutesDiff} minute ago`;
    } else if (hoursDiff >= 1 && hoursDiff <= 24) {
      timeReturn = `${hoursDiff} hour ago`;
    } else if (daysDiff >= 1) {
      timeReturn = `${daysDiff} day ago`;
    }

    return timeReturn;
  };

  return (
    <div className={styles.notification}>
      <ul>
        {notifications?.data?.map((data) => {
          return (
            <li key={data._id}>
              <div className={styles.image}>
                {data && (
                  <ImageBorder
                    src={`http://localhost:3060/images/${data.image}`}
                    alt="image"
                    width="70px"
                    height="70px"
                  />
                )}
              </div>
              <div className={styles.message}>
                <p className={styles.notificationMessage}>{data.message}</p>
                <p className={styles.createdAt}>{getTime(data.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withinSideBar(Notification);
