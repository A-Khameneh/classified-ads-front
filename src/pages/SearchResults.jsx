// src/pages/SearchResults.js (یا هر مسیری که صلاح می‌دانید)

import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { searchPosts } from "src/services/user"; 
import Loader from "src/components/modules/Loader";
import { sp } from "src/utils/numbers";

// یک کامپوننت کوچک برای نمایش هر کارت آگهی
function PostResultCard({ post }) {
    const baseURL = import.meta.env.VITE_BASE_URL;

    return (
        <Link to={`/post-detail/${post._id}`} className="block border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="w-full h-48 bg-gray-200">
                {/* اگر mainImage وجود داشت، آن را نمایش بده */}
                {post.mainImage && (
                    <img 
                        src={`${baseURL}${post.mainImage}`} 
                        alt={post.title}
                        className="w-full h-full object-cover" 
                    />
                )}
            </div>
            <div className="p-4">
                <p className="font-semibold mb-2 truncate">{post.title}</p>
                <p className="text-primary font-bold">{sp(post.price)} تومان</p>
                <p className="text-sm text-gray-500 mt-1">{post.city}</p>
            </div>
        </Link>
    );
}


export default function SearchResults() {
    // از این هوک برای خواندن پارامترهای URL استفاده می‌کنیم
    const [searchParams, setSearchParams] = useSearchParams();

    // خواندن پارامترها از URL
    const title = searchParams.get("q") || ""; // 'q' همان نامی است که در هدر استفاده کردیم
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10; // تعداد نتایج در هر صفحه

    // ارسال درخواست به سرور با استفاده از React Query
    const { data, isLoading, isError, error } = useQuery(
        ["search-posts", title, page, limit], // کلید کوئری
        () => searchPosts({ title, page, limit }), // تابع دریافت اطلاعات
        {
            enabled: !!title, // کوئری فقط زمانی اجرا شود که title وجود داشته باشد
            keepPreviousData: true, // برای تجربه بهتر در صفحه‌بندی
        }
    );

    const posts = data?.data?.posts || [];
    const totalPages = data?.data?.pages || 1;

    // تابع برای تغییر صفحه
    const handlePageChange = (newPage) => {
        setSearchParams({ q: title, page: newPage });
    };

    if (isLoading) return <div className="flex justify-center mt-10"><Loader /></div>;
    if (isError) return <div className="text-center text-red-500 mt-10">خطا در دریافت اطلاعات: {error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">نتایج جستجو برای: "{title}"</h1>

            {posts.length > 0 ? (
                <div>
                    {/* نمایش لیست نتایج */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map(post => (
                            <PostResultCard key={post._id} post={post} />
                        ))}
                    </div>

                    {/* بخش صفحه‌بندی (Pagination) */}
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                        >
                            قبلی
                        </button>
                        <span>صفحه {page} از {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                        >
                            بعدی
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-10">هیچ نتیجه‌ای برای جستجوی شما یافت نشد.</p>
            )}
        </div>
    );
}