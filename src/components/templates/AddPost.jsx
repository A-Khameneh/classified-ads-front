import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getCategory } from "services/admin";

import { getCookie } from "utils/cookie";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddPost() {

    const [ form, setForm ] = useState({
        title: "",
        content: "",
        category: "",
        city: "",
        amount: null,
        images: null,
    });

    const { data } = useQuery( ["get-categories"], getCategory );

    console.log("data in addpost", data);

    useEffect ( () => {
        if (data?.data?.data?.result && data.data.data.result.length > 0) {
            setForm(prevForm => ({
                ...prevForm,
                category: data?.data?.data?.result[0]._id
            }));
        }
    }, [data]);

    const changeHandler = event => {
        const name = event.target.name;
        if ( name !== "images" ) {
            setForm({ ...form, [ name ]: event.target.value })
        } else {
            setForm({ ...form, [name]: event.target.files[0] })
        }
    }

    const addHandler = event => {
        event.preventDefault();
        const formData = new FormData();
        for ( let i in form ) {
            formData.append( i, form[i] );
        }
        const token = getCookie( "accessToken" )
        axios.post( `${ import.meta.env.VITE_BASE_URL }post/createPost`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `bearer ${ token }`
            }
        }).then( res => toast.success( res.data.message ) ).catch( () => toast.error("مشکلی پیش آمده است") );
    }

    return <form onChange={ changeHandler } className="max-w-lg" > 

        <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5" > افزودن آگهی </h3> 

        <label htmlFor="title" className="block text-sm mb-2.5" > عنوان آگهی </label> 
        <input type="text" name="title" id="title" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" /> 

        <label htmlFor="content" className="block text-sm mb-2.5" > توضیحات </label> 
        <textarea name="content" id="content" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5 h-[100px]" /> 

        <label htmlFor="amount" className="block text-sm mb-2.5" > قیمت </label> 
        <input type="number" name="amount" id="amount" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" /> 

        <label htmlFor="city" className="block text-sm mb-2.5" > شهر </label> 
        <input type="text" name="city" id="city" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" /> 

        <label htmlFor="category" className="block text-sm mb-2.5" > دسته بندی </label> 
        <select name="category" id="category" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" > 
            { data?.data?.data?.result.map( i => <option key={ i._id } value={ i._id } > { i.title } </option> ) }
        </select>

        <label htmlFor="images" className="block text-sm mb-2.5" > عکس </label> 
        <input type="file" name="images" id="images" className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" /> 

        <button onClick={ addHandler } className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer" > ایجاد </button>

    </form>

}