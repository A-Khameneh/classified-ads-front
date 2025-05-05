import api from "configs/api";

const addCategory = (data) => api.post(`category/create/${data}`);

const getCategory = () => api.get("category");

const deleteCategory = (categoryId) =>
  api.delete(`category/delete/${categoryId}`);

const deletePostByAdmin = (postId) =>
  api.delete(`/post/deletPostByAdmin/${postId}`);

const setUserRole = (Role) => api.post(`/user/setUserRole`, Role);

const getAdmins = () => api.get("/user/getAdmins");

const createOption = (form) => api.post("/admin/option/create", form);

export {
  addCategory,
  getCategory,
  deleteCategory,
  deletePostByAdmin,
  setUserRole,
  getAdmins,
  createOption,
};
