#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 22:10 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-project-alerts.py


import requests, json

API_key = 'API_KEY_HERE'
Project_ID = 0 #input your Project ID

url = "https://api.serpwoo.com/v1/projects/" + str(Project_ID) + "/alerts/"
payload = {'key': API_key}

r = requests.get(url, params=payload)
j = r.json()

print('\n--\n')

print('%-15s %-20s %-100s %-90s' % ("Alert ID", "Social Timestamp", "Alert Text", "Alert Link"))
print('%-15s %-20s %-100s %-90s' % ("--------", "----------------", "----------", "----------"))

if j['success'] == 1:
    for project_id in j['projects']:

        #print('%-15s' % (project_id))

        for alert_id in sorted(j['projects'][project_id]['alerts']):

            print('%-15s %-20s %-100s %-90s' % (alert_id, j['projects'][project_id]['alerts'][alert_id]['timestamp'], j['projects'][project_id]['alerts'][alert_id]['text'], j['projects'][project_id]['alerts'][alert_id]['link']))

else:

    print('An Error Occurred: ' + j['error'])


print('\n--\n')
