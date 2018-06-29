# spotify-playlist-generator
Spotify Playlist Generator

Enter a track and a playlist will be created based on that track using data from existing playlists.

Built using NodeJS, ReactJS, and the JS Spotify API Wrapper.

Dependencies:
    "gh-pages": "^1.1.0",
    "npm": "^5.8.0",
    "react": "^16.3.2",
    "react-bootstrap": "^0.32.1",
    "react-dom": "^16.3.2",
    "react-scripts": "1.1.4",
    "spotify-web-api-js": "^0.23.0"

To run, you will need to register the app with the Spotify API.

Then replace the values in the server with yours:

/* auth-server/authorization_code/app.js */
var client_id = ‘CLIENT_ID’; // Your client id
var client_secret = ‘CLIENT_SECRET’; // Your secret
var redirect_uri = ‘REDIRECT_URI’; // Your redirect uri

Then run the client with:
'npm start'

Then run the server with:
'node authorization_code/app.js'
