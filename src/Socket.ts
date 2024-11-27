import io from ".";

io.on('connection', (socket) => {
    console.log('a user connected ', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});