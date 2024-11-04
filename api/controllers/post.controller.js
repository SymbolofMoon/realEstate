import { idText } from "typescript";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { addNotification } from "./user.controller.js";
import { onlineUser } from "../app.js";
import { io, socketIdfromuserId } from "../app.js";

export const getPosts = async(req, res) => {

    const query = req.query;
    console.log("this is query", query);

    try {
        const posts = await prisma.post.findMany(
            {
                where: {
                    city: query.city || undefined,
                    type: query.type || undefined,
                    property: query.property || undefined,
                    bedroom: parseInt(query.bedroom) || undefined,
                    price:{
                        gte: parseInt(query.minPrice) || 0,
                        lte: parseInt(query.maxPrice) || 1000000000
                    }
                }
            }
        ); 
        console.log("getPosts is called");
        res.status(200).json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Posts"});
    }
}


export const getPost = async(req, res) => {
    const postId = req.params.postId;
    
    try {

        const post = await prisma.post.findUnique({
            where: {
                id:postId
            },
            include: {
                postDetail: true,
                user: {
                    select:{
                        username: true,
                        avatar: true
                    }
                },
                comments: {
                    include: {
                      user: { // Fetch the user associated with each comment
                        select: {
                          username: true, // Select only the username field
                          avatar: true
                        },
                      },
                    },
                },
            }
        });

        const token = req.cookies?.token;
       
        let userId;

        if(!token){
            userId = null;
        }else{
            jwt.verify(token, "R7t7A=75t485tcehfru", async(err, payload) => {
                if(err){
                    userId = null;
                }else{
                    userId = payload.id;
                }
            } )
        }
        let saved = null;
        if (token){
            saved = await prisma.savedPost.findUnique({
                where:{
                    userId_postId: {
                        postId: postId,
                        userId: userId
                    },
                }
            })
    
        }

        let liked = null
        if (token){
            try {
                liked = await prisma.like.findUnique({
                    where: {
                        userId_postId: {
                            postId: postId,
                            userId: userId
                        },
                    }
                })
            } catch (error) {
                liked = null;
                console.log(error);
            }
        }

        // let comment = [];
        // if (token){
        //     try {
        //         comment = await prisma.comment.findMany({
        //             where: {
        //                     postId: postId,
        //             },
           
        //         })
        //     } catch (error) {
        //         comment = [];
        //         console.log(error);
        //     }
        // }
       return  res.status(200).json({...post, isSaved: saved? true: false, isLiked: liked?true:false});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Post"});
    }
}

export const addPost = async(req, res) => {

    const body = req.body;
    const tokenUserId = req.userId;
    console.log(body);

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                // userId: tokenUserId,
                user:{
                    connect: {
                        id: tokenUserId
                    }
                },
                postDetail: {
                    create: body.postDetail,
                }
                
            },
            include: {
                user: {
                    select:{
                        username: true,
                    }
                }
            }
        });


        try{
        

            const content = `${newPost?.user?.username} added a new Property`;
            console.log(content);

            const newNotification =  await prisma.notification.create({
                data: {
                    content_of_notification:content,
                    userId: tokenUserId
                }
            });

            console.log(newNotification);
            const notification = {
                createdAt: newNotification.createdAt,
                content: newNotification.content_of_notification,
                sendBy: newNotification.userId,
                id: newNotification.id
            }

            const subscribers = await prisma.publisherandSubscribers.findMany({
                where: {
                    publisherId: tokenUserId
                }
            });
            console.log(subscribers);
            console.log(onlineUser);

            for(const subscriber of subscribers){

                const subscriberId = subscriber.subscriberId;
                const socketId = socketIdfromuserId(subscriberId);
                console.log(socketId);

                const x = io.to(socketId).emit('sendNotification', notification );
                console.log(x);

            }
            
            
        }catch(error){
            console.log(error)
        }

        
        res.status(200).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Add Post"});
    }
}

export const updatePost = async(req, res) => {
    try {
        
        const postId = req.params.postId;
        const tokenUserId =  req.userId;
        const body = req.body;
     

        const updatePost = await prisma.post.update({
            where: { 
                id:postId 
            },
            data: {
                ...body.postData,
                postDetail: {
                    update: body.postDetail,
                }
            }
        }); 
        console.log("this is for updated body for post",updatePost);
        

        res.status(200).json(updatePost);



    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Update Post"});
    }
}

export const deletePost = async(req, res) => {

    const postId = req.params.postId;
    console.log("deletepost id is",postId);
    // const tokenUserId = req.userId;
    try {

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })
        console.log(post);

        // if(post.userId !== tokenUserId){
        //     return res.status(403).json({message: "Not AUthorized!!!"});
        // }

        await prisma.postDetail.delete({
            where: {
                postId: post.id
            }
        })

        await prisma.post.delete({
            where: {
                id: postId
            }
        })

        res.status(200).json({message: "Post Deleted successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Delete Post"});
    }
}

export const likePost = async(req, res) => {

    const postId = req.body.postId;
    const tokenUserId = req.userId;
    try {
        
        const LikeonPost = await prisma.like.findUnique({
            where: {
                
                userId_postId: {
                    userId: tokenUserId,
                    postId: postId,
                },
            }
        })

        if(LikeonPost){
            console.log("a");
            const latestpost = await prisma.post.update({
                where:{
                    id:postId,
                }, 
                data: {
                    likeCount: {
                        decrement: 1,
                    },
                }
                
            })
            await prisma.like.delete({
                where: {
                    id: LikeonPost.id
                }
            })
            
            res.status(200).send(latestpost);
            return
        }else{
            const latestpost = await prisma.post.update({
                where:{
                    id:postId,
                }, 
                data: {
                    likeCount: {
                        increment: 1,
                    },
                }
                
            })
            // console.log(latestpost.likeCount);
            await prisma.like.create({
                data: {
                    userId: tokenUserId,
                    postId
                }
            })
             res.status(200).send(latestpost);
             return;
        }   

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Like Post"});
    }
}

export const createCommentonPost = async(req, res)=> {

    

    try{

    const postId = req.body.postId;
    const userId = req.userId;
    const content = req.body.content;
    const newComment = await prisma.comment.create({
                data: {
                    content,
                    userId,
                    postId
                }
    });

    res.status(200).send(newComment);
}catch(error){
        console.log(error);
        res.status(500).send({ error: 'Failed to Create Comment' });
}
}