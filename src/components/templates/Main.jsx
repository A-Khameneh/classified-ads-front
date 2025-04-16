
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from 'components/modules/Modal';
import fallbackImage from '../../../public/image-fallback.jpg';
import { getProfile } from 'src/services/user';
import { deletePostByAdmin } from 'src/services/admin';
import { sp } from 'src/utils/numbers';
import { Link } from 'react-router-dom';

export default function Main({ posts }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const queryClient = useQueryClient();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const fallbackImageUrl = fallbackImage;

    const { data } = useQuery(["profile"], getProfile)

    const deletePostMutation = useMutation(deletePostByAdmin, {
        onSuccess: () => {
            queryClient.invalidateQueries(["post-list"]);
            setShowDeleteModal(false);
            console.log("Hi");
        },
    });

    const handleDeleteClick = (e, postId) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedPostId(postId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedPostId) {
            deletePostMutation.mutate(selectedPostId);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedPostId(null);
    };

    return (
        <div className="mt-5 flex flex-wrap justify-start gap-5 w-[calc(100%-200px)] items-start">
            {posts?.data?.data?.posts?.map(post => (
                <Link
                    to={`/post-detail/${post._id}`}
                    key={post._id}
                    className="w-[330px] flex justify-between border border-gray-300 my-2 mx-0 p-4 rounded-md hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col justify-between">
                        <p className="text-base">{post?.title}</p>
                        <div className="text-gray-500 text-sm">
                            <p>{sp(post?.price)} تومان</p>
                            <span>{post?.city}</span>
                        </div>

                        {data?.data?.Role === "ADMIN" && (
                            <button
                                onClick={(e) => handleDeleteClick(e, post._id)}
                                className="bg-primary hover:bg-red-600 hover:cursor-pointer text-white px-3 py-1 mt-2 rounded-md text-sm"
                            >
                                حذف
                            </button>
                        )}
                    </div>

                    <img
                        src={!("mainImage" in post) ? fallbackImageUrl : `${baseURL}${post?.mainImage}`}
                        className="w-[150px] h-[130px] rounded-md ml-0.5"
                        alt={post?.title || "تصویر آگهی"}
                    />
                </Link>
            ))}

            {showDeleteModal && (
                <Modal onClose={cancelDelete}>
                    <div className="p-6 text-center">
                        {deletePostMutation.isLoading ? (
                            <p className="flex justify-center">در حال حذف ...</p>
                        ) : (
                            <>
                                <h3 className="mb-5 text-lg font-normal">آیا از حذف این آگهی اطمینان دارید؟</h3>
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
