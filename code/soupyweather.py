#Open Weather API Scrape for Forecast Rain/Temp/Crime

# Dependencies
import csv
import numpy as np
import matplotlib.pyplot as plt
import requests
from scipy import stats
import pandas as pd
from config import api_key
from pprint import pprint

# Save config information & units = 'imperial'
url = "http://api.openweathermap.org/data/2.5/forecast?q=Atlanta&appid=08e5e0726d2dd6ba61dfc61132143db1&units=imperial"

# Build partial query URL
response = requests.get(url).json()
## pprint(response)

## try catch except for rain list append 0
date = []
temp = []
precip = []

## range =list(range(40))
## print(range)

for x in range(0,39):
    date.append(response['list'][x]['dt_txt'])
    #print(date)
    temp.append(response['list'][x]['main']['temp'])
    #print(temp)
    try:
        precip.append(response['list'][x]['rain']['3h'])
        #print(precip)
    except KeyError:
        precip.append(0)

## print(temp)
## print(precip)

## Create a new dataframe from what is collected from the API and save

forecast_dict = {
    "date": date,
    "temp": temp,
    "precipitation" : precip
}

df = pd.DataFrame(forecast_dict)

## Date is in UNIX format, convert to datetime
df['date'] = pd.to_datetime(df['date']) 

## Datetime is in hours/seconds, use dt.date to remove hours
df['date'] = df['date'].dt.date

## Convert the preciptiation to a number of either 0 or 1
df.loc[df['precipitation'] > 0, 'rain'] = 1 
df.loc[df['precipitation'] == 0, 'rain'] = 0 

## Group the dates as they come in 3-hour intervals
prediction_df = df.groupby('date').mean().reset_index()
## prediction_df


## Initial linear regression applied to forecasted crime
prediction_df['forecasted_crime'] = prediction_df['temp']*1.3 + prediction_df['rain']*10
prediction_df

## Set the index to the date column
prediction_df.set_index('date', inplace = True)

## Save this date into a CSV 
prediction_df.to_csv('weather_prediction_full.csv')

## Create a new dataframe with the only data needed
new_crimedf = pd.DataFrame(prediction_df[['forecasted_crime','temp','rain']])

## Save this data into a CSV
new_crimedf.to_csv('weather_forecast_crime.csv')

## default is a line graph
## new_crimedf.plot()

## Plotting the data with two axes

## Plot Rain v. Projected Crime
fig, ax1 = plt.subplots()

color = 'tab:red'
ax1.set_xlabel('Date')
ax1.set_ylabel('Rain', color=color)
ax1.plot(new_crimedf.index, new_crimedf.rain, color=color)
ax1.tick_params(axis='y', labelcolor=color)
plt.xticks(rotation = 90) # rotate the dates so they are legiable

ax2 = ax1.twinx()  # create a second axes

color = 'tab:purple'
ax2.set_ylabel('Projected Crime', color=color)  # we already handled the x-label with ax1
ax2.plot(new_crimedf.index, new_crimedf.forecasted_crime, color=color)
ax2.tick_params(axis='y', labelcolor=color)

fig.tight_layout()  # otherwise the right y-label is slightly clipped
plt.show()

## Plot Temp v. Projected Crime
fig, ax1 = plt.subplots()

color = 'tab:green'
ax1.set_xlabel('Date')
ax1.set_ylabel('Temp', color=color)
ax1.plot(new_crimedf.index, new_crimedf.temp, color=color)
ax1.tick_params(axis='y', labelcolor=color)
plt.xticks(rotation = 90)

ax2 = ax1.twinx()  # instantiate a second axes that shares the same x-axis

color = 'tab:blue'
ax2.set_ylabel('Projected Crime', color=color)  # we already handled the x-label with ax1
ax2.plot(new_crimedf.index, new_crimedf.forecasted_crime, color=color)
ax2.tick_params(axis='y', labelcolor=color)

fig.tight_layout()  # otherwise the right y-label is slightly clipped
plt.show()

## Create a conection to our MongoDB
import tra_functions as tralib
tralib.write_df_to_mongo_as_json("Georgia_Forecasted_Weather_Crime", new_crimedf)