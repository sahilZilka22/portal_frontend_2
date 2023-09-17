import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import FileListComponent from "./UserComponents/FileListComponent";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
 

  // return (
  //   <ScrollableFeed>
  //     {messages &&
  //       messages.map((m, i) => (
  //         <div style={{ display: "flex" }} key={m._id}>
  //           {(isSameSender(messages, m, i, user._id) ||
  //             isLastMessage(messages, i, user._id)) && (
  //             <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
  //               <Avatar
  //                 mt="7px"
  //                 mr={1}
  //                 size="sm"
  //                 cursor="pointer"
  //                 name={m.sender.name}
  //                 src={m.sender.photo}
  //               />
  //             </Tooltip>
  //           )}
  //           <div
  //             style={{
  //               backgroundColor: `${
  //                 m.sender._id === user._id ? "#BEE3F8" : "#e84d6c"
  //               }`,
  //               marginLeft: isSameSenderMargin(messages, m, i, user._id),
  //               marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
  //               borderRadius: "20px",
  //               padding: "5px 15px",
  //               maxWidth: "75%",
  //             }}
  //           >
  //             {m.message && (
  //               <div>
  //                 <p>{m.message}</p>
  //               </div>
  //             )}
  //           </div>
  //           <div style={{
  //              display:"flex",
  //              flexDirection:"column",
  //              justifyContent:"center",
  //              alignItems:"center",
  //              alignContent:"center",
  //             }}>
  //             {m.content && m.content.length > 0 && (
  //               <div>
  //                 <div 
  //                 style={{ margin: '5px' }}
  //                 >
  //                   <FileListComponent files={m.content} />
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       ))}
  //   </ScrollableFeed>
  // );
  return (
  <ScrollableFeed>
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.photo}
              />
            </Tooltip>
          )}
          <div
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#e84d6c"
              }`,
              borderRadius:"15px",
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
            }}
          >
            {m.message && (
              <div 
              style={{
              padding: "5px 20px 5px 5px",
              marginTop:"6px",
              marginLeft:"8px",
              }}
              >
              <p style={{
                fontFamily:"sans-serif",
                fontWeight:"550",
                fontSize:"14px",
                fontStyle:"normal"
              }}>{m.message}</p>
              <p style={{
                marginTop:"8px"
              }}> {m.createdAt && (
                    <div style={{ fontSize:"12px",color:"black",}}>
                            {new Date(m.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle:"short",
                              timeStyle : "short"
                            })}
                    </div>
                )}</p>
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
          <div>
             {/* Add the formatted createdAt */}
           
          </div>
        </div>
      ))}
  </ScrollableFeed>
);

};

export default ScrollableChat;
