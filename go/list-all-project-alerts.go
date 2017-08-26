//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
// This output is text format
//
// Last updated - Aug 26th, 2017 @ 16:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project-alerts.go
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

		//for the Alert Structure
		type AlertDetails struct {
			Social_Time	string		`json:"social_time"`
			Text		string		`json:"text"`
			Link		string		`json:"link"`
		}

func main() {

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	output, err := Call_Project_Alerts_API(strconv.Itoa(Project_ID), API_key)

		if err != nil {
			log.Fatal(err)
		}

	fmt.Printf("\n--\n")

	var alert_ids []int

		for k, _ := range output {
			alert_ids = append(alert_ids, k)
		}

	sort.Sort(sort.Reverse(sort.IntSlice(alert_ids)))

		if len(alert_ids) > 0 {
			fmt.Printf("%-15s %-20s %-100s %-90s\n", "Alert ID", "Social Timestamp", "Alert Text", "Alert Link")
			fmt.Printf("%-15s %-20s %-100s %-90s\n", "--------", "----------------", "----------", "----------")
		}

		for _, v := range alert_ids {
			fmt.Printf("%-15d %-20s %-100s %-80s\n", v, output[v].Social_Time, output[v].Text, output[v].Link, )
		}

	fmt.Printf("\n--\n")

}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


func Call_Project_Alerts_API(pid, api_key string) (map[int]AlertDetails, error) {

	var printer map[int]AlertDetails

	url := "https://api.serpwoo.com/v1/projects/" + pid + "/alerts/?key=" + api_key

	out, err := http.Get(url)

		if err != nil {
			return printer, err
		}

	var output interface{}
	defer out.Body.Close()

	err = json.NewDecoder(out.Body).Decode(&output)
	data, ok := output.(map[string]interface{})["projects"].(map[string]interface{})[pid]

		if !ok {
			return printer, errors.New("Error: Project ID " + pid + " was not found in the output")
		}

	final, ok := data.(map[string]interface{})["alerts"].(map[string]interface{})

		if !ok {
			return printer, errors.New("Error: Unable to process alerts within the alert struct")
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