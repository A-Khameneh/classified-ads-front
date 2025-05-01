import { useQuery } from "@tanstack/react-query"
import { getAdmins } from "src/services/admin"


export default function GetAdmins() {

    const { data } = useQuery( ["admins"], getAdmins )

    return <div className="mt-[50px] mb-[70px]">
    
        <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5"> ادمین ها </h3>

        <ul> { data?.data?.data?.map( admin => <li key={admin._id} > {admin.phone} </li> ) } </ul>

    </div>

}