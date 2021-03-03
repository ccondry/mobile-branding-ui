<template>
  <section class="main">
    <img v-if="verticalConfig" :src="verticalConfig.logo.rasterised">
    <div
    v-if="verticalConfig"
    id="background"
    :style="`background-image: url(${verticalConfig.mobileWallpaper})`"
    >
      <div id="overlay">
        <div id="content">
          <a
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
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
      'verticalConfig'
    ])
  },

  watch: {
  },

  mounted () {
  },

  methods: {
    ...mapActions([
    ]),
    clickOption (index) {
      this.$buefy.toast.open({message: 'test ' + index})
    }
  }
}
</script>

<style>
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

