<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects' data in JSON format
//
// This output is text
//
// Last updated - Aug 30th, 2017 @ 11:00 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run Command: php list-all-projects-data.php
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

	//Print Result
		print_r($json_content);
?>