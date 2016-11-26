var port = process.argv[2] || process.env.PORT || 8080;

var express = require('express');
var jsonfile = require('jsonfile');
var extractor = require('unfluff');
var got = require('got');
var join = require('path').join;

var app = express();
var filePath = './data.json';
var webClient = join(__dirname, 'web-client');
app.use(express.static(webClient));
app.get('/url', (req, res) => {
    console.log(req.body);
    var url = 'https://www.bloomberg.com/view/articles/2016-11-23/fake-news-may-not-be-protected-speech';
    var data = {}
    jsonfile.writeFileSync(filePath, data);
    got(url)
    .then(response => extractor(response.body))
    .then(urlData => {
        data[url + ': ' + urlData.date] = urlData;
        jsonfile.writeFileSync(filePath, data, {spaces: 2});
        return urlData;
    })
    .then(urlData => {
        var audioFilePath = urlData.title;
        // then we send it to Watson
        // watson will return an audio file?
        // we'll save the audio file to the audio folder?
        return audioFilePath;
    })
    .then(audioFilePath => {
        // then we add the relevant data to the rss feed.
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
        res.send(error);
    }); 

    res.send('success');
});


app.listen(port, function () {
    console.log('Server started on port', port);
});
