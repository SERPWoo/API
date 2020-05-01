<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-projects.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";

		$requestURL = "https://api.serpwoo.com/v1/projects/?key=" . $API_key;

	// Use Curl to get the request
		$options = array(
			CURLOPT_RETURNTRANSFER => true
		);

		$ch = curl_init($requestURL);
		curl_setopt_array($ch, $options);

		$json_content = curl_exec($ch);
		curl_close($ch);
		
		$myProjectData = json_decode($json_content, true); //Make sure the 2nd variables = true, otherwise you'll have a hell of a time trying to parse this
		
			echo "\n--\n";

			//if this query was even successful or not - ALWAYS check this this = 1
			if ($myProjectData['success'] == 1) {

				echo sprintf("%-15s%-70s%-20s%-70s\n", "Project ID", "Project Name", "Total Keywords", "Link to Keywords");
				echo sprintf("%-15s%-70s%-20s%-70s\n", "----------", "------------", "--------------", "----------------");

					foreach ($myProjectData as $key => $jsons_data) {
					  //echo "Name: " . $key . "\n";
							
							 if ($key == 'projects') {

	 					  		ksort($jsons_data); //sorts the project IDs (ascending)


								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

								  //echo "Project ID=[" . $project_id . "]\n";

								  // second level within a project, start's querying details
								  // (Sample output: https://api.serpwoo.com/#projects-section)
								    foreach($value_level_2 as $key_3 => $level_3_value) {
										
										$link_to_keywords_list_for_project = $myProjectData['projects'][$project_id]['_links']['keywords'];
										$total_keywords_in_project = $myProjectData['projects'][$project_id]['total']['keywords'];

										//if we get the 'name' key, this the value is the project's name
										if ($key_3 == 'name') {

											echo sprintf("%-15s%-70s%-20d%-70s\n", $project_id, $level_3_value, $total_keywords_in_project, $link_to_keywords_list_for_project);

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
				echo "Problem. Error: " . $myProjectData['error'] . "\n";
			}

			echo "\n--\n";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

?>