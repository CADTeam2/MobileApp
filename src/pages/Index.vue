<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <!-- <img alt="Imbroglio logo" src="~assets/ImbroglioDevelopmentThinkingDogClothed.svg" height="125" width="125"> -->
    <div style="width: 500px; max-width:90vw;">
      <p>Login</p>
      <q-input
        v-model="email"
        type="email"
        float-label="Username or email"
        @keyup.enter="shiftFocus()"
      />
      <q-input
      v-model="password"
      ref="password"
      type="password"
      float-label="Password"
      @keyup.enter="dummyLogin()"
      />
  </div>
      <q-btn
        style="margin-top: 20px;"
        icon="lock_open"
        label="Get number fact!"
        @click="loadData()"
        />
        <div>
          <q-btn
            style="margin-top: 20px;"
            icon="lock_open"
            label="Next page"
            @click="nextPage()"
            />
        </div>
        <div>
          <q-btn
            style="margin-top: 20px;"
            icon="lock_open"
            label="Login"
            @click="dummyLogin()"
            />
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
      if (this.email !== undefined) {
        this.$axios.get('http://numbersapi.com/' + this.email)
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
      } else {
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
      }
    },
    nextPage () {
      this.$router.push('/RoomSelect')
      this.$q.notify({ // Notification for simulated login
        color: 'positive',
        position: 'bottom',
        message: 'Pseudo login successful'
      })
    },
    dummyLogin () {
      this.$q.notify({
        color: 'positive',
        position: 'top',
        message: 'Email: ' + this.email + ' Password: ' + this.password
      })
    },
    shiftFocus () {
      this.$refs.password.focus()
    }
  }
}

</script>
