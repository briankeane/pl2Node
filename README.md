# pl2Node

---------------------------
## Models

### User
####### Properties
| Property                | Type                        |
| --------                | :---:                       |
| **twitter**             | *String*                    |
| **twitterUID**          | *String*                    |
| **email**               | *String*                    |
| **birthYear**           | *Number*                    |
| **gender**              | *String*                    |
| **zipcode**             | *String*                    |
| **profileImageUrl**     | *String*                    |
| **_station**            | *reference to 'Station'*    |

### Station
####### Properties
| Property                                | Type                        |
| --------                                | :---:                       |
| **_user**                               | *reference to 'User'*       |
| **secsOfCommercialPerHour**             | *Number*                    |
| **lastAccurateCurrentPosition**         | *Number*                    |
| **averageDailyListeners**               | *Number*                    |
| **averageDailyListenersCalculationDate**| *Date*                      |
| **timezone**                            | *String*                    |

#### AudioBlock (parent for Songs and Commentaries)
###### Properties
| Property                | Type                        |
| --------                | :---:                       |
| **type**                | *String*                    |
| **key**                 | *String*                    |
| **duration**            | *Number*  (positive or negative Integer... number of ms)*

#### Commentary (inherit from audioBlock)
###### Properties
* _station         *reference to 'Station'*
* title            *String*

#### Song (inherit from audioBlock)
###### Properties
| Property                | Type                        |
| --------                | :---:                       |
| **artist**              | *String*                    |
| **title**               | *String*                    |
| **album**               | *String*                    |
| **echonestId**          | *String*                    |
| **albumArtworkUrl**     | *String*                    |
| **itunesTrackViewUrl**  | *String*                    |


###### Statics:
```javascript
Song.findAllMatchingTitle('Test', function (err, songArray){
  // songs matching title
}); 

Song.findAllMatchingArtist('Bob', function (err, songArray){
  // all matching artist ('Bob' and 'Bobby' would both be inlcuded)
}); 

Song.keywordSearch('Test This out', function (err, songArray){
  // array of songs where title or artist contain keywords
}); 

Song.findAllByTitleAndArtist({ artist: 'Randy Rogers Band',
                               title: 'One More Goodbye' }, function (err, songArray){
  // array of matching Songs
}); 

Song.all(function (songArray) {
  // all Songs ordered by title, artist
});
```
#### LogEntry
###### Properties
| Property                | Type                        |
| --------                | :---:                       |
| **playlistPosition**    | *Number*                    |
| **_audioBlock**         | *reference to 'AudioBlock'* |
| **_station**            | *reference to 'Station'*    |
| **airtime**             | *Date*                      |
| **listenersAtStart**    | *Number*                    |
| **listenersAtFinish**   | *Number*                    |
| **durationOffset**      | *Number, default: 0*        |
| **commercialsFollow**   | *Boolean*                   |
######Virtual Properties:
| Property                | Type                        |
| --------                | :---:                       |
| **endTime**             | *Date*                      |
| **duration**            | *Number (in ms)*            |

###### Statics:
```javascript
LogEntry.getRecent({ _station: station.id,
                      count: 5  // default count is 1000
                    }, function (err, logEntryArray) {
  // logEntries starting with most recent
});

LogEntry.getFullStationLog(station.id, function (err, logEntryArray) {
  // logEntries starting with most recent
});

LogEntry.getLog({ _station: station.id,
                  startTime: new Date(1983,3,15, 12,30),
                  endTime: new Date(1983,3,15, 12,45) 
                }, function (err, logEntryArray) {
  // logEntries starting with most recent
});

LogEntry.getLog({ _station: station.id,
                  startingPlaylistPosition: 22,
                  endingPlaylistPosition: 25 
                }, function (err, logEntryArray) {
  // logEntries starting with most recent
});

LogEntry.getLog({ _station: station.id,
                  startingDate: new Date(1983,3,14),
                  endingDate: new Date(1983,3,15) 
                }, function (err, logEntryArray) {
  // logEntries starting with most recent (midnight to midnight)
});

LogEntry.getEntryByPlaylistPosition({ _station: station.id,
                                      playlistPosition: 14
                                    }, function (err, logEntry) {
  // logEntry
});
```
#### Spin
###### Properties
| Property              | Type                        |
| --------              | :---:                       |
| **playlistPosition**  |*Number*                     |
| **_audioBlock**       |*reference to 'AudioBlock'*  |
| **_station**          |*reference to 'Station'*     |
| **airtime**           |*Date*                       |
| **durationOffset**    |*Number, default: 0*         |

######Virtual Properties:
| Property              | Type                        |
| --------              | :---:                       |
| **commercialsFollow** | *Boolean*                   |
| **endTime**           | *Date*                      |
| **duration**          | *Number (in ms)*            |

###### Statics:
```javascript
Spin.getFullPlaylist(station.id, function (err, spins) {
  // array of spins in chronological order
});
Spin.getPartialPlaylist({ _station: station.id,
                          endTime: new Date(1983,3,15, 12,30),  // and/or
                          startTime: new Date(1983,3,14, 12,30)
                        }, function (err spins) {
  // array of spins in chronological order
});
Spin.getPartialPlaylist({ _station: station.id,
                          endingPlaylistPosition: 12,  // and/or
                          startingPlaylistPosition: 20
                        }, function (err spins) {
  // array of spins in chronological order
});
```
#### RotationItem
###### Properties
| Property        | Type                        |
| --------        | :---:                       |
| **_station**    |  *reference to 'Station'*   |
| **_song**       | *reference to 'Song'*       |
| **bin**         |  *String*                   |
| **weight**      | *Number*                    |
| **assignedAt**  | *Date*                      |
| **history**     |*[{ bin: String, weight: Number, assignedAt: Date }]* |

###### Statics:
```javascript
RotationItem.findByIdAndPopulate(rotationItemId, function (err, rotationItem) {
  // populated rotationItem
});

RotationItem.findAllForStation(stationId, function (err, rotationItems) {
  // array of rotationItems for the station
});
```
###### Methods:
```
rotationItem.updateWeight(newWeight, function (err, updatedRotationItem) {
  // updates the rotationItem's weight, stores the 
});

rotationItem.updateBin(newBin, function (err, updatedRotationItem) {
  // does the same with the 'bin'
});

rotationItem.updateWeightAndBin(newWeight, newBin, function (err, updatedRotationItem) {
  // take a guess :)
});
```
