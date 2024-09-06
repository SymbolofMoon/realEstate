import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getChats = async(req, res) => {

    const tokenUserId = req.userId;
    

    try {

        const chats = await prisma.chat.findMany({
            where: {
                userIDs:{
                    hasSome: [tokenUserId],
                }           
            }
        });

        let i=1;

        for(const chat of chats){
            const receiverId = chat.userIDs.find((id) => id!== tokenUserId);
            if(receiverId==undefined){
                chat.receiver = null;
                continue;
            }
           

            const receiver = await prisma.user.findUnique({
                where: {
                    id: receiverId,
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }

            });

            chat.receiver = receiver;
        }

        chats.filter((chat) => chat.receiver!==null)
        res.status(200).json(chats);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Chats"});
    }
}

export const addChat = async(req, res) => {

    const tokenUserId = req.userId;
    console.log(req.body.receiverId);
    const receiverId = req.body.receiverId;
    

    try {

        const newChat = await prisma.chat.create({
            data:{
                userIDs: [tokenUserId, receiverId]
            }
        })
        console.log(newChat, req.body);

        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId,
            },
            select: {
                id: true,
                username: true,
                avatar: true
            }

        });

        newChat.receiver = receiver;
        res.status(200).json(newChat);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get Chats"});
    }
}

export const getChat = async(req, res) => {
    
    const tokenUserId = req.userId;
    console.log("Chat is called");

    console.log(tokenUserId);
    try {

        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
        await prisma.chat.update({
            where: {
                id: req.params.chatId
            },
            data: {
                seenBy: {
                    set: [tokenUserId]
                }
            }
        })
        res.status(200).json(chat);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Chat"});
    }
}

export const getPeopleChat = async(req,res) =>{
    const tokenUserId = req.userId;

    const receiverID = req.params.id;

    try {

        const chat =  await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasEvery: [tokenUserId, receiverID]
                }
            }
        });

        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverID,
            },
            select: {
                id: true,
                username: true,
                avatar: true
            }

        });

        chat.receiver = receiver;

        res.status(200).json(chat);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Chat"});
    }
}

export const readChat = async(req, res) => {
    const tokenUserId = req.userId;

    try {

        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },
            data: {
                seenBy: {
                    set: [tokenUserId],
                }
            }
        });

        console.log("this function is called");

        res.status(200).json(chat);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Get Chat"});
    }
}

export const deleteChat = async(req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;
    console.log(tokenUserId);
    try {

        const chat = await prisma.chat.findUnique({
            where: {id}
        });

        if(!chat){
            res.status(404).json({message: "Chat Not Found"});
            return;
        }

        let exist = chat.userIDs.includes(tokenUserId);
        if(exist==false){
            res.status(403).json({message: "Not Authenticated"});
        }


        await prisma.chat.delete({
            where: {id}
        })

        res.status(200).json({message: "Chat Deleted successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to Delete Post"});
    }
}