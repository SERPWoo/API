<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
//
// (For Javascript/Ajax calls)
//
// Last updated - May 6th, 2019 @ 9:05 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Run: (use javascript/ script in parent folder)
//

	//outputs data in JSON format
		header('Content-type: application/json');

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0; //input your Project ID
		$Keyword_ID = 0; //input your Keyword ID


		$requestURL = "https://api.serpwoo.com/v1/volatility/" . $Project_ID . "/" . $Keyword_ID . "/?key=" . $API_key;

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