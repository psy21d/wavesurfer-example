<template>
  <div class="panel">
    <div><button class="button-set" @click="stop"><img src="/icons/stop.png"></button></div>
    <div><button class="button-set" @click="pause"><img src="/icons/pause.png"></button></div>
    <div><button class="button-set" @click="play"><img :src="playState ? '/icons/playnow.png' : '/icons/play.png'"></button></div>
    <div>
      <knob v-model="speed" :min="0" :max="200" :size="60">
      </knob>
    </div>
  </div>
  <MultiTrackPlayer :playerOptions="playerOptions" :playState="playState" :speed="speed" ref="player"/>
</template>

<script>
import MultiTrackPlayer from '@/components/MultiTrackPlayer.vue'
import { ref, watch } from 'vue'
import Knob from 'primevue/knob';

export default {
  name: 'App',
  components: {
    MultiTrackPlayer,
    Knob,
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
      },
      speed: 100,
    }
  },
  setup() {
    let player = ref(player)
    let playState = ref(true)

    watch(player, (newValuePlayer) => {
      window.player = newValuePlayer;
    })
    let play = () => {
      player.value.play()
      playState.value = true
    }
    let stop = () => {
      player.value.stop()
      playState.value = false
    }
    let pause = () => {
      player.value.pause()
      playState.value = false
    }
    return { player, play, stop, pause, playState }
  }
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: row;
}
.button-set {
  background: none;
  border: none;
}
</style>
