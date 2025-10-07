import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useChat } from "src/context/ChatContext";
import { getProfile } from "src/services/user";
import { useQuery } from "@tanstack/react-query";

const ChatIcon = ({ onClick }) => (
  <button onClick={onClick} className="fixed bottom-5 right-5 bg-[#A62626] text-white p-4 rounded-full shadow-lg hover:bg-[#861f1f] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-110 hover:cursor-pointer">
    <ChatBubbleLeftRightIcon className="h-8 w-8" />
  </button>
);

const XMarkIconComponent = () => (
  <XMarkIcon className="h-6 w-6" />
)

export default function ChatWidget() {

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // ✅ قدم ۲: تمام ابزارها و داده‌های لازم را از مرکز فرماندهی دریافت می‌کنیم
  const { userAllChats, 
          activeChat, 
          createChat, 
          joinChat, 
          sendMessage, 
          setActiveChat,
         } = useChat();


  // ✅ قدم ۳: گفتگوی پشتیبانی را از لیست کل گفتگوها پیدا می‌کنیم
  const supportChat = userAllChats.find(chat => chat.chatType === 'user-support');
  console.log("✅ لیست چت‌ها:",  userAllChats);
  console.log("✅  چت‌ها:", activeChat);
  console.log("✅ چت پشتیبانی:", supportChat);

  const { data } = useQuery(["profile"], getProfile);

  // افکت برای اسکرول خودکار
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("activeChat.messages: ", activeChat.messages);
    }
  }, [activeChat.messages, isOpen]);

  // useEffect(() => {
  //   if (data?.data?._id) {
  //     // وقتی کاربر تغییر کرد، چت‌ها رو ریست کن
  //     //resetChatState();
  //   }
  // }, [data?.data?._id]);

  // منطق هوشمند برای باز کردن ویجت
  const handleOpenWidget = () => {
    setIsOpen(true);
    if (supportChat) {
      // اگر چت پشتیبانی وجود داشت، به آن ملحق شو
      joinChat(supportChat.chatId);
    } else {
      // اگر وجود نداشت، یک چت جدید بساز
      //console.log("ایجاد چت: ");
      createChat('user-support', { subject: 'پشتیبانی آنلاین' });
    }
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    // با بستن پنجره، گفتگوی فعال را پاک می‌کنیم
    setActiveChat({ chatId: null, messages: [] });
  };

  // منطق ارسال پیام (حالا از مرکز فرماندهی استفاده می‌کند)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && supportChat) {
      sendMessage(supportChat.chatId, inputValue.trim());
      setInputValue("");
    }
  };

  if (!userAllChats || data?.data?.Role !== 'USER') {
    // اگر هنوز در حال اتصال هستیم، چیزی نمایش نده
    return null;
  }

  if (!isOpen) {
    return <ChatIcon onClick={handleOpenWidget} />;
  }

  return (
    <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
      {/* هدر چت */}
      <div className="bg-[#A62626] text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-bold text-lg">پشتیبانی آنلاین</h3>
        <button onClick={handleCloseWidget} className="hover:cursor-pointer p-1 rounded-full transition-transform transform hover:scale-110 ">
          <XMarkIconComponent />
        </button>
      </div>

      {/* بدنه پیام‌ها (حالا از activeChat.messages می‌خواند) */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">

        {activeChat.messages.map((msg, index) => {
          return (
            <>

              <div key={index} className={`mb-3 flex ${msg.sender === data.data._id ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${msg.sender === data.data._id ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-black'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>

            </>
          );
        })}

        {/* <div className={`mb-3 flex ${supportChat.lastMessage.sender._id === data.data._id ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${supportChat.lastMessage.sender._id === data.data._id ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-black'}`}>
            <p className="text-sm">{supportChat.lastMessage.content}</p>
          </div>
        </div> */}

        <div ref={chatEndRef} />
      </div>

      {/* فرم ارسال پیام */}
      <div className="p-3 border-t bg-white rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center flex-row-reverse">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#861f1f]"
          />
          <button type="submit" className="ml-2 bg-[#A62626] text-white p-3 rounded-full hover:bg-[#861f1f] transition-transform transform hover:scale-110 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400" disabled={!inputValue.trim()}>
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );

}

