

// import React from "react";
// import { Box } from "@chakra-ui/react";

// import { ChatState } from "../Context/ChatProvider";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
// import MyChats from "../components/MyChats";
// import ChatBox from "../components/ChatBox";


// const ChatPage = () => {
//     const { user } = ChatState();
//     const [fetchAgain, setFetchAgain] = useState(false);

//     return (
//         <div style={{ width: "100%" }}>
            
//             {user && <SideDrawer />}

//             <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 width="100%"
//                 h="91.5vh"
//                 gap="10px"
//                 padding="10px"
//             >
//                 {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={ setFetchAgain} />}
//                 {user && <ChatBox fetchAgain={fetchAgain}setFetchAgain={setFetchAgain} />}
//             </Box>

//         </div>
//     );
// };


// export default ChatPage;



import React, { useState } from "react";

import { Box } from "@chakra-ui/react";

import { ChatState } from "../Context/ChatProvider";

import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import SingleChats from "../components/SingleChats";

const ChatPage = () => {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {/* Side Drawer */}
      {user && <SideDrawer />}

      {/* Main Chat Area */}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        gap="10px"
        padding="10px"
      >
        {/* My Chats */}
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}

        {/* Selected chat messages */}
        {user && (
          <SingleChats
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
