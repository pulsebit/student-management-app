import axios from 'axios'

function logout(cb) {
  axios.get('/api/user/logout')
    .then(res => {
      cb({isLoggedIn: res.data.loggedIn, user: null})
    })
    .catch(err => {
      cb({isLoggedIn: false, user: null})
    })
}

export default logout