import { useState, useEffect } from "react";
import { useChat } from "../../context/ChatContext"; // ۱. از هوک سفارشی خودمان استفاده می‌کنیم

export default function AdminChatPanel() {
  // --- استیت‌های محلی فقط برای مدیریت UI ---
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // ۲. تمام اطلاعات و توابع مورد نیاز را از "مرکز فرماندهی" می‌گیریم
  const { chats, activeChat, joinChat, sendMessage, setActiveChat } = useChat();

  // --- Handlers ---

  const handleSelectChat = (chatId) => {
    // ۳. وقتی ادمین یک چت را انتخاب می‌کند، به مرکز فرماندهی اطلاع می‌دهیم
    setSelectedChatId(chatId);
    joinChat(chatId); // درخواست پیوستن به اتاق و دریافت تاریخچه
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && selectedChatId) {
      // ۴. برای ارسال پیام، فقط تابع مرکز فرماندهی را صدا می‌زنیم
      sendMessage(selectedChatId, inputValue.trim());
      setInputValue("");
    }
  };
  
  // اگر Provider هنوز در حال اتصال باشد، یک پیام لودینگ نشان بده
  if (!chats) {
    return <div>در حال بارگذاری پنل چت...</div>;
  }

  // --- Render ---
  return (
    <div className="flex h-[calc(100vh-100px)] border rounded-lg bg-white">
      {/* ستون راست: لیست گفتگوها */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">گفتگوها</h2>
        </div>
        <ul className="overflow-y-auto">
          {/* ۵. لیست گفتگوها را مستقیماً از Provider می‌خوانیم */}
          {chats.map((chat) => (
            <li
              key={chat.chatId}
              onClick={() => handleSelectChat(chat.chatId)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedChatId === chat.chatId ? 'bg-blue-100' : ''
              }`}
            >
              <div className="font-semibold">{chat.subject}</div>
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage?.content}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ستون چپ: پنجره پیام‌ها */}
      <div className="w-2/3 flex flex-col">
        {selectedChatId ? (
          <>
            <div className="p-4 border-b flex items-center">
              <h3 className="text-lg font-semibold">
                گفتگو با {chats.find(c => c.chatId === selectedChatId)?.subject}
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {/* ۶. پیام‌ها را از گفتگوی فعال (activeChat) که در Provider است می‌خوانیم */}
              {activeChat.messages.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.sender.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2 rounded-lg ${msg.sender.role === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t flex">
                {/* ... فرم بدون تغییر ... */}
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
