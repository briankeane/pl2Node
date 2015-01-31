var db = require('../../../db');
var User = require('../../../models/user');
var Song = require('../../../models/song');
var Commentary = require('../../../models/commentary');
var CommercialBlock = require('../../../models/commercialBlock');
var expect = require('chai').expect;
var async = require('async');

describe('a song', function () {
  var song;

  beforeEach(function (done) {
    Song.remove({}, function (err) {
      song = new Song({ artist: 'Rachel Loy',
                        title: 'Stepladder',
                        album: 'Broken Machine',
                        duration: 180000,
                        key: 'ThisIsAKey.mp3',
                        echonestId: 'ECHONEST_ID' });
      done();
    });
  });