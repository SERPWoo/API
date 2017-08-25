#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 23:05 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: python keyword-SERPs.py

import requests, json

def main():        
    API_key = 'API_KEY_HERE'
    Project_ID = 0 #input your Project ID
    Keyword_ID = 0 #input your Keyword ID

    url = "https://api.serpwoo.com/v1/serps/" + str(Project_ID) + "/" + str(Keyword_ID) + "/"
    payload = {'key': API_key}

    r = requests.get(url, params=payload)
    j = r.json()

    print('\n--\n')

    print('%-15s %-10s %-10s %-80s %-80s' % ("Timestamp", "Rank", "Type", "Title", "URL"))
    print('%-15s %-10s %-10s %-80s %-80s' % ("---------", "----", "----", "-----", "---"))

    if j['success'] == 1:
        for keyword_id in j:
            
            #print('keyword_id=[' + keyword_id + '][' + str(Keyword_ID) + ']')            
            if keyword_id == str(Keyword_ID):
                #print('YES=[' + keyword_id + '][' + str(Keyword_ID) + ']')

                for timestamp in sorted(j[keyword_id], cmp=_compare_keys):
                    for rank in sorted(j[keyword_id][timestamp]['results'], cmp=_compare_keys):
                        print('%-15s %-10s %-10s %-80s %-80s' % (timestamp, rank, j[keyword_id][timestamp]['results'][rank]['type'], j[keyword_id][timestamp]['results'][rank]['title'], j[keyword_id][timestamp]['results'][rank]['url']))
    else:

        print('An Error Occurred: ' + j['error'])

    print('\n--\n')

################################################################################
########################################
########################################

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


main()

################################################################################
################################################################################