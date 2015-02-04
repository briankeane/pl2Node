# pl2Node

---------------------------
## Models

### User
#### Properties
* twitter: *String*
* twitterUID: *String*
* email *String*
* birthYear *Number*
* gender *String*
* zipcode *String*
* profileImageUrl *String*
* _station *reference to 'Station'

### audioBlock (parent for Songs and Commentaries)
#### Properties
* type *String*
* key  *String*
* duration *Number*  (positive or negative Integer... number of ms)

### song (inherit from audioBlock)
#### Properties
* artist *String*
* title *String*
* album *String*
* echonestId *String*
* albumArtworkUrl *String*
* itunesTrackViewUrl *String*

###### Model-Level Statics:
* *findAllMatchingTitle*(**title, callback**)  -- returns array of Songs
```
Song.findAllMatchingTitle('Test', function (err, songArray){
  // songArray
}); 
```
* *findAllMatchingArtist*(**artist, callback**) -- returns array of Songs
```
Song.findAllMatchingArtist('Test', function (err, songArray){
}); 
```
* *keywordSearch*(**keywords, callback**)  --  searches title and artist -- returns array of songs.
```
* *findAllMatchingArtist*(**artist, callback**) -- returns array of Songs
```
Song.keywordSearch('Test This out', function (err, songArray){
}); 
```
* *findAllByTitleAndArtist*(**attrs, callback**) -- returns array of songs
```
Song.findAllByTitleAndArtist({ artist: 'Randy Rogers Band',
                               title: 'One More Goodbye' }, function (err, songArray){
}); 
```
* *all* -- returns all songs sorted by artist, title
```
Song.all(function (songArray) {
  // songArray
});
```
