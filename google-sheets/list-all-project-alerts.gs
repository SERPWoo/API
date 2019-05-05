//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
// This outputs to the Google Sheet
//
// Last updated - May 4th, 2019 @ 21:58 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Update the <PROJECT_ID> part of the 'SERPWoo_API_url' variable with the project ID of the project where the keyword you want to query is in.
//	5. Save the script, then Run it.
//
//

function PullAlerts() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/projects/<PROJECT_ID>/alerts/?key=<API_KEY>";	

	var json_data	= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var alert_array	= new Array();

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
			sheet.getRange(1, 1).setValue('Alert ID');  
			sheet.getRange(1, 2).setValue('Social Timestamp');  
			sheet.getRange(1, 3).setValue('Alert Text');  
			sheet.getRange(1, 4).setValue('Alert Link');  

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
		}


		for (var project_id in json_response.projects) {

				if( typeof(json_response.projects[project_id]) === "object" ) {

					for (var alert_id in json_response.projects[project_id].alerts) {
						//Logger.log("[L75] " + project_id + " = " + alert_id);
						alert_array.push(alert_id); //gets all the alert ids into an array
						alert_array.sort(function(a, b){return b-a}); //sorts the IDs in DESCENDING order (usually best for most recent)
						//alert_array.sort(function(a, b){return a-b}); //sorts the IDs in ASCENDING order
					}

					//Write data to Sheet by rows
					for (var j = 0 ; j < alert_array.length ; ++j) {
						the_alert_id = alert_array[j];

						//Adds values to the sheet
						sheet.getRange((j+2), 1).setValue(the_alert_id);  
						sheet.getRange((j+2), 2).setValue(json_response.projects[project_id].alerts[the_alert_id].social_time);  
						sheet.getRange((j+2), 3).setValue(json_response.projects[project_id].alerts[the_alert_id].text);  
						sheet.getRange((j+2), 4).setValue(json_response.projects[project_id].alerts[the_alert_id].link);
					}
				}
		}

}

///// Functions
//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Alerts", "PullAlerts").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}