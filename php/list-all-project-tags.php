<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-project-tags.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID


		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/tags/?key=" . $API_key;


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

				echo sprintf("%-15s %-80s %-15s %-10s %-15s %-15s\n", "Tag ID", "Tag", "ORM Tag", "Settings", "Creation Date", "Last Update");
				echo sprintf("%-15s %-80s %-15s %-10s %-15s %-15s\n", "------", "---", "-------", "--------", "-------------", "-----------");

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "Name: " . $key . "<br>";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]<br>";

									  // second level within a project
									    foreach($value_level_2 as $key_3 => $second_array) {

												ksort($second_array); //sorts by ID

			  								  // third level within a project, start's querying details
											    foreach($second_array as $id => $json_data) {

				  								  //echo "3rd Level=[" . $id . "][" . $json_data . "]<br>";
									
														$tag = $JSONData['projects'][$project_id]['tags'][$id]['tag'];
														$orm_tag = $JSONData['projects'][$project_id]['tags'][$id]['orm'];

														if (isset($JSONData['projects'][$project_id]['tags'][$id]['setting']['type'])){
															$settings_type = $JSONData['projects'][$project_id]['tags'][$id]['setting']['type'];
														}else {
															$settings_type = "";
														}

														$creation_date = $JSONData['projects'][$project_id]['tags'][$id]['creation_date'];

														if (isset($JSONData['projects'][$project_id]['tags'][$id]['last_updated'])){
															$last_updated = $JSONData['projects'][$project_id]['tags'][$id]['last_updated'];
														}else {
															$last_updated = "";
														}

														echo sprintf("%-15d %-80s %-15d %-10s %-15d %-15d\n", $id, $tag, $orm_tag, $settings_type, $creation_date, $last_updated);

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