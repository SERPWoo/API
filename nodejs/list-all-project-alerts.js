//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
// This output is text format
//
// Last updated - Mar 7th, 2019 @ 10:45 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// The following modules required to be installed to run this successfully (choose between locally or globally):
// (install locally)
// : npm install request
// : npm install sprintf-js
//
// (install globally)
// : npm install request -g
// : npm install sprintf-js -g
//
// Run Command: nodejs list-all-project-alerts.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	var url = "https://api.serpwoo.com/v1/projects/" + Project_ID + "/alerts/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-15s %-20s %-100s %-90s", "Alert ID", "Social Timestamp", "Alert Text", "Alert Link"));
									console.log(sprintf("%-15s %-20s %-100s %-90s", "--------", "----------------", "----------", "----------"));
							
									for(var project_id in JsonData.projects) {

										for(var id in JsonData.projects[project_id]['alerts']) {

										console.log(sprintf("%-15s %-20s %-100s %-90s", id, JsonData.projects[project_id]['alerts'][id].social_time, JsonData.projects[project_id]['alerts'][id].text, JsonData.projects[project_id]['alerts'][id].link));
										}

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
