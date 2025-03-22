import { useQuery } from "@tanstack/react-query";
import { getPosts } from "services/user";
import Loader from "../modules/Loader";
import { sp } from "utils/numbers";

export default function PostList() {

    const { data, isLoading } = useQuery( ["my-post-list"], getPosts )
    const baseURL = import.meta.env.VITE_BASE_URL;

    return <div className="mx-auto pt-[60px] pb-[30px]" > 

        <h3 className="mb-[30px] border-b-4 border-primary w-fit pb-1.5" > آگهی های شما </h3>

        {
            isLoading ? <Loader /> : (

                <>
                    {
                        data.data.data.posts.map( post => (

                            <div key={ post._id } className="flex items-center border-2 border-gray-300 rounded-md my-2.5 mx-0 p-1.5" > 

                                <img src={ `${ baseURL }${ post.images[0] }` } className="w-[100px] h-[70px] rounded-sm ml-[30px]" alt={post?.options?.title || "آگهی"} />

                                <div className="w-full" > 

                                    <p className="text-sm" > { post?.options?.title ?? "بدون عنوان" } </p>
                                    <span className="text-xs text-gray-500" > { post?.options?.content ?? "بدون توضیح" } </span>

                                </div>

                                <div className="w-[150px] text-center" > 

                                    <p className="text-sm" > { new Date( post?.createdAt ).toLocaleDateString("fa-IR") } </p>
                                    <span className="text-xs" > { sp( post?.amount ) } تومان </span> 

                                </div>

                            </div>

                        ) )
                    }
                </>
            )
        }

    </div>

}