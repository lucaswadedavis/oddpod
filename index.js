var port = process.argv[2] || process.env.PORT || 8080;

var express = require('express');
var jsonfile = require('jsonfile');
var humps = require('humps');
var extractor = require('unfluff');
var got = require('got');
var fs = require('fs');
var removeWhitespace = require('remove-whitespace');
var watson = require('watson-developer-cloud');
var Podcast = require('podcast');
var config = require('./config.js');

var join = require('path').join;
var app = express();
var filePath = './data.json';
//var host = 'https://eiwzgndtuq.localtunnel.me/';
var host = 'https://ofibdjeqfy.localtunnel.me/';



var www = join(__dirname, 'audio');
app.use(express.static(www));


var text_to_speech = watson.text_to_speech({
  username: config.ibm.username,
  password: config.ibm.password,
  version: 'v1'
});

app.get('/url', (req, res) => {
    //var url = 'https://www.bloomberg.com/view/articles/2016-11-23/fake-news-may-not-be-protected-speech';
    var url = 'https://www.scientificamerican.com/article/hidden-ldquo-planet-x-rdquo-could-orbit-in-outer-solar-system/';
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
        var audioFilePath = encodeURI(removeWhitespace(humps.decamelize(urlData.title))) + '.ogg';
        urlData.audioFilePath = audioFilePath;
        console.log(urlData.title);
        urlData.text;
        var bytes = Buffer.byteLength(urlData.text, 'utf8');
        var text = urlData.text.split('.');
        var str = '';
        for (var i = 0, str = ''; Buffer.byteLength(str) + Buffer.byteLength(text[i]) < 5000; i++) {
            str += text[i];
        }
        console.log('final str size: ' + Buffer.byteLength(str));
        var params = {
          //text: str,
          text: str,
          voice: 'en-US_AllisonVoice',
          accept: 'audio/ogg;codecs=opus'
          //accept: 'audio/wav'
        };

        // Pipe the synthesized text to a file.
        text_to_speech
            .synthesize(params, function (req, res) {
                fs.writeFile('./audio/' + audioFilePath, res, function () {console.log('done writing');});
                // then we add the relevant data to the rss feed.
                var feed = new Podcast({title: 'oddpod'});
                console.log('at the feed step.');

                feed.item({
                    title: urlData.title,
                    enclosure: {
                        url: host + urlData.audioFilePath,
                        file: './audio/' + urlData.audioFilePath
                    }
                })

                fs.writeFileSync('./audio/feed.rss', feed.xml());
            });
            //.pipe(fs.createWriteStream('./audio/' + audioFilePath));

        return urlData;
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
