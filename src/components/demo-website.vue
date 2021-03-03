<template>
  <panel title="Demo Website" aria-id="demo-website">
    <p>
      <strong>Demo Website:
        <a :href="url" target="_blank">
          {{ url }}
        </a>
      </strong>
      <copy :value="url" name="Demo Website URL" />
    </p>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://branding.dcloud.cisco.com/api/v1/brand'
    }
  }
}
</script>
