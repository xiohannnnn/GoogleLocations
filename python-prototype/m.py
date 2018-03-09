print("Loading modules")
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import pandas as pd
import json
import io

e7 = 10000000
lat, lon = [], []

print("Reading JSON data")
d = json.load(open("Location History.json"))
for loc in d["locations"]:
    lat.append(int(loc["latitudeE7"])/e7)
    lon.append(int(loc["longitudeE7"])/e7)

print("Determining min-max")
# determine range to print based on min, max lat and lon of the data
margin = 2  # buffer to add to the range
lat_min = min(lat) - margin
lat_max = max(lat) + margin
lon_min = min(lon) - margin
lon_max = max(lon) + margin

print("Setting up Basemap obj")
m = Basemap(
    llcrnrlon=lon_min,
    llcrnrlat=lat_min,
    urcrnrlon=lon_max,
    urcrnrlat=lat_max,
    lat_0=(lat_max - lat_min)/2,
    lon_0=(lon_max-lon_min)/2,
    projection="merc",
    resolution = "h",
    area_thresh=10000.,
)
m.drawcoastlines()
m.drawcountries()
m.drawmapboundary(fill_color="#46bcec")
m.fillcontinents(color="white", lake_color="#46bcec")

print("Converting to projection coords")
lons, lats = m(lon, lat)

print("Plotting on map")
m.scatter(lons, lats, marker="o", color="r", zorder=5)

print("Done, showing")
plt.show()
