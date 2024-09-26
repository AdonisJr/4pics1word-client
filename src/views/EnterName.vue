<template>
    <main class="w-screen h-screen flex flex-col gap-5 items-center justify-center">
        <div class="text-center font-mono font-extrabold">
            <p class="text-3xl">Enter your name</p>
            <p class="text-xl animate-bounce font-semibold font-mono text-red-300">Multiplayer</p>
        </div>
        <div class="flex gap-3">
            <input type="text" v-model="player" placeholder="Player 1" class="w-4/6 p-2 border-2 border-slate-400 rounded-lg" />
            <button @click="enterName"
                class="bg-emerald-400 w-[300px] rounded-xl cursor-pointer py-2 text-white text-center font-bold hover:bg-emerald-300 duration-200">Join
        </button>
        </div>
    </main>

</template>

<script setup>
    import { ref, onBeforeMount } from 'vue';

    const player = ref('');
    const enterName = () =>{
        if(!player.value){
            return alert('Please enter valid name')
        }
        localStorage.setItem('player', player.value)
        window.location.href = '/player'
    }

</script>