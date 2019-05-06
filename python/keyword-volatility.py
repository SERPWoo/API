#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
#
# This output is text format
#
# Last updated - May 5, 2019 @ 20:40 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python keyword-volatility.py


import requests, json

API_key = 'API_KEY_HERE'
Project_ID = 0 #input your Project ID
Keyword_ID = 0 #input your Keyword ID

url = "https://api.serpwoo.com/v1/volatility/" + str(Project_ID) + "/" + str(Keyword_ID) + "/"
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('%-20s %-20s' % ("Timestamp",  "Volatility %"))
print('%-20s %-20s' % ("----------", "------------"))

if j['success'] == 1:

        #print('%-15s' % (project_id))
        for timestamp in sorted(j[str(Project_ID)][str(Keyword_ID)], reverse=True):

            print('%-20s %-20s' % (timestamp, j[str(Project_ID)][str(Keyword_ID)][timestamp]['volatility']))

else:

    print('An Error Occurred: ' + j['error'])


print('\n--\n')
