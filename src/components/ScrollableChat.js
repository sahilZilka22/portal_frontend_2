import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import FileListComponent from "./UserComponents/FileListComponent";
import {
  isCurrentUser,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={
                  m.sender && m.sender.name ? m.sender.name : "User not found"
                }
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={
                    m.sender && m.sender.name ? m.sender.name : "User not found"
                  }
                  src={
                    m.sender && m.sender.photo
                      ? m.sender.photo
                      : "User photo not found"
                  }
                />
              </Tooltip>
            )}
            <div
              style={{
                backgroundColor:
                  m.sender && m.sender._id === user._id ? "#BEE3F8" : "#e84d6c",
                borderRadius: "15px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.message && (
                <div>
                  <div
                    className="message-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {!isCurrentUser(m.sender?._id || "", user._id) && (
                      <h4
                        style={{
                          marginLeft: "10px",
                          fontFamily: "sans-serif",
                          padding: "2px",
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >{`~${
                        m.sender && m.sender.name
                          ? m.sender.name
                          : "User not found"
                      } (${
                        m.sender && m.sender.role ? m.sender.role : "--"
                      })`}</h4>
                    )}
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        fontWeight: 550,
                        fontSize: "14px",
                        fontStyle: "normal",
                        marginBottom: "8px", // Add margin for spacing
                        padding: "6px 8px", // Adjust padding for better alignment
                      }}
                    >
                      {m.message}
                    </p>
                    {m.createdAt && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "black",
                          padding: "6px 8px", // Adjust padding for better alignment
                        }}
                      >
                        {new Date(m.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {m.content && m.content.length > 0 && (
                <div>
                  <div style={{ margin: "5px" }}>
                    <FileListComponent files={m.content} />
                  </div>
                </div>
              )}
            </div>
            <div>{/* Add the formatted createdAt */}</div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
