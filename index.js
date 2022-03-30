import { Server } from "socket.io";

const io = new Server({
    // cors: {
    //     origin: "http://localhost:19000"
    // }
});

// let onlineUsers = [];

const addNewUser = (userName, position, socketId) => {
    !onlineUsers.some((user) => user.userName === userName) &&
        onlineUsers.push({ userName, position, socketId })
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => {
        return user.socketId !== socketId
    })
}
// onlineUsers.forEach((user) => {
//     // console.log(user.userName)
//     if (user.position === 2)
//         io.to(user.socketId).emit("getNotification", "thong bao ne")
// })


io.on("connection", (socket) => {
    console.log("co nguoi ket noi")
    socket.on("newUser", async ({ user, position }) => {
        if (position === 1)
            socket.join("waiter");
        else if (position === 2)
            socket.join("chef");
        else
            socket.join("shipper");
    })

    socket.on("sendNotification", ({ senderName }) => {
        io.to("chef").emit("getNotification", "thong bao ne")

    })

    socket.on("disconnect", () => {
        console.log("co nguoi ngat ket noi")
    })

});

io.listen(5000);