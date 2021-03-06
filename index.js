const EventEmitter = require('events')
const names = require('./lib/names')

class Emitter extends EventEmitter {}

const emitter = new Emitter()

;['search', 'choose', 'find', 'download'].forEach((key) => {
  const fn = require(`./lib/${key}`)
  emitter.on(key, async function (...args) {
    const res = await fn(...args)
    this.emit('handler', key, res, ...args)
  })
})

// 搜索后触发 afterSearch，它回调里面继续触发 choose 事件
emitter.on('afterSearch', function (data, q) {
  if (!data || !data.result || !data.result.songs) {
    console.log(`没搜索到 ${q} 的相关结果`)
    return process.exit(1)
  }
  const { songs } = data.result
  this.emit('choose', songs)
})
// 在歌曲被选中后，它回调里面继续触发 find 事件
emitter.on('afterChoose', function (answers, songs) {
  const [selectedSong] = songs.filter((song, i) => names(song, i) === answers.song)
  if (selectedSong && selectedSong.id) {
    this.emit('find', selectedSong, answers.song)
  }
})
// 在歌曲被找到后，在它回调里面触发下载事件
emitter.on('afterFind', function ({ song, res, findName }) {
  if (!res[0] || !res[0].url) {
    console.log(`没查找到 ${findName} 的相关下载资源`)
    return process.exit(1)
  }
  this.emit('download', {
    song,
    findMusic: res[0],
    findName,
  })
})
// 下载结束
emitter.on('downloadEnd', function () {
  console.log('下载结束')
  process.exit()
})

// 这里的 handler 精简了多个事件的判断
// 为不同的事件增加了不同的触发回调
emitter.on('handler', function (key, res, ...args) {
  switch (key) {
    case 'search':
      return this.emit('afterSearch', res, args[0])
    case 'choose':
      return this.emit('afterChoose', res, args[0])
    case 'find':
      return this.emit('afterFind', res)
    case 'download':
      return this.emit('downloadEnd', res)
  }
})

module.exports = emitter
