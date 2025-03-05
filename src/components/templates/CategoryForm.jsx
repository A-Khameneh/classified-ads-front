import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addCategory } from "services/admin";

export default function CategoryForm() {

    const queryClient = useQueryClient();

    const [ form, setForm ] = useState({
        name: "",
        slug: "",
        icon: "",
    })

    const { mutate, isLoading, error, data } = useMutation( addCategory, {
        onSuccess: () => queryClient.invalidateQueries("get-categories"),
    } )
    console.log({isLoading, error, data});

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const submitHandler = event => {
        event.preventDefault();
        if ( !form.name || !form.slug || !form.icon ) return;
        mutate( form );
    }

    return <form onChange={ changeHandler } onSubmit={ submitHandler } className="max-w-lg" > 

        <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5" > دسته بندی جدید </h3> 

        { data?.status === 201 && <p className="bg-primary mb-5 text-white p-1.5 text-center rounded-md" > دسته بندی با موفقیت اضافه شد </p> } 
        { !!error && <p className="bg-primary mb-5 text-white p-1.5 text-center rounded-md" > مشکلی پیش آمده است </p> }

        <label htmlFor="name" className="block text-sm mb-2.5" > اسم دسته بندی </label> 
        <input type="text" name="name" id="name" className="block w-[300px] p-1.5 border border-gray-300 rounded-md mb-7.5" /> 

        <label htmlFor="slug" className="block text-sm mb-2.5" > اسلاگ </label> 
        <input type="text" name="slug" id="slug" className="block w-[300px] p-1.5 border border-gray-300 rounded-md mb-7.5" /> 

        <label htmlFor="icon" className="block text-sm mb-2.5" > آیکون </label> 
        <input type="text" name="icon" id="icon" className="block w-[300px] p-1.5 border border-gray-300 rounded-md mb-7.5" /> 

        <button type="submit" disabled={ isLoading } className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer disabled:opacity-50" > ایجاد </button> 

    </form>

}