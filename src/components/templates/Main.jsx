import { sp } from "utils/numbers";

export default function Main({ posts }) {

    const baseURL = import.meta.env.VITE_BASE_URL;

    console.log("posts in main", posts);

    return <div className="mt-5 flex flex-wrap justify-start gap-5 w-[calc(100%-200px)] items-start" > 

        {

            posts?.data?.posts?.map( post => (

                <div key={ post._id } className="w-[330px] flex justify-between border border-gray-300 my-2 mx-0 p-4 rounded-md" > 

                    <div className="flex flex-col justify-between" > 

                        <p className="text-base"> { post?.title } </p>
                        <div className="text-gray-500 text-sm" > 

                            <p> { sp( post?.price ) } تومان </p>
                            <span> { post?.city } </span>

                        </div>

                    </div>

                    <img src={ `${ baseURL }${ post.images[0] }` } className="w-[150px] h-[130px] rounded-md ml-0.5" /> 

                </div>

            ) )

        }

    </div>

}