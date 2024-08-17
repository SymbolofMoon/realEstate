import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    }
});

const onlineUser = []

const addUser = (userId, socketId) => {
    const userExist =  onlineUser.find((user) => user.userId===userId);
    if(!userExist){
        onlineUser.push({userId, socketId})
    }
}

const removeUser = (socketId) => {
    onlineUser =  onlineUser.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId);
}

io.on("connection", (socket)=> {
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id)
    });

    socket.on("sendMessage", ({ receiverId, data}) => {
        console.log(receiverId);
    })

    socket.on("disconnection", (userId)=>{
        removeUser(socket.id);
    })
})

io.listen("4000");