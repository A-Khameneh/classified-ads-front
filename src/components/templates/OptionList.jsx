// فایل: components/OptionList.jsx

import { useState } from "react"; // ۱. ایمپورت کردن useState
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOptions, deleteOption } from "services/admin";
import Modal from "components/modules/Modal"; // ۲. ایمپورت کردن مودال
import Loader from "components/modules/Loader"; // برای نمایش لودینگ حذف

export default function OptionList() {
    // ۳. اضافه کردن state برای مدیریت مودال و آپشن انتخاب‌شده
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["get-all-options"],
        queryFn: getOptions,
    });

    // ۴. اضافه کردن useMutation برای حذف آپشن
    const deleteOptionMutation = useMutation({
        mutationFn: deleteOption,
        onSuccess: () => {
            queryClient.invalidateQueries(["get-all-options"]);
            setShowDeleteModal(false); // بستن مودال بعد از حذف موفق
        },
    });

    // ۵. اضافه کردن توابع مدیریت رویدادها
    const handleDeleteClick = (optionId) => {
        setSelectedOptionId(optionId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedOptionId) {
            deleteOptionMutation.mutate(selectedOptionId);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedOptionId(null);
    };

    if (isLoading) return <div className="p-4">در حال بارگذاری لیست آپشن‌ها...</div>;
    if (isError) return <div className="p-4 text-red-500">خطایی رخ داد: {error.message}</div>;

    const options = data?.data?.options || [];
    const groupedOptions = options.reduce((acc, option) => {
        const categoryKey = option.category?.slug || "بدون دسته‌بندی";
        if (!acc[categoryKey]) acc[categoryKey] = [];
        acc[categoryKey].push(option);
        return acc;
    }, {});

    return (
        <div className="container ml-auto w-full lg:w-1/2 p-4">
            <h3 className="mb-7.5 text-xl font-semibold text-gray-700">لیست آپشن‌ها</h3>
            {Object.keys(groupedOptions).length > 0 ? (
                <div className="space-y-6">
                    {Object.keys(groupedOptions).map(categoryKey => (
                        <div key={categoryKey}>
                            <h4 className="text-lg font-semibold text-primary capitalize border-b-2 border-primary pb-2 mb-3">
                                {categoryKey}
                            </h4>
                            <ul className="space-y-2 pl-4">
                                {groupedOptions[categoryKey].map(option => (
                                    <li
                                        key={option._id}
                                        // ✅ این کلاس‌ها استایل را درست می‌کنند
                                        className="flex justify-between items-center p-3 bg-white border rounded-md shadow-sm"
                                    >
                                        <span className="text-gray-800">
                                            {option.title} <span className="text-sm text-gray-500">({option.key})</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(option._id)}
                                            className="text-red-500 hover:text-red-700 text-xl font-bold"
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>هیچ آپشنی برای نمایش وجود ندارد.</p>
            )}

            {/* ۷. اضافه کردن JSX مودال */}
            {showDeleteModal && (
                <Modal onClose={cancelDelete}>
                    <div className="p-6 text-center">
                        {deleteOptionMutation.isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <h3 className="mb-5 text-lg font-normal">آیا از حذف این آپشن اطمینان دارید؟</h3>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={confirmDelete}
                                        className="bg-primary hover:bg-red-600 hover:cursor-pointer text-white px-5 py-2 rounded-md"
                                    >
                                        بله، حذف شود
                                    </button>
                                    <button
                                        onClick={cancelDelete}
                                        className="bg-gray-300 hover:bg-gray-400 hover:cursor-pointer px-5 py-2 rounded-md"
                                    >
                                        انصراف
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}