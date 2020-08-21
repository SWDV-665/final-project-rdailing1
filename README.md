# final-project-rdailing1

This is a companion application for the Gift Exchange Organizer web app created for the final project in the capstone class.

Rather than using MongoDB, the database used for this app is the same SQL database used for the companion app.

Usage:

open a command window

cd to geo-server folder

execute 'node server.js'


open a second command window

cd to geomobile folder

execute 'ionic cordova plugin add phonegap-plugin-barcodescanner'

execute 'npm install @ionic-native/barcode-scanner'

execute 'ionic serve --type=angular'

The app opens to the login page.  Use the default username and password.  cmdail@earthlink.net can also be used, with the same password.
Once signed in, click 'Select Group' and choose a group to view.  If a partner has been chosen, that person's wishlist info will be displayed.

The app uses several Angular services, including ion-select and ion-toolbar.
The app uses the Cordova BarcodeScanner plugin.  The functionality is commented for testing on non-mobile devices.
