let https = require('https');
let crypto = require('crypto');
let express = require('express');
let sign = require('./src/js/sign.js');

// console.log(sign('jsapi_ticket', 'http://example.com'));
let app = express();

const TOKEN = 'werewolf-kill';
const APPSECRET = 'e206aaef01ed6e738d46a9deeb4cc15a';
const APPID = 'wx4e95556bd902571e';

let Access_Token = '';
let Access_Token_Expires = 0;
let Jsapi_Ticket = '';

function sha1(str) {
  let hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex');
}
// 获取access_token并缓存
function getAccessToken() {
  let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
  https.get(accessTokenUrl, (res) => {
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(data);
      let result = JSON.parse(data);
      if (undefined !== result.errcode) {
      // 记录错误日志 errmsg
        console.log(result.errmsg);
        return ;
      }
      Access_Token = result.access_token;
      Access_Token_Expires = result.expires_in;
      // 在Access_Token失效之前刷新
      setTimeout(getAccessToken, (Access_Token_Expires  -120) * 1000);
      getJsapiTicket(Access_Token)
    });
  });
}

// 获ticket并缓存
function getJsapiTicket(token) {
  let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${Access_Token}&type=jsapi`;
  https.get(ticketUrl, (resp) => {
    resp.setEncoding('utf8');
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      let res = JSON.parse(data);
      if (0 !== res.errcode) {
      // 记录错误日志 errmsg
        console.log(res.errmsg);
        return ;
      }
      Jsapi_Ticket = res.ticket;
      console.log(`Jsapi_Ticket: ${Jsapi_Ticket}`)
    });
  });
}

// 获取 Access_Token 和 Jsapi_Ticket
getAccessToken();
// 静态资源服务
// app.use('/', express.static('./dist'))

// 微信公众号接入
app.get('/werewolf/access', (req, res) => {
  let rs = '';
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce = req.query.nonce;
  let echostr = req.query.echostr;

  // 1. 将token、timestamp、nonce三个参数进行字典序排序
  // 2. 将三个参数字符串拼接成一个字符串进行sha1加密
  let str = [timestamp, nonce, TOKEN].sort().join('');
  if (sha1(str) === signature) {
    res.send(echostr);
  } else {
    res.send('Something error!');
  }
});

// 处理关注公众号事件
app.post('/werewolf/access', (req, res) => {

});

// 获取jssdk签名
app.get('/werewolf/jssdk/sign', (req, res) => {
  let url = unescape(req.query.url);
  console.log(url)
  if (Jsapi_Ticket === '') {
    res.json({
      errcode: 101,
      errmsg: 'invalid jsapi_ticket!'
    });
    return;
  }
  if (undefined === url) {
    res.json({
      errcode: 101,
      errmsg: 'url cont\'t be undefined!'
    });
    return;
  }
  res.json(sign(Jsapi_Ticket, url));
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
