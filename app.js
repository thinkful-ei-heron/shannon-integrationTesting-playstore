const express = require('express');
const morgan = require('morgan');
const googleApps = require('./googlePlayApps');

const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let results = googleApps;

  const { genres = '', sort = '' } = req.query;
  if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card', ''].includes(genres)) {
    return res
      .status(400)
      .send('Genre must be either: Action, Puzzle, Strategy, Casual, Arcade, or Card');
  }
  else if (!['Rating', 'App', ''].includes(sort)) {
    return res
      .status(400)
      .send('Must sort by Rating or App');
  }
  if (genres) {
    results = results.filter(app => app.Genres.includes(genres));
  }
  if (sort === 'App') {
    results = results.sort((a, b) => {
      return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
    });
  }
  if (sort === 'Rating') {
    results = results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  return res.status(200).json(results);
});

module.exports = app;