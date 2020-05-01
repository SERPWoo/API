<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-project-alerts.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID

		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/alerts/?key=" . $API_key;

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

				echo sprintf("%-15s %-20s %-100s %-90s\n", "Alert ID", "Social Timestamp", "Alert Text", "Alert Link");
				echo sprintf("%-15s %-20s %-100s %-90s\n", "--------", "----------------", "----------", "----------");

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "Name: " . $key . "\n";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]\n";

									  // second level within a project
									  // (Sample output: https://api.serpwoo.com/#projects-keywords)
									    foreach($value_level_2 as $key_3 => $alert_array) {

												ksort($alert_array); //sorts by Alert ID

			  								  // third level within a project, start's querying details
											    foreach($alert_array as $alert_id => $keyword_data) {

				  								  //echo "3rd Level=[" . $$alert_id . "][" . $$keyword_data . "]\n";
									
														$social_time = $JSONData['projects'][$project_id]['alerts'][$alert_id]['social_time'];
														$alert_text = $JSONData['projects'][$project_id]['alerts'][$alert_id]['text'];
														$alert_link = $JSONData['projects'][$project_id]['alerts'][$alert_id]['link'];

														echo sprintf("%-15s %-20s %-100s %-90s\n", $alert_id, $social_time, $alert_text, $alert_link);

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