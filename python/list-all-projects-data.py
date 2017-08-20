#
# This code requests all of your projects' data in JSON format
#
# Last updated - Aug 20th, 2017 @ 19:38 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#

import requests
import json

API_key = 'API_KEY_HERE'

url = 'https://api.serpwoo.com/v1/projects/'
payload = {'key': API_key}

r = requests.get(url, params=payload)

parsed = json.loads(r.text)
print json.dumps(parsed, indent=4, sort_keys=True)

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

#    print r.text
