//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
//
// This output is text format
//
// Last updated - Aug 25th, 2017 @ 8:12 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: nodejs list-all-project-notes.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	var url = "https://api.serpwoo.com/v1/projects/" + Project_ID + "/notes/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-25s %-15s %-10s %-80s", "Note ID", "Timestamp", "Type", "Note"));
									console.log(sprintf("%-25s %-15s %-10s %-80s", "-------", "---------", "----", "----"));
							
									for(var project_id in JsonData.projects) {

										for(var id in JsonData.projects[project_id]['notes']) {

										console.log(sprintf("%-25s %-15s %-10s %-80s", id, JsonData.projects[project_id]['notes'][id]['note'].timestamp, JsonData.projects[project_id]['notes'][id].type, JsonData.projects[project_id]['notes'][id]['note'].message));
										}

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
