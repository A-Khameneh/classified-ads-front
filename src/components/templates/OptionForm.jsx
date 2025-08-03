import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form"; // اضافه کردن FormProvider
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createOption, getCategory } from "src/services/admin";
import EnumFields from "./EnumFields";


// Validation Schema with Yup
const validationSchema = Yup.object().shape({
    title: Yup.string().required("عنوان الزامی است"),
    key: Yup.string().required("اسلاگ الزامی است"),
    category: Yup.string().required("انتخاب دسته الزامی است"),
    // ممکن است بخواهید اعتبار سنجی برای enumType و enumOption نیز اضافه کنید
    enumType: Yup.string().when('useEnum', {
        is: true,
        then: (schema) => schema.required("انتخاب نوع Enum الزامی است")
    }),
    enum: Yup.array().when('useEnum', {
        is: true,
        then: (schema) => schema.min(1, "حداقل یک مقدار برای Enum اضافه کنید")
    })
});

export default function OptionForm() {

    const queryClient = useQueryClient();

    // استفاده از useForm و گرفتن همه متدها
    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: "",
            key: "",
            guide: "",
            type: "number",
            required: "true",
            searchable: "true",
            category: "",
            useEnum: false, // مقدار اولیه برای useEnum
            enumType: "string", // مقدار اولیه برای enumType
            enum: [], // مقدار اولیه برای enum (آرایه خالی)
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = methods; // دی استراکچر کردن متدها از methods

    const { data } = useQuery(["get-categories"], getCategory);

    const mutation = useMutation({
        mutationFn: createOption,
        onSuccess: () => {
            queryClient.invalidateQueries("get-categories");
            toast.success("آپشن با موفقیت ایجاد شد.");
            reset(); // ریست کردن فرم
        },
        onError: (err) => { // از onError استفاده کنید به جای onerror
            console.error("Error submitting post:", err);
            toast.error("مشکلی پیش آمده است");
        }
    });

    useEffect(() => {
        if (data?.data?.data?.result && data.data.data.result.length > 0) {
            reset(prevValues => ({
                ...prevValues,
                category: data?.data?.data?.result[0]._id
            }));
        }
    }, [data, reset]);

    const onSubmit = (formData) => {

        console.log("Form Data:", formData); // برای بررسی داده‌های فرم
            const dataToSend = { ...formData };

            // اگر از enum استفاده شده، آن را به فرمت صحیح تبدیل می‌کنیم
            if (dataToSend.useEnum && dataToSend.enum) {

                // ۱. بررسی می‌کنیم نوع enum چیست
                if (dataToSend.enumType === 'number') {
                    // اگر number بود، به عدد تبدیل می‌کنیم
                    dataToSend.enum = dataToSend.enum.map(item => Number(item.value));
                } else {
                    // در غیر این صورت (برای string)، فقط مقدار را استخراج می‌کنیم
                    dataToSend.enum = dataToSend.enum.map(item => item.value);
                }
            }

            // اگر از enum استفاده نشده، فیلدهای اضافی را حذف می‌کنیم
            if (!dataToSend.useEnum) {
                delete dataToSend.enumType;
                delete dataToSend.enum;
            }

            console.log("Final data being sent to server:", dataToSend);

            // داده‌های تبدیل‌شده را به سرور ارسال می‌کنیم
            mutation.mutate(dataToSend);

    };

    return (
        // پیچیدن فرم با FormProvider
        <FormProvider {...methods}>
            <div className="container mx-auto p-4"> {/* اضافه کردن یک container برای بهتر شدن ظاهر */}
                <form className="max-w-lg bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)} noValidate> {/* اضافه کردن استایل‌های بیشتر به فرم */}
                    <h3 className="mb-7.5 border-b-2 w-fit pb-1.5 border-primary text-xl font-semibold text-gray-700">افزودن آپشن</h3> {/* بهبود استایل عنوان */}

                    {/* Title */}
                    <div className="mb-5"> {/* اضافه کردن div برای فاصله */}
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            عنوان آپشن
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title")}
                            className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary" // بهبود استایل input
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>} {/* بهبود استایل ارور */}
                    </div>

                    {/* Type Radio Buttons */}
                    <fieldset className="mb-5">
                        <legend className="block text-sm font-medium text-gray-700 mb-2">نوع آپشن</legend>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input type="radio" value="number" {...register("type")} className="form-radio" defaultChecked />
                                <span className="ml-1 text-gray-700">Number</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" value="string" {...register("type")} className="form-radio" />
                                <span className="ml-1 text-gray-700">String</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" value="boolean" {...register("type")} className="form-radio" />
                                <span className="ml-1 text-gray-700">Boolean</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Key / Slug */}
                    <div className="mb-5">
                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                            اسلاگ
                        </label>
                        <input
                            type="text"
                            id="key"
                            {...register("key")}
                            className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>}
                    </div>

                    {/* Guide */}
                    <div className="mb-5">
                        <label htmlFor="guide" className="block text-sm font-medium text-gray-700 mb-1">
                            توضیحات
                        </label>
                        <input
                            type="text"
                            id="guide"
                            {...register("guide")}
                            className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Required */}
                    <fieldset className="mb-5">
                        <legend className="block text-sm font-medium text-gray-700 mb-2">لازم هست</legend>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input type="radio" value="true" {...register("required")} className="form-radio" defaultChecked />
                                <span className="ml-1 text-gray-700">True</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" value="false" {...register("required")} className="form-radio" />
                                <span className="ml-1 text-gray-700">False</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Searchable */}
                    <fieldset className="mb-5">
                        <legend className="block text-sm font-medium text-gray-700 mb-2">آیا قابلیت جستجو دارد؟</legend>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input type="radio" value="true" {...register("searchable")} className="form-radio" defaultChecked />
                                <span className="ml-1 text-gray-700">True</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" value="false" {...register("searchable")} className="form-radio" />
                                <span className="ml-1 text-gray-700">False</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Category Select */}
                    <div className="mb-5">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            دسته بندی
                        </label>
                        <select
                            id="category"
                            {...register("category")}
                            key={watch("category") || "empty"}
                            className="block w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            {data?.data?.data?.result?.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.title}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    {/* Checkbox for Enum Fields */}
                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                {...register("useEnum")} // useEnum در defaultValues اضافه شده
                                className="form-checkbox h-5 w-5 text-primary rounded" // بهبود استایل چک‌باکس
                            />
                            <span className="ml-2 text-sm text-gray-700">از متغیرهای انتخابی (Enum) استفاده کنم؟</span>
                        </label>
                        {errors.useEnum && <p className="text-red-500 text-xs mt-1">{errors.useEnum.message}</p>}
                    </div>


                    {/* Conditional rendering of EnumFields */}
                    {watch("useEnum") && <EnumFields />} {/* حذف پراپ‌های register و control */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        // بهبود استایل دکمه: استایل‌های دکمه را تعریف می‌کند
                        className="w-full bg-primary text-white border-none px-6 py-2.5 rounded-md text-sm cursor-pointer hover:bg-primary-dark transition-colors duration-200"
                        disabled={mutation.isLoading} // غیرفعال کردن دکمه حین ارسال
                    >
                        {mutation.isLoading ? "در حال ایجاد..." : "ایجاد آپشن"} {/* نمایش وضعیت ارسال */}
                    </button>
                </form>
            </div>
        </FormProvider> // پایان FormProvider
    );
}