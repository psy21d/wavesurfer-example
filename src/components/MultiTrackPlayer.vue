<template>
<div class="playerbox">
  <div 
    class="track" 
    v-for="player in Object.keys(playersOptions)" 
    :key="player"
  >
    <div class="knob">
      <knob v-model="volume[player]" :min="0" :max="200" :size="60">
      </knob>
    </div>
    <div class="wave">
      <wavesurfer
        class="wavesurfer"
        :src="playersOptions[player].file" 
        :options="playersOptions[player].options"
        :ref="playersOptions[player].name"
      >
      </wavesurfer>
      <div
        class="wave-timeline"
        :ref="`timeline-${playersOptions[player].name}`"
        :id="`wave-timeline-${playersOptions[player].name}`"
      ></div>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import WaveSurfer from'wavesurfer.js'
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import Timeline from'wavesurfer.js/dist/plugin/wavesurfer.timeline'
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
            plugins: {
              timeline: true,
            }
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
    playState: {
      type: Boolean,
      default: true,
    },
    speed: {
      type: Number,
      default: 100,
    }
  },
  watch: {
    speed(newSpeed) {
      console.log(newSpeed)
      console.log(this.playersOptions)
      console.log(this.players)
      
      const playerNames = Object.keys(this.playersOptions)
      playerNames.forEach(playerName => {
        this.players[playerName].value.waveSurfer.setPlaybackRate(newSpeed / 100)
      })
    }
  },
  unmounted() {
     document.removeEventListener("resize", this.onResize);
  },
  setup(props) {
    const playerNames = Object.keys(props.playersOptions)
    let players = {}
    let timelines = {}
    let playersOptions = ref(props.playersOptions)
    let ready = {}
    let volume = null;
    let v = {}
    let positionProcess = false
    let playState = props.playState
    let speed = ref(props.speed)

    playerNames.forEach(playerName => {
      players[playerName] = ref(null);
      timelines[`timeline-${playerName}`] = ref(null)
      playersOptions.value[playerName].name = playerName
      playersOptions.value[playerName].options = {
        plugins: [Cursor.create()]
      }
      if (playersOptions.value[playerName].plugins && playersOptions.value[playerName].plugins.timeline) {
        playersOptions.value[playerName].options.plugins.push(Timeline.create({
          //container: `#wave-timeline-${playerName}`,
          //container: timelines[`timeline-${playerName}`],
          container: timelines[`timeline-${playerName}`],
          height: 30
        }))
      }
      playersOptions.value[playerName].ready = ref(false)
      v[playerName] = 100
    });
    
    volume = reactive(v)

    watch(volume, newVolume => {
      //console.log(newVolume)
      Object.keys(newVolume).forEach(playerName => {
        players[playerName].value.waveSurfer.setVolume(newVolume[playerName] / 100)
      })
    })

    let playersForWatch = []
    let readyForWatch = []
    Object.keys(players).forEach(r => {
      playersForWatch.push(players[r])
    })

    let onResize = () => {
      Object.keys(players).forEach(player => {
        players[player].value.waveSurfer.drawBuffer();
      })
    }
  
    let playersPlay = () => {
      onResize();
      //console.log('play')
      playState = true
      Object.keys(players).forEach(player => {
        players[player].value.waveSurfer.setMute(false);
        //console.log(players[player].value.waveSurfer.getVolume());
        
        setTimeout(() => {
          players[player].value.waveSurfer.play();
          //console.log(player + ' played');
        }, 0);
      })
    }
    let playersStop = () => {
      //console.log('stop')
      playState = false
      positionProcess = true;
      Object.keys(players).forEach(player => {
        players[player].value.waveSurfer.setMute(false);
        players[player].value.waveSurfer.stop();
        //console.log(player + ' stopped');
      })
      positionProcess = false;
    }    

    let playersPause = () => {
      //console.log('stop')
      playState = false
      Object.keys(players).forEach(player => {
        setTimeout(() => {
          players[player].value.waveSurfer.pause();
          //console.log(player + ' stopped');
        }, 0);
      })
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
        //console.log('all players ready')
        if (playState) {
          playersPlay()
        }
      });

      //console.log('all players initialized')
      activatedPlayers.forEach(player => {
        player.waveSurfer.on('ready', () => {
          //console.log('ready ' + player.name);
          player.ready = true;
          ready[player.name].value = true
        })

        player.waveSurfer.on('seek', (position) => {
          if (positionProcess) return;
          positionProcess = true;
          let positionInSeconds = player.waveSurfer.getCurrentTime();
          //console.log(positionInSeconds);
          Object.keys(players).forEach(pl => {
            if (playState) {
              players[pl].value.waveSurfer.play(positionInSeconds);
            } else {
              players[pl].value.waveSurfer.setMute(true);
              players[pl].value.waveSurfer.play(positionInSeconds);
              setTimeout(() => {
                players[pl].value.waveSurfer.playPause()
                players[pl].value.waveSurfer.setMute(false);
              }, 10);
            }
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
    
    return { ...players, ...timelines, players, playersOptions, ready, play, stop, volume, pause, onResize }
  }
};
</script>

<style scoped>
.playerbox {
  display: flex;
  flex-direction: column;
}
.track {
  display: flex;
  flex-direction: row;
}
.knob {
  align-self: center;
}
.wave {
  flex-grow: 1;
}
.wavesurfer {
  position: relative;
}
.wave-timeline {
  width: 100%;
}
</style>
