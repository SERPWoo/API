//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
//
// This output is text format
//
// Last updated - Aug 26th, 2017 @ 16:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project-domains.go
//

		package main

		import (
			"net/http"
			"log"
			"encoding/json"
			"fmt"
			"errors"
			"sort"
			"strconv"
		)

		//for the Domain Structure
		type DomainData struct {
			ORM				int		`json:"orm"`
			Domain			string	`json:"domain"`
			Creation_Date	int		`json:"creation_date"`

			Setting		struct {
							Type	string		`json:"type"`
						} `json:"setting"`

		}

func main() {

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	JSONoutput, err := Call_Project_Domains_API(strconv.Itoa(Project_ID), API_key)

		if err != nil {
			log.Fatal(err)
		}

	fmt.Printf("\n--\n")

	var domains_ids []int

		for k, _ := range JSONoutput {
			domains_ids = append(domains_ids, k)
		}

	sort.Sort(sort.IntSlice(domains_ids))

		if len(domains_ids) > 0 {
			fmt.Printf("%-15s %-80s %-15s %-10s %-15s\n", "Domain ID", "Domain/URL", "ORM Tag", "Settings", "Creation Date")
			fmt.Printf("%-15s %-80s %-15s %-10s %-15s\n", "---------", "----------", "-------", "--------", "-------------")
		}

		for _, domain_id := range domains_ids {
			fmt.Printf("%-15d %-80s %-15d %-10s %-15d\n", domain_id, JSONoutput[domain_id].Domain, JSONoutput[domain_id].ORM, JSONoutput[domain_id].Setting.Type, JSONoutput[domain_id].Creation_Date)
		}

	fmt.Printf("\n--\n")

}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


func Call_Project_Domains_API(pid, api_key string) (map[int]DomainData, error) {

	var printer map[int]DomainData

	url := "https://api.serpwoo.com/v1/projects/" + pid + "/domains/?key=" + api_key

	out, err := http.Get(url)

		if err != nil {
			return printer, err
		}

	var JSONoutput interface{}
	defer out.Body.Close()

	err = json.NewDecoder(out.Body).Decode(&JSONoutput)
	data, ok := JSONoutput.(map[string]interface{})["projects"].(map[string]interface{})[pid]

		if !ok {
			return printer, errors.New("Error: Project ID " + pid + " was not found.")
		}

	final, ok := data.(map[string]interface{})["domains"].(map[string]interface{})

		if !ok {
			return printer, errors.New("Error: Unable to process domains within the tag struct.")
		}

	bt, err := json.Marshal(final)

		if err != nil {
			return printer, err
		}

	err = json.Unmarshal(bt, &printer)

		if err != nil {
			return printer, err
		}

	return printer, nil
}