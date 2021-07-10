<template>
  <button @click="play">play</button>
  <button @click="pause">pause</button>
  <button @click="stop">stop</button>
  
  <MultiTrackPlayer :playerOptions="playerOptions" ref="player"/>
</template>

<script>
import MultiTrackPlayer from '@/components/MultiTrackPlayer.vue'
import { ref, watch } from 'vue'

export default {
  name: 'App',
  components: {
    MultiTrackPlayer
  },
  data() {
    return {
      playerOptions: {
        playerA: {
          file: "/audio/Bass.mp3",
        },
        playerB: {
          file: "/audio/Drums.mp3",
        },
        playerC: {
          file: "/audio/Piano.mp3",
        }
      }
    }
  },
  setup() {
    let player = ref(player)
    watch(player, (newValuePlayer) => {
      window.player = newValuePlayer;
    })
    let play = () => {
      player.value.play()
    }
    let stop = () => {
      player.value.stop()
    }
    let pause = () => {
      player.value.pause()
    }
    return { player, play, stop, pause }
  }
}
</script>

<style>
</style>
