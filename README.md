# spotify-playlist-generator
Spotify Playlist Generator

Try it here: https://joshlambertuw.github.io/spotify-playlist-generator/

Enter a track and a playlist will be created based on that track using data from existing playlists.

Built in JavaScript using NodeJS, React, and the JS Spotify API Wrapper.

Dependencies:
    "gh-pages": "^1.1.0",
    "npm": "^5.8.0",
    "react": "^16.3.2",
    "react-bootstrap": "^0.32.1",
    "react-dom": "^16.3.2",
    "react-scripts": "1.1.4",
    "spotify-web-api-js": "^0.23.0"
    
The Spotify API can authorize apps through either User Authorization or App Authorization. User Authorization is temporary and can be done client-side. App authorization maintains access but requires a server with a secret key.

To run the tool, first register it with the Spotify API.

To use client-side, temporary authorization, enter your client id and redirect URL in the client file. Your redirect URL can be the page your are hosting the tool on, e.g. https://joshlambertuw.github.io/spotify-playlist-generator/.

If you want to use server-side, permanent authorization, enter your client id, client secret, and redirect url in the authorization server app.js. The redirect URL will be your server address, e.g. 'http://localhost:8888/callback'.

Then run the client with:
'npm start'

Then run the server with:
'node authorization_code/app.js'
