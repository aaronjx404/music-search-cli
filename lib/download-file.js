const https = require('https')
const fs = require('fs')
const cliProgress = require('cli-progress')

module.exports = (url, filePath) =>
  new Promise((resolve, reject) => {
    const fileSteam = fs.createWriteStream(filePath, { flags: 'a+' })

    const progress = new cliProgress.SingleBar({
      format: '下载进度 | {bar} | {percentage}%',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    })

    console.log('文件下载开始...')

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(`http status: ${res.statusCode}`)
        return
      }

      progress.start(res.headers['content-length'], 0)

      let dataLength = 0

      res.on('data', (chunk) => {
        dataLength += chunk.length
        progress.update(dataLength)
      })

      fileSteam
        .on('finish', () => {
          progress.stop()
          console.log('文件保存完成')
          resolve()
        })
        .on('error', (err) => {
          fs.unlinkSync(filePath)
          reject(err.message)
        })

      res.pipe(fileSteam)
    })
  })
