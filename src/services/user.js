import api from "configs/api";

const getProfile = () => api.get("user/whoami").then( res => res || false );

const getPosts = () => api.get("post/myPost");

const getAllPosts = () => api.get("");

const getPostById = (postId) => api.get(`/post/showSinglePost/${postId}`);

const deletePost = (postId) => api.delete(`/post/deleteMyPost/${postId}`);

export { getProfile, getPosts, getAllPosts, deletePost, getPostById };