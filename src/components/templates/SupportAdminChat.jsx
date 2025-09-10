// src/components/admin/AdminChatPanel.js

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

// --- Socket Connection ---
const SOCKET_URL = "http://127.0.0.1:3000";
const socket = io(SOCKET_URL, { autoConnect: false });

// --- AdminChatPanel Component ---
export default function AdminChatPanel() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  // --- Effects ---

  useEffect(() => {
    const adminToken = Cookies.get('accessToken');
    if (adminToken) {
      socket.auth = { token: adminToken };
      socket.connect();
      console.log("ADMIN: ✅ در حال اتصال به سرور به عنوان ادمین...");
    }

    socket.on('connect', () => {
      console.log("ADMIN: 🎉 با موفقیت به سرور متصل شد. ID:", socket.id);
    });

    const onActiveRooms = (activeRooms) => {
        console.log("ADMIN: 📥 لیست اتاق‌های فعال از سرور دریافت شد:", activeRooms);
        const sortedRooms = (activeRooms || []).sort((a, b) => {
            if (a.status === 'unresponded' && b.status !== 'unresponded') return -1;
            if (b.status === 'unresponded' && a.status !== 'unresponded') return 1;
            return 0;
        });
        setRooms(sortedRooms);
    };

    const onLoadHistory = (data) => {
      console.log(`ADMIN: 📜 تاریخچه چت برای اتاق ${data.room} دریافت شد:`, data);
      const historyMessages = (data.messages || []).map(msg => ({
          ...msg,
          senderRole: msg.sender === data.room ? 'user' : 'admin'
      }));
      setMessages(historyMessages);
    };

    const onNewMessage = (data) => {
        console.log(`ADMIN: 📥 پیام جدید دریافت شد:`, data);
        if (data.room === selectedRoom) {
            setMessages(prev => [...prev, { ...data, senderRole: data.sender === selectedRoom ? 'user' : 'admin' }]);
        } else {
            setRooms(prevRooms => {
                const otherRooms = prevRooms.filter(r => r.room !== data.room);
                const updatedRoom = prevRooms.find(r => r.room === data.room) || { room: data.room };
                updatedRoom.lastMessage = data.message;
                updatedRoom.status = 'unresponded';
                return [updatedRoom, ...otherRooms];
            });
        }
    };

    const onNewRoom = (newRoomData) => {
        console.log("ADMIN: 🚪 اتاق جدید اضافه شد:", newRoomData);
        setRooms(prevRooms => [newRoomData, ...prevRooms]);
    };

    socket.on("activeRooms", onActiveRooms);
    socket.on("loadChatHistory", onLoadHistory);
    socket.on("newMessage", onNewMessage);
    socket.on("newRoom", onNewRoom);

    return () => {
      console.log("ADMIN: 🔌 قطع اتصال از سرور.");
      socket.off("connect");
      socket.off("activeRooms", onActiveRooms);
      socket.off("loadChatHistory", onLoadHistory);
      socket.off("newMessage", onNewMessage);
      socket.off("newRoom", onNewRoom);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      console.log(`ADMIN: 🚪 در حال پیوستن به اتاق: ${selectedRoom}`);
      socket.emit('joinRoom', { clientId: selectedRoom });
    }
  }, [selectedRoom]);

  // ✅ تغییر اصلی: منطق اسکرول اصلاح شد
  useEffect(() => {
    if (messages.length === 0) return;

    // اگر بارگذاری اولیه گفتگو باشد، اسکرول نکن
    if (isInitialLoad.current) {
        isInitialLoad.current = false;
    } else {
        // در غیر این صورت (برای پیام‌های جدید)، اسکرول کن
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // --- Handlers ---

  const handleSelectRoom = (room) => {
    setMessages([]);
    setSelectedRoom(room);
    isInitialLoad.current = true; // با انتخاب اتاق جدید، حالت را برای بارگذاری اولیه تنظیم کن
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && selectedRoom) {
      const messageData = {
        message: inputValue.trim(),
        clientId: selectedRoom,
        repliedTo: null,
      };
      console.log("ADMIN: 📤 در حال ارسال پیام:", messageData);
      socket.emit("sendMessage", messageData);

      setMessages(prev => [...prev, { message: inputValue.trim(), senderRole: 'admin' }]);
      setInputValue("");
    }
  };

  // --- Render ---

  return (
    <div className="flex h-[calc(100vh-100px)] border rounded-lg bg-white">
      {/* ستون لیست گفتگوها */}
      <div className="w-1/3 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">گفتگوها</h2>
        </div>
        <ul className="overflow-y-auto">
          {rooms.map((roomData) => (
            <li
              key={roomData.room}
              onClick={() => handleSelectRoom(roomData.room)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedRoom === roomData.room ? 'bg-blue-100' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{roomData.room}</span>
                {roomData.status === 'unresponded' && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">جدید</span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate mt-1">{roomData.lastMessage}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ستون پنجره چت */}
      <div className="w-2/3 flex flex-col border-r">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b flex items-center">
              <h3 className="text-lg font-semibold">
                گفتگو با {selectedRoom}
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-2 rounded-lg ${msg.senderRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t flex">
              <button type="submit" className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center ml-2 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
                &rarr;
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="پاسخ خود را بنویسید..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              />
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">برای مشاهده پیام‌ها، یک گفتگو را انتخاب کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
}
