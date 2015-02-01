// var db = require('../../../db');
// var User = require('../../../models/user');
// var Song = require('../../../models/song');
// var expect = require('chai').expect;
// var async = require('async');

// describe('a song', function () {
//   var song;

//   beforeEach(function (done) {
//     Song.remove({}, function (err) {
//       song = new Song({ artist: 'Rachel Loy',
//                         title: 'Stepladder',
//                         album: 'Broken Machine',
//                         duration: 180000,
//                         key: 'ThisIsAKey.mp3',
//                         echonestId: 'ECHONEST_ID' });
//       User.remove({}, function (err) {
//         user = new User({ twitter: 'BrianKeaneTunes',
//                           twitterUID: '756',
//                           email: 'lonesomewhistle@gmail.com',
//                           birthYear: 1977,
//                           gender: 'male',
//                           profileImageUrl: 'http://badass.jpg' });
//         Station.remove({}, function (err) {
//           station = new Station ({ _user: user.id,
//                                    }) 
//         })

//       })
//       done();
//     });
//   });