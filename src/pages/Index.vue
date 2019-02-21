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
      @keyup.enter="dummyLogin()"
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
            @click="dummyLogin()"
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
  methods: {
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
      this.$refs.username.blur()
      this.$refs.password.focus()
    }
  }
}

</script>
