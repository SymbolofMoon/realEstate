import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const addMessage = async(req, res) => {

    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;

    try {

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })

        if(!chat) return res.status(404).json({message: "Chat not found!!!"});

        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId,
                
            }
        });

        await prisma.chat.update({
            where:{
                id: chatId,
            },
            data: {
                seenBy: [tokenUserId],
                lastMessage: text
            }
        })
        res.status(200).json(message);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to add messages"});
    }
}

export const seenMessage =  async(req, res)=>{

    const lastmsgseenbyuser = req.body.data;

    const chatId = req.params.chatId;
    const recvId = req.userId;
    const latesttxt = lastmsgseenbyuser.text;
    const sendId = lastmsgseenbyuser.senderId;

    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

    const updatedSeenBy = Array.from(new Set([...chat.seenBy, sendId, recvId]));

    try{
        const updatedchat = await prisma.chat.update({
            where:{
                id: chatId,
            },
            data: {
                seenBy:  updatedSeenBy,
                lastMessage: latesttxt
            }
        })
        console.log(updatedchat);
        res.status(200).json(updatedchat);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to add messages"});
    }


}