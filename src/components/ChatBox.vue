<template>
    <div class="bg-emerald-200 h-full p-2 w-2/6 flex flex-col gap-2 justify-between">
        <p class="animate-bounce text-xl font-mono font-bold">Chat</p>
        <div class="text bg-white h-[100%] overflow-y-auto flex flex-col-reverse p-2 gap-1" ref="chatContainer">
            <p v-for="(item, index) in sortedConversation" :key="index"
                class="bg-blue-50 rounded-full p-2 hover:bg-blue-100 duration-200">
                <span>({{ item.name }}): </span>
                <span>{{ item.message }}</span>
            </p>
        </div>
        <div class="flex gap-1">
            <input type="text" class="p-1 rounded-lg w-5/6" placeholder="What's on your mind?" v-model="message" />
            <button class="bg-blue-500 text-white rounded-full p-1 w-1/6" @click="props.sendMessage">SEND</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed, watch } from 'vue';

const props = defineProps({
    conversation: {
        type: Array,
        required: true
    }
})

const conversation = ref(props.conversation)

const sortedConversation = computed(() => {
  return [...conversation.value].reverse();  // Reverses the array order
  // You could also sort or manipulate the array in other ways if needed
});

watch(() => props.conversation, (newVal, oldVal) => {
    alert(newVal)
})


</script>