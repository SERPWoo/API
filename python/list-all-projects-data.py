#
# This code requests all of your projects' data in JSON format
#
# Last updated - Aug 20th, 2017 @ 11:45 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#

import requests

# Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
API_key	= "API_KEY_HERE"

url = 'https://api.serpwoo.com/v1/projects/'
payload = {'key': API_key}

r = requests.get(url, params=payload)

# GET
#r = requests.get(url)

# GET with params in URL

# POST with form-encoded data
#r = requests.post(url, data=payload)

# POST with JSON 
#import json
#r = requests.post(url, data=json.dumps(payload))

# Response, status etc
#r.text
#r.status_code

#Print Result
print r.text