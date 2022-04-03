import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:8080"
    }
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
    socket.on("newUser", async ({ position }) => {
        if (position === 1)
            socket.join("waiter");
        else if (position === 2)
            socket.join("chef");
        else
            socket.join("shipper");
    })

    socket.on("sendNotificationAddOrder", ({ senderName, table }) => {
        io.to("chef").emit("getNotificationAddOrder", senderName + " đã lập hóa đơn cho " + table)
    })

    socket.on("sendNotificationUpdate", ({ senderName, table, act }) => {
        if (act === 1) {
            io.to("chef").to("waiter").emit("getNotificationUpdate", { message: senderName + " đã xác nhận hóa đơn " + table, type: "success" })
        }
        else if (act === 2) {
            io.to("chef").to("waiter").emit("getNotificationUpdate", { message: senderName + " đã huỷ hóa đơn " + table, type: "danger" })
        }
    })

    socket.on("sendNotificationWaiterUpdate", ({ senderName, table, act }) => {
        if (act === 1) {
            io.to("chef").to("waiter").emit("getNotificationWaiterUpdate", { message: senderName + " đã cập nhật hóa đơn " + table, type: "normal" })
        }
        else if (act === 2) {
            io.to("chef").to("waiter").emit("getNotificationWaiterUpdate", { message: senderName + " đã huỷ hóa đơn " + table, type: "danger" })
        }
    })

    socket.on("sendNotificationChefNote", ({ senderName, table }) => {
        io.to("waiter").emit("getNotificationChefNote", "Thông báo mới từ " + senderName + " về " + table )
    })

    socket.on("sendNotificationChefCompleteOrder", ({ senderName, table }) => {
        io.to("waiter").to("chef").emit("getNotificationChefCompleteOrder", senderName + " đã hoàn thành món " +table )
    })

    socket.on("sendNotificationWaiterCompleteOrder", ({ senderName, table }) => {
        io.to("waiter").to("chef").emit("getNotificationWaiterCompleteOrder", senderName + " đã hoàn thành món " +table )
    })

    socket.on("sendNotificationWaiterCompletePayOrder", ({ senderName, table }) => {
        io.to("waiter").to("chef").emit("getNotificationWaiterCompletePayOrder", senderName + " đã hoàn thành hóa đơn " +table )
    })

    socket.on("sendNotificationBookShip", () => {
        io.to("waiter").emit("getNotificationBookShip", "Khách hàng đặt lịch mới" )
    })


    socket.on('forceDisconnect', function(){
        console.log("co nguoi ngat ket noi")
        socket.disconnect();
    });

});

io.listen(5000);