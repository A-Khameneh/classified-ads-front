import api from "configs/api";

const addCategory = data => api.post("category/create", data);

const getCategory = () => api.get("category");

const deleteCategory = categoryId => api.delete("category/delete", categoryId)

export { addCategory, getCategory, deleteCategory };