const express = require('express')
const app = express()
const connectCounter = 0
const http = require('http').Server(app)
const io = require('socket.io')(http)



app.use('/static', express.static(__dirname + '/main.css'))
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))



io.on('connection', (socket) => {
		let clientCount = io.engine.clientsCount;
		io.sockets.emit("userCount", clientCount);

		socket.on('joinOperatorsRoom', (name, accessRights) => {
			socket.username = name;
			socket.accessRights = accessRights;
			socket.join('OperatorsRoom')
			socket.broadcast.emit('message', {
				'user': 'Сервер', 'message': ( socket.username != '' ? 'Оператор ' + socket.username : 'Неизвестный оператор') + ' присоединился к чату.'
			})
		}),

			socket.on('joinUsersRoom', (name, accessRights) => {
				socket.username = name;
				socket.accessRights = accessRights;
				socket.join('UsersRoom')
				socket.broadcast.emit('message', {
					'user': 'Сервер', 'message': ( socket.username != '' ? 'Пользователь ' + socket.username : 'Анонимный пользователь') + ' присоединился к чату.'
				})
			}),

		socket.on('message', (msg) => io.in('UsersRoom').in('OperatorsRoom').emit('message', {
			'user': (socket.username == '' ? 'Аноним' : socket.username), 'message': msg
			})
		)
})

io.on("disconnect", () => {
    io.sockets.emit("userCount", clientCount);
  });

http.listen(3000, () => console.log('Listening to the port 3000'))
