<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header id="noSelect">
      <q-toolbar
        color="primary"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ this.$route.params.roomName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Useful Links</q-list-header>
        <q-item @click.native="openURL('http://cadgroup2.jdrcomputers.co.uk')">
          <q-item-side icon="cloud" />
          <q-item-main label="Main Site" sublabel="cadgroup2.jdrcomputers.co.uk" />
        </q-item>
        <q-item @click.native="prevPage()"> <!-- Log out sidebar option only visible from questions page which needs login to view -->
          <q-item-side icon="lock" />
          <q-item-main label="Log Out" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

document.addEventListener('deviceready', () => {

}, false)

export default {
  name: 'Questions',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    prevPage () {
      this.$router.push('/')
      this.$q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Sign out successful'
      })
    },
    openURL
  }
}
</script>

<style>
  #noSelect {
    user-select: none
  }
</style>
