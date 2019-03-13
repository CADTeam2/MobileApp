<template>
  <q-pull-to-refresh :handler="refreshHandler"> <!-- Allows pull to refresh (will be depreciated along with event selection) -->
    <q-page padding class="docs-input flex flex-center column justify-center">
      <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
        <!-- Selection for event (possibly redundant) -->
        <q-select
        v-model="eventSelect"
        :value="value"
        :disable="disableSelect"
        @input="handleEventSelect"
        :float-label="dispVal"
        :options="eventOptions"
        />
        <!-- Input for session ID -->
        <q-select
        v-model="sessID"
        :value="value"
        :disable="disableSessSelect"
        @input="handleChange"
        :float-label="sessionDispVal"
        :options="sessSubset"
        />
        <!-- <q-field
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
        </q-field> -->
      </div>
        <div>
          <!-- Button to grab new events from the server -->
          <q-btn
            style="margin-top: 20px"
            label="Refresh Events"
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
      loading: true,
      eventSelect: '', // Selected event
      eventOptions: [], // List of events from API call
      sessionOptions: [],
      disabled: true,
      timeout: 20000, // Global timeout variable for API call
      disableSelect: true, // Disables the selection box when there is not data, prevents showing one blank entry
      dispVal: 'Loading...', // Displays in the slection bar when retrieveing events
      sessionDispVal: 'Loading...',
      sessID: '',
      sessLength: 5, // Maximum length for the room code, likely unnecessary in the future
      error: false,
      selectSessID: null,
      disableSessSelect: true,
      sessLabel: '',
      sessSubset: []
    }
  },
  mounted: function () { // Populate select list on page load
    this.$q.notify({
      color: 'positive',
      position: 'top',
      message: 'Your user ID: ' + this.$store.state.data.userID
    })
    this.$axios({
      method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/https://cadgroup2.jdrcomputers.co.uk/api/events', // Using temporary workaround for lacking return CORS headers
      timeout: this.timeout
    // headers: { 'Access-Control-Allow-Origin': '*' },
    // contentType: 'application/x-www-form-urlencoded'
    })
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].city != null) { // Shows only either city, street or postcode if they exist, ignores others (placeholder options)
            this.eventOptions.push({ label: response.data[i].city, value: response.data[i].eventID })
          } else if (response.data[i].street != null) {
            this.eventOptions.push({ label: response.data[i].street, value: response.data[i].eventID })
          } else if (response.data[i].postcode != null) {
            this.eventOptions.push({ label: response.data[i].postcode, value: response.data[i].eventID })
          }
        }
        this.disableSelect = false
        this.dispVal = 'Event Selection'
        this.loading = false
        this.$store.commit('data/setAllEvents', this.eventOptions)
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
    this.loading = true
    this.$axios({
      method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/https://cadgroup2.jdrcomputers.co.uk/api/sessions',
      timeout: this.timeout // 20 second timeout
      // headers: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        this.sessionOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.sessionOptions.push({ label: response.data[i].speaker, value: response.data[i].sessionID, event: response.data[i].eventID })
        }
        this.loading = false
        this.sessionDispVal = 'Select Event First'
        console.log(this.sessionOptions)
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
          this.dispVal = 'Error Loading'
          this.sessionDispVal = 'Error Loading'
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
          this.dispVal = 'Error Loading'
          this.sessionDispVal = 'Error Loading'
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
          this.sessionDispVal = 'Error Loading'
        }
        console.log(error.config)
      })
  },
  props: ['value'],
  methods: {
    populateSelect () { // Option to pop list after page load, for dev, depreceated in final version
      this.loading = true
      this.eventOptions = [] // Clears the array before loading so new items aren't duplicated
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
            if (response.data[i].city != null) {
              this.eventOptions.push({ label: response.data[i].city, value: response.data[i].eventID })
            } else if (response.data[i].street != null) {
              this.eventOptions.push({ label: response.data[i].street, value: response.data[i].eventID })
            } else if (response.data[i].postcode != null) {
              this.eventOptions.push({ label: response.data[i].postcode, value: response.data[i].eventID })
            }
          }
          this.disableSelect = false
          this.loading = false
          this.dispVal = 'Expanded Event Selection'
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
      this.$router.push('/asking/')
      if (typeof this.sessionJoinNotif === 'function') {
        this.sessionJoinNotif()
      }
      this.sessionJoinNotif = this.$q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'Joining session with speaker: ' + this.$store.state.data.session.label
      })
    },
    refreshHandler (done) { // Identical to populateSelect but with the done function for pull to refresh
      this.eventOptions = [] // Clears the array before loading so new items aren't duplicated
      this.$axios({
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/comments',
        timeout: this.timeout // 20 second timeout
      })
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.eventOptions.push({ label: response.data[i].name, value: response.data[i].name })
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
    handleChange () { // Enables join room button on session select
      this.disabled = false
      this.sessionOptions.forEach(element => { // To output speaker name rather than session ID
        if (element.value === this.sessID) {
          this.sessLabel = element.label
          this.$store.commit('data/setSession', element)
        }
      })
    },
    handleEventSelect () {
      this.sessSubset = []
      console.log(this.eventSelect)
      console.log(this.sessionOptions[0].eventID)
      for (var i = 0; i < this.sessionOptions.length; i++) {
        if (this.sessionOptions[i].event === this.eventSelect) {
          this.sessSubset.push({ label: this.sessionOptions[i].label, value: this.sessionOptions[i].value })
        }
      }
      this.disableSessSelect = false
    }
  }
}
</script>

<style>
</style>
