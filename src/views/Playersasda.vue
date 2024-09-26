<template>
    <div>
      <div v-if="!nameEntered">
        <h1>Welcome</h1>
        <input v-model="playerName" placeholder="Enter your name" />
        <button @click="enterName">Enter</button>
      </div>
      <div v-if="nameEntered">
        <h2>Select a Room</h2>
        <button v-for="room in rooms" :key="room" @click="joinRoom(room)">
          Join Room "{{ room }}"
        </button>
        <p v-if="rooms.length === 0">No rooms available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { io } from 'socket.io-client';
  
  // Initialize state
  const socket = io('http://localhost:3001');
  const playerName = ref('');
  const rooms = ref([]);
  const nameEntered = ref(false);
  
  const enterName = () => {
    if (playerName.value) {
      nameEntered.value = true;
      socket.emit('listRooms');
    }
  };
  
  // Join room
  const joinRoom = (room) => {
    socket.emit('joinRoom', { room, name: playerName.value });
  };
  
  // Listen for available rooms
  socket.on('availableRooms', (availableRooms) => {
    rooms.value = availableRooms;
  });
  </script>
  
  <style scoped>
  input {
    margin-right: 10px;
  }
  button {
    margin: 5px;
  }
  </style>
  