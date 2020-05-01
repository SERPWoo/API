<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-project-notes.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID


		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/notes/?key=" . $API_key;


	// Use Curl to get the request
		$options = array(
			CURLOPT_RETURNTRANSFER => true
		);

		$ch = curl_init($requestURL);
		curl_setopt_array($ch, $options);

		$json_content = curl_exec($ch);
		curl_close($ch);
		
		$JSONData = json_decode($json_content, true); //Make sure the 2nd variables = true, otherwise you'll have a hell of a time trying to parse this
		
			echo "\n--\n";

			//if this query was even successful or not - ALWAYS check this this = 1
			if ($JSONData['success'] == 1) {


				echo sprintf("%-25s %-15s %-10s %-80s\n", "Note ID", "Timestamp", "Type", "Note");
				echo sprintf("%-25s %-15s %-10s %-80s\n", "-------", "---------", "----", "----");

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "Name: " . $key . "\n";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]\n";

									  // second level within a project
									    foreach($value_level_2 as $key_3 => $second_array) {

												ksort($second_array); //sorts by ID

			  								  // third level within a project, start's querying details
											    foreach($second_array as $id => $json_data) {

				  								  //echo "3rd Level=[" . $id . "][" . $json_data . "]\n";
									
														$note_timestamp = $JSONData['projects'][$project_id]['notes'][$id]['note']['timestamp'];
														$note_type = $JSONData['projects'][$project_id]['notes'][$id]['type'];
														$note_message = $JSONData['projects'][$project_id]['notes'][$id]['note']['message'];
														
														echo sprintf("%-25s %-15d %-10d %-80s\n", $id, $note_timestamp, $note_type, $note_message);

												}
										 
										}
							    }

							}else {
								//Outputs additional data
								//echo "Name: " . $key . " // " . $jsons_data . "\n";
							}

					}

			}else {
				//Something went wrong, outputs message
				echo "Problem. Error: " . $JSONData['error'] . "\n";
			}

			echo "\n--\n";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

?>