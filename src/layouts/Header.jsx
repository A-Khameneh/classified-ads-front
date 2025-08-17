import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getProfile } from "src/services/user";

export default function Header() {
    // استیت‌های قبلی
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    // ✅ مرحله ۲: استیت جدید برای ذخیره متن جستجو
    const [searchTerm, setSearchTerm] = useState("");
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        Cookies.remove("accessToken");
        queryClient.invalidateQueries(["profile"]);
        navigate("/");
    };
    
    // ✅ مرحله ۳: تابع برای مدیریت ارسال فرم جستجو
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // جلوگیری از رفرش شدن صفحه
        if (!searchTerm.trim()) return; // اگر ورودی خالی بود، کاری نکن

        // کاربر را به صفحه نتایج بفرست و عبارت جستجو را به عنوان پارامتر q ارسال کن
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    };

    const { data: profileData } = useQuery(["profile"], getProfile);

    return (
        <header className="flex justify-between items-center border-b-2 border-gray-300 py-2.5 mb-5 gap-x-4">
            {/* بخش لوگو */}
            <div className="flex items-center ps-4 flex-shrink-0">
                <Link to="/">
                    <img src="/divar.svg" alt="divar" className="w-12" />
                </Link>
            </div>

            {/* ✅ مرحله ۱: فرم جستجو */}
            <div className="flex-grow max-w-lg mx-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="جستجو در همه آگهی‌ها..."
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2">
                        {/* می‌توانید اینجا یک آیکون ذره‌بین قرار دهید */}
                        🔍
                    </button>
                </form>
            </div>

            {/* بخش پروفایل و ثبت آگهی */}
            <div className="flex items-center space-x-4 flex-shrink-0 pe-4">
                {profileData && (
                    <div className="relative">
                        <button onClick={toggleProfileDropdown}>
                            <span className="flex items-center cursor-pointer">
                                <img src="/profile.svg" alt="profile" />
                            </span>
                        </button>
                        {isProfileDropdownOpen && (
                            <div className="absolute top-full left-0 bg-white shadow-md rounded-md mt-2 w-32 z-10">
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            to={profileData?.data?.Role === "ADMIN" ? "/admin" : "/dashboard"}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
                                        >
                                            {profileData?.data?.Role === "ADMIN" ? "داشبورد ادمین" : "داشبورد"}
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm w-full text-start cursor-pointer"
                                        >
                                            خروج
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <Link to="/dashboard" className="bg-primary text-white h-10 w-24 rounded-md flex items-center justify-center text-center">
                    ثبت آگهی
                </Link>
            </div>
        </header>
    );
}