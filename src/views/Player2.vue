<template>
    <main class="w-screen h-screen flex flex-col gap-5 bg-slate-200">
        <nav class="flex justify-between text-center font-mono bg-slate-700 px-10 items-center text-white p-2">
            <div class="flex gap-2 items-center">
                <p class="text-xl font-bold">4pics-1word <span class="rounded-l-xl">|</span></p>
                <p class="text-xs text-yellow-400 animate-pulse font-bold">Multiplayer</p>
            </div>
            <div class="flex gap-2 items-center">
                <div></div>
                <p class="">Welcome Player: {{ player }}</p>
                <button class="bg-red-200 py-1 px-2">Logout</button>
            </div>
        </nav>

        <p v-if="notif" class="text-center text-white bg-red-300 rounded-lg">{{ notif }}</p>
        <div class="flex justify-center">
            <div class="flex flex-col gap-5 bg-white p-3 w-full h-[600px] overflow-y-auto">
                <div class="flex justify-between px-2">
                    <div class="flex flex-col gap-2">
                        <span>Player Name: {{ player }}</span>
                        <span>Id: {{ player_id }}</span>
                    </div>

                </div>
                <div>
                    <div class="flex gap-2" v-if="!currentRoom">
                        <input type="text" class="py-1 px-2 border-2 border-slate-200 rounded-lg" v-model="room"
                            placeholder="Room name" />
                        <button @click="joinRoom"
                            class="bg-emerald-500 text-white px-4 rounded-lg py-1 hover:bg-emerald-600 duration-200">
                            Join
                        </button>
                    </div>
                    <div class="flex gap-2 w-4/6" v-else>
                        <p class="text-xl font-bold">Room: {{ currentRoom }}</p>
                        <button @click="leaveRoom"
                            class="bg-emerald-500 text-white px-4 rounded-lg py-1 hover:bg-emerald-600 duration-200">
                            Leave Room
                        </button>
                    </div>
                    
                </div>

                <div class="flex w-full h-full items-start bg-blue-50" v-if="currentRoom">
                    <div class="w-2/6 p-2 flex items-center justify-center">
                        <img :src="computedImageSrc" class="border-4 border-indigo-800 rounded-lg" />
                    </div>
                    <div class="bg-emerald-200 h-full p-2 w-2/6 flex flex-col gap-2 justify-between">
                        <p class="animate-bounce text-xl font-mono font-bold">Chat</p>
                        <div class="text bg-white h-[100%] overflow-y-auto flex flex-col-reverse p-2 gap-1"
                            ref="chatContainer">
                            <p v-for="(item, index) in sortedConversation" :key="index"
                                class="bg-blue-50 rounded-full p-2 hover:bg-blue-100 duration-200">
                                <span>({{ item.name }}): </span>
                                <span>{{ item.message }}</span>
                            </p>
                        </div>
                        <div class="flex gap-1">
                            <input type="text" class="p-1 rounded-lg w-5/6" placeholder="What's on your mind?"
                                v-model="message" />
                            <button class="bg-blue-500 text-white rounded-full p-1 w-1/6"
                                @click="sendMessage">SEND</button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 w-[200px] bg-blue-50 p-2 h-full">   
                        <div class="p-5 bg-white h-full overflow-y-auto">
                            <p v-for="(data, id) in userListRoom" :key="id">{{ data.name }}: {{ data.score }}</p>
                        </div>
                    </div>
                    <!-- User online globally -->
                    <div
                        class="flex flex-col gap-2 bg-white shadow-xl border-2 border-slate-700 h-[100%] w-[250px] p-2 overflow-y-auto">
                        <p class="font-bold font-mono text-lg text-slate-500">Global</p>
                        <p
                            class="text-sm font-semibold text-emerald-600 border-b border-slate-200 p-1 flex gap-1 items-center">
                        <div class="w-[10px] h-[10px] rounded-full bg-emerald-400 animate-pulse">
                        </div>Online Players
                        </p>
                        <div class="flex gap-1" v-for="(name, id) in userList" key="id">
                            <p class="text-xs">{{ name.id }}</p>
                            <span class="text-xs font-bold">({{ name.name }})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

</template>
<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { io } from 'socket.io-client';

const newRoom = ref('');
const createdRoom = ref('');
const player = ref(localStorage.getItem('player'));
const player_id = ref('');
const room = ref('');
const currentRoom = ref('');
const userList = ref([]); // Reactive state f++or the user list
const userListRoom = ref([]);
const notif = ref('');
const message = ref('');
const conversation = ref([]);
const currentQuestion = ref('');
const scores = ref('');

// functions

const sortedConversation = computed(() => {
  return [...conversation.value].reverse();  // Reverses the array order
  // You could also sort or manipulate the array in other ways if needed
});

const computedImageSrc = computed(() => {
  return currentQuestion.value ? currentQuestion.value.url : '/bg.jpg';
});

// Set up the socket connection
const socket = io('http://localhost:3001'); // Replace with your server URL

const joinRoom = () => {
    socket.emit('join-room', room.value, msg => {
        currentRoom.value = room.value;
        notif.value = msg;
    })
}

const leaveRoom = () => {
    socket.emit('leave-room', currentRoom.value, msg => {
        currentRoom.value = ''
        notif.value = msg;
    })
}

// handle incomming question

socket.on('question', qst =>{
    console.log(qst)
    currentQuestion.value = qst;
})

// send message

const sendMessage = () => {
    socket.emit('message', { roomName: currentRoom.value, message: message.value })
    socket.emit('send-answer', {roomName: currentRoom.value, answer: currentQuestion.value.answer, providedAnswer: message.value}, msg =>{
        notif.value = msg
    })
}

// handle all score

socket.on('all-user-score', score =>{
    console.log(score)
    scores.value = score;
})

socket.on('get-player-scores', scores => {
    // Assuming scores is an array of {id: socket.id, score: number}
    scores.value = scores; // Not really needed if you're just mapping below

    scores.forEach(score => {
        const user = userList.value.find(user => user.id === score.id);
        if (user) {
            user.score = score.score; // Update the user's score
        }
    });

    userListRoom.value = userList.value; // Update the userListRoom after score updates
    console.log(userListRoom.value); // Log the updated user list
});

// handle conversation
socket.on('conversation', message => {
    conversation.value.push(message)
    console.log(message)
})

// Handle user list updates from the server
socket.on('main-message', (msg) => {
    notif.value = msg;
})

// Handle user list updates from the server
socket.on('update-user-list', (list) => {
    userList.value = list;
})

// Handle user list inside room
socket.on('update-user-list-room', (list) => {
    userListRoom.value = list;
})

// Watch for changes in userList
watch(userList, (newList) => {
    console.log('User list updated:', newList);
})

// Watch for changes in userList
watch(notif, (newList) => {
    setTimeout(() => {
        notif.value = '';
    }, 25000);
})


onMounted(() => {
    if (!player.value) return window.location.href = '/login';

    socket.emit('new-user', player.value, id => {
        player_id.value = id;
        console.log('Player ID:', id);
    });

    socket.on('get-player-scores', scores => {
    // Assuming scores is an array of {id: socket.id, score: number}
    scores.value = scores; // Not really needed if you're just mapping below

    scores.forEach(score => {
        const user = userList.value.find(user => user.id === score.id);
        if (user) {
            user.score = score.score; // Update the user's score
        }
    });

    userListRoom.value = userList.value; // Update the userListRoom after score updates
    console.log(userListRoom.value); // Log the updated user list
});
})

onBeforeUnmount(() => {
    socket.emit('disconnect');
})
</script>
