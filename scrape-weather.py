from bs4 import BeautifulSoup
import pandas as pd
from splinter import Browser
from pprint import pprint
from datetime import datetime
import requests
import time
import pymongo

# Create connection to mongodb
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    # Connect to database and its collection 
    db = client.mars_app
    collection = db.mars

    # Executable Path/Initialize Browser
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    browser = Browser("chrome", **executable_path, headless=False)