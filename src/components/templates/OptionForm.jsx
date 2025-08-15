// components/OptionForm.js

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOption, getCategory } from "src/services/admin";
import EnumFields from "./EnumFields";

// Validation Schema
const validationSchema = Yup.object().shape({
    title: Yup.string().required("عنوان الزامی است"),
    key: Yup.string().required("اسلاگ (کلید) الزامی است").matches(/^[a-zA-Z0-9_]+$/, "اسلاگ فقط می‌تواند شامل حروف انگلیسی، اعداد و آندرلاین باشد"),
    category: Yup.string().required("انتخاب دسته الزامی است"),
    useEnum: Yup.boolean(),
    enumType: Yup.string().when('useEnum', {
        is: true,
        then: schema => schema.required("انتخاب نوع Enum الزامی است")
    }),
    enum: Yup.array().when('useEnum', {
        is: true,
        then: schema => schema.of(Yup.object().shape({
            value: Yup.string().required("مقدار Enum نمی‌تواند خالی باشد")
        })).min(1, "حداقل یک مقدار برای Enum اضافه کنید")
    })
});

export default function OptionForm() {
    const queryClient = useQueryClient();

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: "",
            key: "",
            guide: "",
            type: "string",
            required: true,
            searchable: true,
            category: "",
            useEnum: false,
            enumType: "string",
            enum: [],
        },
    });

    const { register, handleSubmit, reset, watch, formState: { errors } } = methods;

    const { data: categoriesData } = useQuery(["get-categories"], getCategory);

    const { mutate, isLoading } = useMutation({
        mutationFn: createOption,
        onSuccess: () => {
            queryClient.invalidateQueries("get-categories");
            toast.success("آپشن با موفقیت ایجاد شد.");
            reset();
        },
        onError: (err) => {
            console.error("Error creating option:", err);
            toast.error(err?.response?.data?.message || "مشکلی پیش آمده است");
        }
    });

    useEffect(() => {
        if (categoriesData?.data?.data?.result?.[0]?._id) {
            reset(prev => ({
                ...prev,
                category: categoriesData.data.data.result[0]._id
            }));
        }
    }, [categoriesData, reset]);


    const onSubmit = (formData) => {
        const dataToSend = { ...formData };

        if (dataToSend.useEnum && dataToSend.enum) {
            if (dataToSend.enumType === 'number') {
                dataToSend.enum = dataToSend.enum.map(item => Number(item.value));
            } else {
                dataToSend.enum = dataToSend.enum.map(item => item.value);
            }
        }

        if (!dataToSend.useEnum) {
            delete dataToSend.enumType;
            delete dataToSend.enum;
        }

        mutate(dataToSend);
    };

    return (
        <FormProvider {...methods}>
            <div className="container mx-auto p-4">
                <form className="max-w-lg bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h3 className="mb-7 border-b-2 w-fit pb-1.5 border-primary text-xl font-semibold text-gray-700">افزودن آپشن</h3>

                    <div className="mb-5">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">عنوان آپشن</label>
                        <input type="text" id="title" {...register("title")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">اسلاگ (کلید منحصر به فرد)</label>
                        <input type="text" id="key" {...register("key")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary" />
                        {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="guide" className="block text-sm font-medium text-gray-700 mb-1">متن راهنما (اختیاری)</label>
                        <input type="text" id="guide" {...register("guide")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary" />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">دسته بندی</label>
                        <select id="category" {...register("category")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary">
                            {categoriesData?.data?.data?.result?.map((i) => (
                                <option key={i._id} value={i._id}>{i.title}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <fieldset className="mb-5 grid grid-cols-2 gap-4">
                        <div>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">نوع</legend>
                            <select {...register("type")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary">
                                <option value="string">String (متن)</option>
                                <option value="number">Number (عدد)</option>
                                <option value="boolean">Boolean (بله/خیر)</option>
                            </select>
                        </div>
                        <div>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">الزامی است؟</legend>
                            <select {...register("required")} className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary">
                                <option value={true}>بله</option>
                                <option value={false}>خیر</option>
                            </select>
                        </div>
                    </fieldset>


                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input type="checkbox" {...register("useEnum")} className="form-checkbox h-5 w-5 text-primary rounded" />
                            <span className="mr-2 text-sm text-gray-700">از مقادیر ثابت و قابل انتخاب (Enum) استفاده شود؟</span>
                        </label>
                    </div>

                    {watch("useEnum") && <EnumFields />}

                    <button type="submit" className="w-full bg-primary text-white px-6 py-2.5 rounded-md text-sm cursor-pointer hover:bg-opacity-90 transition-colors" disabled={isLoading}>
                        {isLoading ? "در حال ایجاد..." : "ایجاد آپشن"}
                    </button>
                </form>
            </div>
        </FormProvider>
    );
}