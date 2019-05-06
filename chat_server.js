//Based on code from the class wiki: https://classes.engineering.wustl.edu/cse330/index.php?title=Socket.IO

// Require the packages we will use:
var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");
	users= require('./users.js');
	rooms= require('./rooms.js');


// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
var app = http.createServer(function(req, resp){
	// This callback runs when a new connection is made to our HTTP server.
	
	fs.readFile("index.html", function(err, data){
		// This callback runs when the client.html file has been read from the filesystem.
		
		if(err) return resp.writeHead(500);
		resp.writeHead(200);
		resp.end(data);
	});
});
app.listen(3456);


var io = socketio.listen(app);

//A Function for processing messages
var message= function(sender, message){
	return{
		sender,
		message,
		createdAt: new Date().getTime()
	};
};
//Make a namespace so we can have multiple chat rooms at once.
var chat_room= io.of('/chat_room');
var current_room = "";
var current_username = "";

chat_room.on("connection", function(socket){
	console.log("current room: "+current_room);
	//Set the current user to whoever just logged in
	socket.on('user_joined',function(data){
		users.setUser(data["username"], socket.id);
		current_username = data["username"];

		console.log('The current User is now: '+data["username"]);
	})
	;
	//Recive a message from the client side
	socket.on('message_to_server', function(data) {
		// This callback runs when the server receives a new message from the client.
		
		console.log("message: "+data['text']); 
		var current_user=users.getUser(socket.id);
		if (current_user){
			//spit out that message to the chat room
			current_room = data["room"];
			console.log("this is the current user "+current_user.username + "current room "+current_room);
			chat_room.in(current_room).emit('message_to_client', {username:current_user.username, message:data['text']});
			
		}
	});
	
	
	//User leaves the chat
	socket.on('disconnect', function(){ 
		console.log('A user has left the chat room');
		var current_user=users.dropUser(socket.id);
		if (current_user){
			var mesg= current_user.username+ " has left."
			chat_room.in(current_room).emit("message_to_client", {message:mesg });
			chat_room.in(current_room).emit('update_users', users.usersInRoom(current_user.room));

			//rest current room
			current_room = "";
		}
	});

	//joining chat
	socket.on("join_room", function(data){
		var roomname = data["roomname"];
		var room = rooms.getRoom(roomname);
		if(room.length <= 0){
			socket.emit("did_not_join");
			console.log("room not found on server");
		}
		console.log("room info: name "+room.room_name+" public "+room.public);
		
		//Join the requested chat room
		if (rooms.banCheck(current_username, roomname) || rooms.kickCheck(current_username, roomname)){}
		else{
			socket.leave(current_room);
			socket.join(roomname);
			current_room = roomname;
			chat_room.in(roomname).emit("joined_room", {room: roomname, username: current_username});
		}
	});
	//creating a new chat room
	socket.on('new_room', function(data){
		var roomname = data['roomname'];
		var public = data['public'];
		var creator = users.getUser(socket.id).username;
		console.log('Room on server '+roomname+" & current user "+creator);
		
		if(rooms.nameCheck(roomname)){
			//Check to see if the room is private or public
			if(!public){
				//Check to see if that room has already been made
				if(users.usersInRoom(roomname).length >2){
					//Get the Client given password
					socket.emit('getPassword');
				}
			}
					
					
					//add the new chat room to our list of all chat rooms
					rooms.newRoom(roomname, public, data['password'], creator);
					chat_room.emit('update_rooms', {rooms: rooms.getRooms()});
					console.log('room added to list of all ');
					
					//Join the requested chat room
					var room= rooms.getRoom(roomname);
					if (rooms.banCheck(creator, roomname) || rooms.kickCheck(creator, roomname) ){
						
					}
					else{
						socket.join(roomname);
						current_room = roomname;
						chat_room.in(roomname).emit("joined_room", {room: roomname, username: creator});
						
					}

					
					//Add user to the list of all users in the given room
					users.newUser(socket.id, creator, roomname);
					chat_room.in(roomname).emit('update_users', users.usersInRoom(roomname));
				
				}
				else{
					//If the room neame was not unique
					console.log('roomname is not unique');
					socket.emit("did_not_join");
				}
					
				});
				//This is how we display all avialiable chats
				socket.on('get_chats', function(){
					var r = rooms.getRooms();
					socket.emit('display_chats', {rooms: r});
				});
				
				//Ban 	
				socket.on('ban',function(data){
					var banname= data['banname'];
					var current_user=users.getUser(socket.id).username;
					var room= rooms.getRoom(current_room);
					if (room.creator==current_user){
						room.ban.push(banname);
						console.log(banname+' has been banned');


					}
					
				});	
				
				//Kick
				socket.on('kick',function(data){
					var kickname= data['kickname'];
					var current_user=users.getUser(socket.id).username;
					var room= rooms.getRoom(current_room);
					if (room.creator==current_user){
						room.kick.push(kickname);
						console.log(kickname+' has been kicked out');
					}
					
				});	
					
				//unKick	
				socket.on('unkick',function(data){
					var unkickname= data['unkickname'];
					var current_user=users.getUser(socket.id).username;
					var room= rooms.getRoom(current_room);
					console.log("list of kicked users before unkick ", room.kick);
											console.log(unkickname+'' +'UNKICK');
											console.log(room.creator+' '+current_user)

					if (room.creator==current_user){
						room = rooms.unKick(unkickname, room.room_name);
						console.log("list of kicked users after unkick ", room);
					}
		
	});
		
	
});








