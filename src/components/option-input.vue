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
          return this.value.value
        }
        if (this.isDate) {
          return new Date(this.value.value)
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
          // request a weekday along with a long date
          this.$emit('input', {
            ...this.value,
            value: this.dateFormatter(value)
          })
        }
      }
    }
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
