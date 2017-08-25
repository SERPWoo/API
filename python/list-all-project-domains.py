#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 22:10 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-project-domains.py


import requests, json

API_key = 'API_KEY_HERE'
Project_ID = 0 #input your Project ID

url = "https://api.serpwoo.com/v1/projects/" + str(Project_ID) + "/domains/"
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('%-15s %-80s %-15s %-10s %-15s' % ("Domain ID", "Domain/URL", "ORM Tag", "Settings", "Creation Date"))
print('%-15s %-80s %-15s %-10s %-15s' % ("---------", "----------", "-------", "--------", "-------------"))

if j['success'] == 1:
    for project_id in j['projects']:

        #print('%-15s' % (project_id))

        for domain_id in sorted(j['projects'][project_id]['domains']):

            print('%-15s %-80s %-15s %-10s %-15s' % (domain_id, j['projects'][project_id]['domains'][domain_id]['domain'], j['projects'][project_id]['domains'][domain_id]['orm'], j['projects'][project_id]['domains'][domain_id]['setting']['type'], j['projects'][project_id]['domains'][domain_id]['creation_date']))

else:

    print('An Error Occurred: ' + j['error'])


print('\n--\n')
