//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
// This output is text format
//
// Last updated - Aug 25th, 2017 @ 8:00 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: nodejs keyword-SERPs.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID
	var Keyword_ID = 0 //input your Keyword ID

	var url = "https://api.serpwoo.com/v1/serps/" + Project_ID + "/" + Keyword_ID + "/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-15s %-10s %-10s %-80s %-80s", 'Timestamp', 'Rank', 'Type', 'Title', 'URL'));
									console.log(sprintf("%-15s %-10s %-10s %-80s %-80s", '---------', '----', '----', '-----', '---'));
							
									for(var keyword_id in JsonData) {
																				
											if (keyword_id == Keyword_ID) {

												//console.log(sprintf("%-15s", keyword_id));

												for(var timestamp in JsonData[keyword_id]) {

													for(var JsonField in JsonData[keyword_id][timestamp]) {
														
														if (JsonField == "results") {

															for(var rank in JsonData[keyword_id][timestamp]['results']) {

																console.log(sprintf("%-15s %-10s %-10s %-80s %-80s", timestamp, rank, JsonData[keyword_id][timestamp]["results"][rank].type, JsonData[keyword_id][timestamp]["results"][rank].title, JsonData[keyword_id][timestamp]["results"][rank].url));
															}
														}

												//console.log(sprintf("%-15s", exKey), sprintf("%-70s", JsonData.projects[exKey].name), sprintf("%-20s", JsonData.projects[exKey].total.keywords), sprintf("%-70s", JsonData.projects[exKey]._links.keywords));
												
													}
																						
												}
											}

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
