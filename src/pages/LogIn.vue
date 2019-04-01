<template>
  <q-page padding class="docs-input flex flex-center column justify-center">
    <div style="width: 500px; max-width:90vw;">
      <p>Login</p>
      <!-- Username/email login input on pressing enter switches to password input -->
      <q-input
        v-model="email"
        ref="username"
        type="email"
        float-label="Username or email"
        @keyup.enter="shiftFocus()"
      />
      <!-- Password input to run loginSubmit function when enter is pressed-->
      <q-input
      v-model="password"
      ref="password"
      type="password"
      float-label="Password"
      @keyup.enter="loginSubmit()"
      />
  </div>
        <div>
          <!-- Login button on press runs loginSubmit -->
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
export default {
  // Page variables
  name: 'PageIndex',
  timeout: 20000,
  userExist: false,
  loading: false,
  methods: {
    // Method for attempting login
    loginSubmit () {
      this.loading = true // Sets loading variable for the login button to display
      this.$axios({
        method: 'get',
        url: 'https://cadgroup2.jdrcomputers.co.uk/api/users',
        timeout: this.timeout
      }) // Sets up axios API request
        .then((response) => {
          response.data.forEach(element => {
            if (element.username === this.email || element.email === this.email) { // Checks for username or email
              this.userExist = true
              if (element.password === this.password) { // Checks correct password
                this.$store.commit('data/setUserID', element.userID) // sets the userID in the vuex store
                this.$router.push('/RoomSelect') // Changes the screen to RoomSelect
                if (typeof this.userNotExist === 'function') { // Removes notification if it exists
                  this.userNotExist()
                }
                if (typeof this.passIncorr === 'function') {
                  this.passIncorr()
                }
              } else {
                if (typeof this.passIncorr === 'function') {
                  this.passIncorr()
                }
                this.passIncorr = this.$q.notify({ // Notifies user of incorrect password
                  color: 'warning',
                  position: 'top',
                  message: 'Password incorrect'
                })
              }
            }
          })
          if (!this.userExist) {
            if (typeof this.userNotExist === 'function') {
              this.userNotExist()
            }
            this.userNotExist = this.$q.notify({
              color: 'warning',
              position: 'top',
              message: 'User does not exist'
            })
          }
        })
    },
    shiftFocus () { // Shifts focus from username to password input
      this.$refs.username.blur()
      this.$refs.password.focus()
    }
  }
}

</script>
