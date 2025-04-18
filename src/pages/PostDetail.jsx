import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/user";
import { sp } from "src/utils/numbers";
import fallbackImage from '../../public/image-fallback.jpg';
import Loader from "src/components/modules/Loader";
import ShowMap from "src/components/templates/ShowMap";

export default function PostDetail() {
    const { id: postId } = useParams();
    console.log("postId in PostDetail:", postId);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const fallbackImageUrl = fallbackImage;

    const { data: postData, isLoading, isError } = useQuery(
        ["post-detail", postId],
        () => getPostById(postId),
        {
            enabled: !!postId,
        }
    );

    const post = postData?.data?.data.post;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">خطا در بارگذاری اطلاعات آگهی</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img 
                            src={!("mainImage" in post) ? fallbackImageUrl : `${baseURL}${post?.mainImage}`} 
                            className="w-full h-64 object-cover md:h-auto" 
                            alt={post?.title || "تصویر آگهی"}
                        />

                        <div className="mt-8" > 
                            <h2 className="text-lg font-medium mb-2">موقعیت مکانی</h2>
                            <div className="overflow-hidden h-72 w-full" > <ShowMap lat={ parseFloat(post.lat) } lng={ parseFloat(post.lng) } /> </div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/2">
                        <h1 className="text-2xl font-bold mb-4">{post?.title}</h1>
                        <div className="mb-4">
                            <p className="text-lg font-semibold text-primary"> { sp( post?.price ) } تومان </p>
                            <p className="text-gray-600">شهر: {post?.city}</p>
                        </div>
                        
                        {post?.description && (
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold mb-2">توضیحات</h2>
                                <p className="text-gray-700 text-justify">{post?.description}</p>
                            </div>
                        )}
                        
                        {post?.category && (
                            <p className="text-gray-600">دسته‌بندی: {post?.category}</p>
                        )}
                        
                        {post?.createdAt && (
                            <p className="text-gray-500 text-sm mt-4">
                                تاریخ انتشار: {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                        )}
                    </div>
                </div>
                
                {post?.features && post.features.length > 0 && (
                    <div className="p-6 border-t">
                        <h2 className="text-lg font-semibold mb-2">ویژگی‌ها</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {post.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="ml-2">•</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {post?.contactInfo && (
                    <div className="p-6 border-t">
                        <h2 className="text-lg font-semibold mb-2">اطلاعات تماس</h2>
                        <p className="text-gray-700">{post.contactInfo}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-4">
                <button 
                    onClick={() => window.history.back()} 
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                >
                    بازگشت
                </button>
            </div>
        </div>
    );
}