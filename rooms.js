//Create the rooms json thingy
var rooms=[{
		room_name: '',
		public: true,
		password: '',
		creator: '',
		kick: [''],
		ban: ['']
}];

//Filter through the array to search for the given room name and return that room
exports.findARoom=function(room_name){
	return rooms.filter((room)=> room.room ===room_name)[0];
};

//Create a new room
exports.newRoom= function(room_name, public, password, creator){
	//We need to do slightly different things for public vs private rooms
	if (public){
		rooms.push({
			room_name: room_name,
			public: public,
			password: '',
			creator: creator,
			kick: [''],
			ban: ['']
		});
	}
	else{
		rooms.push({
			room_name: room_name,
			public: public,
			password: password,
			creator: creator,
			kick: [''],
			ban: ['']
		});	
	}
	return rooms;
};

//get rooms
exports.getRooms = function(){
	return rooms;
};

//get specified room
exports.getRoom = function(room_name){
	var temp = rooms.filter((room)=>room.room_name===room_name)[0];
	return temp;
};

//Filter through the list of users in a room and delete a user who leaves from that list
/*exports.leave=function(username){
	var temp = rooms.filter((room)=>room.username===username);
	rooms = rooms.filter((room2)=>room2.username!==username);
	return temp;
}*/

//Find all the rooms that a specific user is in
/*exports.findAllRooms= function(username){    
    return rooms.filter((room) => room.username ===username);
};*/

//Check to see if a room name is already taken
exports.nameCheck= function(room_name){
	var temp = rooms.filter((room)=>room.room_name===room_name);
	if (temp>0){
		return false;
	} 
	else{
		return true;
	}
};

//check to see if user is banned
exports.banCheck= function(username, room_name){
	var temp = rooms.filter((room)=>room.room_name===room_name)[0];
	var banlist=temp.ban;
	for (var i=0; i < banlist.length;i++){
		if (banlist[i]==username){
			return true;
		}
	}
	return false;
};

//check to see if user is kicked
exports.kickCheck= function(username, room_name){
	var temp = rooms.filter((room)=>room.room_name===room_name)[0];
	var kicklist=temp.kick;
	for (var i=0; i < kicklist.length;i++){
		if (kicklist[i]==username){
			return true;
		}
	}
	return false;
};

//unKick
exports.unKick= function(username, name){
	var room = rooms.filter((room)=>room.room_name===name)[0];
	
	
	return room.kick.splice( room.kick.indexOf(username), 1);
};

/*exports.unKick=function(username, room_name){
	var temp = rooms.filter((room)=>room.room_name===room_name)[0];
	var kicklist=temp.kick;
	for (var i=0; i < kicklist.length;i++){
		if (kicklist[i]==username){
			kicklist[i]='';
		}
	}
	return temp;
};*/


// Check to see if the password that a user gave to get into the room is correct
exports.passwordCheck= function (room_name, password){
	var temp = rooms.filter((room)=>room.room_name===room_name)[0];
	if (temp.password===password){
		return true;
	} 
	else{
		return false;
	}
	
};