<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
      <q-select
      v-model="select"
      float-label="Conference Selection"
      :options="optionsFromAPI"
      />
    </div>
      <div>
        <q-btn
          style="margin-top: 20px"
          label="Fetch API"
          :loading="loading"
          @click="populateSelect"
        />
      </div>
      <div>
        <q-btn
          style="margin-top: 20px"
          label="Join Conference"
          @click="joinRoom"
        />
      </div>
  </q-page>
</template>§

<script>
export default {
  data () {
    return {
      loading: false,
      select: '',
      optionsFromAPI: [
      ]
    }
  },
  mounted: function () { // Populate select list on page load, simulating db API call
    this.$axios.get('https://jsonplaceholder.typicode.com/comments')
      .then((response) => {
        for (var i = 0; i < 10; i++) { // Only adds 10 items, button loads all
          this.optionsFromAPI.push({ label: response.data[i].name, value: response.data[i].name })
        }
      })
  },
  methods: {
    populateSelect () { // Option to pop list after page load
      this.loading = true
      this.$axios.get('https://jsonplaceholder.typicode.com/comments')
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.optionsFromAPI.push({ label: response.data[i].name, value: response.data[i].name })
          }
          this.loading = false
        })
    },
    joinRoom () {
      this.$router.push('/asking')
      this.$q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'Joining room ' + this.select
      })
    }
  }
}
</script>

<style>
</style>
