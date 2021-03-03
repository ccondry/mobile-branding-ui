<template>
  <section v-if="mobileOption" class="main">
    <b-loading :active="isWorking" :is-full-page="true" />
    <!-- title -->
    <h1 class="title">
      {{ mobileOption.caption }}
    </h1>

    <!-- 3 options / inputs -->
    <option-input
    v-for="(option, index) of mobileOption.fields"
    :key="index"
    v-model="mobileOption.fields[index]"
    style="width: 90%"
    />

    <!-- attach photo -->
    <div style="width: 90%;">
      <hr style="width: 90%;">
      <div
      v-if="photoSrc.length"
      style="display: flex; justify-content: space-around; padding-bottom: 1rem;"
      >
        <span>
          <img
          :src="photoSrc"
          style="max-height: 6rem;"
          >
          <b-icon
          icon="times"
          style="position: relative; top: -1rem; margin-top: 0; float: right; cursor: pointer;"
          @click.native="clickRemovePhoto"
          />
        </span>
      </div>
      <input
      ref="fileElem"
      type="file"
      accept="image/*"
      style="display: none"
      name="image"
      @change="changeFileInput"
      >
      <b-button
      type="is-info"
      expanded
      rounded
      icon-right="camera"
      @click="clickAddPhoto"
      >
        Upload a Picture
      </b-button>
    </div>

    <!-- bottom -->
    <div style="width: 100%; padding-top: 1rem; display: flex; justify-content:space-around;">
      <!-- contact buttons -->
      <div class="buttons" style="width: 80%; display: flex; justify-content: space-around;">
        <!-- call -->
        <div style="display: flex; flex-direction: column;">
          <b-icon
          type="is-info"
          icon="phone"
          size="is-large"
          style="cursor: pointer;"
          @click.native="clickCall"
          />
          <span style="align-self: center;">Call</span>
        </div>

        <!-- chat -->
        <div style="display: flex; flex-direction: column;">
          <b-icon
          type="is-info"
          icon="commenting"
          size="is-large"
          style="cursor: pointer;"
          @click.native="clickChat"
          />
          <span style="align-self: center;">Chat</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OptionInput from '../components/option-input'

export default {
  components: {
    OptionInput
  },

  data () {
    return {
      mobileOption: null,
      latitude: '',
      longitude: '',
      photoSrc: '',
      locationLoading: false,
      rawFile: null
    }
  },

  computed: {
    ...mapGetters([
      'verticalConfig',
      'sessionInfo',
      'userId',
      'working'
    ]),
    answersData () {
      return {
        ...this.mobileOption,
        index: parseInt(this.$route.params.index, 10),
        latitude: this.latitude,
        longitude: this.longitude,
        verticalOptions: this.verticalConfig.mobileOptions
      }
    },
    isWorking () {
      return this.working.dcloud.photo || this.working.dcloud.answers
    }
  },

  watch: {
    verticalConfig () {
      this.refresh()
    }
  },

  mounted () {
    this.refresh()
    this.getLocation()
  },

  methods: {
    ...mapActions([
      'uploadPhoto',
      'uploadAnswers'
    ]),
    async clickCall () {
      console.log('click call')
      // send data then call
      try {
        await this.uploadPhoto(this.rawFile)
        await this.uploadAnswers(this.answersData)
        // call
        window.location = 'tel:' + encodeURIComponent(this.sessionInfo.dids.DID8)
      } catch (e) {
        this.$buefy.toast.open({
          message: 'failed to send your data: ' + e.message
        })
      }
    },
    async clickChat () {
      console.log('click chat')
      // send data then start chat
      try {
        await this.uploadPhoto(this.rawFile)
        await this.uploadAnswers(this.answersData)
        // start chat
        const url = this.sessionInfo.chatUrl + '&userId=' + this.userId
        console.log('going to chat url', url)
        window.location = url
      } catch (e) {
        this.$buefy.toast.open({
          message: 'failed to send your data: ' + e.message
        })
      }
    },
    clickRemovePhoto () {
      this.photoSrc = ''
      this.rawFile = null
    },
    refresh () {
      try {
        const data = this.verticalConfig.mobileOptions[this.$route.params.index]
        this.mobileOption = JSON.parse(JSON.stringify(data))
      } catch (e) {
        // continue
      }
    },
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
        this.locationLoading = true
      } else {
        this.$buefy.toast.open({
          title: 'GPS location not available',
          message: 'Geolocation is not supported by this browser',
          type: 'is-danger',
          duration: 8000
        })
      }
    },
    clickAddPhoto () {
      console.log('clickAddPhoto')
      this.$refs.fileElem.click()
    },
    changeFileInput (event) {
      console.log('addPhoto', event)
      if (event.target.files && event.target.files[0]) {
        const reader = new window.FileReader()
        this.rawFile = event.target.files[0]
        reader.onload = (e) => {
          console.log('reader onload', e)
          // set src of attach photo
          this.photoSrc = e.currentTarget.result
        }

        reader.readAsDataURL(event.target.files[0])
      }
    },
    showPosition (pos) {
      this.locationLoading = false
      this.latitude = pos.coords.latitude
      this.longitude = pos.coords.longitude
      // this.accuracy = pos.coords.accuracy
      console.log('Your current position is:')
      console.log(`Latitude : ${this.latitude}`)
      console.log(`Longitude: ${this.longitude}`)
      console.log(`More or less ${pos.coords.accuracy} meters.`)
    }
  }
}
</script>
