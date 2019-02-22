<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
      <!--<p id="rmID">Conference (room) name: {{ this.$route.params.roomName }}</p>-->
      <q-input
        clearable
        v-model="question"
        type="textarea"
        float-label="Enter Question Here"
      />
    </div>
    <div>
      <q-btn
        style="margin-top: 20px;"
        icon-right="send"
        label="Send Question!"
        :loading="loading"
        @click="questionSubmit()"
        />
    </div>
    <div>
      <q-btn
        style="margin-top: 20px;"
        label="Change Room"
        @click="toRoom()"
        />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return { // Value defaults to allow field refresh
      question: '',
      loading: false,
      timeout: 20000,
      apiAddress: 'https://reqres.in/'
    }
  },
  mounted: function () {
    console.log('Page Loaded') // Debug
  },
  methods: {
    loadData () { // Method to call basic random number fact api and displays the response as notification and writes to console
      this.$axios.get('http://numbersapi.com/random/trivia')
        .then((response) => {
          this.data = response.data
          console.log(response.data)
          this.$q.notify({
            message: response.data,
            color: 'info'
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    questionSubmit: function () { // Fucntion called to submit the question with ajax post request
      if (this.question !== undefined && this.question !== '') { // Only allow existing questions, most fundamental verification
        this.loading = true
        console.log(this.question)
        this.$axios({
          method: 'post',
          url: this.apiAddress + 'api/users',
          data: {
            question: this.question
          },
          timeout: this.timeout
        })
          .then((response) => {
            this.loading = false
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Submission ' + response.data.question + ' recieved' // Displays question for testing beofre api is ready
            })
          })
          .catch((error) => {
            if (error.response) {
              // console.log(error.response.data);
              this.$q.notify({
                color: 'info',
                position: 'top',
                message: 'Error retreiving conferences: ' + error.response.status,
                icon: 'cloud'
              })
              this.loading = false
              this.dispVal = 'Error Loading'
              // console.log(error.response.status);
              // console.log(error.response.headers)
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              if (error.code === 'ECONNABORTED') { // Ran if connection exceeds timeout limit
                this.$q.notify({
                  color: 'warning',
                  position: 'top',
                  message: 'Conference retrieval timeout, are you online?'
                })
              } else {
                this.$q.notify({
                  color: 'warning',
                  position: 'top',
                  message: 'Could not retrieve conferences, are you online?'
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
      } else {
        this.$q.notify({ // Return error message if no question is entered
          color: 'negative',
          position: 'bottom',
          message: 'Please enter a question to submit'
        })
      }
    },
    toRoom () { // Go back to session selection screen
      this.$router.push('/RoomSelect')
    }
  }
}

</script>
