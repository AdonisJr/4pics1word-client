import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    player: null,
  }),
  actions: {
    setPlayer(player) {
      this.player = player
    }
  },
  getters: {
    getUser: (state) => state.player
  }
})
