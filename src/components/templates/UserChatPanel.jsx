import { useChat } from "src/context/ChatContext";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "src/services/user";

export default function UserChatPanel() {

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [searchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState("");

    const { userAllChats,
        activeChat,
        createChat,
        joinChat,
        sendMessage,
        setActiveChat,
    } = useChat();

    const { data } = useQuery(["profile"], getProfile);

    const buyerSellerChats = userAllChats.filter(chat => chat.chatType === 'buyer-seller');
    const postId = searchParams.get("postId");
    const sellerId = searchParams.get("sellerId");
    const postTitle = searchParams.get("postTitle");

    useEffect(() => {

        if (searchParams) {

            createChat('buyer-seller', { subject: `${postTitle}`, postId: `${postId}` });

        }

    }, [searchParams]);

    useEffect(() => {

        console.log("✅ لیست چت‌ها:", userAllChats);
        console.log("✅  چت‌ها:", activeChat);
        console.log("✅ چت خریدار فروشنده:", buyerSellerChats);

    }, [userAllChats]);

    console.log("postId:", postId);
    console.log("sellerId:", sellerId);
    console.log("postTitle:", postTitle);

    const handleSelectChat = (c) => {
        setSelectedChatId(c);
        //joinChat(chatId); // درخواست تاریخچه چت از سرور
        console.log("selectedChatId", c);
        joinChat(c);
    };

    // const handleOpenWidget = () => {
    //     setIsOpen(true);
    //     if (supportChat) {
    //         // اگر چت پشتیبانی وجود داشت، به آن ملحق شو
    //         joinChat(supportChat.chatId);
    //     } else {
    //         // اگر وجود نداشت، یک چت جدید بساز
    //         //console.log("ایجاد چت: ");
    //         createChat('user-support', { subject: 'پشتیبانی آنلاین' });
    //     }
    // };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() && selectedChatId) {
            // ۴. برای ارسال پیام، فقط تابع مرکز فرماندهی را صدا می‌زنیم
            sendMessage(selectedChatId, inputValue.trim());
            setInputValue("");
        }
    };

    return <>

        <h3 className="mb-[30px] border-b-4 border-primary w-fit pb-1.5"> پنل گفتگوهای کاربر </h3>

        <div className="flex h-[calc(100vh-150px)] border rounded-lg bg-white shadow">
            <div className="w-1/3 border-l flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="font-bold">گفتگوهای آگهی‌ها</h3>
                </div>
                <ul className="overflow-y-auto flex-1">
                    {buyerSellerChats.length === 0 ? (
                        <li className="p-4 text-gray-500">چتی وجود ندارد.</li>
                    ) : (
                        buyerSellerChats.map((chat) => (
                            <li
                                key={chat.chatId}
                                onClick={() => handleSelectChat(chat.chatId)}
                                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedChatId === chat.chatId ? 'bg-blue-100' : ''
                                    }`}
                            >
                                <div className="font-semibold">
                                    {chat?.postTitle || 'آگهی بدون عنوان'}
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {chat?.lastMessage?.content || 'بدون پیام'}
                                </p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* ستون راست: پیام‌ها */}
            <div className="w-2/3 flex flex-col p-4">
                {selectedChatId ? (
                    <>
                        <h4 className="font-bold mb-4">
                            چت با {buyerSellerChats.find(c => c.chatId === selectedChatId)?.metadata?.sellerName || 'فروشنده'}
                        </h4>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {activeChat.messages.map((msg, index) => (

                                <div key={index} className={`mb-3 flex ${msg.sender === data.data._id ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${msg.sender === data.data._id ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-black'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                        {console.log("seder not first render")}
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
                    <div className="flex items-center justify-center h-full text-gray-500">
                        یک گفتگو را انتخاب کنید.
                    </div>
                )}
            </div>
        </div>

    </>

}