// Just a simple share object, for now
export default {
  state: {
    login: {
      valid: false,
      admin: false,
      user: null
    }
  },
  userLogin (user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('User Login: ' + user.displayName)
    }
    this.state.login.user = user
    this.state.login.admin = false
    this.state.login.valid = true
  },
  setAdminUser () {
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin login')
    }
    this.state.login.admin = true
  },
  userLogout () {
    if (process.env.NODE_ENV === 'development') {
      console.log('User Logout')
    }
    this.state.login.user = null
    this.state.login.admin = false
    this.state.login.valid = true
  }
}
