const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');


describe('Google Play Apps', () => {
  it('returns full list of apps when no queries are supplied', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(20);
        expect(res.body[0]).to.include.all.keys('App', 'Rating', 'Genres');
      });
  });

  it('returns 400 error when genres does not match accepted values', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'null' })
      .expect(400, 'Genre must be either: Action, Puzzle, Strategy, Casual, Arcade, or Card');
  });

  it('returns 400 error when sort does not match accepted values', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'null' })
      .expect(400, 'Must sort by Rating or App');
  });

  it('returns filtered genre results', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Card' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let correctGenre = true;
        res.body.forEach(app => {
          if (!app.Genres.toLowerCase().includes('card')) {
            correctGenre = false;
          }
        });
        expect(correctGenre).to.be.true;
      });
  });
  // it('returns sorted results correctly', () => {
  //   return supertest(app)
  //     .get('/apps')
  //     .query({ sort: 'App' })
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .then(res => {



});