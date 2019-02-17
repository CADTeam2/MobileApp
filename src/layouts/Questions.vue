<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;">
      <p>Questions</p>
      <q-input
        v-model="question"
        type="textarea"
        float-label="Enter Question"
        @keydown.enter="dummySendQuestion()"
      />
      <q-btn
        style="margin-top: 20px;"
        icon="lock_open"
        label="Send Question!"
        @click="dummySendQuestion()"
        />
        <div>
          <q-btn
            style="margin-top: 20px;"
            icon="lock_open"
            label="Previous page"
            @click="prevPage()"
            />
        </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  methods: {
    loadData () {
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
    dummySendQuestion () {
      this.$q.notify({
        color: 'positive',
        position: 'top',
        message: 'Questions sent: ' + this.question
      })
    },
    prevPage () {
      this.$router.push('/')
      this.$q.notify({
        color: 'positive',
        position: 'top',
        message: 'Login Page Loaded'
      })
    }
  }
}

</script>
