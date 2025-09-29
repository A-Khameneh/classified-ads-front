import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { newStructMessage } from 'src/utils/newMassageAPI';

// --- ۱. ساختن کانتکست و هوک سفارشی ---

// این "کانال Wi-Fi" ماست که داده‌ها را منتقل می‌کند
const ChatContext = createContext(null);

// این یک هوک سفارشی است تا در کامپوننت‌های دیگر به راحتی به داده‌های چت دسترسی داشته باشیم
export function useChat() {
  return useContext(ChatContext);
}


// --- ۲. ساختن "مرکز فرماندهی" یا Provider ---

const SOCKET_URL = "http://127.0.0.1:3000";

export function ChatProvider({ children }) {
  // --- استیت‌های مرکزی برای نگهداری داده‌ها ---
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]); // لیست تمام گفتگوهای کاربر
  const [activeChat, setActiveChat] = useState({ // گفتگوی فعالی که کاربر در حال مشاهده آن است
    chatId: null,
    messages: [],
  });

  // --- افکت اصلی برای مدیریت اتصال و شنونده‌ها ---
  useEffect(() => {
    const token = Cookies.get('accessToken');

    // فقط در صورتی که کاربر لاگین کرده باشد، اتصال را برقرار کن
    if (token) {
      const newSocket = io(SOCKET_URL, {
        auth: { token },
      });

      setSocket(newSocket);
      console.log("PROVIDER: ✅ در حال اتصال به سرور چت...");

      // --- ثبت شنونده‌های دائمی ---
      // این شنونده‌ها فقط یک بار ثبت می‌شوند و تا آخر فعال می‌مانند

      newSocket.on('connect', () => {
        console.log("PROVIDER: 🎉 با موفقیت به سرور متصل شد.");
      });

      // دریافت لیست اولیه تمام گفتگوها
      newSocket.on('user-chats', (allChats) => {

        console.log("PROVIDER: 📥 لیست گفتگوها دریافت شد:", allChats);

        setChats(allChats || []);

      });

      // دریافت تاریخچه و پیام‌های یک گفتگوی خاص (پس از join-chat)
      newSocket.on('chat-joined', (data) => {
        console.log("PROVIDER: 📜 تاریخچه چت دریافت شد:", data);
        setActiveChat({
          chatId: data.chat.chatId,
          messages: data.messages || [],
        });
      });

      // دریافت یک پیام جدید به صورت لحظه‌ای
      newSocket.on('new-message', (newMessage) => {
        console.log("PROVIDER: 📬 پیام جدید دریافت شد:", newMessage);

        // پیام جدید را به لیست پیام‌های گفتگوی فعال اضافه کن
        // (فقط اگر مربوط به همین چت باشد)
        setActiveChat(prev => {
          if (prev.chatId === newMessage.chatId) {
            return { ...prev, messages: [...prev.messages, newStructMessage(newMessage)] };
          }
          return prev;
        });

        // لیست کلی گفتگوها را هم با آخرین پیام به‌روز کن
        setChats(prevChats => prevChats.map(chat =>
          chat.chatId === newMessage.chatId
            ? { ...chat, lastMessage: newMessage }
            : chat
        ));
      });

      // وقتی یک چت جدید ساخته می‌شود، آن را به لیست اضافه کن
      newSocket.on('chat-created', (newChat) => {
        console.log("PROVIDER: ✨ چت جدید ایجاد شد:", newChat);
        setChats(prev => [newChat, ...prev]);
      });
    // وقتی یک چت جدید ساخته می‌شود، آن را به لیست اضافه کن
      newSocket.on('new-support-chat', (newChat) => {
        console.log("PROVIDER: ✨ چت پشتیبانی جدید ایجاد شد:", newChat);
        setChats(prev => [newChat, ...prev]);
      });

      // تابع پاکسازی: وقتی برنامه بسته می‌شود، اتصال را قطع کن
      return () => {
        console.log("PROVIDER: 🔌 قطع اتصال از سرور.");
        newSocket.disconnect();
      }
    }
  }, []); // [] یعنی این افکت فقط یک بار اجرا می‌شود

  // --- توابع قابل استفاده برای کامپوننت‌های دیگر ---
  // این توابع مانند یک API داخلی برای بقیه برنامه عمل می‌کنند

  // تابع برای شروع یک گفتگوی جدید
  const createChat = (type, metadata) => {
    if (socket) {
      console.log("PROVIDER: 🚀 درخواست ایجاد چت جدید:", { type, metadata });
      socket.emit('create-chat', { chatType: type, metadata });
    }
  };

  // تابع برای پیوستن به یک اتاق چت و دریافت تاریخچه آن
  const joinChat = (chatId) => {
    if (socket) {
      console.log(`PROVIDER: 🚪 درخواست پیوستن به اتاق: ${chatId}`);
      socket.emit('join-chat', { chatId });
    }
  };

  // تابع برای ارسال یک پیام
  const sendMessage = (chatId, content) => {
    if (socket) {
      console.log(`PROVIDER: 📤 ارسال پیام به اتاق ${chatId}:, ${ content }`);
      socket.emit('send-message', { chatId, content, messageType: 'text' });
    }
  };

  // --- "بسته اطلاعاتی" نهایی که به اشتراک گذاشته می‌شود ---
  const value = {
    socket,
    chats,
    activeChat,
    setActiveChat, // برای اینکه بتوانیم از بیرون گفتگوی فعال را پاک کنیم
    createChat,
    joinChat,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}