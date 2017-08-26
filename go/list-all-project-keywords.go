//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
//
// This output is text format
//
// Last updated - Aug 26th, 2017 @ 16:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project-keywords.go
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

		//for the Keyword Structure
		type KeywordData struct {
			Keyword			string	`json:"keyword"`
			Comp			string	`json:"Comp"`
			OCI				string	`json:"oci"`
			Volume			int		`json:"volume"`
			Creation_Date	int		`json:"creation_date"`

			Links		struct {
							SERPs	string		`json:"serps"`
						} `json:"_links"`

			SDATA		struct {
							Recent		int		`json:"recent_date"`
							Oldest		int		`json:"oldest_date"`
						} `json:"SERP_data"`

			CPC		struct {
						USD		struct {
									Amount	string		`json:"amount"`
								} `json:"usd"`								
					} `json:"CPC"`

		}

func main() {

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	JSONoutput, err := Call_Project_Keywords_API(strconv.Itoa(Project_ID), API_key)

		if err != nil {
			log.Fatal(err)
		}

	fmt.Printf("\n--\n")

	var keyword_ids []int

		for k, _ := range JSONoutput {
			keyword_ids = append(keyword_ids, k)
		}

	sort.Sort(sort.IntSlice(keyword_ids))

		if len(keyword_ids) > 0 {
			fmt.Printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs")
			fmt.Printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------")
		}

		for _, keyword_id := range keyword_ids {
			fmt.Printf("%-15d %-50s %-10s %-10s %-15d %-10s %-15d %-15d %-15d %-40s\n", keyword_id, JSONoutput[keyword_id].Keyword, JSONoutput[keyword_id].Comp, JSONoutput[keyword_id].OCI, JSONoutput[keyword_id].Volume, JSONoutput[keyword_id].CPC.USD.Amount, JSONoutput[keyword_id].Creation_Date, JSONoutput[keyword_id].SDATA.Oldest, JSONoutput[keyword_id].SDATA.Recent, JSONoutput[keyword_id].Links.SERPs)
		}

	fmt.Printf("\n--\n")

}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


func Call_Project_Keywords_API(pid, api_key string) (map[int]KeywordData, error) {

	var printer map[int]KeywordData

	url := "https://api.serpwoo.com/v1/projects/" + pid + "/keywords/?key=" + api_key

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

	final, ok := data.(map[string]interface{})["keywords"].(map[string]interface{})

		if !ok {
			return printer, errors.New("Error: Unable to process keywords within the tag struct.")
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