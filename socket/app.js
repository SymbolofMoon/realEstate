import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    }
});

let onlineUser = []

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

const socketIdfromuserId = (userId) => {
    const user =  onlineUser.find((user) => user.userId===userId);

    

    return user ? user.socketId : null;
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

io.listen("4000");