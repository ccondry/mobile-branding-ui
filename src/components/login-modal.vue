<template>
  <div class="modal-card" style="width: auto">
    <section class="modal-card-body">
      <!-- username -->
      <b-field label="Your Name">
        <b-input
        v-model="model.username"
        placeholder=""
        required
        :autofocus="model.username.length <= 2"
        @keyup.enter.native="submit"
        />
      </b-field>

      <!-- phone number -->
      <b-field label="Phone Number">
        <b-input
        v-model="model.phone"
        placeholder=""
        required
        :autofocus="model.username.length > 2 && model.phone.length <= 4"
        @keyup.enter.native="submit"
        />
      </b-field>

      <!-- datacenter -->
      <b-field label="Datacenter">
        <b-select
        v-model="model.datacenter"
        placeholder="New Name"
        required
        >
          <option value="webex">
            Webex
          </option>
          <option value="RTP">
            US East
          </option>
          <option value="SJC">
            US West
          </option>
          <option value="LON">
            EMEAR
          </option>
          <option value="SNG">
            APJ
          </option>
          <!-- <option value="webex">Webex Cloud</option> -->
        </b-select>
      </b-field>

      <!-- webex demo -->
      <b-field
      v-if="model.datacenter === 'webex'"
      label="Demo"
      >
        <b-select
        v-model="model.sessionId"
        required
        @keyup.enter.native="submit"
        >
          <option
          v-for="version of webexVersions"
          :key="version.value"
          :value="version.value"
          >
            {{ version.name }}
          </option>
        </b-select>
      </b-field>

      <!-- session ID -->
      <b-field
      v-if="model.datacenter !== 'webex'"
      label="Session ID"
      >
        <b-input
        v-model="model.sessionId"
        placeholder="123456"
        required
        type="number"
        pattern="[0-9]*"
        :autofocus="model.phone.length >= 4 && model.userId.length !== 4"
        @keyup.enter.native="submit"
        />
      </b-field>

      <!-- user ID -->
      <b-field label="User ID">
        <b-input
        v-model="model.userId"
        placeholder="1234"
        required
        type="number"
        pattern="[0-9]{4}"
        :autofocus="model.phone.length >= 4 && model.sessionId.length > 1"
        @keyup.enter.native="submit"
        />
      </b-field>
    </section>

    <footer class="modal-card-foot" style="justify-content: flex-end;">
      <b-button
      rounded
      type="is-success"
      expanded
      :disabled="!isValid"
      @click="submit"
      >
        Start
      </b-button>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    // essentially our default input data
    datacenter: {
      type: String,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      // our form data
      model: {
        datacenter: '',
        sessionId: '',
        userId: '',
        phone: '',
        username: ''
      },
      webexVersions: [{
        name: 'v4',
        value: 'v4prod'
      }, {
        name: 'v6',
        value: 'v6'
      }]
    }
  },

  computed: {
    ...mapGetters([
      'hasSessionInput'
    ]),
    isValid () {
      return this.model.datacenter.length >= 3 &&
      this.model.sessionId.length > 0 &&
      this.model.userId.length === 4 &&
      this.model.phone.length >= 4 &&
      this.model.username.length > 2
    },
    modelDatacenter () {
      return this.model.datacenter
    }
  },

  watch: {
    // watch all props and refresh if any change
    datacenter () {
      this.refresh()
    },
    sessionId () {
      this.refresh()
    },
    userId () {
      this.refresh()
    },
    phone () {
      this.refresh()
    },
    username () {
      this.refresh()
    },
    modelDatacenter () {
      // if datacenter is set to webex and sessionId is not a valid webex
      // demo version, set the sessionId to the first webex demo version
      if (
        this.model.datacenter === 'webex' &&
        !this.webexVersions.find(v => v.value === this.model.sessionId)
      ) {
        this.model.sessionId = this.webexVersions[0].value
        return
      }
      // if datacenter is set to not webex and sessionId is a webex version,
      // set the sessionId field blank
      if (
        this.model.datacenter !== 'webex' &&
        this.webexVersions.find(v => v.value === this.model.sessionId)
      ) {
        this.model.sessionId = ''
        return
      }
    }
  },

  mounted () {
    // refresh model data with props data
    this.refresh()
    // submit now if all fields are valid
    this.submit()
  },

  methods: {
    submit () {
      if (this.isValid) {
        this.$emit('submit', this.model)
        this.$emit('close')
      }
    },
    refresh () {
      // refresh model data with props data
      this.model = {
        datacenter: this.datacenter || '',
        sessionId: this.sessionId || '',
        userId: this.userId || '',
        phone: this.phone || '',
        username: this.username || ''
      }
    }
  }
}
</script>
