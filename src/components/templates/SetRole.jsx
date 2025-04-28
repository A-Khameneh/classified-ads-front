import { useState } from "react";
import toast from "react-hot-toast";
import { setUserRole } from "src/services/admin";

export default function SetRole() {
    const roles = ["USER", "ADMIN"];

    // حالت اولیه فرم
    const [form, setForm] = useState({
        phone: "",
        role: "USER",
    });

    // مدیریت تغییرات فیلدها
    const changeHandler = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // تابع اضافه کردن نقش
    const addHandler = (event) => {
        event.preventDefault();

        // اعتبارسنجی اطلاعات
        if (!form.phone.trim()) {
            toast.error("لطفاً شماره تلفن کاربر را وارد کنید.");
            return;
        }

        // ارسال اطلاعات به سرور
        setUserRole(form)
            .then(() => {
                toast.success("تغییر نقش با موفقیت انجام شد.");

                // تنظیم مجدد فرم به حالت دیفالت
                setForm({
                    phone: "",
                    role: "USER",
                });
            })
            .catch((error) => {
                toast.error("خطا در تغییر نقش کاربر.");
                console.error(error);
            });
    };

    return (
        <form className="max-w-lg">
            <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5">
                تعیین نقش کاربر
            </h3>

            {/* فیلد شماره تلفن */}
            <label htmlFor="phone" className="block text-sm mb-2.5">
                شماره تلفن کاربر
            </label>
            <input
                type="text"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={changeHandler}
                className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5"
            />

            {/* فیلد نقش کاربر */}
            <label htmlFor="role" className="block text-sm mb-2.5">
                نقش کاربر
            </label>
            <select
                name="role"
                id="role"
                value={form.role}
                onChange={changeHandler}
                className="block w-[300px] p-1.5 border border-gray-400 rounded-md mb-7.5"
            >
                {roles.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>

            {/* دکمه ایجاد */}
            <button
                onClick={addHandler}
                className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer"
            >
                ایجاد
            </button>
        </form>
    );
}