<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
//
// This output is text
//
// Last updated - May 5th, 2019 @ 20:10 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php keyword-volatility.php
//

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID
		$Keyword_ID = 0;		//input your Keyword ID

		$requestURL = "https://api.serpwoo.com/v1/volatility/" . $Project_ID . "/" . $Keyword_ID . "/?key=" . $API_key;

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

				echo sprintf("%-20s %-20s\n", "Timestamp",  "Volatility %");
				echo sprintf("%-20s %-20s\n", "----------", "------------");

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "Project_ID: " . $key . "\n";
							
							 if ($key == $Project_ID) {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $the_keyword_id => $value_level_2) {

									  //echo "1st Level=[" . $the_keyword_id . "]\n";

									  // second level within a project
									  // (Sample output: https://api.serpwoo.com/#projects-keywords)

									krsort($value_level_2); //sorts by Alert ID

									    foreach($value_level_2 as $the_timestamp => $alert_array) {
										    
										    //echo "2nd Level=[" . $the_timestamp . "]\n";

												$the_volatility = $JSONData[$key][$the_keyword_id][$the_timestamp]['volatility'];

												echo sprintf("%-20s %-15s\n", $the_timestamp, $the_volatility);

										 
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