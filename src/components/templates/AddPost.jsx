// components/AddPost.js

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getCategory, getOptionsOfCategory } from "services/admin";
import { getCookie } from "utils/cookie";
import axios from "axios";
import toast from "react-hot-toast";
import LocationPicker from './LocationPicker';

export default function AddPost() {
    const queryClient = useQueryClient();
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [form, setForm] = useState({
        title: "",
        content: "",
        amount: "",
        lat: null,
        lng: null,
        city: "",
        images: null,
        category: "",
        options: {}, // 👈 تغییر: options به آبجکت تغییر کرد
    });

    const { data: categoriesData } = useQuery(["get-categories"], getCategory);

    useEffect(() => {
        const fetchOptions = async () => {
            if (form.category) {
                try {
                    const res = await getOptionsOfCategory(form.category);
                    setCategoryOptions(res?.data?.options || []);
                    // Reset options when category changes
                    setForm(prevForm => ({ ...prevForm, options: {} }));
                } catch (error) {
                    toast.error("خطا در گرفتن فیلدهای اضافی");
                    setCategoryOptions([]);
                }
            } else {
                setCategoryOptions([]);
            }
        };
        fetchOptions();
    }, [form.category]);

    // ✅ هندلر برای فیلدهای اصلی فرم
    const mainFormChangeHandler = event => {
        const { name, value, type, files } = event.target;
        if (type === "file") {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    // ✅ هندلر جدید برای فیلدهای داینامیک
    const optionsChangeHandler = event => {
        const { name, value, type, checked } = event.target;

        setForm(prevForm => {
            const newOptions = { ...prevForm.options };

            if (type === "checkbox") {
                const currentValues = newOptions[name] || [];
                if (checked) {
                    newOptions[name] = [...currentValues, value];
                } else {
                    newOptions[name] = currentValues.filter(item => item !== value);
                }
            } else {
                newOptions[name] = value;
            }

            return {
                ...prevForm,
                options: newOptions,
            };
        });
    }

    const addHandler = event => {
        event.preventDefault();
        const formData = new FormData();

        // Append all form fields except options
        for (let key in form) {
            if (key !== "options" && form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        }

        // 👈 تغییر: آبجکت options را به رشته JSON تبدیل و اضافه کن
        if (form.options && Object.keys(form.options).length > 0) {
            formData.append("options", JSON.stringify(form.options));
        }

        const token = getCookie("accessToken");
        axios.post(`${import.meta.env.VITE_BASE_URL}post/createPost`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `bearer ${token}`
            }
        }).then(() => {
            toast.success("پست با موفقیت ایجاد شد.");
            queryClient.invalidateQueries(["my-post-list"]);
        }).catch((err) => {
            console.error("Error submitting post:", err);
            toast.error("مشکلی پیش آمده است");
        });
    }

    const handleLocationSelected = (location) => {
        setForm(prevForm => ({ ...prevForm, lat: location.lat, lng: location.lng }));
    }

    const inputStyle = "outline-none block w-[300px] p-1.5 border border-gray-400 rounded-md";

    const renderDynamicField = (option) => {
        const { key, title, type, guide, required, enum: enumArray, showType } = option;
        // 👈 تغییر: از optionsChangeHandler استفاده می‌شود
        const fieldProps = { name: key, id: key, onChange: optionsChangeHandler, required: required };

        if (type === "boolean") {
            return (
                <div key={key} className="flex items-center gap-x-4">
                    <p className="text-sm font-medium">{title}</p>
                    <label className="flex items-center gap-x-1"><input type="radio" name={key} value="true" onChange={optionsChangeHandler} /> بله</label>
                    <label className="flex items-center gap-x-1"><input type="radio" name={key} value="false" onChange={optionsChangeHandler} /> خیر</label>
                </div>
            );
        }

        if (enumArray && enumArray.length > 0) {
            if (showType === 'selectOption') {
                return (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm mb-2.5">{title}</label>
                        <select {...fieldProps} className={inputStyle}>
                            <option value="">انتخاب کنید...</option>
                            {enumArray.map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>
                );
            }
            if (showType === 'checkBox') {
                return (
                    <div key={key}>
                        <p className="block text-sm mb-2.5">{title}</p>
                        <div className="space-y-2">
                            {enumArray.map(val => <label key={val} className="flex items-center gap-x-2"><input type="checkbox" name={key} value={val} onChange={optionsChangeHandler} /> {val}</label>)}
                        </div>
                    </div>
                );
            }
        }

        const inputType = type === 'number' ? 'number' : 'text';
        return (
            <div key={key}>
                <label htmlFor={key} className="block text-sm mb-2.5">{title}</label>
                {guide && <p className="text-xs text-gray-500 mb-1">{guide}</p>}
                <input type={inputType} {...fieldProps} className={inputStyle} />
            </div>
        );
    }

    return (
        <form onSubmit={addHandler} className="max-w-lg">
            <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5"> افزودن آگهی </h3>

            <div className="mb-7.5">
                <label htmlFor="title" className="block text-sm mb-2.5"> عنوان آگهی </label>
                <input type="text" name="title" id="title" value={form.title} onChange={mainFormChangeHandler} className={inputStyle} />
            </div>

            <div className="mb-7.5">
                <label htmlFor="content" className="block text-sm mb-2.5"> توضیحات </label>
                <textarea name="content" id="content" value={form.content} onChange={mainFormChangeHandler} className={`${inputStyle} h-[100px]`} />
            </div>

            <div className="mb-7.5">
                <label htmlFor="amount" className="block text-sm mb-2.5"> قیمت </label>
                <input type="number" name="amount" id="amount" value={form.amount} onChange={mainFormChangeHandler} className={inputStyle} />
            </div>

            <div className="mb-7.5">
                <label htmlFor="city" className="block text-sm mb-2.5"> شهر </label>
                <input type="text" name="city" id="city" value={form.city} onChange={mainFormChangeHandler} className={inputStyle} />
            </div>

            <div className="mb-7.5">
                <label htmlFor="category" className="block text-sm mb-2.5"> دسته بندی </label>
                <select name="category" id="category" value={form.category} onChange={mainFormChangeHandler} className={inputStyle}>
                    <option value="">یک دسته را انتخاب کنید...</option>
                    {categoriesData?.data?.data?.result.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                </select>
            </div>

            {categoryOptions.length > 0 && (
                <div className="p-4 border-t-2 mt-6 pt-6 space-y-6">
                    <h4 className="font-bold text-lg">ویژگی‌های اضافی</h4>
                    {categoryOptions.map(option => renderDynamicField(option))}
                </div>
            )}

            <div className="mb-7.5">
                <label htmlFor="images" className="block text-sm mb-2.5"> عکس </label>
                <input type="file" name="images" id="images" onChange={mainFormChangeHandler} className={`${inputStyle} p-0 file:mr-2 file:p-2 file:border-0 file:bg-gray-100`} />
            </div>

            <div className="mb-7.5">
                <label className="block text-sm mb-2.5"> انتخاب موقعیت مکانی </label>
                <LocationPicker onLocationSelected={handleLocationSelected} />
                {form.lat && form.lng && <p className="text-sm mt-2">موقعیت انتخاب شده: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</p>}
            </div>

            <button type="submit" className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer"> ایجاد آگهی </button>
        </form>
    );
}