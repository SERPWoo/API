//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
// This output is text format
//
// Last updated - Aug 26th, 2017 @ 16:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run keyword-SERPs.go
//

	package main

		import (
			"fmt"
			"net/http"
			"encoding/json"
			"bytes"
			"log"
			"sort"
			"strconv"
		)

	//for the SERP ranking structure
	type rank struct {
		Description string 	`json:"description"`
		Title		string	`json:"title"`
		Type		string	`json:"type"`
		Url			string	`json:"url"`
	}

	//for the SERP Results
	type result struct {
		Results		map[int]rank	`json:"results"`
	}


func main() {

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID
	var Keyword_ID = 0	//input your Keyword ID

	//Pulls the JSON Data from the API
	newdata, err := Call_SERP_API(strconv.Itoa(Project_ID), strconv.Itoa(Keyword_ID), API_key)
		
	fmt.Printf("\n--\n")

		if err != nil{

			log.Fatal("Error: ", err)

		}else{

			if len(newdata) > 0 {

				//Output the column header
				fmt.Printf("%-15s %-10s %-10s %-80s %-80s\n", "Timestamp", "Rank", "Type", "Title", "URL")
				fmt.Printf("%-15s %-10s %-10s %-80s %-80s\n", "---------", "----", "----", "-----", "---")

				var datesort []int

				for k, _:= range newdata {

					date, err := strconv.Atoi(k)

						if err != nil {
							log.Fatal("Error: ", err)
						}

					datesort = append(datesort, date)
				}

				sort.Ints(datesort)

				for _, v := range datesort {

					date := strconv.Itoa(v)
					rankhold := make([]int, 0)

						for x,_ := range newdata[date].Results {
							rankhold = append(rankhold, x)
						}

					sort.Ints(rankhold)

						for _, keys := range rankhold {
							fmt.Printf("%-15s %-10d %-10s %-80s %-80s\n", date, keys, newdata[date].Results[keys].Type, newdata[date].Results[keys].Title, newdata[date].Results[keys].Url)
						}

				}

			}else {

				log.Fatal("Error: There was no output for Project ID ", Project_ID, " and Keyword ID ", Keyword_ID)

			}

			fmt.Printf("--\n\n")

		}
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

func Call_SERP_API(pid, kid, api_key string)(map[string]result, error){

	var newdata map[string]result

	url := "https://api.serpwoo.com/v1/serps/" + pid + "/" + kid + "/?key=" + api_key

	resp, err := http.Get(url)

		if err != nil {
			return newdata, err
		}

	var dump interface{}
	defer resp.Body.Close()
	err = json.NewDecoder(resp.Body).Decode(&dump)

		if err != nil {
			return newdata, err
		}

	data := dump.(map[string]interface{})[kid]
	bt, err := json.Marshal(data)

		if err != nil {
			return newdata, err
		}

	ioread := bytes.NewReader(bt)
	err = json.NewDecoder(ioread).Decode(&newdata)
		if err != nil {
			return newdata, err
		}

	return newdata, nil
}
