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

function getHtmlBuilder() {
  const templateContent = fs.readFileSync(
    path.join(__dirname, 'index.hbs'),
    'utf-8'
  );
  const cssContent = fs.readFileSync(
    path.join(__dirname, 'index.css'),
    'utf-8'
  );
  const socialMediaContent = fs.readFileSync(
    path.join(__dirname, 'social-media.hbs'),
    'utf-8'
  );

  Handlebars.registerPartial('css', cssContent);
  Handlebars.registerPartial('socialMedia', socialMediaContent);

  return Handlebars.compile(templateContent);
}

const template = getHtmlBuilder();

app.get('/', (req, res) => {
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
