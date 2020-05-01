<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-project-keywords.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID


		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/keywords/?key=" . $API_key;


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

				echo sprintf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs");
				echo sprintf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------");


					foreach ($JSONData as $key => $jsons_data) {
					  //echo "Name: " . $key . "\n";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]\n";

									  // second level within a project
									  // (Sample output: https://api.serpwoo.com/#projects-keywords)
									    foreach($value_level_2 as $key_3 => $keyword_array) {

												ksort($keyword_array); //sorts by keyword ID

			  								  // third level within a project, start's querying details
											    foreach($keyword_array as $keyword_id => $keyword_data) {

				  								  //echo "3rd Level=[" . $keyword_id . "][" . $keyword_data . "]\n";
									
														$keyword = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['keyword'];
														$ppc_comp = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['Comp'];
														$ppc_comp = ($ppc_comp * 100) . "%";														
														$oci = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['oci'];
														$volume = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['volume'];
														$CPC_USD = sprintf("%.2f", $JSONData['projects'][$project_id]['keywords'][$keyword_id]['CPC']['usd']['amount']);
														$creation_date = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['creation_date'];
														$SERP_oldest = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['SERP_data']['oldest_date'];
														$SERP_recent = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['SERP_data']['recent_date'];
														$SERP_link = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['_links']['serps'];

														echo sprintf("%-15d %-50s %-10s %-10s %-15d %-10s %-15d %-15d %-15d %-40s\n", $keyword_id, $keyword, $ppc_comp, $oci, $volume, $CPC_USD, $creation_date, $SERP_oldest, $SERP_recent, $SERP_link);

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