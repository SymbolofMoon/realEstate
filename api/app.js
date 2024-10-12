import express from "express";
import cors from "cors";
import config from './config/config.js';
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import { Server } from "socket.io";
import http from "http";


const app = express();


app.use(cors({origin: "http://localhost:5173", credentials:true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

const server = http.createServer(app);

// Initialize Socket.io and bind it to the HTTP server
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

export let onlineUser = []

const addUser = (userId, socketId) => {
    let userExist =  onlineUser.find((user) => user.userId===userId);
    console.log("this function is called");
    if(userExist){
        onlineUser =  onlineUser.filter((user) => user.userId !== userId);
        userExist = null;
    }
    if(!userExist){
        onlineUser.push({userId, socketId})
    }
}

export const socketIdfromuserId = (userId) => {
    const user =  onlineUser.find((user) => user.userId===userId);
    return user ? user.socketId : null;
}

export const removeUser = (socketId) => {
    onlineUser =  onlineUser.filter((user) => user.socketId !== socketId);
}

io.on("connection", (socket)=> {
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id)
    });

    socket.on("sendMessage", ({ receiverId, data}) => {
        console.log("this is data", data);
        console.log("this is socket id",  socket.id);

        console.log(onlineUser);

        const sid = socketIdfromuserId(receiverId);
        console.log(sid);
//njkj
        io.to(sid).emit('receiveMessage', data);

    })

    socket.on("disconnection", (userId)=>{
        console.log("disconnection is called");
        removeUser(socket.id);
    })
})


server.listen(config.port, ()=> {
    console.log("Server is running!!!");
})