<template>
  <section class="main">
    <b-loading :active="hasSessionInput && !verticalConfig" />
    <div id="logo" v-if="verticalConfig">
      <img :src="verticalConfig.logo.rasterised">
    </div>
    <div
    v-if="verticalConfig"
    :style="`background-image: url(${verticalConfig.mobileWallpaper})`"
    id="background"
    >
      <div id="overlay">
        <div id="content">
          <div
          v-for="(option, index) of verticalConfig.mobileOptions"
          :key="index"
          class="content-item"
          @click="clickOption(index)"
          >
            <b-icon
            :icon="option.icon"
            pack="fa"
            size="is-large"
            />
            {{ option.caption }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginModal from './components/login-modal'
import { getUrlQueryParams } from './utils'

export default {
  components: {
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters([
      'sessionInfo',
      'datacenter',
      'sessionId',
      'userId',
      'phone',
      'verticalConfig',
      'hasSessionInput'
    ])
  },

  watch: {
    sessionInfoError (val) {
      // error getting session info. display message
      if (val.status === 404) {
        // session not found - probably user entered invalid data
        // pop session modal again
        this.showSessionInfoModal = true
      } else {
        // other error - display message
        // display error message
        this.$buefy.dialog.alert({
          title: 'Error Retreiving dCloud Session Info',
          message: `There was an error retreiving your dCloud
          session information. Please refresh the page to try again, or
          contact dCloud support if you continue to have this issue.
          <br />
          Status Code: <strong>${val.status}</strong>
          <br />
          Error Message: <strong>${val.data}</strong>`,
          type: 'is-danger',
          canCancel: false,
          hasIcon: true,
          icon: 'close-circle',
          iconPack: 'mdi'
        })
      }
    }
  },

  mounted () {
    // set query parameters into state
    const queryParams = getUrlQueryParams()
    this.setSessionId(queryParams.sessionId)
    this.setDatacenter(queryParams.datacenter)
    this.setUserId(queryParams.userId)
    this.setPhone(queryParams.phone)
    // get dcloud session info
    if (this.hasSessionInput) {
      this.getSessionInfo()
    } else {
      // wait for Vue to be ready to open a modal
      this.$nextTick(() => {
        this.$buefy.modal.open({
          parent: this,
          component: LoginModal,
          hasModalCard: true,
          trapFocus: true,
          props: {
            datacenter: this.datacenter,
            sessionId: this.sessionId,
            userId: this.userId,
            phone: this.phone
          },
          events: {
            submit: (data) => {
              this.setSessionId(data.sessionId)
              this.setDatacenter(data.datacenter)
              this.setUserId(data.userId)
              this.setPhone(data.phone)
              this.getSessionInfo()
            }
          }
        })
      })
    }
  },

  methods: {
    ...mapActions([
      'setSessionId',
      'setDatacenter',
      'setUserId',
      'getSessionInfo',
      'setPhone'
    ]),
    clickOption (index) {
      
    }
  }
}
</script>

<style>
/* // hide scroll bar */
html, body {
  background-image: url(./assets/images/sign_in_background.jpg);
  /* // background-position: 0 0; */
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  overflow: hidden !important;
  position: fixed !important;
}

/* // make container fill viewport */
#main-container {
  height: 100vh;
  padding-top: 1rem;
}

/* // each route content container class - centered */
section.main {
  /* // flex layout */
  display: flex;
  height: 100vh;
  justify-content: center;
  /* // center panels horizontally */
  align-items: center;
  /* // put content in a column down the page */
  flex-direction: column;
}

#background {
  background-position: center;
  background-size: cover;
  height: 100%;
  width: 100%;
}

#overlay {
  /* position: fixed; Sit on top of the page content */
  display: block; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* blue overlay over the background image */
  background-color: rgba(0, 160, 209, 0.85);
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  /* Specify a stack order in case you're using a different order for other elements */
  /* z-index: 2; */
  /* Add a pointer on hover */
  /* cursor: pointer; */
  width: 100%;
  height: 100%;
  color: white;
}

#content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  /* padding-top: 2rem; */
  justify-content: space-evenly;
  height: 100%
  /* align-content: space-between; */
}

.content-item {
  /* flex: 1; */
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

