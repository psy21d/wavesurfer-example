<template>
  <wavesurfer :src="fileA" :options="optionsA" ref="playerA"></wavesurfer>
  <wavesurfer :src="fileB" :options="optionsB" ref="playerB"></wavesurfer>
  <wavesurfer :src="fileC" :options="optionsC" ref="playerC"></wavesurfer>
</template>

<script>
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import { watch, ref } from 'vue';

export default {
  name: 'MTP',
  data() {
    return {
      optionsA: {
        plugins: [Cursor.create()],
      },
      fileA: "/audio/Bass.mp3",
      optionsB: {
        plugins: [Cursor.create()],
      },
      fileB: "/audio/Drums.mp3",
      optionsC: {
        plugins: [Cursor.create()],
      },
      fileC: "/audio/Piano.mp3",
    };
  },
  // mounted() {
  //   if(this.playerA.value) this.playerA.value.waveSurfer.on('ready', () => {
  //     console.log('readyA');
  //     this.readyA.value = true;
  //   });
  //   playerB.value.waveSurfer.on('ready', () => {
  //     console.log('readyB');
  //     this.readyB.value = true;
  //   });
  //   playerC.value.waveSurfer.on('ready', () => {
  //     console.log('readyC');
  //     this.readyC.value = true;
  //   });
  // },
  setup() {
    const playerA = ref(null);
    const playerB = ref(null);
    const playerC = ref(null);

    let readyA = ref(false);
    let readyB = ref(false);
    let readyC = ref(false);

    watch([playerA, playerB, playerC], ([newplayerA, newplayerB, newplayerC]) => {
      if (newplayerA && newplayerB && newplayerC) {
        console.log('all players initialized')
        playerA.value.waveSurfer.on('ready', () => {
          console.log('readyA');
          readyA.value = true;
        });
        playerB.value.waveSurfer.on('ready', () => {
          console.log('readyB');
          readyB.value = true;
        });
        playerC.value.waveSurfer.on('ready', () => {
          console.log('readyC');
          readyC.value = true;
        });
      }
      // do whatever you want
    });
  
    watch([readyA, readyB, readyC], ([newReadyA, newReadyB, newReadyC]) => {
      if (newReadyA && newReadyB && newReadyC) {
        console.log('all players ready')
        console.log('play')
        window.playerA = playerA.value.waveSurfer;
        window.playerB = playerB.value.waveSurfer;
        window.playerC = playerC.value.waveSurfer;

        playerA.value.waveSurfer.setMute(false);
        playerB.value.waveSurfer.setMute(false);
        playerC.value.waveSurfer.setMute(false);

        console.log(playerA.value.waveSurfer.getVolume());
        console.log(playerB.value.waveSurfer.getVolume());
        console.log(playerC.value.waveSurfer.getVolume());
        
        setTimeout(() => {
          playerA.value.waveSurfer.play();
          playerB.value.waveSurfer.play();
          playerC.value.waveSurfer.play();
        }, 0);
      }
      // do whatever you want
    });

    return { readyA, readyB, readyC, playerA, playerB, playerC }
  }
};
</script>

<style scoped>
</style>
