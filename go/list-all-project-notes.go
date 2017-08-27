//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
//
// This output is text format
//
// Last updated - Aug 27th, 2017 @ 8:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project-notes.go
//

	package main

	import (
		"net/http"
		"encoding/json"
		"fmt"
		"errors"
		"log"
		"sort"
		"strconv"
	)

	//for the Note structure
	type NoteData	struct {
		Type	int			`json:"type"`

		Note	struct	{
					Message		string		`json:"message"`
					Timestamp	int			`json:"timestamp"`
					Link		string		`json:"link"`
				} `json:"note"`
	}


func main() {
	
	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0	//input your Project ID
	
	JSONoutput, err := Call_Project_Notes_API(strconv.Itoa(Project_ID), API_key)

		if err != nil {
			log.Fatal(err)
		}

	var note_ids []string

		for k, _ := range JSONoutput {
			note_ids = append(note_ids, k)
		}

	fmt.Printf("\n--\n")

	sort.Strings(note_ids)

	if len(note_ids) > 0 {

		fmt.Printf("%-25s %-15s %-10s %-80s\n", "Note ID", "Timestamp", "Type", "Note")
		fmt.Printf("%-25s %-15s %-10s %-80s\n", "-------", "---------", "----", "----")

		for _, note_id := range note_ids {
			fmt.Printf("%-25s %-15d %-10d %-80s\n", note_id, JSONoutput[note_id].Note.Timestamp, JSONoutput[note_id].Type, JSONoutput[note_id].Note.Message)
		}

		fmt.Printf("--\n\n")

	}
}

func Call_Project_Notes_API(pid, api_key string) (map[string]NoteData, error) {

	var printer map[string]NoteData

	url := "https://api.serpwoo.com/v1/projects/"  + pid + "/notes/?key=" + api_key

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

	final, ok := data.(map[string]interface{})["notes"].(map[string]interface{})

		if !ok {
			return printer, errors.New("Error: Unable to process notes within the note struct.")
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