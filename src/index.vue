<template>
  <div>
    <!-- top navbar -->
    <navbar />
    <!-- main -->
    <div
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <!-- demo website -->
        <demo-website v-if="isLoggedIn" />

        <!-- agents -->
        <agents v-if="isLoggedIn" />

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Agents from './components/agents'
import AppFooter from './components/app-footer'
import DemoWebsite from './components/demo-website'
import Navbar from './components/navbar'

export default {
  components: {
    Agents,
    AppFooter,
    DemoWebsite,
    Navbar
  },

  computed: {
    ...mapGetters([
      'user',
      'isLoggedIn'
    ])
  },

  mounted () {
    this.checkUserId()
  },

  methods: {
    ...mapActions([
      'setUser'
    ]),
    checkUserId () {
      if (!this.isLoggedIn) {
        // get user ID
        this.$buefy.dialog.prompt({
          message: 'What is your 4-digit user ID?',
          rounded: true,
          confirmText: 'Submit',
          type: 'is-primary',
          canCancel: false,
          inputAttrs: {
            value: this.user.id,
            required: true,
            pattern: '[0-9]{4}'
          },
          onConfirm: (id) => {
            this.setUser({id})
          }
        })
      }
    }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (oldVal && !val) {
        // user just logged out
        this.checkUserId()
      }
    }
  }
}
</script>
