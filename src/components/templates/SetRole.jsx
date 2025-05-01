import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { setUserRole } from "src/services/admin";

export default function SetRole() {
    const roles = ["USER", "ADMIN"];
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        phone: "",
        role: "USER",
    });

    const mutation = useMutation({

        mutationFn: setUserRole,
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("تغییر نقش با موفقیت انجام شد.");
            setForm({
                phone: "",
                role: "USER",
            });
            
        },

        onError: (error) => {
            toast.error("خطا در تغییر نقش کاربر.");
            console.error(error);
        },

    })

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const addHandler = (event) => {
        event.preventDefault();

        if (!form.phone.trim()) {
            toast.error("لطفاً شماره تلفن کاربر را وارد کنید.");
            return;
        }

        mutation.mutate(form);

    };

    return (
        <form className="max-w-lg">
            <h3 className="mb-7.5 border-b-4 border-primary w-fit pb-1.5">
                تعیین نقش کاربر
            </h3>

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

            <button
                onClick={addHandler}
                className="bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer"
            >
                ایجاد
            </button>
        </form>
    );
}