// var db = require('../../../db');
// var User = require('../../../models/user');
// var Commentary = require('../../../models/commentary');
// var expect = require('chai').expect;
// var async = require('async');

// describe('a song', function () {
//   var commentary;

//   beforeEach(function (done) {
//     Commentary.remove({}, function (err) {
//       commentary = new Commentary({  duration: 180000,
//                                      key: 'ThisIsAKey.mp3',
//                                      echonestId: 'ECHONEST_ID' });
//       commentary.save(function (err, commentary) {
//         done();
//       });
//     });
//   });

//   it('can be created and retrieved', function (done) {
//     Commentary.findById(commentary.id, function (err, foundCommentary) {
//       expect(err).to.equal(null);
//       expect(foundCommentary.id).to.equal(commentary.id);
//       expect(foundCommentary.)
//       done();
//     });
//   });

//   xit('can be updated', function (done) {

//   });
//   xit('can be deleted', function (done) {

//   });
// });
