import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async(req, res) => {
    try {

        const users = await prisma.user.findMany();
        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Users"});
    }
}

export const getUser = async(req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id!==tokenUserId){
        return res.status(403).json({ message: "Not Authorized!!!!"});
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id}
        });

        res.status(200).json(user);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get User"});
    }
}

export const updateUser = async(req, res) => {

    
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if(id!==tokenUserId){
        return res.status(403).json({ message: "Not Authorized"});
    }

    let updatedPassword = null;

    try {
        if(password){
            updatedPassword = await bcrypt.hash(password, 10);
        }



        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && {avatar})
            }
        }); 

        const { password: userPassword, ...restData} = updateUser

        res.status(200).json(restData);


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to update User"});
    }
}

export const deleteUser = async(req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id!== tokenUserId){
        return res.status(403).json({ message: "Not Authorized"});
    }

    try {
        await prisma.user.delete({
            where:{id}
        })

        res.status(200).json({message:"User Deleted"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to delete User"});
    }
}

export const savePost = async(req, res) => {

    const postId = req.body.postId;
    const tokenUserId = req.userId;



    try {
        
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            }
        })

        if(savedPost){
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id
                }
            })
            res.status(200).json({message:"Post removed from Saved List"});
            return
        }else{
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId
                }
            })
             res.status(200).json({message:"Post Saved"});
             return;
        }
       

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Save Post"});
    }
}

export const profilePosts = async(req, res) => {

    const tokenUserId = req.userId;
    console.log("this is tokenuser id from profile post",tokenUserId);


    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId }
        })
        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true
            }
        })

        const savedPosts = saved.map((item) => item.post);

        res.status(200).json({savedPosts});
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get profile posts"});
    }
}


export const getNotificationNumber = async(req, res) => {

    const tokenUserId = req.userId;


    try {
        const chatsnumber = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                },
                NOT:{
                    seenBy:{
                        hasSome: [tokenUserId]
                    }
                }
            }
        })

        console.log("this is chatnumber", chatsnumber);
        res.status(200).json(chatsnumber);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get number of notifications"});
    }
}

// export const addCity = async(req, res) => {

//     const body = req.body;
    

//     try {
//         const newCity = await prisma.city.create({
//             data: {
//                 city_name:body.city_name
//             }
//         });

//         res.status(200).json(newCity);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: "Failed to Add City"});
//     }
// }

// export const getCities = async(req, res) => {
//     try {
//         const cities = await prisma.city.findMany();
        

//         console.log(cities);
//         res.status(200).json(cities);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: "Failed to Get Cities"});
//     }
// }