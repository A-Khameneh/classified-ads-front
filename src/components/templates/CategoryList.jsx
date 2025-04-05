import { useQuery } from "@tanstack/react-query";
import { getCategory } from "services/admin";
import Loader from "../modules/Loader";

export default function CategoryList() {

    const { data, isLoading } = useQuery( ["get-categories"], getCategory );

    return <div className="mt-[50px] mb-[70px]" >

        { isLoading ? <Loader /> :

            data?.data?.data?.result.map( i => (

                <div key={ i._id } className="flex my-5 mx-0 p-4 border-2 border-gray-300 rounded-md items-center" > 

                    <img src={`${ i.icon }.svg`} alt={i.name} /> 
                    <h5 className="mr-2.5 text-sm w-[120px]" > { i.title } </h5> 
                    <p className="w-full text-left text-[#a62626]" > slug: { i.slug } </p> 

                </div>

            ) )

        }

    </div>

}