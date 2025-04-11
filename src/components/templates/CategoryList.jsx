
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategory, deleteCategory } from "services/admin";
import Loader from "components/modules/Loader";
import Modal from "components/modules/Modal";

export default function CategoryList() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery(["get-categories"], getCategory);

    const deleteCategoryMutation = useMutation(deleteCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries(["get-categories"]);
            setShowDeleteModal(false);
        },
    });

    const handleDeleteClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedCategoryId) {
            deleteCategoryMutation.mutate(selectedCategoryId);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedCategoryId(null);
    };

    return <div className="mt-[50px] mb-[70px]">
        {isLoading ? <Loader /> :
            data?.data?.data?.result.map(i => (
                <div key={i._id} className="flex my-5 mx-0 p-4 border-2 gap-3 border-gray-300 rounded-md items-center">
                    <img src={`${i.icon}.svg`} alt={i.name} />
                    <h5 className="mr-2.5 text-sm w-[120px]">{i.title}</h5>
                    <p className="w-full text-left text-[#a62626]">slug: {i.slug}</p>
                    <button 
                        onClick={() => handleDeleteClick(i._id)}
                        className="bg-primary hover:bg-red-600 hover:cursor-pointer text-white px-10 py-1 rounded-md text-sm"
                    >
                        حذف
                    </button>
                </div>
            ))
        }

        {showDeleteModal && (
            <Modal onClose={cancelDelete}>
                <div className="p-6 text-center">
                    {deleteCategoryMutation.isLoading ? 
                        <p className="flex justify-center">در حال حذف ...</p> :
                        <>
                            <h3 className="mb-5 text-lg font-normal">آیا از حذف این دسته‌بندی اطمینان دارید؟</h3>
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
                    }
                </div>
            </Modal>
        )}
    </div>;
}
