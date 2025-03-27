import api from "configs/api";

const getProfile = () => api.get("user/whoami").then( res => res || false );

const getPosts = () => api.get("post/myPost");

const getAllPosts = () => api.get("");

const deletePost = console.log("deletePost");
// const deletePost = (postId) => api.delete(`post/${postId}`);

export { getProfile, getPosts, getAllPosts, deletePost };