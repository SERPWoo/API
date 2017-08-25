<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
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
		$Keyword_ID = 0; //input your Keyword ID

		$requestURL = "https://api.serpwoo.com/v1/serps/" . $Project_ID . "/" . $Keyword_ID . "/?key=" . $API_key;

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