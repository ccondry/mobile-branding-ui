<template>
  <b-navbar
  :transparent="true"
  :fixed-top="true"
  style="background-color: rgba(0, 0, 0, 0)"
  >
    <template slot="end">
      <div class="navbar-item">
        <div class="buttons">
          <b-button
          v-if="isLoggedIn"
          type="is-info"
          rounded
          aria-label="Log Out"
          @click="clickLogout"
          >
            Log Out
          </b-button>
        </div>
      </div>
    </template>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },

  methods: {
    ...mapActions([
      'logout'
    ]),
    clickLogout () {
      this.logout()
    }
  }
}
</script>
