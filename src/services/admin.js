import api from "configs/api";

const addCategory = (data) => api.post(`category/create/${data}`);

const getCategory = () => api.get("category");

const deleteCategory = (categoryId) =>
  api.delete(`category/delete/${categoryId}`);

const deletePostByAdmin = (postId) =>
  api.delete(`/post/deletPostByAdmin/${postId}`);

const setUserRole = (Role) => api.post(`/user/setUserRole`, Role);

const getAdmins = () => api.get("/user/getAdmins");

const createOption = async (form) => {
  try {
    const response = await api.post("/admin/option/create", form);
    // بهتر است که داده‌های پاسخ را برگردانید
    return response.data;
  } catch (error) {
    // خطا را در کنسول لاگ می‌گیریم و دوباره آن را پرتاب می‌کنیم
    // تا useMutation بتواند آن را در بخش onError مدیریت کند.
    console.error("API call failed in createOption:", error);
    throw error;
  }
};

const getOptions = async () => {
  try {
    const response = await api.get("/admin/option/getAll");
    return response.data; // معمولاً داده‌های اصلی در response.data قرار دارند
  } catch (error) {
    console.error("Error fetching options:", error);
    throw error;
  }
};

const deleteOption = async (optionId) => {
  // آدرس endpoint ممکن است متفاوت باشد، آن را با API خود تطبیق دهید
  return api.delete(`/admin/option/deleteOption/${optionId}`);
};

const getOptionsOfCategory = async (id) => {
  try {
    const response = await api.get(`/admin/option/getOptionsOfCategroy/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching options for category ${id}:`, error);
    throw error;
  }
};

export {
  addCategory,
  getCategory,
  deleteCategory,
  deletePostByAdmin,
  setUserRole,
  getAdmins,
  createOption,
  getOptions,
  deleteOption,
  getOptionsOfCategory,
};
