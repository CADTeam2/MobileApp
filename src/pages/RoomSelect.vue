<template>
  <q-pull-to-refresh :handler="refreshHandler"> <!-- Allows pull to refresh (will be depreciated along with event selection) -->
    <q-page padding class="docs-input flex flex-center column justify-center">
      <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
        <!-- Selection for event (possibly redundant) -->
        <q-select
        v-model="select"
        :value="value"
        :disable="disableSelect"
        @input="handleChange"
        :float-label="dispVal"
        :options="optionsFromAPI"
        />
        <!-- Input for session ID -->
        <q-field
        :error="error"
        :count="sessLength"
        >
          <q-input
          v-model="sessID"
          type="text"
          @input="handleChange"
          float-label="Enter Session ID"
          :maxlength="sessLength"
          />
        </q-field>
      </div>
        <div>
          <!-- Button to grab new events from the server -->
          <q-btn
            style="margin-top: 20px"
            label="Fetch API"
            :loading="loading"
            @click="populateSelect"
          />
        </div>
        <div>
          <!-- Join session -->
          <q-btn
            style="margin-top: 20px"
            label="Join Session"
            :disable="disabled"
            @click="joinRoom"
          />
        </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      select: '', // Selected event
      optionsFromAPI: [ // List of events from API call
      ],
      disabled: true,
      timeout: 20000, // Global timeout variable for API call
      disableSelect: true, // Disables the selection box when there is not data, prevents showing one blank entry
      dispVal: 'Loading...', // Displays in the slection bar when retrieveing events
      sessID: '',
      sessLength: 5, // Maximum length for the room code, likely unnecessary in the future
      error: false
    }
  },
  mounted: function () { // Populate select list on page load
    this.$axios({
      method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/https://cadgroup2.jdrcomputers.co.uk/api/events', // Using temporary workaround for lacking return CORS headers
      timeout: this.timeout
      // headers: { 'Access-Control-Allow-Origin': '*' },
      // contentType: 'application/x-www-form-urlencoded'
    })
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) { // Only adds 10 items, button loads all
          this.optionsFromAPI.push({ label: response.data[i].city, value: response.data[i].city })
        }
        this.disableSelect = false
        this.dispVal = 'Event Selection'
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          this.$q.notify({
            color: 'info',
            position: 'top',
            message: 'Error retreiving events: ' + error.response.status,
            icon: 'cloud'
          })
          this.loading = false
          this.dispVal = 'Error Loading'
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          if (error.code === 'ECONNABORTED') { // Ran if connection exceeds timeout limit
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: 'Event retrieval timeout, are you online?'
            })
          } else {
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: 'Could not retrieve events, are you online?'
            })
          }
          console.log(error.request)
          this.loading = false
          this.dispVal = 'Error Loading'
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
          this.loading = false
          this.$q.notify({
            color: 'warning',
            position: 'top',
            message: '' + error.request
          })
          this.loading = false
          this.dispVal = 'Error Loading'
        }
        console.log(error.config)
      })
  },
  props: ['value'],
  methods: {
    populateSelect () { // Option to pop list after page load, for dev, depreceated in final version
      this.loading = true
      this.optionsFromAPI = [] // Clears the array before loading so new items aren't duplicated
      this.dispVal = 'Loading...'
      this.disableSelect = true
      this.$axios({
        method: 'get',
        url: 'https://cors-anywhere.herokuapp.com/https://cadgroup2.jdrcomputers.co.uk/api/events',
        timeout: this.timeout // 20 second timeout
        // headers: { 'Access-Control-Allow-Origin': '*' }
      })
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.optionsFromAPI.push({ label: response.data[i].city, value: response.data[i].city })
          }
          this.disableSelect = false
          this.loading = false
          this.dispVal = 'Expanded Event Selection'
          this.disableSelect = false
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data);
            this.$q.notify({
              color: 'info',
              position: 'top',
              message: 'Error retreiving events: ' + error.response.status,
              icon: 'cloud'
            })
            this.disableSelect = true
            this.loading = false
            this.dispVal = 'Error Loading'
            // console.log(error.response.status);
            // console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            if (error.code === 'ECONNABORTED') {
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Event retrieval timeout, are you online?' // + error.request
              })
            } else {
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Could not retrieve events, are you online?' // + error.request
              })
            }
            console.log(error.request)
            this.disableSelect = true
            this.loading = false
            this.dispVal = 'Error Loading'
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            this.loading = false
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: '' + error.request
            })
            this.disableSelect = true
            this.loading = false
            this.dispVal = 'Error Loading'
          }
          console.log(error.config)
        })
    },
    joinRoom () {
      this.$router.push('/asking/' + this.sessID)
      this.$q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'Joining room ' + this.sessID
      })
    },
    refreshHandler (done) { // Identical to populateSelect but with the done function for pull to refresh
      this.optionsFromAPI = [] // Clears the array before loading so new items aren't duplicated
      this.$axios({
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/comments',
        timeout: this.timeout // 20 second timeout
      })
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.optionsFromAPI.push({ label: response.data[i].name, value: response.data[i].name })
          }
          this.loading = false
          done()
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data);
            this.$q.notify({
              color: 'info',
              position: 'top',
              message: 'Error retreiving events: ' + error.response.status,
              icon: 'cloud'
            })
            this.loading = false
            done()
            // console.log(error.response.status);
            // console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            if (error.code === 'ECONNABORTED') {
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Event retrieval timeout, are you online?' // + error.request
              })
            } else {
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Could not retrieve events, are you online?' // + error.request
              })
            }
            console.log(error.request)
            this.loading = false
            done()
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            this.loading = false
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: '' + error.request
            })
            this.loading = false
            done()
          }
          console.log(error.config)
        })
    },
    handleChange () { // Simple insurance that the user has entered a code of a certain length
      if (this.sessID !== '' && this.sessID.length === this.sessLength) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

<style>
</style>
