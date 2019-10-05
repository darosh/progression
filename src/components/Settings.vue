<template>
  <v-list class="py-2">
    <v-list-item class="pt-5 pb-5 ma-0">
      <v-flex />
      <v-btn-toggle
        v-model="progressionType"
        mandatory
        rounded>
        <v-btn
          v-for="({name, value}, index) in progressionTypes"
          :key="index"
          text
          :value="value"
          v-text="name" />
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-5">
      <v-flex />
      <v-btn-toggle
        v-model="rootPitch"
        rounded
        mandatory>
        <v-btn
          v-for="key in pitches"
          :key="key"
          :value="key"
          text
          v-text="key" />
      </v-btn-toggle>
    </v-list-item>
    <v-list-item class="pb-5">
      <v-spacer />
      <v-btn-toggle
        v-model="rootOctave"
        class="mr-3"
        rounded
        mandatory>
        <v-btn
          v-for="key in octaves"
          :key="key"
          text
          :value="key"
          v-text="key " />
      </v-btn-toggle>
      <v-btn-toggle
        v-model="rootAccidental"
        mandatory
        rounded>
        <v-btn
          v-for="({name, value}, key) in accidentals"
          :key="key"
          text
          :value="value">
          <span
            class="sign"
            v-text="name" />
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-5">
      <v-flex />
      <v-btn-toggle
        v-model="layoutPads"
        class="mr-3"
        rounded>
        <v-btn
          text
          :value="true">
          Pads
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        v-model="formatRoman"
        rounded>
        <v-btn
          text
          :value="true">
          Roman
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-5">
      <v-flex />
      <v-btn-toggle
        v-model="chartBass"
        class="mr-3"
        rounded>
        <v-btn
          text
          :value="true">
          /Bass
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        v-model="chartSimple"
        rounded>
        <v-btn
          text
          :value="true">
          Simple
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
    <v-list-item
      class="py-5">
      <v-flex />
      <v-menu
        :close-on-content-click="false"
        right>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on">
            Channels
          </v-btn>
        </template>
        <v-card>
          <v-simple-table :style="{maxWidth: '420px'}">
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
                  <th class="text-left" />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(v, key) in channels"
                  :key="key">
                  <td>
                    <v-checkbox v-model="v.bass" />
                  </td>
                  <td>
                    <v-checkbox v-model="v.mid" />
                  </td>
                  <td>
                    <v-checkbox v-model="v.voice" />
                  </td>
                  <td>
                    <v-text-field
                      v-model="v.octave"
                      type="number" />
                  </td>
                  <td>
                    <v-text-field
                      v-model="v.channel"
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
                  <td colspan="5" />
                  <td>
                    <v-btn
                      color="accent"
                      class="my-4"
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
        class="ml-5"
        rounded>
        <v-btn
          text
          :value="true">
          Dark
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
  </v-list>
</template>
<script>
import Settable from './Settable'
import { midiStatus, initMidi } from '../utils/midi'

export default {
  mixins: [Settable],
  data: () => ({ midiStatus }),
  methods: { initMidi }
}
</script>
<style scoped>
.sign {
  font-size: 22px;
}
</style>
