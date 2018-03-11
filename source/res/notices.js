alert(
  `
  This website outputs a lot of useful information to the
  console, press F12 and then select the 'Console' tab to
  see what is going on, and what options you can change
  `
);

console.log(`
  Read the GitHub for more information:
  https://github.com/thatguywiththatname/GoogleLocations

  -----------------------------------------------------------------

  Before uploading your file, if you want to change the accuracy of
  the plotted points, set the variable latLongAccuracy equal to the
  integer of the decimal places wanted. The default is 5

  Read this wikipedia table to see what they mean:
  https://en.wikipedia.org/wiki/Decimal_degrees#Precision

  For example, type this into the console: latLongAccuracy = 5\n
`);

console.warn(`
  Your location information is NOT sent or stored anywhere, all
  the processing and calculations happen locally on YOUR machine
`);

console.log("\n  -----------------------------------------------------------------\n\n");
