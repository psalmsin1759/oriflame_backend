import axios from 'axios'

export default axios.create({
  baseURL: 'https://endpoint.oriflamedraw.com/api/'
  //baseURL: 'http://localhost:8888/lottery/api/'
})
