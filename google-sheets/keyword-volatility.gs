//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword Volatility and outputs the Epoch Timestamp, Regular Date, Volatility %
//
// This outputs to the Google Sheet
//
// Last updated - May 4th, 2019 @ 21:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Update the <PROJECT_ID> part of the 'SERPWoo_API_url' variable with the project ID of the project where the keyword you want to query is in.
//	5. Update the <KEYWORD_ID> part of the 'SERPWoo_API_url' variable with the keyword ID you want to query.
//	6. Save the script, then Run it.
//
//

function PullVolatility() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/volatility/<PROJECT_ID>/<KEYWORD_ID>/?key=<API_KEY>";

	var json_data	= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var midnight_array	= new Array();

		if (json_response.success != true) {
			//Something went wrong with the API call
			sheet.getRange(2, 1).setValue('[API Problem]');  

				if ((json_response.error !== undefined) && (json_response.error !== null)) {
					sheet.getRange(3, 1).setValue('[API ERROR] = [' + json_response.error + ']');  
				}else {
					sheet.getRange(3, 5).setValue('[API ERROR]= Unknown error!');
				}      

			sheet.getRange(2,1).setBackground("red");
			sheet.getRange(2,1).setFontColor('white');

			return;

		}else {
			//Update Header (Row #1)
			sheet.getRange(1, 1).setValue('Epoch Time');  
			sheet.getRange(1, 2).setValue('Date');  
			sheet.getRange(1, 3).setValue('Volatility %');  

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
		}


		for (var project_id in json_response) {
				if( typeof(json_response[project_id]) === "object" ) {
					for (var keyword_id in json_response[project_id]) {

						for (var midnight_time in json_response[project_id][keyword_id]) {
							//Logger.log("[L75] " + project_id + "/" + keyword_id + " = " + midnight_time);
							midnight_array.push(midnight_time); //gets all the timeperiods into an array (this is the day's midnight time)
							midnight_array.sort(function(a, b){return b-a}); //sorts the midnight times in DESCENDING order
							//midnight_array.sort(function(a, b){return a-b}); //sorts the midnight times in ASCENDING order
						}

						//Write data to Sheet by rows
						for (var j = 0 ; j < midnight_array.length ; ++j) {
							midnight_time = midnight_array[j];

							//Adds values to the sheet
							sheet.getRange((j+2), 1).setValue(midnight_time);  
							sheet.getRange((j+2), 2).setValue(FROM_UNIX_EPOCH(midnight_time));  
							sheet.getRange((j+2), 3).setValue(json_response[project_id][keyword_id][midnight_time].volatility);
						}
					}
				}
		}

}

///// Functions
//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Volatility", "PullVolatility").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}