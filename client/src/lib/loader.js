import apiRequest from "./apiRequest";
import { defer } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchPosts } from "../slice/postSlice";

export const singlePageLoader = async ({ request, params}) => {
    const res = await apiRequest("/post/"+params.id);
    return res.data;
}

// export const listPageLoader = async({ request, params}) => {
//     const dispatch = useDispatch();

//     dispatch(fetchPosts());
//     return defer({
//         postResponse: fetchPosts()
//     }) 
// }

export const agentlistPageLoader = async({ request, params}) => {
    const query = request.url.split("?")[1]
    const agentPromise = await apiRequest("/user/agents?"+query);
    const chatPromise = await apiRequest("/chat");
    console.log(agentPromise);
    return defer({
        agentResponse: agentPromise,
        chatResponse: chatPromise
    }) 
}

export const customerprofilePageLoader = async({ request, params}) => {
    const postPromise = await apiRequest("/user/profilePosts");
    const chatPromise = await apiRequest("/chat");
    console.log(postPromise);
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise
    }) 
}

export const agentprofilePageLoader = async({ request, params}) => {
    const postPromise = await apiRequest("/user/profilePosts");
    const chatPromise = await apiRequest("/chat");
    console.log(postPromise);
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise
    }) 
}