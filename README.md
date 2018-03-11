# GoogleLocation

[link](https://thatguywiththatname.github.io/GoogleLocations/source)

## Info

A website that plots all of the location data that google has collected from you

You can get you data from [here](https://takeout.google.com/settings/takeout), the file you want is "Location History.json"

This website outputs a lot of useful information to the console,
press F12 and then select the 'Console' tab to see what is going
on, and what options you can change.

**Your information is NOT sent or stored anywhere, all the processing and calculations happen locally on YOUR machine**

## Options

### Point accuracy

Before uploading your file, if you want to change the accuracy of
the plotted points, set the variable latLongAccuracy equal to the
integer of the decimal places wanted. The default is `5`

**Why would I change the accuracy?**
The more points you have, the laggier the loading andmap will
become. Reducing the accuracy reduces the number of points that
can be plotted in any one place, reducing load time and map lag.

Read this wikipedia table to see what accuracy values can be used:

https://en.wikipedia.org/wiki/Decimal_degrees#Precision

For example, type this into the console: `latLongAccuracy = 2`
