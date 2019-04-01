<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;"> <!-- Width of input never exceeds 500px -->
      <!-- To set maximum input length -->
      <q-field
      :count="maxQ"
      :warning="warning"
      >
        <!-- Puestion input field -->
        <q-input
          clearable
          v-model="question"
          type="textarea"
          :max-height="maxInputHeight"
          float-label="Enter Question Here"
          :maxlength="maxQ"
          @keydown.enter.prevent="questionSubmit"
          @input="checkWarn"
        />
      </q-field>
    </div>
    <div>
      <!-- Submit question button to run questionSubmit-->
      <q-btn
        style="margin-top: 20px;"
        :icon-right="iconStyle"
        :label="sendVal"
        :loading="loading"
        :disabled="disabled"
        @click="questionSubmit()"
        />
    </div>
    <div>
      <!-- Button to run toRoom function to rewrite DOM -->
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
    return { // Initiate local variables
      question: '',
      loading: false,
      timeout: 20000,
      apiAddress: 'https://cadgroup2.jdrcomputers.co.uk/api/questions',
      maxInputHeight: 0.33 * window.innerHeight,
      maxQ: 250,
      warning: false,
      disabled: false,
      acceptingQuestions: false,
      polling: null,
      sendVal: 'Submit Question',
      iconStyle: 'send'
    }
  },
  beforeDestroy: function () { // Verify the polling is ended before the page is closed
    clearInterval(this.polling)
  },
  mounted: function () {
    this.polling = setInterval(() => { // Check status of the session every 5 seconds
      this.$axios({
        method: 'get',
        url: 'https://cadgroup2.jdrcomputers.co.uk/api/sessions/' + this.$store.state.data.session.value,
        timeout: this.timeout // 20 second timeout
      })
        .then((response) => {
          if (response.data.acceptingQuestions === 1) { // When accepting questions
            this.acceptingQuestions = true
            this.checkWarn()
            this.sendVal = 'Submit Question'
            this.iconStyle = 'send'
          } else { // When not accepting questions
            this.acceptingQuestions = false
            this.disabled = true
            this.sendVal = 'Session not Accpeting Questions'
            this.iconStyle = ''
          }
        })
        .catch((error) => {
          this.sendVal = 'Trouble Contacting Server' // Chnages button text
          this.iconStyle = 'error'
          this.acceptingQuestions = false
          this.disabled = true
          if (error.response) { // Catching errors
            console.log(error.response.data)
          } else if (error.request) {
            if (error.code === 'ECONNABORTED') {
              console.log('Timeout')
            }
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
    }, 5000)
  },
  methods: {
    questionSubmit: function () { // Function called to submit the question with ajax post request
      if (this.question !== undefined && this.question !== '') { // Only allow existing questions, most fundamental verification
        if (this.question.length <= this.maxQ) {
          this.loading = true
          console.log(this.question)
          this.$axios({ // Construction of API request
            method: 'post',
            url: this.apiAddress,
            data: {
              question: this.question,
              sessionID: this.$store.state.data.session.value,
              userID: this.$store.state.data.userID
            },
            timeout: this.timeout
          })
            .then((response) => {
              this.loading = false
              this.question = ''
              this.$q.notify({ // Informs user of successful submission
                color: 'positive',
                position: 'bottom',
                message: 'Submission successful'
              })
            })
            .catch((error) => {
              if (error.response) {
                // console.log(error.response.data);
                this.$q.notify({
                  color: 'info',
                  position: 'top',
                  message: 'Error sending question: \n' + error.response.status,
                  icon: 'cloud'
                })
                this.loading = false
              } else if (error.request) {
                if (error.code === 'ECONNABORTED') { // Ran if connection exceeds timeout limit
                  if (typeof this.noTimeNotif === 'function') {
                    this.noTimeNotif()
                  }
                  this.noTimeNotif = this.$q.notify({
                    color: 'warning',
                    position: 'top',
                    message: 'Question submission failed, are you online?'
                  })
                } else {
                  if (typeof this.noConnNotif === 'function') {
                    this.noConnNotif()
                  }
                  this.noConnNotif = this.$q.notify({
                    color: 'warning',
                    position: 'top',
                    message: 'Could not submit question, are you online?'
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
                  message: 'Something went wrong'
                })
                console.log(error.request)
                this.loading = false
                this.dispVal = 'Error Loading'
              }
              console.log(error.config)
            })
        } else {
          if (typeof this.lastNotify === 'function') {
            this.lastNotify()
          }
          this.lastNotify = this.$q.notify({ // Return error message if no question is entered
            color: 'warning',
            position: 'bottom',
            message: 'Question exceeds character limit'
          })
        }
      } else {
        if (typeof this.noQuestion === 'function') {
          this.noQuestion()
        }
        this.noQuestion = this.$q.notify({ // Return error message if no question is entered
          color: 'negative',
          position: 'bottom',
          message: 'Please enter a question to submit'
        })
      }
    },
    checkWarn () { // Function to verify the input length is under maxQ, does not allow sending if over maxQ
      if (this.question.length > this.maxQ) {
        this.warning = true
        this.disabled = true
      } else {
        if (this.acceptingQuestions) {
          this.warning = false
          this.disabled = false
        }
      }
    },
    toRoom () { // Go back to session selection screen
      this.$store.commit('data/setSession', [])
      this.$router.push('/RoomSelect')
    }
  }
}

</script>
