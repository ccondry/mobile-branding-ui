<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <p class="title" style="white-space:nowrap">
        {{ agent.name }}
      </p>

      <p class="subtitle">
        {{ agent.description }}
      </p>

      <img :src="agent.picture" style="width: 128px; height: 128px;">

      <p style="white-space: nowrap;">
        <strong>
          Webex Username:
          {{ agent.username }}
        </strong>
        <copy :value="agent.username" name="Webex Username" />
      </p>

      <p>
        <strong>
          Password:
          {{ agent.password }}
        </strong>
        <copy :value="agent.password" name="Password" />
      </p>

      <p
      v-if="['Agent', 'Supervisor'].includes(agent.role)"
      >
        <strong>
          Extension:
          {{ agent.extension }}
        </strong>
        <copy :value="agent.extension" name="Extension" />
      </p>

      <p
      v-if="agent.role === 'Agent'"
      style="white-space: nowrap;"
      >
        <strong>
          Agent Desktop:
          <a :href="agentPortalUrl" target="_blank">
            {{ agentPortalUrl }}
          </a>
        </strong>
        <copy :value="agentPortalUrl" name="Agent Desktop URL" />
      </p>

      <p
      v-if="agent.role === 'Administrator'"
      style="white-space: nowrap;"
      >
        <strong>
          Management Portal:
          <a :href="cjpAdminPortalUrl" target="_blank">
            {{ cjpAdminPortalUrl }}
          </a>
        </strong>
        <copy :value="cjpAdminPortalUrl" name="Management Portal URL" />
      </p>

      <p
      v-if="['Supervisor', 'Administrator'].includes(agent.role)"
      style="white-space: nowrap;"
      >
        <strong>
          Control Hub:
          <a :href="webexAdminPortalUrl" target="_blank">
            {{ webexAdminPortalUrl }}
          </a>
        </strong>
        <copy :value="webexAdminPortalUrl" name="Control Hub URL" />
      </p>
    </article>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    agent: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      agentPortalUrl: 'https://desktop.wxcc-us1.cisco.com',
      webexAdminPortalUrl: 'https://admin.webex.com/overview',
      cjpAdminPortalUrl: 'https://portal.wxcc-us1.cisco.com'
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>
