<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;">
      <p>Login</p>
      <q-input
        v-model="email"
        ref="username"
        type="email"
        float-label="Username or email"
        @keyup.enter="shiftFocus()"
      />
      <q-input
      v-model="password"
      ref="password"
      type="password"
      float-label="Password"
      @keyup.enter="loginSubmit()"
      />
  </div>
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
            @click="loginSubmit()"
            :loading="loading"
            />
        </div>
  </q-page>
</template>

<style>
</style>

<script>
document.addEventListener('deviceready', () => {

}, false)
export default {
  name: 'PageIndex',
  timeout: 20000,
  userExist: false,
  loading: false,
  methods: {
    nextPage () {
      this.$router.push('/RoomSelect')
      this.$q.notify({ // Notification for simulated login
        color: 'positive',
        position: 'bottom',
        message: 'Pseudo login successful'
      })
    },
    loginSubmit () {
      this.loading = true
      this.$axios({
        method: 'get',
        url: 'https://cors-anywhere.herokuapp.com/https://cadgroup2.jdrcomputers.co.uk/api/users',
        timeout: this.timeout
      })
        .then((response) => {
          response.data.forEach(element => {
            if (element.username === this.email || element.email === this.email) {
              this.userExist = true
              if (element.password === this.password) {
                this.$store.commit('data/setUserID', element.userID)
                this.$router.push('/RoomSelect')
              } else {
                this.$q.notify({
                  color: 'warning',
                  position: 'top',
                  message: 'Password incorrect'
                })
              }
            }
          })
          if (!this.userExist) {
            this.$q.notify({
              color: 'warning',
              position: 'top',
              message: 'User does not exist'
            })
          }
        })
      console.log(this.$store.state.data.userID)
    },
    shiftFocus () {
      this.$refs.username.blur()
      this.$refs.password.focus()
    }
  }
}

</script>
