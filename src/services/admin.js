import api from "configs/api";

const addCategory = data => api.post(`category/create/${data}`);

const getCategory = () => api.get("category");

const deleteCategory = categoryId => api.delete(`category/delete/${categoryId}`)

const deletePostByAdmin = postId => api.delete(`/post/deletPostByAdmin/${postId}`);

export { addCategory, getCategory, deleteCategory, deletePostByAdmin };