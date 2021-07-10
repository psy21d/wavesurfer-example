<template>
<div class="playerbox">
  <div 
    class="track" 
    v-for="player in Object.keys(playersOptions)" 
    :key="player"
  >
    <div><knob v-model="volume[player]" :min="0" :max="200"></knob></div>
    <div>
      <wavesurfer
        :src="playersOptions[player].file" 
        :options="playersOptions[player].options"
        :ref="playersOptions[player].name"
      >
      </wavesurfer>
    </div>
  </div>
</div>
</template>

<script>
  /* eslint-disable */
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import { watch, ref, reactive } from 'vue';
import Knob from 'primevue/knob';

export default {
  name: 'MTP',
  components: {
    Knob
  },
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
    let playersOptions = ref(props.playersOptions)
    let ready = {}
    let volume = null;
    let v = {}
    let positionProcess = false

    playerNames.forEach(playerName => {
      players[playerName] = ref(null);
      playersOptions.value[playerName].name = playerName
      playersOptions.value[playerName].options = {
        plugins: [Cursor.create()],
      },
      playersOptions.value[playerName].ready = ref(false)
      v[playerName] = 100
    });
    
    volume = reactive(v)

    watch(volume, newVolume => {
      console.log(newVolume)
      Object.keys(newVolume).forEach(playerName => {
        players[playerName].value.waveSurfer.setVolume(newVolume[playerName] / 100)
      })
    })

    let playersForWatch = []
    let readyForWatch = []
    Object.keys(players).forEach(r => {
      playersForWatch.push(players[r])
    })
  
    let playersPlay = () => {
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
    let playersStop = () => {
      console.log('stop')
      positionProcess = true;
      Object.keys(players).forEach(player => {
        players[player].value.waveSurfer.setMute(false);
        players[player].value.waveSurfer.stop();
        console.log(player + ' stopped');
      })
      positionProcess = false;
    }    

    let playersPause = () => {
      console.log('stop')
      Object.keys(players).forEach(player => {
        setTimeout(() => {
          players[player].value.waveSurfer.pause();
          //console.log(player + ' stopped');
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
        ready[playerName] = ref(playersOptions.value[playerName].ready) 
        players[playerName].value.name = playerName
      })

      Object.keys(ready).forEach(r => {
        readyForWatch.push(ready[r])
      })

      watch(readyForWatch, (activatedReady) => {
        const unactivatedFound = activatedReady.find((active) => {
          return (active === false)
        })
        if (unactivatedFound === false) return
        console.log('all players ready')
        playersPlay()
      });

      console.log('all players initialized')
      activatedPlayers.forEach(player => {
        player.waveSurfer.on('ready', () => {
          console.log('ready ' + player.name);
          player.ready = true;
          ready[player.name].value = true
        })

        player.waveSurfer.on('seek', (position) => {
          if (positionProcess) return;
          positionProcess = true
          Object.keys(players).forEach(pl => {
            players[pl].value.waveSurfer.seekTo(position);
          })
          positionProcess = false
        })
      });
    })
    let play = () => {
      playersPlay()
    }
    
    let stop = () => {
      playersStop()
    }
    
    let pause = () => {
      playersPause()
    }
    
    return { ...players, playersOptions, ready, play, stop, volume, pause }
  }
};
</script>

<style scoped>
</style>

<style scoped>
.playerbox {
  display: flex;
  flex-direction: column;
}
.track {
  display: flex;
  flex-direction: row;
}
</style>
