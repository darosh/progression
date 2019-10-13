<template>
  <v-list class="py-0">
    <v-list-item class="py-3">
      <v-row
        justify="space-between"
        align="center"
        no-gutters>
        <v-btn-toggle
          v-model="progressionType"
          class="ma-3"
          :mandatory="progressionTypes.some(({ value }) => value === progressionType)"
          rounded>
          <v-btn
            v-for="({name, value}, index) in progressionTypes"
            :key="index"
            text
            :value="value"
            v-text="name" />
        </v-btn-toggle>
        <v-menu
          left>
          <template v-slot:activator="{ on }">
            <v-btn
              class="ma-3"
              text
              v-on="on">
              More
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item
                v-for="({name, value}, index) in progressionTypesMore"
                :key="index"
                @click="progressionType = value">
                <v-list-item-title v-text="name" />
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-5 px-0">
      <v-flex />
      <div style="position: relative;height: 200px; width: 200px;">
        <v-row
          align="center"
          no-gutters
          style="position: absolute; top: 82px; width: 100%; display: flex;"
          class="text-center">
          <v-flex />
          <v-btn
            icon
            style="font-size: 15px;"
            @click="rootOctave = octaves[(octaves.indexOf(rootOctave) - 1 + octaves.length) % octaves.length]">
            &minus;
          </v-btn>
          <span
            style="min-width: 24px; font-size: 15px; display: inline-block; text-align: center;"
            v-text="rootOctave" />
          <v-btn
            icon
            style="font-size: 15px;"
            @click="rootOctave = octaves[(octaves.indexOf(rootOctave) + 1) % octaves.length]">
            +
          </v-btn>
          <v-flex />
        </v-row>
        <v-btn
          v-for="(v, i) in pitches"
          :key="i"
          style="position: absolute; font-size: 15px;"
          :class="rootPitch === v ? 'grey darken-1' : null"
          :dark="rootPitch === v"
          :style="{
            left: `${100 -36/2 + 78 * Math.sin(i / pitches.length * 2 * Math.PI)}px`,
            top: `${100 -36/2 + 78 * -Math.cos(i / pitches.length * 2 * Math.PI)}px`
          }"
          icon
          @click="rootPitch = v"
          v-text="`${v[0]}${v[1] ? accidentals[1].name : ''}`" />
      </div>
      <v-flex />
    </v-list-item>
    <v-divider />
    <v-list-item class="py-3">
      <v-row
        justify="space-between"
        no-gutters>
        <v-btn-toggle
          v-model="layoutPads"
          class="my-3"
          rounded>
          <v-btn
            text
            :value="true">
            Pads
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
          v-model="formatRoman"
          class="my-3"
          rounded>
          <v-btn
            text
            :value="true">
            Roman
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
          v-model="chartBass"
          class="my-3"
          rounded>
          <v-btn
            text
            :value="true">
            /Bass
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
          v-model="chartSimple"
          class="my-3"
          rounded>
          <v-btn
            text
            :value="true">
            Simple
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-5">
      <v-slider
        v-model="volume"
        :label="!midiOutput ? `${formatNumber(velocityToVolume(volume))} dB` : volume.toString()"
        inverse-label
        prepend-icon="mdi-volume-high"
        :dark="dark"
        thumb-color="grey darken-1"
        hide-details
        min="0"
        max="127"
        light
        color="grey darken-1"
        track-color="rgba(156,156,156,.24)" />
    </v-list-item>
    <v-divider />
    <v-list-item
      class="py-3">
      <v-row
        justify="space-between"
        align="center"
        no-gutters>
        <v-menu
          min-width="300"
          max-width="520"
          :close-on-content-click="false"
          right>
          <template v-slot:activator="{ on }">
            <v-btn
              class="my-3"
              text
              v-on="on">
              Channels
            </v-btn>
          </template>
          <v-card>
            <v-simple-table
              dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Bass
                    </th>
                    <th class="text-left">
                      Mid
                    </th>
                    <th class="text-left">
                      Voice
                    </th>
                    <th class="text-left">
                      Octave
                    </th>
                    <th class="text-left">
                      Channel
                    </th>
                    <th class="text-left">
                      Velocity
                    </th>
                    <th class="text-left" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(v, key) in channels"
                    :key="key">
                    <td>
                      <v-checkbox
                        v-model="v.bass"
                        class="mt-0"
                        hide-details />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="v.mid"
                        class="mt-0"
                        hide-details />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="v.voice"
                        class="mt-0"
                        hide-details />
                    </td>
                    <td>
                      <v-text-field
                        v-model="v.octave"
                        min="-8"
                        max="8"
                        class="mt-0"
                        hide-details
                        type="number" />
                    </td>
                    <td>
                      <v-text-field
                        v-model="v.channel"
                        min="1"
                        max="16"
                        class="mt-0"
                        hide-details
                        type="number" />
                    </td>
                    <td>
                      <v-text-field
                        v-model="v.velocity"
                        min="1"
                        max="127"
                        class="mt-0"
                        hide-details
                        type="number" />
                    </td>
                    <td>
                      <v-btn
                        v-if="channels.length > 1"
                        color="accent"
                        small
                        icon
                        @click="channels.splice(channels.indexOf(v), 1)">
                        <v-icon>mdi-close-circle</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6" />
                    <td>
                      <v-btn
                        color="accent"
                        class="my-2"
                        light
                        small
                        icon
                        @click="channels.push({...channels[channels.length - 1]})">
                        <v-icon>mdi-plus-circle</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-menu>
        <v-menu
          left>
          <template v-slot:activator="{ on }">
            <v-btn
              class="my-3"
              text
              v-on="on"
              @click="initMidi">
              MIDI
            </v-btn>
          </template>
          <v-card
            v-if="midiStatus.loading"
            class="pa-3">
            <v-progress-circular
              indeterminate
              :size="48-3"
              :width="6"
              color="accent"
              class="mr-2" />
            <i>Waiting for MIDI...</i>
          </v-card>
          <v-card v-else>
            <v-list>
              <v-list-item @click="midiOutput = null">
                <v-list-item-title>
                  None
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon
                    v-if="midiOutput === null"
                    color="accent">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="midiStatus.outputs && midiStatus.outputs.length" />
              <v-list-item
                v-for="(output, key) in midiStatus.outputs"
                :key="key"
                @click="midiOutput = output">
                <v-list-item-title>
                  {{ output.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon
                    v-if="midiOutput === output"
                    color="accent">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn-toggle
          v-model="dark"
          class="my-3"
          rounded>
          <v-btn
            text
            :value="true">
            Dark
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-list-item>
    <v-divider />
    <p class="ma-0 pa-5">
      Begin with blue box.
      Follow to the right.
      Jump to green one at any time and follow to the right.
      Use +3/-3 chord inversion buttons or W/S hot keys.
      See and replay recent chords on the right (hot keys 1-9).
      Have fun!
    </p>
    <v-divider />
  </v-list>
</template>
<script>
import Settable from './Settable'
import { midiStatus, initMidi } from '../utils/midi'
import { velocityToVolume } from '@/utils/play'
import { formatNumber } from '@/utils/format'

export default {
  mixins: [Settable],
  data: () => ({ midiStatus }),
  methods: { initMidi, velocityToVolume, formatNumber }
}
</script>
<style scoped>
.sign {
  font-size: 22px;
}
</style>
