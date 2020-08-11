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

  res.send(
    template({
      hasVideoUrl: Boolean(videoUrl),
      videoUrl,
      autoplay: req.query.autoplay !== false,
    })
  );
});

app.get('*', (req, res) => res.redirect('/'));

