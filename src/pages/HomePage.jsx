import { useQuery } from "@tanstack/react-query";
import Main from "components/templates/Main";
import Sidebar from "components/templates/Sidebar";
import Loader from "src/components/modules/Loader";
import { getCategory } from "src/services/admin";
import { getAllPosts } from "src/services/user";

export default function HomePage() {

    const { data: posts, isLoading: postLoading } = useQuery( ["post-list"], getAllPosts );
    const { data: categories, isLoading: categoryLoading } = useQuery( ["get-categories"], getCategory );
    
    console.log(`posts in homepage: ${posts}`);

    return <>

        { postLoading || categoryLoading ? (

            <Loader />

        ) : <div className="flex items-start" >

                <Sidebar categories={ categories } />
                <Main posts={ posts } />

            </div>

        }

    </>

}