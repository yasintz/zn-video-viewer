const port = process.env.PORT || 3000;
const morgan = require('morgan');

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

var express = require('express');

var app = express();

app.use(express.json());

app.use(morgan('dev'));

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on server http://localhost:${port}`);
});

const videoUrlStore = {};

function getOrCreateVideoUrl(url) {
  const storredVideoId = videoUrlStore[url];
  if (storredVideoId) {
    return storredVideoId;
  }
  const id = ID();
  videoUrlStore[url] = id;
  return id;
}

function getUrlFromVideoId(id, domain) {
  return domain + '/' + id;
}

const fileContent = fs.readFileSync(path.join(__dirname, 'index.hbs'), 'utf-8');

const template = Handlebars.compile(fileContent);

app.get('/', (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host');
  const videoUrl = req.query.videoUrl;

  if (videoUrl && !validURL(videoUrl)) {
    res.redirect('/');
    return;
  }

  res.send(
    template({
      hasVideoUrl: Boolean(videoUrl),
      videoUrl,
      autoplay: req.query.autoplay !== false,
      sortUrl: videoUrl
        ? getUrlFromVideoId(getOrCreateVideoUrl(videoUrl), fullUrl)
        : undefined,
    })
  );
});

app.get('/:videoId', (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host');
  const findedUrlArray = Object.entries(videoUrlStore).find(
    ([url, id]) => id === req.params.videoId
  );
  if (!findedUrlArray) {
    res.redirect('/');
    return;
  }

  const [videoUrl, id] = findedUrlArray;

  res.send(
    template({
      hasVideoUrl: true,
      videoUrl,
      isUsedVideoId: true,
      autoplay: req.query.autoplay !== false,
      sortUrl: getUrlFromVideoId(id, fullUrl),
    })
  );
});

app.get('*', (req, res) => res.redirect('/'));

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(str);
}

function ID() {
  return Math.random().toString(36).substr(2, 9);
}
