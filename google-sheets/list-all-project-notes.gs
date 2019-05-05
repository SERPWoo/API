//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Social Time, Note Type, Note Message, Note Last Updated
//
// This outputs to the Google Sheet
//
// Last updated - May 5th, 2019 @ 6:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Instructions:
//	1. use the "Script Editor", under Tools, when inside a blank spreadsheet.
//	2. Copy and paste this script into it the script editor.
//	3. Update the <API_KEY> part of the 'SERPWoo_API_url' variable with your SERPWoo API Key
//	4. Update the <PROJECT_ID> part of the 'SERPWoo_API_url' variable with the project ID of the project where the keyword you want to query is in.
//	5. Save the script, then Run it.
//
//

function PullNotes() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/projects/<PROJECT_ID>/notes/?key=<API_KEY>";	

	var json_data	= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var note_array		= new Array();

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
			sheet.getRange(1, 1).setValue('Note ID');
			sheet.getRange(1, 2).setValue('Timestamp');
			sheet.getRange(1, 3).setValue('Social Timestamp');
			sheet.getRange(1, 4).setValue('Type');
			sheet.getRange(1, 5).setValue('Note');
			sheet.getRange(1, 6).setValue('Last Updated');

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");
			sheet.getRange(1, 5).setBackground("#000000");
			sheet.getRange(1, 6).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
			sheet.getRange(1, 5).setFontColor('white');
			sheet.getRange(1, 6).setFontColor('white');
		}


		for (var project_id in json_response.projects) {

				if( typeof(json_response.projects[project_id]) === "object" ) {

					for (var note_id in json_response.projects[project_id].notes) {
						Logger.log("[L77] " + project_id + " = " + note_id);
						note_array.push(note_id); //gets all the note ids into an array
						note_array.sort(function(a, b){return json_response.projects[project_id].notes[b].note.timestamp-json_response.projects[project_id].notes[a].note.timestamp}); //sorts the IDs in DESCENDING order (usually best for most recent)
						//note_array.sort(function(a, b){return json_response.projects[project_id].notes[a].note.timestamp-json_response.projects[project_id].notes[b].note.timestamp}); //sorts the IDs in ASCENDING order					
					}

					//Write data to Sheet by rows
					for (var j = 0 ; j < note_array.length ; ++j) {
						the_note_id = note_array[j];

						//Adds values to the sheet
						sheet.getRange((j+2), 1).setValue(the_note_id);  
						sheet.getRange((j+2), 2).setValue(json_response.projects[project_id].notes[the_note_id].note.timestamp);  
						sheet.getRange((j+2), 3).setValue(json_response.projects[project_id].notes[the_note_id].note.social_time);  
						sheet.getRange((j+2), 4).setValue(json_response.projects[project_id].notes[the_note_id].type);  
						sheet.getRange((j+2), 5).setValue(json_response.projects[project_id].notes[the_note_id].note.message);
						sheet.getRange((j+2), 6).setValue(FROM_UNIX_EPOCH(json_response.projects[project_id].notes[the_note_id].last_updated));
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

}

///// Functions
//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull Notes", "PullNotes").addToUi(); 
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}