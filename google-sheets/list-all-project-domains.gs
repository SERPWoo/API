//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
//
// This outputs to the Google Sheet
//
// Last updated - May 5th, 2019 @ 7:40 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Update the <PROJECT_ID> part of the 'SERPWoo_API_url' variable with the project ID of the project where the keyword you want to query is in.
//	5. Save the script, then Run it.
//
//

function PullDomains() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/projects/<PROJECT_ID>/domains/?key=<API_KEY>";	

	var json_data	= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var domain_array		= new Array();

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
			sheet.getRange(1, 1).setValue('Domain ID');
			sheet.getRange(1, 2).setValue('Domain/URL');
			sheet.getRange(1, 3).setValue('ORM Tag');
			sheet.getRange(1, 4).setValue('Settings');
			sheet.getRange(1, 5).setValue('Creation Date');

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");
			sheet.getRange(1, 5).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
			sheet.getRange(1, 5).setFontColor('white');
		}


		for (var project_id in json_response.projects) {

				if( typeof(json_response.projects[project_id]) === "object" ) {

					for (var domain_id in json_response.projects[project_id].domains) {
						Logger.log("[L77] " + project_id + " = " + domain_id);
						domain_array.push(domain_id); //gets all the domain ids into an array
						//domain_array.sort(function(a, b){return b-a}); //sorts the IDs in DESCENDING order
						domain_array.sort(function(a, b){return a-b}); //sorts the IDs in ASCENDING order					
					}

					//Write data to Sheet by rows
					for (var j = 0 ; j < domain_array.length ; ++j) {
						the_domain_id = domain_array[j];

						//Adds values to the sheet
						sheet.getRange((j+2), 1).setValue(the_domain_id);  
						sheet.getRange((j+2), 2).setValue(json_response.projects[project_id].domains[the_domain_id].domain);
						sheet.getRange((j+2), 3).setValue(json_response.projects[project_id].domains[the_domain_id].orm);

						//Whether this is an exact URL or just monitoring the whole domain
						if ((json_response.projects[project_id].domains[the_domain_id].setting.type !== undefined) && (json_response.projects[project_id].domains[the_domain_id].setting.type !== null)) {
							sheet.getRange((j+2), 4).setValue(json_response.projects[project_id].domains[the_domain_id].setting.type);  							
						}else {
							sheet.getRange((j+2), 4).setValue('domain');
						}

						sheet.getRange((j+2), 5).setValue(FROM_UNIX_EPOCH(json_response.projects[project_id].domains[the_domain_id].creation_date));
					}
				}
		}

	//Resize Columns -- (WARNING: This increases execution time significantly, can add an additional 2-4 seconds)
	//sheet.autoResizeColumn(1);
	//sheet.autoResizeColumn(2);
	//sheet.autoResizeColumn(3);
	//sheet.autoResizeColumn(4);
	//sheet.autoResizeColumn(5);


}

///// Functions
//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Domains", "PullDomains").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}