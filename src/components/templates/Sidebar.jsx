
export default function SideBar({ categories }) {

    return <div className={`mt-7 w-[200px]`} >

        <h4> دسته ها </h4>

        <ul>

            { categories?.data?.data?.result?.map( category => (

                <li key={ category._id } className="flex my-5" >

                    <img src={`${ category?.icon }.svg`} />
                    <p className="font-light mr-2.5 text-gray-400" > { category.name } </p>

                </li>

            ) ) }

        </ul>

    </div>

}