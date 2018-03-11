# GoogleLocation

[link](https://thatguywiththatname.github.io/GoogleLocations/source)

A website that plots all of the location data that google has collected from you

You can get you data from [here](https://takeout.google.com/settings/takeout), the file you want is "Location History.json"

This website outputs a lot of useful information to the console,
press F12 and then select the 'Console' tab to see what is going
on, and what options you can change.

Before uploading your file, if you want to change the accuracy of
the plotted points, set the variable latLongAccuracy equal to the
integer of the decimal places wanted.

Read this wikipedia table to see what they mean:

https://en.wikipedia.org/wiki/Decimal_degrees#Precision

For example: `latLongAccuracy = 5`
