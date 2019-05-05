//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Epoch Timestamp, Regular Date, Rank Order, Page Title, Description, URL, Search Type
//
// This outputs to the Google Sheet
//
// Last updated - May 4th, 2019 @ 20:24 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
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

function PullSERPs() //Pulls the API Data
{
	//Finds current active Sheet
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Clears the sheet, except for the header row (row #1)
		if(sheet.getLastRow() > 1) { sheet.getRange(2, 1, sheet.getLastRow()-1 , sheet.getLastColumn()).clear(); }

// *** UPDATE THIS URL TO REFLECT THE DATA YOU WANT TO CALL *** //
	var SERPWoo_API_url	= "https://api.serpwoo.com/v1/serps/<PROJECT_ID>/<KEYWORD_ID>/?key=<API_KEY>";

	var json_data	= UrlFetchApp.fetch(SERPWoo_API_url).getContentText();
	var json_response	= JSON.parse(json_data);
	var Final_Rows		= new Array();
	var Days_Data		= new Array();
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
			sheet.getRange(1, 3).setValue('Rank');  
			sheet.getRange(1, 4).setValue('Title');  
			sheet.getRange(1, 5).setValue('Description');  
			sheet.getRange(1, 6).setValue('URL');  
			sheet.getRange(1, 7).setValue('Type');  

			sheet.getRange(1, 1).setBackground("#000000");
			sheet.getRange(1, 2).setBackground("#000000");
			sheet.getRange(1, 3).setBackground("#000000");
			sheet.getRange(1, 4).setBackground("#000000");
			sheet.getRange(1, 5).setBackground("#000000");
			sheet.getRange(1, 6).setBackground("#000000");
			sheet.getRange(1, 7).setBackground("#000000");

			sheet.getRange(1, 1).setFontColor('white');
			sheet.getRange(1, 2).setFontColor('white');
			sheet.getRange(1, 3).setFontColor('white');
			sheet.getRange(1, 4).setFontColor('white');
			sheet.getRange(1, 5).setFontColor('white');
			sheet.getRange(1, 6).setFontColor('white');
			sheet.getRange(1, 7).setFontColor('white');
		}


		for (var keyword_id in json_response) {
			if( typeof(json_response[keyword_id]) === "object" ) {

				for(var midnight_time in json_response[keyword_id]) {
					//Logger.log("[L56] " + keyword_id + " = " + midnight_time);
					midnight_array.push(midnight_time); //gets all the timeperiods into an array (this is the day's midnight time)
					midnight_array.sort(function(a, b){return b-a}); //sorts the midnight times in DESCENDING order
					//midnight_array.sort(function(a, b){return a-b}); //sorts the midnight times in ASCENDING order
				}

				//Adds the data of the results to the Days_Data array
				for(var j = 0 ; j < midnight_array.length ; ++j) {
					midnight_time = midnight_array[j];
					Days_Data.push(GetPack(json_response[keyword_id][midnight_time]));
				}
			}
		}


		//Combines dates (with each row) with the other dates into the final set of rows
		for (var i = 0 ; i < Days_Data.length ; ++i) {
			for(var j = 0 ; j < Days_Data[i].length ; ++j) {
				Final_Rows.push(Days_Data[i][j]);
			}
		}

	//Adds values to the sheet
	sheet.getRange(2, 1, Final_Rows.length, Final_Rows[0].length).setValues(Final_Rows);  

	//Resize Columns -- (WARNING: This increases execution time significantly, can add an additional 2-4 seconds)
	//sheet.autoResizeColumn(1);
	//sheet.autoResizeColumn(2);
	//sheet.autoResizeColumn(3);
	//sheet.autoResizeColumn(4);
	//sheet.autoResizeColumn(5);
	//sheet.autoResizeColumn(6);
	//sheet.autoResizeColumn(7);

}

///// Functions

//Creates a Menu that can be called
function onOpen() {
	SpreadsheetApp.getUi().createMenu("[ SERPWoo Script ]").addItem("Pull SERPs", "PullSERPs").addToUi(); 
}


//this actually pushes the individual row of data into a proper row for display
function GetElement(actual_time, rank_order, json_response) {
	var a_row = new Array();                   
	a_row.push(actual_time);
	a_row.push(FROM_UNIX_EPOCH(actual_time));
	a_row.push(rank_order);
	a_row.push(json_response.title);
	a_row.push(json_response.description);
	a_row.push(json_response.url);
	a_row.push(json_response.type);
	return a_row;
}


//packages the data up into a proper row for the sheet
function GetPack(json_response) {

	var pack = new Array();
                  
		for(var the_rank_order in json_response.results) {
			pack.push(GetElement(json_response.actual_time, the_rank_order, json_response.results[the_rank_order]));
		}
             
	pack.sort(function(a, b){return a[2]-b[2]}); //Sorts the data by the ranking #1 (Ascending order) 
	//pack.sort(function(a, b){return b[2]-a[2]}); //Sorts the data by the ranking #1 (Descending order) 
	return pack;
}

//Converts EPOCH Time into a human readable date
function FROM_UNIX_EPOCH(epoch_in_secs) {
	return new Date(epoch_in_secs * 1000);  // Convert to milliseconds
}
