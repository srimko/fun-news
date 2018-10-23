// index.js
const cron = require('node-cron')
const request = require('request')
const xpath = require('xpath')
const Dom = require('xmldom').DOMParser
const chalk = require('chalk')
const _ = require('lodash')

function getParisTeamNews () {
  let url = 'http://www.paristeam.fr/feed'

  let news = []

  new Promise(function (resolve, reject) {
    request(url, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        let doc = new Dom().parseFromString(body)
        let titles = xpath.select('//title', doc)
        let links = xpath.select('//link', doc)
        let descriptions = xpath.select('//description', doc)
        let totalNewsLength = titles.length

        for (let i = 0; i < totalNewsLength; i++) {
          news.push({
            title: titles[i].firstChild.data,
            link: links[i].firstChild.data,
            description: descriptions[i].firstChild.data
          })
        }
      }
      resolve('All is fine')
    })
  }).then(() => {
    // console.log(news.slice(3))
    // console.log(news.length)
    _.each(news, (value, key) => {
      if (key < 3) {
        console.log(chalk.hex('#4E7C46')(value.title))
        console.log(chalk.hex('3381C1')(value.link))
        console.log(chalk.hex('#E4E3E5')(value.description))
      }
    })
    console.log(chalk.hex('#FFF')('░░░░░░░░░░░░░'))
  }).catch((err) => {
    console.log(err)
  })
}

cron.schedule('* * * * * *', function () {
  getParisTeamNews()
})
