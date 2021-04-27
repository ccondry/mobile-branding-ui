<template>
  <div>
    <b-loading :active="hasSessionInput && !verticalConfig" />
    <transition
    mode="out-in"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
    appear
    >
      <keep-alive>
        <b-loading :active="isLoading" />
        <router-view />
      </keep-alive>
    </transition>
  </div>
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
      'username',
      'verticalConfig',
      'hasSessionInput',
      'loading'
    ]),
    isLoading () {
      return true
      // return this.loading.dcloud.sessionInfo ||
      // this.loading.dcloud.brand ||
      // this.loading.dcloud.demo ||
      // this.loading.dcloud.multichannel
    }
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
    this.setUsername(queryParams.username)
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
            phone: this.phone,
            username: this.username
          },
          events: {
            submit: (data) => {
              this.setSessionId(data.sessionId)
              this.setDatacenter(data.datacenter)
              this.setUserId(data.userId)
              this.setPhone(data.phone)
              this.setUsername(data.username)
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
      'setPhone',
      'setUsername'
    ])
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
  /* overflow: hidden !important; */
  /* position: fixed !important; */
}

a {
  color: white !important;
}

a:hover {
  color: white !important;
}

/* // each route content container class - centered */
section.main {
  /* // flex layout */
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: flex-start;
  /* // center panels horizontally */
  align-items: center;
  /* // put content in a column down the page */
  flex-direction: column;
  /* enable full screen access on mobile */
  /* overflow: scroll; */
}

</style>

