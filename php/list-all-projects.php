<?php
//
//
// This code requests all of your projects and outputs their ID, names, amount of keywords,
// and direct links to API query of keywords (DO NOT DISPLAY THIS PUBLICALLY SINCE YOUR API KEY IS WITHIN THE SOURCE CODE)
//
// Last updated - Aug 15th, 2017 @ 12:58 PM EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//

	//outputs data in text/html format
		header('Content-type: text/html');

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
		
		$myProjectData = json_decode($json_content, true); //Make sure the 2nd variables = true, otherwise you'll have a hell of a time trying to parse this

		//Print Result
		
		//var_dump($myProjectData);

		html_css_style();

			//if this query was even successful or not - ALWAYS check this this = 1
			if ($myProjectData['success'] == 1) {

  			  echo "<table>\n<tr><th>Project ID</th><th>Name</th><th>Total Keywords</th><th>Link to Keywords</th></tr>\n";
		
					foreach ($myProjectData as $key => $jsons_data) {
					  //echo "<b style='color: #0099ff;'>Name:</b> " . $key . "<br>";
							
							 if ($key == 'projects') {

	 					  		ksort($jsons_data); //sorts the project IDs (ascending)


								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

								  //echo "Project ID=[" . $project_id . "]<br>";

								  // second level within a project, start's querying details
								  // (Sample output: https://api.serpwoo.com/#projects-section)
								    foreach($value_level_2 as $key_3 => $level_3_value) {
										
										$link_to_keywords_list_for_project = $myProjectData['projects'][$project_id]['_links']['keywords'];
										$total_keywords_in_project = $myProjectData['projects'][$project_id]['total']['keywords'];

										//if we get the 'name' key, this the value is the project's name
										if ($key_3 == 'name') {
  										  echo "<tr>";
										  echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $project_id . "</span></td>";
										  echo "<td style='text-align: left;'><span style='color: #ff0099;'>" . $level_3_value . "</span></td>";
										  echo "<td style='text-align: center;'><span style='color: #009900;'>" . $total_keywords_in_project . "</span></td>";
										  echo "<td style='text-align: left;'><a href='https://api.serpwoo.com" . $link_to_keywords_list_for_project . "?key=" . $API_key . "'>" . $link_to_keywords_list_for_project . "</a></td>";
										  echo "</tr>\n";

										}
										 
									 }
							    }

							}else {
								//Outputs additional data
		  					  //echo "<b style='color: #009900;'>Name:</b> " . $key . " // " . $jsons_data . "<br>";
							}

					}

	    			  echo "\n</table>\n";

			}else {
				//Something went wrong, outputs message
			  echo "<b style='color: #0099ff;'>Problem. Error:</b> [<b style='color: #ff0000;'>" . $myProjectData['error'] . "</b>]<br>";
			}


		  echo "\n\t</body></html>\n";



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

			// Styles this faux html ouput
			function html_css_style () {

echo "<!DOCTYPE html>
<!--[if IE 8]> <html lang=\"en\" class=\"ie8\"> <![endif]-->  
<!--[if IE 9]> <html lang=\"en\" class=\"ie9\"> <![endif]-->  
<!--[if !IE]><!--> <html lang=\"en\"> <!--<![endif]-->  
	<head>
		<title>Untitled Document</title>
		<meta name=\"robots\" content=\"NOINDEX,NOFOLLOW,NOARCHIVE\">
			<style type='text/css'>
				.body {
					line-height: 1.4em;
				}
				td {
					border: 1px #eee solid;
				}
				table {
					margin: 20px auto;
					min-width: 80%;
					max-width: 94%;
				}
				td, tr, th {
					padding: 10px;
					margin: 10px;
				}
				th {
					background-color: #00294e;
					color: #ff6d00;
				}
			</style>
		</head>
	<body>
";

			}

?>