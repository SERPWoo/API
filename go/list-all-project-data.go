//
//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests all of your projects' data in JSON format
//
// Last updated - Aug 22th, 2017 @ 21:48 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//
// Run Command: go run list-all-project-data.go
//
//

	package main

		import (
			"fmt"
			"io/ioutil"
			"net/http"
		)

func main() {
		var client http.Client

		// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		var API_key = "API_KEY_HERE"

			resp, err := client.Get("https://api.serpwoo.com/v1/projects/?key=" + API_key)

		if err != nil {
			// There is a problem
			fmt.Println(err)
		}

		defer resp.Body.Close()

		if resp.StatusCode == 200 { // OK
			bodyBytes, err2 := ioutil.ReadAll(resp.Body)

			if err2 == nil {
				bodyString := string(bodyBytes)
				fmt.Println(bodyString)				
			}

		}

}