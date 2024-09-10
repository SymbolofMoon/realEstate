import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from '../lib/apiRequest';
import { addNotification } from "./notificationSlice";
// import { sub } from 'date-fns';
import axios from "axios";
// import { store } from "../store/store";
import { useDispatch } from "react-redux";

// const dispatch = useDispatch();

const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter:{
        city: '',
        type: '',
        property: '',
        minPrice: null,
        maxPrice: null,
        bedroom: null
    }
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (queryParams) => {
    // const query = request.url.split("?")[1]
    const query = new URLSearchParams(queryParams).toString();
    console.log(query);
    const response = await apiRequest.get(`/post?${query}`);
    console.log(response);
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost, {dispatch}) => {
    const response = await apiRequest.post('/post', initialPost)
    
  try {
    const content = 'A Property is added by agent';
    // const res = dispatch(addNotification({content})).unwrap();
    // console.log(res);
  } catch (error) {
    console.log(error)
  }
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async ({postId, postData}) => {
   
    try {
        const response = await apiRequest.put(`/post/${postId}`, postData)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId) => {
    const response = await apiRequest.get(`/post/${postId}`);
    return response.data;
  });

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    const postId = id;
    try {
        const response = await apiRequest.delete(`/post/${postId}`)
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: { 
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        postAdded: {
            prepare(inputs, images, value) {

                const {
                    title,
                    price,
                    address,
                    city,
                    bedroom,
                    bathroom,
                    latitude,
                    longitude,
                    type,
                    property,
                    utilities,
                    pet,
                    income,
                    size,
                    school,
                    bus,
                    restaurant
                  } = inputs;
                return {
                    payload: {
                        // id: nanoid(),
                        // title,
                        // content,
                        // date: new Date().toISOString(),
                        // userId,
                        // reactions: {
                        //     thumbsUp: 0,
                        //     wow: 0,
                        //     heart: 0,
                        //     rocket: 0,
                        //     coffee: 0
                        // }

                        postData:{
                            title: title ,
                            price: parseInt(price, 10),
                            address:address,
                            city: city,
                            bedroom: parseInt(bedroom, 10),
                            bathroom: parseInt(bathroom, 10),
                            latitude: latitude,
                            longitude: longitude,
                            type: type,
                            property: property,
                            images:images,
                            img: "img"
                          },
                          postDetail: {
                            desc: value,
                            utilities: utilities,
                            pet: pet,
                            income: income,
                            size: parseInt(size),
                            school: parseInt(school),
                            bus: parseInt(bus),
                            restaurant: parseInt(restaurant),         
                          }
                    }
                }
            },
            reducer(state, action) {
                state.posts.push(action.payload)
            },
        },
        // reactionAdded(state, action) {
        //     const { postId, reaction } = action.payload
        //     const existingPost = state.posts.find(post => post.id === postId)
        //     if (existingPost) {
        //         existingPost.reactions[reaction]++
        //     }
        // }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                // const loadedPosts = action.payload.map(post => {
                //     post.date = sub(new Date(), { minutes: min++ }).toISOString();
                //     post.reactions = {
                //         thumbsUp: 0,
                //         wow: 0,
                //         heart: 0,
                //         rocket: 0,
                //         coffee: 0
                //     }
                //     return post;
                // });

                // Add any fetched posts to the array
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                // const sortedPosts = state.posts.sort((a, b) => {
                //     if (a.id > b.id) return 1
                //     if (a.id < b.id) return -1
                //     return 0
                // })
                // action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // // End fix for fake API post IDs 

                // action.payload.userId = Number(action.payload.userId)
                // action.payload.date = new Date().toISOString();
                // action.payload.reactions = {
                //     thumbsUp: 0,
                //     wow: 0,
                //     heart: 0,
                //     rocket: 0,
                //     coffee: 0
                // }
                console.log("this is action payload",action.payload)
                state.posts.push(action.payload)
            })
            .addCase(fetchPostById.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
              })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    state.error = "POST DOES NOT EXIST";
                    state.status = 'failed';
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload];
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts;
            })
    }
})

export const selectAllPosts = (state) => {
    const { posts, filter} = state.posts;
    const {
        city = '',
        minPrice = null,
        maxPrice = null,
        bedroom = 0,
        property = '',
        type = ''
      } = filter;
    console.log(filter);
    return posts.filter(post => {
        // const inPriceRange = (minPrice !== null && maxPrice !== null) 
        //     ? (post.price >= minPrice && post.price <= maxPrice) 
        //     : true;
        // // const cityFilter = (filter.city!=='')
        // //                     ? (post.city === filter.city : true)
        // return (
        //   (filter.city!=='' ? post.city === filter.city : true) &&
        // //   (filter.minPrice ? (post.date >= new Date(filter.dateRange[0]) && new Date(post.date) <= new Date(filter.dateRange[1])) : true) &&
        //   (filter.bedroom!==null ? post.bedroom>=filter.bedroom : true) &&
        //   (filter.property!=='' ? post.property === filter.property : true) &&
        //   (filter.type!=='' ? post.type === filter.type : true) &&
        //   inPriceRange
        // );
        const inPriceRange = (minPrice !== null && maxPrice !== null)
        ? (post.price >= minPrice && post.price <= maxPrice)
        : true;
  
      return (
        (city !== '' ? post.city === city : true) &&
        (bedroom !== 0 ? post.bedroom >= bedroom : true) &&
        (property !== '' ? post.property === property : true) &&
        (type !== '' ? post.type === type : true) &&
        inPriceRange
      );
      });    
};
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;



export const selectPostById = (state, postId) =>
    state.posts.posts.find(post => post.id === postId);

export const { postAdded, setFilter } = postsSlice.actions

export default postsSlice.reducer