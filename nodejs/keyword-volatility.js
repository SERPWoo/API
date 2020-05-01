//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's Volatility metric and outputs the Timestamp and volatility
//
// This output is text format
//
// Last updated - Mar 8th, 2019 @ 9:00 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
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
// Run Command: nodejs keyword-volatility.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	var API_key = "API_KEY_HERE"
	var Project_ID = 0 //input your Project ID
	var Keyword_ID = 0 //input your Keyword ID

	var url = "https://api.serpwoo.com/v1/volatility/" + Project_ID + "/" + Keyword_ID + "/?key=" + API_key
	//var url = "https://api.serpwoo.com/v1/volatility/" + Project_ID + "/" + Keyword_ID + "/?key=" + API_key + "&since=1546318800" //Since January 1st 2019

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-16s %-15s %-10s", 'Time', 'Timestamp', 'Voltility'));
									console.log(sprintf("%-16s %-15s %-10s", '----------', '----------', '---------'));
							
									for(var project_id in JsonData) {
										
										for(var keyword_id in JsonData[project_id]) {
																				
												if (keyword_id == Keyword_ID) {

													//console.log(sprintf("%-15s", keyword_id));

													for(var timestamp in JsonData[project_id][keyword_id]) {

														for(var volatility in JsonData[project_id][keyword_id][timestamp]) {

															console.log(sprintf("%-16s %-15s %-10s", formatDate(timestamp), timestamp, JsonData[project_id][keyword_id][timestamp].volatility + ' %'));

												
														}
																						
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



////////////////////////////////////////
// Formating Date

function formatDate(date) {
	var d = new Date(date * 1000), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//
////////////////////////////////////////