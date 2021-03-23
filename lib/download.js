const path = require('path')
const fs = require('fs')
const downloadFile = require('./download-file')

module.exports = async ({ song, findMusic, findName }) => {
  const musicDir = path.resolve(process.cwd(), './music')

  // 文件夹不存在则创建
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir)
  }

  // 获取文件路径
  const [, musicName] = findName.split('. ')
  const ext = path.extname(findMusic.url)
  const musicPath = path.join(musicDir, `${musicName}.${findMusic.id}${ext}`)

  if (!fs.existsSync(musicPath)) {
    await downloadFile(findMusic.url, musicPath).catch((err) => console.error(err))
  } else {
    console.log(`${musicName}已存在!`)
  }
}
