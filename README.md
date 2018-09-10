# GoogleLocations

[Click here to go to the project](https://thatguywiththatname.github.io/GoogleLocations/source/LeafletJS)

## How to get your location file

You can get you data from [here](https://takeout.google.com/settings/takeout)

 - Click "Select None", scroll down and find "Location History"
 - Switch that on and make sure it says "JSON format" next to it
 - Scroll to the bottom and click next
 - You dont need to change any options on the next page
 - Click "create archive"
 - Wait for a minute, depending on the size of the data you may want to leave it working and continue when it is done
 - Download the zip file and find your "location history.json" in `Takeout/Location History`

## Info

A website that plots all of the location data that google has collected from you

This website outputs a lot of useful information to the console, press F12 and then select the 'Console' tab to see what is going on, and what options you can change.

**Your information is NOT sent or stored anywhere, all the processing and calculations happen locally on YOUR machine**

## Options

### Marker accuracy

The more markers you have, the laggier the loading and map will become. Reducing the accuracy reduces the number of markers that can be plotted in any one place, reducing load time and map lag.

Read this wikipedia table to see what accuracy values can be used:

https://en.wikipedia.org/wiki/Decimal_degrees#Precision
