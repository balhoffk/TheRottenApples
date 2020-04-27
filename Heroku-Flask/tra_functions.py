#!/usr/bin/env python
# coding: utf-8

import sys
sys.path.append("..")
from splinter import Browser
import time
import pymongo
# import json
import pandas as pd
# import collections
# import bson
# from bson.codec_options import CodecOptions
import pickle
from config import aws_key, aws_secret
from config import mongo_username, mongo_password, mongo_server_name
from config import postgres_server_name, postgres_database, postgres_username, postgres_port, postgres_password

def scrape_imagedata(range_max):
    print("Scrape Image Data invoked")

    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    hem_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hem_url)
    time.sleep(5)
    image_dict = {}
    for i in range(range_max):
        get_image_details(browser, i, image_dict)
    
    browser.quit()
    
    return image_dict

def get_image_details(browser, click_count, image_dict):
    links = browser.find_link_by_partial_text('Hemisphere Enhanced')
    links[click_count].click()
    title = browser.find_by_css('.title').first.text
    url = browser.find_by_text('Sample').first["href"]
    image_dict[title] = url
    browser.back()
    print("Back to main screen")

def scrape_weatherdata():
    print("Scrape Weather Data Invoked")

    weather_dict = {"Weather":"Today, Mars has a high temperature of minus 14 degrees Fahrenheit and a low of minus 117. The weather data comes from the Mars rover Curiosity, which has been on the Red Planet for 458 sols."}
        
    return weather_dict

def make_mars_fact_dict(mars_facts_dict, row):
    mars_facts_dict[row.Description] = row.Value
    
def scrape_mars_details():
    print("Scrape Mars Facts Data Invoked")
    mars_facts_file = "Resources/Mars_Facts.csv"
    mars_facts_df = pd.read_csv(mars_facts_file, encoding="ISO-8859-1")
    mars_facts_dict = {}
    mars_facts_df.apply(lambda row: make_mars_fact_dict(mars_facts_dict, row), axis=1)

    return mars_facts_dict


def print_dict_details(dict_object):
    for key, value in dict_object.items():
        if key != '_id':
            print('Key->', key, '\n   Value=', value, '\n')

def connect_to_mongo():
	conn_str = f'mongodb+srv://{mongo_username}:{mongo_password}@{mongo_server_name}/test?retryWrites=true&w=majority'
	client = pymongo.MongoClient(conn_str)
	db = client.TheRottenApples
	return db.Pandas

def insert_mongo(type_name, dict_object):
    collection = connect_to_mongo()
    app_json = json.dumps(dict_object)
    rec_id = collection.insert_one({'type':type_name, 'dict':app_json})
    print('Record inserted:', rec_id)
    return rec_id;

def get_value_from_mongo(type_name):
    collection = connect_to_mongo()
    cursor = collection.find({'type':type_name})
    for record in cursor:
        for key, value in record.items():
            if (key != '_id') and (key != 'type'):
                return value
        break;

        
def insert_mongo_small_chunks(dict_object):
    collection = connect_to_mongo()
    
    # collection.delete_many({})
    for key, value in dict_object.items():
        if key != '_id':
            a_dict = {key: value}
            print(a_dict)
            collection.insert_one(a_dict)


def to_mongodb(data, collection, key, pickling=False):
    """ write object to default MongoDB database.

    :param data: BSON compatible object
    :param str collection: collection name
    :param str key: key to identify
    :param bool pickling: store data pickled
    :return: None
    """

    '''
    with get_default_mongo_database() as db:
        collection = db[collection]
        if pickling:
            data = pickle.dumps(data)
        collection.delete_many({'name': key})
        collection.insert_one({'name': key, 'data': data})
    '''
    
    if pickling:
        data = pickle.dumps(data)
    collection.delete_many({'name': key})
    collection.insert_one({'name': key, 'data': data})

def from_mongodb(collection, key, pickling=False):
    """ retrieve object from MongoDB.

    :param str collection: collection name
    :param key: key to identify
    :param bool pickling: stored data is pickled
    :return: data
    """
    
    '''
    with get_default_mongo_database() as db:
        collection = db[collection]
        data = collection.find_one({'name': key})['data']
        
    '''
    
    try:
        data = collection.find_one({'name': key})['data']
        if pickling:
            data = pickle.loads(data)
    except:
        data = {"No Data": "~please load /scrape or click on the button 'Scrape New Data'"}  

    return data


def clear_mongo_collection():
    collection = connect_to_mongo()
    collection.delete_many({})

def write_df_to_mongo_as_json(key, df_data):
	conn_str = f'mongodb+srv://{mongo_username}:{mongo_password}@{mongo_server_name}/test?retryWrites=true&w=majority'
	client = pymongo.MongoClient(conn_str)
	collection = client.TheRottenApples.Pandas
	packaged_data = df_data.to_json()
	collection.delete_many({'name': key})
	collection.insert_one({'name': key, 'data': packaged_data})


def read_df_from_mongo_as_json(key):
    conn_str = f'mongodb+srv://{mongo_username}:{mongo_password}@{mongo_server_name}/test?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn_str)
    collection = client.TheRottenApples.Pandas

    try:
        data = collection.find_one({'name': key})['data']

    except:
        data = {"No Data": "~please load /scrape or click on the button 'Scrape New Data'"}  

    return data
