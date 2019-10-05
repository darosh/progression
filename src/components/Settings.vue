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
    <v-list-item class="py-5">
      <v-flex />
      <v-btn-toggle
        v-model="dark"
        rounded>
        <v-btn
          text
          :value="true">
          Dark
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <v-divider />
    <v-list-item
      id="midi-menu-wrap"
      class="py-5">
      <v-flex />
      <v-menu
        attach="#midi-menu-wrap"
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
            color="rgb(0, 255, 68)"
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
                <v-icon v-if="midiOutput === null">
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
                <v-icon v-if="midiOutput === output">
                  mdi-check
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
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
