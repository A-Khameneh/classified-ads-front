import { createContext } from "react";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = "http://localhost:3000";

export function ChatProvider({children}) {

    const [ socket, setSocket ] = useState(null);
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ chats, setChats ] = useState([]);

    useEffect( () => {

        const token = Cookies.get('accessToken');
        if( token ) {

            const newSocket = io( SOCKET_URL, { auth: { token } } );
            setSocket( newSocket );
            newSocket.on( 'user-chats', ( allChats ) => {

                setChats( allChats );

            } );

            return () => newSocket.disconnect();

        }


    } , [] );

    const value = {

        socket,
        currentUser,
        chats,

    }

    return <ChatContext.Provider value={value} >

        { children }

    </ChatContext.Provider>

}



export const ChatContext = createContext(null);