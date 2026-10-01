
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

// Create Context
const ChatContext = createContext({
    user: null,
    setUser: () => {},
    selectedChat: null,
    setSelectedChat: () => {},
    chats: null,
    setChats: () => {},
    notifications: [],
    setNotifications: () => {},
    loadingChat: false,
    setLoadingChat: () => {},
});

// Chat Provider
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChatState] = useState(() => {
        const savedChat = localStorage.getItem("selectedChat");

        if (!savedChat) {
            return null;
        }

        try {
            return JSON.parse(savedChat);
        } catch (error) {
            localStorage.removeItem("selectedChat");
            return null;
        }
    });
    const [chats, setChats] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const setSelectedChat = (chat) => {
        const nextChat = chat || null;
        setSelectedChatState(nextChat);

        if (nextChat?._id) {
            localStorage.setItem("selectedChat", JSON.stringify(nextChat));
        } else {
            localStorage.removeItem("selectedChat");
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
            } catch (error) {
                console.error("Invalid userInfo:", error);

                localStorage.removeItem("userInfo");
                setUser(null);
            }
        }
    }, []);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notifications,
                setNotifications,
                loadingChat,
                setLoadingChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

// Custom Hook
export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;


