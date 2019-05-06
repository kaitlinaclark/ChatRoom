//Create the users json thingy
var users = [{
	socket_id: '',
	username: '',
	password: '',
}];

//Get a user with a specific socket id
exports.getUser=function(socket_id){
	return users.filter((user) => user.socket_id== socket_id)[0];
};

//Create a new user
exports.newUser=function(socket_id,username, room_name){
	users.push({
		socket_id: socket_id,
		username: username,
		room_name: room_name	
	});
	return users;
};

//Get all the users in a certain room
exports.usersInRoom= function(room_name){
	return users.filter((user)=> user.room_name ==room_name);
};

//Delete a user
exports.dropUser=function(socket_id){
	var temp=users.filter((user)=>user.socket_id===socket_id)[0];
	users = users.filter((user2)=> user2.socket_id !==socket_id);
	return temp;
};

//Set a current user
exports.setUser = function(username, socket_id){
	users.push({
		socket_id: socket_id,
		username: username,
		room_name: ''
	});
};