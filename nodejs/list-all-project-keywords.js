//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
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
// Run Command: nodejs list-all-project-keywords.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID

	var url = "https://api.serpwoo.com/v1/projects/" + Project_ID + "/keywords/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs"));
									console.log(sprintf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------"));
							
									for(var project_id in JsonData.projects) {

										for(var id in JsonData.projects[project_id]['keywords']) {

										console.log(sprintf("%-15s %-50s %-10.0f %-10s %-15s %-10.2f %-15s %-15s %-15s %-40s", id, JsonData.projects[project_id]['keywords'][id].keyword, (JsonData.projects[project_id]['keywords'][id].Comp * 100), JsonData.projects[project_id]['keywords'][id].oci, JsonData.projects[project_id]['keywords'][id].volume, JsonData.projects[project_id]['keywords'][id].CPC.usd.amount, JsonData.projects[project_id]['keywords'][id].creation_date, JsonData.projects[project_id]['keywords'][id].SERP_data.oldest_date, JsonData.projects[project_id]['keywords'][id].SERP_data.recent_date, JsonData.projects[project_id]['keywords'][id]['_links'].serps));
										}

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
