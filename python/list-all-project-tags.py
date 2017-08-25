#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 22:10 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-project-tags.py


import requests, json

API_key = 'API_KEY_HERE'
Project_ID = 0 #input your Project ID

url = "https://api.serpwoo.com/v1/projects/" + str(Project_ID) + "/tags/"
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('%-15s %-80s %-15s %-10s %-15s %-15s' % ("Tag ID", "Tag", "ORM Tag", "Settings", "Creation Date", "Last Update"))
print('%-15s %-80s %-15s %-10s %-15s %-15s' % ("------", "---", "-------", "--------", "-------------", "-----------"))

if j['success'] == 1:
    for project_id in j['projects']:

        #print('%-15s' % (project_id))

        for tag_id in sorted(j['projects'][project_id]['tags']):

            print('%-15s %-80s %-15s %-10s %-15s %-15s' % (tag_id, j['projects'][project_id]['tags'][tag_id]['tag'], j['projects'][project_id]['tags'][tag_id]['orm'], j['projects'][project_id]['tags'][tag_id]['setting']['type'], j['projects'][project_id]['tags'][tag_id]['creation_date'], j['projects'][project_id]['tags'][tag_id]['last_updated']))

else:

    print('An Error Occurred: ' + j['error'])


print('\n--\n')
