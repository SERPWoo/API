<?php
//
// This code requests all of your projects and their details in JSON format
//
// Last updated - Aug 15th, 2017 @ 10:43AM EST
//

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
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

	//outputs data in JSON format
		header('Content-type: application/json');

	//Print Result
		print_r($json_content);
?>