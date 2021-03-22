const request = require('./request')

module.exports = (name) => {
  const url = 'https://musicapi.leanapp.cn/search?limit=100&keywords=' + name
  return request(url)
}
