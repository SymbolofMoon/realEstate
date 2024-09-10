import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { onlineUser } from "../app.js";

export const getUsers = async(req, res) => {
    try {

        const users = await prisma.user.findMany();
        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Users"});
    }
}

export const getAgentUsers = async(req, res) => {
    console.log(req.userId);
    console.log(onlineUser);
    try {

        const query = req.query;
        console.log("this is query", query);

        const users = await prisma.user.findMany({
            where:{
                role: 'agent',
                username: query.username || undefined,
            },
            include:{
                publisher:{
                    where:{
                        subscriberId:req.userId
                    }
                }
            }
        });

        // for(const user of users){
        //     console.log(user);
        // }

        const safeuser = users.map(({ password, ...user }) => user)

        // console.log(safeuser);
        // const relation = await prisma.publisherandSubscribers.findMany({
        //     where:{
        //         subscriberId: req.userId
        //     }
        // })
        
        
        res.status(200).json(safeuser);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Agent Users"});
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

        // console.log("this is chatnumber", chatsnumber);
        res.status(200).json(chatsnumber);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get number of notifications"});
    }
}

export const addSubscriber = async(req, res) => {

    const publisherId = req.body.publisherId; //Agent
    const subscriberId = req.userId;  //Customer
    

    try {        
        const relationPublisherandSubscriber = await prisma.publisherandSubscribers.findUnique({
            where: {
                publisherId_subscriberId: {
                    publisherId,
                    subscriberId,
                },
            }
        })
        console.log(relationPublisherandSubscriber);
        if(relationPublisherandSubscriber){
            await prisma.publisherandSubscribers.delete({
                where: {
                    id: relationPublisherandSubscriber.id
                }
            })
            res.status(200).json({message:"Customer unsubscribe the Agent"});
            return
        }else{
            await prisma.publisherandSubscribers.create({
                data: {
                    publisherId,
                    subscriberId,
                }
            })
             res.status(200).json({message:"Customer subscribe the Agent"});
             return;
        }
       

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Save Post"});
    }
}

export const getAllPublisherandSubscriberRelations = async(req, res) => {
    try {

        const PublisherandSubscriberRelations = await prisma.publisherandSubscribers.findMany();
        res.status(200).json(PublisherandSubscriberRelations);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Users"});
    }
}

export const addNotification = async(req, res) => {
    try {
        
        const userId = req.userId;
        const content =  req.body.content;

        const newNotification =  await prisma.notification.create({
                data: {
                    content_of_notification:content,
                    userId
                }
        });

        res.status(200).send(newNotification);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to create notification' });
    }
}

export const fetchNotifications =  async(req, res)=>{
    const tokenUserId =  req.userId;


    try {

        const publishers = await prisma.publisherandSubscribers.findMany({
            where: {
                subscriberId: tokenUserId
            }
        })

        const notifications = []

        for(const publisher of publishers){
            console.log(publisher.publisherId);
            
            const notification =  await prisma.notification.findMany({
                where:{
                    userId:publisher.publisherId,
                    NOT: {
                        readBy: {
                            hasSome:[tokenUserId]
                        }
                        
                    }
                }
            });


            console.log("notification is",notification)
            if(notification.length!=0){
                for(const data of notification){
                    notifications.push(data);
                }
            }
        }


        res.status(200).send(notifications);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to fetch notifications' });
    }
}

export const readNotification =  async(req, res)=>{
    const tokenUserId =  req.userId;

    const notificationId = req.params.notificationId;

    try {

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { readBy: true }, 
          });

        const updatedReadBy = notification.readBy.includes(tokenUserId)
                                ? notification.readBy
                                : [...notification.readBy, tokenUserId];
          
        const updatedNotification = await prisma.notification.update({
              where: { id: notificationId },
              data: { readBy: updatedReadBy },
            });

        res.status(200).send(updatedNotification);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to fetch notifications' });
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