<template>
  <b-field
  :label="value.name"
  >
    <b-input
    v-if="isText || isNumber"
    v-model="vmodel"
    :placeholder="value.value"
    />
    <!-- date time picker -->
    <b-datepicker
    v-if="isDate"
    v-model="vmodel"
    :show-week-number="false"
    locale="en-US"
    placeholder="Click to select..."
    icon="calendar"
    trap-focus
    :date-formatter="dateFormatter"
    />
    <!-- <pre>{{ vmodel }}</pre> -->
  </b-field>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      model: '',
      formatOptions: {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }
    }
  },

  computed: {
    isText () {
      return this.value.type === 'text'
    },
    isNumber () {
      return this.value.type === 'number'
    },
    isDate () {
      return this.value.type === 'date'
    },
    vmodel: {
      get () {
        if (this.isText || this.isNumber) {
          return this.model
        }
        if (this.isDate) {
          return new Date(this.model)
        }
        return ''
      },
      set (value) {
        if (this.isText || this.isNumber) {
          this.$emit('input', {
            ...this.value,
            value
          })
        }
        if (this.isDate) {
          // this.model = value.get
          // request a weekday along with a long date
          this.$emit('input', {
            ...this.value,
            value: new Intl.DateTimeFormat('en-US', this.formatOptions).format(value)
          })
        }
      }
    }
  },

  watch: {
    option () {
      // update model cache from changed prop data
      this.model = this.value.value
    }
  },

  mounted () {
    // copy prop to model
    this.model = this.value.value
  },

  methods: {
    dateFormatter (time) {
      return new Intl.DateTimeFormat('en-US', this.formatOptions).format(time)
    }
  }
}
</script>

<style>
/* make the calendar icon more visible in the datepicker */
.datepicker .control.has-icons-left .icon {
  color: initial !important;
}
</style>
