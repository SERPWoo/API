<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
//
// (For Javascript/Ajax calls)
//
// Last updated - Aug 25th, 2017 @ 11:00 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run: (use javascript/ script in parent folder)
//

	//outputs data in JSON format
		header('Content-type: application/json');

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0; //input your Project ID

		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/tags/?key=" . $API_key;

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