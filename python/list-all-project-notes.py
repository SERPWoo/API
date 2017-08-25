#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 22:10 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-project-notes.py


import requests, json

API_key = 'API_KEY_HERE'
Project_ID = 0 #input your Project ID

url = "https://api.serpwoo.com/v1/projects/" + str(Project_ID) + "/notes/"
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('%-25s %-15s %-10s %-80s' % ("Note ID", "Timestamp", "Type", "Note"))
print('%-25s %-15s %-10s %-80s' % ("-------", "---------", "----", "----"))

if j['success'] == 1:
    for project_id in j['projects']:

        #print('%-15s' % (project_id))

        for note_id in sorted(j['projects'][project_id]['notes']):

            print('%-25s %-15s %-10s %-80s' % (note_id, j['projects'][project_id]['notes'][note_id]['note']['timestamp'], j['projects'][project_id]['notes'][note_id]['type'], j['projects'][project_id]['notes'][note_id]['note']['message']))

else:

    print('An Error Occurred: ' + j['error'])


print('\n--\n')
