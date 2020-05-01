//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
//
// This output is text format
//
// Last updated - Aug 26th, 2017 @ 16:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project-tags.go
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

		//for the Tag Structure
		type TagData struct {
			ORM				int		`json:"orm"`
			Tag				string	`json:"tag"`
			Creation_Date	int		`json:"creation_date"`
			Last_Updated	int		`json:"last_updated"`

			Setting		struct {
							Type	string		`json:"type"`
						} `json:"setting"`

		}

func main() {

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	JSONoutput, err := Call_Project_Tags_API(strconv.Itoa(Project_ID), API_key)

		if err != nil {
			log.Fatal(err)
		}

	fmt.Printf("\n--\n")

	var tag_ids []int

		for k, _ := range JSONoutput {
			tag_ids = append(tag_ids, k)
		}

	sort.Sort(sort.IntSlice(tag_ids))

		if len(tag_ids) > 0 {
			fmt.Printf("%-15s %-85s %-15s %-10s %-15s %-15s\n", "Tag ID", "Tag", "ORM Tag", "Settings", "Creation Date", "Last Update")
			fmt.Printf("%-15s %-85s %-15s %-10s %-15s %-15s\n", "------", "---", "-------", "--------", "-------------", "-----------")
		}

		for _, tag_id := range tag_ids {
			fmt.Printf("%-15d %-85s %-15d %-10s %-15d %-15d\n", tag_id, JSONoutput[tag_id].Tag, JSONoutput[tag_id].ORM, JSONoutput[tag_id].Setting.Type, JSONoutput[tag_id].Creation_Date, JSONoutput[tag_id].Last_Updated)
		}

	fmt.Printf("\n--\n")

}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


func Call_Project_Tags_API(pid, api_key string) (map[int]TagData, error) {

	var printer map[int]TagData

	url := "https://api.serpwoo.com/v1/projects/" + pid + "/tags/?key=" + api_key

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

	final, ok := data.(map[string]interface{})["tags"].(map[string]interface{})

		if !ok {
			return printer, errors.New("Error: Unable to process tags within the tag struct.")
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