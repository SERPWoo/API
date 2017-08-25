<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
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

	//Print Result
		print_r($json_content);

?>