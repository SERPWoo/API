//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date
//
// This outputs to the Google Sheet
//
// Last updated - May 5th, 2019 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Update the <PROJECT_ID> part of the 'SERPWoo_API_url' variable with the project ID of the project where the keyword you want to query is in.
//	5. Save the script, then Run it.
//
//

function PullKeywords() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/projects/<PROJECT_ID>/keywords/?key=<API_KEY>";

	var json_data		= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var keyword_array	= new Array();

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
			sheet.getRange(1, 1).setValue('Keyword ID');
			sheet.getRange(1, 2).setValue('Keyword');
			sheet.getRange(1, 3).setValue('PPC Competition');
			sheet.getRange(1, 4).setValue('OCI');
			sheet.getRange(1, 5).setValue('Monthly Search Volume');
			sheet.getRange(1, 6).setValue('CPC (USD)');
			sheet.getRange(1, 7).setValue('Created Date');
			sheet.getRange(1, 8).setValue('Oldest Date (of Data)');
			sheet.getRange(1, 9).setValue('Recent Date (of Data)');

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");
			sheet.getRange(1, 5).setBackground("#000000");
			sheet.getRange(1, 6).setBackground("#000000");
			sheet.getRange(1, 7).setBackground("#000000");
			sheet.getRange(1, 8).setBackground("#000000");
			sheet.getRange(1, 9).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
			sheet.getRange(1, 5).setFontColor('white');
			sheet.getRange(1, 6).setFontColor('white');
			sheet.getRange(1, 7).setFontColor('white');
			sheet.getRange(1, 8).setFontColor('white');
			sheet.getRange(1, 9).setFontColor('white');
		}


		for (var project_id in json_response.projects) {

				if( typeof(json_response.projects[project_id]) === "object" ) {

					for (var keyword_id in json_response.projects[project_id].keywords) {

						Logger.log("[L92] " + project_id + " = " + keyword_id + '/' + json_response.projects[project_id].keywords[keyword_id].keyword);
						keyword_array.push(keyword_id); //gets all the keyword ids into an array

						//Sort
							//sorts AlphaNumberically DESCENDING
							//keyword_array.sort(function(a, b){ 
							//
							//	if (json_response.projects[project_id].keywords[a].keyword.toLowerCase() > json_response.projects[project_id].keywords[b].keyword.toLowerCase()) { return -1; }
							//	if (json_response.projects[project_id].keywords[a].keyword.toLowerCase() < json_response.projects[project_id].keywords[b].keyword.toLowerCase()) { return 1; }
							//	return 0;
							//
							//});

							//sorts AlphaNumberically ASCENDING
							keyword_array.sort(function(a, b){ 
						
								if (json_response.projects[project_id].keywords[a].keyword.toLowerCase() < json_response.projects[project_id].keywords[b].keyword.toLowerCase()) { return -1; }
								if (json_response.projects[project_id].keywords[a].keyword.toLowerCase() > json_response.projects[project_id].keywords[b].keyword.toLowerCase()) { return 1; }
								return 0;
						
							});
					}

					//Write data to Sheet by rows
					for (var j = 0 ; j < keyword_array.length ; ++j) {
						the_keyword_id = keyword_array[j];

						//Adds values to the sheet
						sheet.getRange((j+2), 1).setValue(the_keyword_id);  
						sheet.getRange((j+2), 2).setValue(json_response.projects[project_id].keywords[the_keyword_id].keyword);
						sheet.getRange((j+2), 3).setValue((json_response.projects[project_id].keywords[the_keyword_id].Comp * 100) + '%');
						sheet.getRange((j+2), 4).setValue(json_response.projects[project_id].keywords[the_keyword_id].oci);
						sheet.getRange((j+2), 5).setValue(json_response.projects[project_id].keywords[the_keyword_id].volume);
						sheet.getRange((j+2), 6).setValue(json_response.projects[project_id].keywords[the_keyword_id].CPC.usd.amount);
						sheet.getRange((j+2), 7).setValue(FROM_UNIX_EPOCH(json_response.projects[project_id].keywords[the_keyword_id].creation_date));
						sheet.getRange((j+2), 8).setValue(FROM_UNIX_EPOCH(json_response.projects[project_id].keywords[the_keyword_id]['SERP_data'].oldest_date));
						sheet.getRange((j+2), 9).setValue(FROM_UNIX_EPOCH(json_response.projects[project_id].keywords[the_keyword_id]['SERP_data'].recent_date));

					}
				}
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

}

///// Functions

//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Keywords", "PullKeywords").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}