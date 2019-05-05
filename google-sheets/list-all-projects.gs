//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests all of your projects, lists the project ID, project name, and amount of keywords inside the project, amount of domains inside the project 
//	- also displays creation date, last updated date, country, device, language, locality and locality_geo_id
//
//	This outputs to the Google Sheet
//
//	Last updated - May 5th, 2019 @ 11:35 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Save the script, then Run it.
//
//

function PullProjects() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if (sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	//var SERPWoo_API_url		= "https://api.serpwoo.com/v1/projects/?key=<API_KEY>";

	var json_data		= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var project_array	= new Array();

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
			sheet.getRange(1, 1).setValue('Project ID');
			sheet.getRange(1, 2).setValue('Project Name');
			sheet.getRange(1, 3).setValue('Total Keywords');
			sheet.getRange(1, 4).setValue('Total Domains');
			sheet.getRange(1, 5).setValue('Creation Date');
			sheet.getRange(1, 6).setValue('Last Updated');
			sheet.getRange(1, 7).setValue('Country');
			sheet.getRange(1, 8).setValue('Device');
			sheet.getRange(1, 9).setValue('Language');
			sheet.getRange(1, 10).setValue('Locality');
			sheet.getRange(1, 11).setValue('Locallity GEO ID');

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");
			sheet.getRange(1, 5).setBackground("#000000");
			sheet.getRange(1, 6).setBackground("#000000");
			sheet.getRange(1, 7).setBackground("#000000");
			sheet.getRange(1, 8).setBackground("#000000");
			sheet.getRange(1, 9).setBackground("#000000");
			sheet.getRange(1, 10).setBackground("#000000");
			sheet.getRange(1, 11).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
			sheet.getRange(1, 5).setFontColor('white');
			sheet.getRange(1, 6).setFontColor('white');
			sheet.getRange(1, 7).setFontColor('white');
			sheet.getRange(1, 8).setFontColor('white');
			sheet.getRange(1, 9).setFontColor('white');
			sheet.getRange(1, 10).setFontColor('white');
			sheet.getRange(1, 11).setFontColor('white');
		}


		for (var project_id in json_response.projects) {

			if (typeof (json_response.projects[project_id]) === "object" ) {

				project_array.push(project_id); //gets all the project ids into an array
				
				//Sort
					//sorts AlphaNumberically DESCENDING
					//project_array.sort(function(a, b){ 
					//
					//	if (json_response.projects[a].name.toLowerCase() > json_response.projects[b].name.toLowerCase()) { return -1; }
					//	if (json_response.projects[a].name.toLowerCase() < json_response.projects[b].name.toLowerCase()) { return 1; }
					//	return 0;
					//
					//});

					//sorts AlphaNumberically ASCENDING
					project_array.sort(function(a, b){ 
			
						if (json_response.projects[a].name.toLowerCase() < json_response.projects[b].name.toLowerCase()) { return -1; }
						if (json_response.projects[a].name.toLowerCase() > json_response.projects[b].name.toLowerCase()) { return 1; }
						return 0;
			
					});
				

			}
		}

		//Write data to Sheet by rows
		for (var j = 0 ; j < project_array.length ; ++j) {
			the_project_id = project_array[j];

			//Adds values to the sheet
			sheet.getRange((j+2), 1).setValue(the_project_id);  
			sheet.getRange((j+2), 2).setValue(json_response.projects[the_project_id].name);
			sheet.getRange((j+2), 3).setValue(json_response.projects[the_project_id].total.keywords);
			sheet.getRange((j+2), 4).setValue(json_response.projects[the_project_id].total.domains);
			sheet.getRange((j+2), 5).setValue(FROM_UNIX_EPOCH(json_response.projects[the_project_id].creation_date));
			sheet.getRange((j+2), 6).setValue(FROM_UNIX_EPOCH(json_response.projects[the_project_id].last_updated));
			sheet.getRange((j+2), 7).setValue(json_response.projects[the_project_id].settings.country);
			sheet.getRange((j+2), 8).setValue(json_response.projects[the_project_id].settings.device);
			sheet.getRange((j+2), 9).setValue(json_response.projects[the_project_id].settings.language);
			sheet.getRange((j+2), 10).setValue(json_response.projects[the_project_id].settings.locality.name);
			sheet.getRange((j+2), 11).setValue(json_response.projects[the_project_id].settings.locality.geo_id);
			
		}

	//Resize Columns -- (WARNING: This increases execution time significantly, can add an additional 2-4 seconds)
	//sheet.autoResizeColumn(1);
	//sheet.autoResizeColumn(2);
	//sheet.autoResizeColumn(3);
	//sheet.autoResizeColumn(4);
	//sheet.autoResizeColumn(5);
	//sheet.autoResizeColumn(6);
	//sheet.autoResizeColumn(7);
	//sheet.autoResizeColumn(8);
	//sheet.autoResizeColumn(9);
	//sheet.autoResizeColumn(10);
	//sheet.autoResizeColumn(11);

}

///// Functions
//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Projects", "PullProjects").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}