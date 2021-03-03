<template>
  <section v-if="mobileOption" class="main">
    <h1 class="title">
      {{ mobileOption.caption }}
    </h1>
    <option-input
    v-for="(option, index) of mobileOption.fields"
    :key="index"
    v-model="mobileOption.fields[index]"
    style="width: 90%"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import OptionInput from '../components/option-input'

export default {
  components: {
    OptionInput
  },

  data () {
    return {
      mobileOption: null
    }
  },

  computed: {
    ...mapGetters([
      'verticalConfig'
    ])
  },

  watch: {
    verticalConfig () {
      this.refresh()
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    refresh () {
      try {
        const data = this.verticalConfig.mobileOptions[this.$route.params.index]
        this.mobileOption = JSON.parse(JSON.stringify(data))
      } catch (e) {
        // continue
      }
    }
  }
}
</script>
