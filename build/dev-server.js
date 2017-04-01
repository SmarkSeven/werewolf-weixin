require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var cheerio = require('cheerio');
var url = require('url');
var http = require('http');
var xmlreader = require('xmlreader');
var webpack = require('webpack')
var bodyParser = require('body-parser')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/praise/add', urlencodedParser, function (req, res) {
});
app.post('/movie/praisestory', urlencodedParser, function (req, res) {
});
app.post('/comment/praise', urlencodedParser, function (req, res) {
});
app.post('/comment/unpraise', urlencodedParser, function (req, res) {
});
app.post('/collection/add', urlencodedParser, function (req, res) {
});
app.post('/collection/del', urlencodedParser, function (req, res) {
});

var isXiamiSong = /www.xiami.com\/song\/\d+/;
var sidPattern = /(\d+)/;
var songUrlPattern = /a href="(\/song\/\d+)"/g;

app.get('/xiami/song',urlencodedParser, function(req, res) {
    console.log(req.query.id)
    const songId = req.query.id;
    var options = url.parse('http://www.xiami.com/song/playlist/id/'+ songId +'/object_name/default/object_id/0');
    var xiamiRealSong = {};
    http.get(options, function(resp) {
        resp.setEncoding('utf8');
        var xml = '';
        resp.on('data', function(data) {
            xml += data;
        })
        resp.on('end', function() {
            xmlreader.read(xml, function(errors, responsive){
                if(null !== errors ){
                    res.json({
                        'res': 1,
                        'message': '服务内部错误。'+errors,
                    });
                    return;
                }
                if (!responsive.playlist) {
                    res.json({
                        'res': 1,
                        'message': '没找到相关信息，该歌曲很可能已经从虾米下架。'
                    });
                    return;
                }
                xiamiRealSong.title = toTxt(responsive.playlist.trackList.track.title.text());
                xiamiRealSong.artist = parseArtist(responsive.playlist.trackList.track);
                xiamiRealSong.album = toTxt(responsive.playlist.trackList.track.album_name.text());
                xiamiRealSong.url = getMp3Location(responsive.playlist.trackList.track.location.text());

                if (typeof responsive.playlist.trackList.track.lyric_url.text !== 'undefined') {
                    xiamiRealSong.lyricUrl = toTxt(responsive.playlist.trackList.track.lyric_url.text());
                } else {
                    xiamiRealSong.lyricUrl = null;
                }
                // 封面处理
                var cover;
                var coverpath = responsive.playlist.trackList.track.pic.text();
                var coverReg = /http:\/\/[a-zA-Z0-9-.-\/-_]+.(jpg|jpeg|png|gif|bmp)/g;
                var json;
                // 正则替换小的封面为大封面
                if(coverReg.test(coverpath)){
                    coverpath.replace(coverReg, function(s,value) {
                        cover = s.replace('_1', '');
                    });
                }
                xiamiRealSong.cover =  cover;
                json = xiamiRealSong;
                res.json({
                  res: 0,
                  data: json,
                });
            })
        });
    });

});


function toTxt(str){
    var RexStr = /(&lt;|&gt;|&quot;|&#39;|&#039;|&amp;)/g;
    str = str.replace(RexStr,
        function(MatchStr){
            switch(MatchStr){
                case "&lt;":
                    return "<";
                    break;
                case "&gt;":
                    return ">";
                    break;
                case "&quot;":
                    return '\"';
                    break;
                case "&#39;":
                    return "'";
                    break;
                case "&#039;":
                    return "'";
                    break;
                case "&amp;":
                    return "&";
                    break;
                default :
                    break;
            }
        }
    )
    return str;
}

function getMp3Location(str) {
    try {
        var a1 = parseInt(str.charAt(0)),
            a2 = str.substring(1),
            a3 = Math.floor(a2.length / a1),
            a4 = a2.length % a1,
            a5 = [],
            a6 = 0,
            a7 = '',
            a8 = '';
        for (; a6 < a4; ++a6) {
            a5[a6] = a2.substr((a3 + 1) * a6, (a3 + 1));
        }
        for (; a6 < a1; ++a6) {
            a5[a6] = a2.substr(a3 * (a6 - a4) + (a3 + 1) * a4, a3);
        }
        for (var i = 0,a5_0_length = a5[0].length; i < a5_0_length; ++i) {
            for (var j = 0,a5_length = a5.length; j < a5_length; ++j) {
                a7 += a5[j].charAt(i);
            }
        }
        a7 = decodeURIComponent(a7);
        for (var i = 0,a7_length = a7.length; i < a7_length; ++i) {
            a8 += a7.charAt(i) === '^' ? '0': a7.charAt(i);
        }
        return a8;
    } catch(e) {
        return false;
    }
}

function parseArtist(track) {
    if (track.artist.hasOwnProperty('text')) {
        return toTxt(track.artist.text())
    } else if (track.artist_name.hasOwnProperty('text')) {
        return toTxt(track.artist_name.text())
    } else {
        return '未知艺术家';
    }
}

var uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it

  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
