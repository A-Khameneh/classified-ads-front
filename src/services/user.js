import api from "configs/api";

const getProfile = () => api.get("user/whoami").then( res => res || false );

const getPosts = () => api.get("post/myPost");

const getAllPosts = () => api.get("");
// const getAllPosts = () => api.get("/?category=67befaac41e5b8d40b06c45d");

const getPostById = (postId) => api.get(`/post/showSinglePost/${postId}`);

const deletePost = (postId) => api.delete(`/post/deleteMyPost/${postId}`);

const searchPosts = async ({ title, page, limit }) => {
    const res = await api.get(`/search?title=${title}&page=${page}&pageLimit=${limit}`);
    return res.data;
};

export { getProfile, getPosts, getAllPosts, deletePost, getPostById, searchPosts };