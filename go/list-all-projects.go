//
//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
// This output is text format
//
// Last updated - Aug 22th, 2017 @ 21:48 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run list-all-project.go
//
//

	package main

	import (
		"fmt"
		"net/http"
		"encoding/json"
	)

	type data struct {
		Name 	string  `json:"name"`
		Links  struct{
			Keyword  string	`json:"keywords"`
		       } `json:"_links"`
		Total struct{
			Keywords int `json:"keywords"`
		      } `json:"total"`
	}

	type project struct {
		Project map[string]data `json:"projects"`
	}


func main() {
		// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		var API_key = "API_KEY_HERE"

			url := "https://api.serpwoo.com/v1/projects/?key=" + API_key

			resp, err := http.Get(url)

			if err != nil {
				// There is a problem
				fmt.Println(err)
			}

			dec := json.NewDecoder(resp.Body)
			var test project
			err = dec.Decode(&test)

			if err != nil {
				fmt.Println(err)
			}

			fmt.Println("\n--")

				if len(test.Project) > 0 {
						fmt.Printf("%-15s%-70s%-20s%-70s\n", "Project ID", "Project Name", "Total Keywords", "Link to Keywords")
						fmt.Printf("%-15s%-70s%-20s%-70s\n", "----------", "------------", "--------------", "----------------")

					for k, v:= range test.Project {
						fmt.Printf("%-15s%-70s%-20d%-70s\n", k, v.Name, v.Total.Keywords, v.Links.Keyword)
					}

				}else{
					fmt.Println("API returned an empty structure")
				}

			fmt.Println("--\n")
}
