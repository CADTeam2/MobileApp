<template>
  <q-layout view="lHh Lpr lFf" id="noSelect">
    <q-layout-header>
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
          Imbroglio Development
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
        <q-list-header>Just One Link</q-list-header>
        <q-item @click.native="openURL('http://cadgroup2.jdrcomputers.co.uk')">
          <q-item-side icon="school" />
          <q-item-main label="Main Site" sublabel="cadgroup2.jdrcomputers.co.uk" />
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
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    reload () {
      this.$router.go()
      this.$q.notify({
        color: 'positive',
        position: 'top',
        message: 'Page Reloaded!'
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
