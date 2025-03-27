import { useQuery } from "@tanstack/react-query";
import { getPosts } from "services/user";
import Loader from "../modules/Loader";
import { sp } from "utils/numbers";

export default function PostList() {

    const { data, isLoading, err } = useQuery(["my-post-list"], getPosts, {

        refetchOnWindowFocus: true,
        staleTime: 30000,

    })

    const baseURL = import.meta.env.VITE_BASE_URL;

    if (isLoading) return <Loader />;

    if (err) return (

        <div className="mx-auto pt-[60px] pb-[30px]">
            <h3 className="mb-[30px] border-b-4 border-primary w-fit pb-1.5">آگهی های شما</h3>
            <p className="text-red-500">خطا در بارگذاری آگهی‌ها: {err.message}</p>
        </div>

    );

    const posts = data?.data?.data?.posts || [];
    const hasPosts = posts.length > 0;

    return (

        <div className="mx-auto pt-[60px] pb-[30px]">
            <h3 className="mb-[30px] border-b-4 border-primary w-fit pb-1.5">آگهی های شما</h3>

            {!hasPosts ? (
                <p className="text-gray-500">شما هنوز آگهی ثبت نکرده‌اید.</p>
            ) : (
                posts.map(post => (
                    <div key={post._id} className="flex items-center border-2 border-gray-300 rounded-md my-2.5 mx-0 p-1.5">
                        {post.images && post.images.length > 0 ? (
                            <img
                                src={`${baseURL}${post.images[0]}`}
                                className="w-[100px] h-[70px] rounded-sm ml-[30px] object-cover"
                                alt={post?.title || "آگهی"}
                            />
                        ) : (
                            <div className="w-[100px] h-[70px] bg-gray-200 rounded-sm ml-[30px] flex items-center justify-center">
                                <span className="text-xs text-gray-500">بدون تصویر</span>
                            </div>
                        )}

                        <div className="w-full">
                            <p className="text-sm font-medium">{post?.title ?? "بدون عنوان"}</p>
                            <span className="text-xs text-gray-500 line-clamp-2">{post?.description ?? "بدون توضیح"}</span>
                        </div>

                        <div className="w-[150px] text-center">
                            <p className="text-sm">{new Date(post?.createdAt).toLocaleDateString("fa-IR")}</p>
                            <span className="text-xs font-medium">{sp(post?.price)} تومان</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
