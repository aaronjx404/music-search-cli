module.exports = (item, index) => `${index + 1}. ${item.name} -[ ${item.artists[0].name} ]-「${item.album.name}」`
