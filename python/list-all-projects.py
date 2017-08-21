#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
#
# This output is text format
#
# Last updated - Aug 21th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-projects.py


import requests, json

API_key = 'API_KEY_HERE'

url = 'https://api.serpwoo.com/v1/projects/'
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('\n%-15s %-70s %-20s %-70s' % ("Project ID", "Project Name", "Total Keywords", "Link to Keywords"))
print('%-15s %-70s %-20s %-70s\n' % ("----------", "------------", "--------------", "----------------"))

for entry in j['projects']:
    print('%-15s %-70s %-20s %-70s' % (entry, j['projects'][entry]['name'], j['projects'][entry]['total']['keywords'], j['projects'][entry]['_links']['keywords']))

print('\n--\n')
