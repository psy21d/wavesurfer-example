<template>
  <div class="panel">
    <div class="button">
      <IconStop @click="stop" />
    </div>
    <div class="button">
      <IconPause @click="pause" />
    </div>
    <div class="button">
      <IconPlay @click="play" :playState="playState" />
    </div>
    <div>
      <knob v-model="speed" :min="0" :max="200" :size="60">
      </knob>
    </div>
  </div>
  <MultiTrackPlayer :playersOptions="playersOptions" :playState="playState" :speed="speed" ref="player"/>
</template>

<script>
import MultiTrackPlayer from '@/components/MultiTrackPlayer.vue';
import { ref } from 'vue';
import Knob from 'primevue/knob';
import IconStop from "@/buttons/Stop.vue";
import IconPause from "@/buttons/Pause.vue";
import IconPlay from "@/buttons/Play.vue";

export default {
  name: 'App',
  components: {
    MultiTrackPlayer,
    IconStop,
    IconPause,
    IconPlay,
    Knob,
  },
  data() {
    return {
      playersOptions: {
        playerA: {
          file: "/audio/Bass.mp3",
          caption: "default playerA",
        },
        playerB: {
          file: "/audio/Drums.mp3",
          caption: "default playerB",
        },
        playerC: {
          file: "/audio/Piano.mp3",
          caption: "default playerC",
          plugins: {
            timeline: true,
          }
        }
      },
      speed: 100,
    }
  },
  setup() {
    let player = ref(player)
    let playState = ref(true)

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
.button {
  width: 40px;
    height: 48px;
    margin: 5px;
    align-self: center;
}
</style>
