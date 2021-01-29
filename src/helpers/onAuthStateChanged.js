import axios from 'axios'

function onAuthStateChanged(cb) {
  axios.get('/api/user/onAuthStateChanged')
    .then(res => {
      cb({isLoggedIn: res.data.loggedIn, user: res.data.user})
    })
    .catch(() => {
     cb({isLoggedIn: false, user: null})
    })
}

export default onAuthStateChanged