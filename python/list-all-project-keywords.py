#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 22:22 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python list-all-project-keywords.py

import requests, json

def main():        
    API_key = 'API_KEY_HERE'
    Project_ID = 0 #input your Project ID

    url = "https://api.serpwoo.com/v1/projects/" + str(Project_ID) + "/keywords/"
    payload = {'key': API_key}

    r = requests.get(url, params=payload)
    j = r.json()

    print('\n--\n')

    print('%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s' % ("Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs"))
    print('%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s' % ("----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------"))

    if j['success'] == 1:
        for project_id in j['projects']:

            for keyword_id in sorted(j['projects'][project_id]['keywords'], cmp=_compare_keys):

                print('%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s' % (keyword_id, j['projects'][project_id]['keywords'][keyword_id]['keyword'], j['projects'][project_id]['keywords'][keyword_id]['Comp'], j['projects'][project_id]['keywords'][keyword_id]['oci'], j['projects'][project_id]['keywords'][keyword_id]['volume'], j['projects'][project_id]['keywords'][keyword_id]['CPC']['usd']['amount'], j['projects'][project_id]['keywords'][keyword_id]['creation_date'], j['projects'][project_id]['keywords'][keyword_id]['SERP_data']['oldest_date'], j['projects'][project_id]['keywords'][keyword_id]['SERP_data']['recent_date'], j['projects'][project_id]['keywords'][keyword_id]['_links']['serps']))

    else:

        print('An Error Occurred: ' + j['error'])


    print('\n--\n')


#Sorting comparion
def _compare_keys(x, y):
    try:
        x = int(x)
    except ValueError:
        xint = False
    else:
        xint = True
    try:
        y = int(y)
    except ValueError:
        if xint:
            return -1
        return cmp(x.lower(), y.lower())
        # or cmp(x, y) if you want case sensitivity.
    else:
        if xint:
            return cmp(x, y)
        return 1


################################################################################
main()