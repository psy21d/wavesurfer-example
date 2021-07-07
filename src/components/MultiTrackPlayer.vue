<template>
  <wavesurfer 
    v-for="player in Object.keys(_players)" 
    :src="_players[player].file" 
    :options="_players[player].options" 
    :key="_players[player].name"
    :ref="_players[player].name"
  >
  </wavesurfer>
</template>

<script>
  /* eslint-disable */
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import { watch, ref } from 'vue';

export default {
  name: 'MTP',

  props: {
    playersOptions: {
      type: Object,
      default: () => {
        return {
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
    }
  },

  setup(props) {
    const playerNames = Object.keys(props.playersOptions)
    let players = {}
    let _players = ref(props.playersOptions)
    let ready = {}

    playerNames.forEach(playerName => {
      players[playerName] = ref(null);
      _players.value[playerName].name = playerName
      _players.value[playerName].options = {
        plugins: [Cursor.create()],
      },
      _players.value[playerName].ready = ref(false)      
    });

    let playersForWatch = []
    let readyForWatch = []
    Object.keys(players).forEach(r => {
      playersForWatch.push(players[r])
    })
  
    let playersPlay = () => {
      console.log('all players ready')
      console.log('play')

      Object.keys(players).forEach(player => {
        players[player].value.waveSurfer.setMute(false);
        console.log(players[player].value.waveSurfer.getVolume());
        
        setTimeout(() => {
          players[player].value.waveSurfer.play();
          console.log(player + ' played');
        }, 0);
      })
    }

    let checkToPlayersPlay = () => {
      const unactivatedFound = Object.keys(ready).find((active) => {
        return !ready[active].value
      })
      if (unactivatedFound) return
      playersPlay()
    }

    watch(playersForWatch, (activatedPlayers) => {
      const unactivatedFound = activatedPlayers.find((player) => {
        return !player
      })
      if (unactivatedFound) return

      playerNames.forEach(playerName => {
        ready[playerName] = ref(_players.value[playerName].ready) 
        players[playerName].value.name = playerName
      })

      Object.keys(ready).forEach(r => {
        readyForWatch.push(ready[r])
      })

      console.log('all players initialized')

      activatedPlayers.forEach(player => {
        player.waveSurfer.on('ready', () => {
          console.log('ready ' + player.name);
          player.ready = true;
          ready[player.name].value = true
          checkToPlayersPlay()
        })
      });
    })

    watch(readyForWatch, (activatedReady) => {
      debugger
      const unactivatedFound = activatedReady.find((active) => {
        return !active
      })
      if (unactivatedFound) return
      playersPlay()
    });
    return { ...players, _players, ready }
  }
};
</script>

<style scoped>
</style>
