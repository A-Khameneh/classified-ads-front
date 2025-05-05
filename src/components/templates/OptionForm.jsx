import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOption, getCategory } from "src/services/admin";
export default function OptionForm() {

    const queryClient = useQueryClient();

    const [form, setForm] = useState({

        title: "",
        type: "number",
        key: "",
        guide: "",
        required: false,
        searchable: false,
        category: "",
        enumOption: [],

    })

    const { data } = useQuery(["get-categories"], getCategory);

    const mutation = useMutation({

        mutationFn: createOption,
    
        onSuccess: () => {
                
            queryClient.invalidateQueries("get-categories");
            toast.success("آپشن با موفقیت ایجاد شد.");
            setForm({
                title: "",
                type: "number",
                key: "",
                guide: "",
                required: false,
                searchable: false,
                category: "",
                enumOption: [],
            });
    
        },

        onerror: (err) => {

            console.error("Error submitting post:", err);
            toast.error("مشکلی پیش آمده است");

        }
    
    } )

    useEffect(() => {
        if (data?.data?.data?.result && data.data.data.result.length > 0) {
            setForm(prevForm => ({
                ...prevForm,
                category: data?.data?.data?.result[0]._id
            }));
        }
    }, [data]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        console.log("name:", value);

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));

    }

    const addHandler = event => {

        event.preventDefault();
        mutation.mutate( form )

    }

    return <div>

        <form className="max-w-lg">

            <h3 className="mb-7.5 border-b-4 w-fit pb-1.5 border-primary" > افزودن آپشن </h3>

            <label htmlFor="title" className="block text-sm mb-2.5">
                عنوان آپشن
            </label>
            <input
                type="text"
                name="title"
                id="title"
                value={form.title}
                onChange={handleChange}
                className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5 outline-none"
            />

            <fieldset className="flex gap-2 mb-7.5">

                <legend >نوع آپشن</legend>

                <label htmlFor="type">Number</label>
                <input
                    type="radio"
                    name="type"
                    value="number"
                    checked={form.type === "number"}
                    onChange={handleChange}
                />

                <label htmlFor="type">String</label>
                <input
                    type="radio"
                    name="type"
                    value="string"
                    checked={form.type === "string"}
                    onChange={handleChange}
                />

                <label htmlFor="type">Boolean</label>
                <input
                    type="radio"
                    name="type"
                    value="boolean"
                    checked={form.type === "boolean"}
                    onChange={handleChange}
                />

            </fieldset>

            <label htmlFor="key" className="block text-sm mb-2.5">
                اسلاگ
            </label>
            <input
                type="text"
                name="key"
                id="key"
                value={form.key}
                onChange={handleChange}
                className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5 outline-none"
            />

            <label htmlFor="guide" className="block text-sm mb-2.5">
                توضیحات
            </label>
            <input
                type="text"
                name="guide"
                id="guide"
                value={form.guide}
                onChange={handleChange}
                className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5 outline-none"
            />

            <fieldset className="flex gap-2 mb-7.5">

                <legend >لازم هست</legend>

                <label htmlFor="required">True</label>
                <input
                    type="radio"
                    name="required"
                    value="true"
                    checked={form.required === "true"}
                    onChange={handleChange}
                />

                <label htmlFor="required">False</label>
                <input
                    type="radio"
                    name="required"
                    value="false"
                    checked={form.required === "false"}
                    onChange={handleChange}
                />

            </fieldset>

            <fieldset className="flex gap-2 mb-7.5">

                <legend >آیا قابلیت جستجو دارد؟</legend>

                <label htmlFor="searchable">True</label>
                <input
                    type="radio"
                    name="searchable"
                    value="true"
                    checked={form.searchable === "true"}
                    onChange={handleChange}
                />

                <label htmlFor="searchable">False</label>
                <input
                    type="radio"
                    name="searchable"
                    value="false"
                    checked={form.searchable === "false"}
                    onChange={handleChange}
                />

            </fieldset>

            <label htmlFor="category" className="block text-sm mb-2.5" > دسته بندی </label>
            <select name="category" id="category" className="outline-none block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5" >
                {data?.data?.data?.result.map(i => <option key={i._id} value={i._id} > {i.title} </option>)}
            </select>

            <button onClick={addHandler} className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer" > ایجاد </button>

        </form>

    </div>

}