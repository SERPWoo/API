//
// Github Repo: https://github.com/SERPWoo/API
//
// This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
//
// This output is text format
//
// Last updated - Jul 22nd, 2019 @ 17:45 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: go run keyword-volatility.go
//

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strconv"
	"text/tabwriter"
	"time"
)

type Volatility struct {
	Meta map[string]struct {
		Keyword map[string]struct {
			KW string `json:"kw"`
		}
	}
	Time         float64  `json:"time`
	Success      int      `json:"success"`
	ResponseTime string   `json:"response_time"`
	Total        int      `json:"total"`
	result       []Result `json:"-"`
}

type Result struct {
	Timestamp  time.Time
	Volatility int
}

type APIInfo struct {
	project string
	keyword string
	key     string
}

func main() {

	var API_key = "API_KEY_HERE" // Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	var Project_ID = "0" //input your Project ID
	var Keyword_ID = "0" //input your Keyword ID

	api := APIInfo{Project_ID, Keyword_ID, API_key}
	resp, err := api.newRequest()
	if err != nil {
		panic(err)
	}
	defer resp.Close()

	volatility, err := api.parseVolatility(resp)
	if err != nil {
		panic(err)
	}

	w := &tabwriter.Writer{}

	w.Init(os.Stdout, 0, 0, 1, ' ', tabwriter.AlignRight)
	fmt.Fprintf(w, "\n%s:\t%s\t\t\n\n", api.keyword, volatility.Meta[api.project].Keyword[api.keyword].KW)
	fmt.Fprintln(w, "Time\tTimestamp\tVolatility\t")
	fmt.Fprintln(w, "--------\t--------\t----------\t")
	for _, v := range volatility.result {
		fmt.Fprintf(w, "%s\t%d\t%d %%\t\n", v.Timestamp.Format("2006-01-02"), v.Timestamp.Unix(), v.Volatility)
	}
	fmt.Fprintln(w)
	w.Flush()

}

func (api APIInfo) newRequest() (io.ReadCloser, error) {
	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get("https://api.serpwoo.com/v1/volatility/" + api.project + "/" + api.keyword + "/?key=" + api.key + "&metadata=1")
	if err != nil {
		return nil, err
	}

	return resp.Body, nil
}

func (api APIInfo) parseVolatility(APIResp io.Reader) (*Volatility, error) {
	tmpIface := map[string]interface{}{}
	volatility := &Volatility{}
	result := []Result{}

	if err := json.NewDecoder(APIResp).Decode(&tmpIface); err != nil {
		return nil, err
	}

	dump, err := json.Marshal(tmpIface)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(dump, volatility); err != nil {
		return nil, err
	}

	for key, v := range tmpIface[api.project].(map[string]interface{})[api.keyword].(map[string]interface{}) {
		unixTime, err := strconv.Atoi(key)
		if err != nil {
			return nil, err
		}

		timestamp := time.Unix(int64(unixTime), 0)

		result = append(result, Result{
			Timestamp:  timestamp,
			Volatility: int(v.(map[string]interface{})["volatility"].(float64)),
		})

	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].Timestamp.Unix() < result[j].Timestamp.Unix()
	})

	volatility.result = result

	return volatility, nil
}
