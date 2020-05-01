<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 10:50 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php keyword-SERPs.php
//

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID
		$Keyword_ID = 0;		//input your Keyword ID

		$requestURL = "https://api.serpwoo.com/v1/serps/" . $Project_ID . "/" . $Keyword_ID . "/?key=" . $API_key;


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

				echo sprintf("%-15s %-10s %-10s %-80s %-80s\n", "Timestamp", "Rank", "Type", "Title", "URL");
				echo sprintf("%-15s %-10s %-10s %-80s %-80s\n", "---------", "----", "----", "-----", "---");

					foreach ($JSONData as $key => $jsons_data) {
					  						
						if ($key == $Keyword_ID) {

						  	//echo "KEYWORD ID: " . $key . "\n";
							
							krsort($jsons_data); //sorts by timestamp of SERP
							
							    foreach($jsons_data as $serp_timestamp => $value_level_2) {
									
									  //echo "a_keyword_id=[" . $serp_timestamp . "][" . $value_level_2 . "]\n";

									    foreach($value_level_2 as $key_3 => $time_array) {
										  
												if ($key_3 == "results") {
												
															ksort($time_array); //sorts by rank

														    foreach($time_array as $rank => $json_obj) {

				  	  	  									  //echo "rank=[" . $rank . "][" . $json_obj['type'] . "]\n";

																	$type = $JSONData[$key][$serp_timestamp]['results'][$rank]['type'];
																	$title = $JSONData[$key][$serp_timestamp]['results'][$rank]['title'];
																	$url = $JSONData[$key][$serp_timestamp]['results'][$rank]['url'];

																		echo sprintf("%-15s %-10d %-10s %-80s %-80s\n", $serp_timestamp, $rank, $type, $title, $url);

															}
												
												}
										 
										}
							    }
								
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