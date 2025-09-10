// src/components/ChatWidget.js

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

// آیکون‌ها به صورت کامپوننت‌های ساده برای خوانایی بهتر
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM9.75 9.75v.001M14.25 9.75v.001M12 14.25v.001" />
    </svg>
);


const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SOCKET_URL = "http://127.0.0.1:3000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});


export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [token, setToken] = useState(Cookies.get('accessToken'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = Cookies.get('accessToken');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    const onConnect = () => {
      console.log("🎉 با موفقیت به سرور متصل شد. ID:", socket.id);
    };

    const onDisconnect = () => {
      console.log("🔌 اتصال از سرور قطع شد.");
    };
    
    const onLoadHistory = (data) => {
      console.log("📜 تاریخچه چت دریافت شد:", data);
      const historyMessages = data.messages || [];
      setMessages(historyMessages.map(msg => ({
        ...msg,
        sender: msg.sender === data.room ? 'You' : 'Support'
      })));
    };

    const onNewMessage = (data) => {
        console.log("📥 پیام جدید از سرور دریافت شد:", data);
        setMessages(prev => [...prev, { 
            message: data.message, 
            sender: data.sender === socket.id ? 'You' : 'Support' 
        }]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("loadChatHistory", onLoadHistory);
    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("loadChatHistory", onLoadHistory);
      socket.off("newMessage", onNewMessage);
    };
  }, []);


  useEffect(() => {
    if (isOpen && token) {
      socket.auth = { token };
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [isOpen, token]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // --- تحلیل ساختار داده ارسالی ---

      // ۱. متن پیام را از استیت می‌خوانیم
      const messageText = inputValue.trim();

      // ۲. شناسه کلاینت را از خود سوکت می‌گیریم
      //const clientId = socket.id;
      //console.log("clientID:", clientId);

      // ۳. مقدار repliedTo را تعریف می‌کنیم
      const repliedTo = null;

      // ۴. آبجکت داده را می‌سازیم. این همان چیزی است که به سرور ارسال می‌شود.
      // **نکته کلیدی:** آیا نام کلیدها (keys) دقیقاً همین‌هاست؟
      // مثلاً آیا بک‌اند به جای `message` منتظر `text` یا `content` نیست؟
      const messageData = { 
          message: messageText,
          //clientId: clientId, 
          repliedTo: repliedTo 
      };

      // ۵. قبل از ارسال، آبجکت را در کنسول لاگ می‌کنیم تا مطمئن شویم درست است
      console.log("📤 در حال ارسال این آبجکت به سرور:", messageData);
      console.log("📤 تحت رویداد 'sendMessage'");

      // ۶. رویداد را به همراه آبجکت داده به سرور ارسال می‌کنیم
      socket.emit("sendMessage", messageData);

      // ۷. پیام را به صورت محلی نمایش می‌دهیم
      setMessages(prev => [...prev, { message: messageText, sender: 'You' }]);
      setInputValue("");
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="w-80 h-[450px] bg-white rounded-lg shadow-2xl flex flex-col">
          <div className="bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">پشتیبانی آنلاین</h3>
            <button onClick={() => setIsOpen(false)} className="text-white cursor-pointer">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 flex ${msg.sender === 'You' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
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
              placeholder="پیام خود را بنویسید..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative cursor-pointer"
        >
          <ChatIcon />
          {hasNewMessage && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      )}
    </div>
  );
}
