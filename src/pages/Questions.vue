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
      loading: false
    }
  },
  mounted: function () {
    console.log('Page Loaded')
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
    questionSubmit: function () {
      if (this.question !== undefined && this.question !== '') { // Only allow existing questions, most fundamental verification
        this.loading = true
        setTimeout(() => { // Simulating a 1.5 second wait on a ficticious ajax call
          this.$q.notify({
            color: 'positive',
            position: 'bottom',
            message: 'Submission Successful' // Displays question for testing beofre api is ready
          })
          this.loading = false
          this.question = '' // Delete the sent question from the input
        }, 1500)
      } else {
        this.$q.notify({ // Return error message if no question is entered
          color: 'negative',
          position: 'bottom',
          message: 'Please enter a question to submit'
        })
      }
    },
    toRoom () {
      this.$router.push('/RoomSelect')
    }
  }
}

</script>
