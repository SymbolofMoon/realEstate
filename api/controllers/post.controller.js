import { idText } from "typescript";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";


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

        

   
     
        console.log(posts);
        res.status(200).json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Posts"});
    }
}

export const getPost = async(req, res) => {
    const id = req.params.id;
    try {

        const post = await prisma.post.findUnique({
            where: {id},
            include: {
                postDetail: true,
                user: {
                    select:{
                        username: true,
                        avatar: true
                    }
                }
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
                        postId: id,
                        userId: userId
                    },
                }
            })
    
        }
    
        
       return  res.status(200).json({...post, isSaved: saved? true: false});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Post"});
    }
}

export const addPost = async(req, res) => {

    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                }
            }
        });

        res.status(200).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Add Post"});
    }
}

export const updatePost = async(req, res) => {
    try {
        
        const postId = req.params.id;
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

    const id = req.params.id;
    const tokenUserId = req.userId;
    try {

        const post = await prisma.post.findUnique({
            where: {id}
        })

        if(post.userId !== tokenUserId){
            return res.status(403).json({message: "Not AUthorized!!!"});
        }

        await prisma.postDetail.delete({
            where: {
                postId: post.id
            }
        })

        await prisma.post.delete({
            where: {id}
        })

        res.status(200).json({message: "Post Deleted successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Delete Post"});
    }
}