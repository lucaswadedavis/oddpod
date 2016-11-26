# Oddpod

So, I'm trying to mashup a Feeldy-Saved-For-Later-to-Podcast thing. IFTTT's in the middle sending the saved for later stuff one thing at a time to this little node app which will retrieve the HTML and clean it up with `unfluff.js`, send it to Watson which will send back an audio file which I'll then insert into a podcast RSS feed for myself.

I'm trying to test it locally, exposing the RSS feed and audio files through localtunnel until I can verify that everything's working well.

So far it's mostly working, except for the very last mile. I can generate the audio files and RSS feed and subscribe with my Podcast App (Podcast Addict) but it errors out after downloading the (appropriately sized) OGG file, saying something about it not being the right file format...
