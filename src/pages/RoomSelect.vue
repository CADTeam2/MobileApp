<template>
    <q-page padding class="docs-input flex flex-center column justify-center">
      <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
        <!-- Selection for event -->
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
      selectSessID: null,
      disableSessSelect: true,
      sessLabel: '',
      sessSubset: []
    }
  },
  mounted: function () { // Populate select list on page load
    this.$axios({
      method: 'get',
      url: 'https://cadgroup2.jdrcomputers.co.uk/api/events',
      timeout: this.timeout
    })
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          this.eventOptions.push({ label: response.data[i].eventName, value: response.data[i].eventID })
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
      url: 'https://cadgroup2.jdrcomputers.co.uk/api/sessions/user/' + this.$store.state.data.userID,
      timeout: this.timeout // 20 second timeout
    })
      .then((response) => {
        this.sessionOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.sessionOptions.push({ label: response.data[i].speaker, value: response.data[i].sessionID, event: response.data[i].eventID, name: response.data[i].sessionName })
        }
        this.loading = false
        this.sessionDispVal = 'Select Event First'
        console.log(this.sessionOptions)
      })
      .catch((error) => {
        if (error.response) {
          this.$q.notify({
            color: 'info',
            position: 'top',
            message: 'Error retreiving events: ' + error.response.status,
            icon: 'cloud'
          })
          this.loading = false
          this.dispVal = 'Error Loading'
          this.sessionDispVal = 'Error Loading'
        } else if (error.request) {
          if (error.code === 'ECONNABORTED') {
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: 'Event retrieval timeout, are you online?' // + error.request
            })
          } else {
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
        url: 'https://cadgroup2.jdrcomputers.co.uk/api/events',
        timeout: this.timeout
      })
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.eventOptions.push({ label: response.data[i].eventName, value: response.data[i].eventID })
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
            if (error.code === 'ECONNABORTED') { // Ran if connection exceeds timeout limit
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Event retrieval timeout, are you online?'
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
        url: 'https://cadgroup2.jdrcomputers.co.uk/api/sessions/user/' + this.$store.state.data.userID,
        timeout: this.timeout // 20 second timeout
      })
        .then((response) => {
          this.sessionOptions = []
          for (var i = 0; i < response.data.length; i++) {
            this.sessionOptions.push({ label: response.data[i].speaker, value: response.data[i].sessionID, event: response.data[i].eventID, name: response.data[i].sessionName })
          }
          this.loading = false
          this.sessionDispVal = 'Select Event First'
          console.log(this.sessionOptions)
        })
        .catch((error) => {
          if (error.response) {
            this.$q.notify({
              color: 'info',
              position: 'top',
              message: 'Error retreiving events: ' + error.response.status,
              icon: 'cloud'
            })
            this.loading = false
            this.dispVal = 'Error Loading'
            this.sessionDispVal = 'Error Loading'
          } else if (error.request) {
            if (error.code === 'ECONNABORTED') {
              this.$q.notify({
                color: 'warning',
                position: 'top',
                message: 'Event retrieval timeout, are you online?' // + error.request
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
    joinRoom () {
      this.$router.push('/asking/')
      if (typeof this.sessionJoinNotif === 'function') {
        this.sessionJoinNotif()
      }
    },
    handleChange () { // Enables join room button on session select
      this.disabled = false
      this.sessionOptions.forEach(element => { // To output speaker/session name rather than session ID
        if (element.value === this.sessID) {
          this.sessLabel = element.label
          this.$store.commit('data/setSession', element)
        }
      })
    },
    handleEventSelect () { // For when an event is selected, populates session list with all sessions in that event which the user is subscribed to
      this.sessSubset = []
      console.log(this.eventSelect)
      console.log(this.sessionOptions[0].eventID)
      for (var i = 0; i < this.sessionOptions.length; i++) {
        if (this.sessionOptions[i].event === this.eventSelect) {
          this.sessSubset.push({ label: this.sessionOptions[i].label, value: this.sessionOptions[i].value })
        }
      }
      if (this.sessSubset.length > 0) {
        this.disableSessSelect = false
      } else {
        this.disableSessSelect = true
        if (typeof this.noSessNotif === 'function') {
          this.noSessNotif()
        }
        this.noSessNotif = this.$q.notify({
          color: 'warning',
          position: 'top',
          message: 'No subscribed sessions in this event'
        })
      }
    }
  }
}
</script>
