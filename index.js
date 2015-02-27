var fs = require('fs')
var unirest = require("unirest")

var api_key = "YOUR_MASHAPE_API_KEY"

fs.exists('./colors.json', function(exists) {
  if (exists) {
    buildHTML(require('./colors.json'))
  } else {
    getColors("https://i.imgur.com/N2nASkl.jpg")
  }
});

function getColors(image) {
  unirest.get("https://colorengine.p.mashape.com/palette/"+image)
  .header("X-Mashape-Key", api_key)
  .header("Accept", "application/json")
  .end(function (res) {

    if (res.status === 403) {
      console.log("Missing API Key!")
      return
    }

    fs.writeFile("./colors.json", JSON.stringify(res.body), function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("Colors File Saved!")
        }
    })

    var colors = res.body
    buildHTML(colors)
  })
}

function buildHTML(colors) {

    var html = "<html><body>"

    for (var i = colors.length - 1; i >= 0; i--) {
      html += "<div style='padding:20px;background:"+colors[i].hex+"'></div>"
    }

    html += "</body></div>"

    fs.writeFile("./index.html", html, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("HTML File Saved!")
        }
    })
}