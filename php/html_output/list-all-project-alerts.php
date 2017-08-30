<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
// This output is HTML code
//
// Last updated - Aug 30th, 2017 @ 11:05 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//


	//outputs data in text/html format
		header('Content-type: text/html');

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;	//input your Project ID


		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/alerts/?key=" . $API_key;


	// Use Curl to get the request
		$options = array(
			CURLOPT_RETURNTRANSFER => true
		);

		$ch = curl_init($requestURL);
		curl_setopt_array($ch, $options);

		$json_content = curl_exec($ch);
		curl_close($ch);
		
		$JSONData = json_decode($json_content, true); //Make sure the 2nd variables = true, otherwise you'll have a hell of a time trying to parse this

		html_css_style();

			//if this query was even successful or not - ALWAYS check this this = 1
			if ($JSONData['success'] == 1) {

  			  echo "<table>\n<tr><th>Alert ID</th><th>Social Timestamp</th><th>Alert Text</th><th>Alert Link</th></tr>\n";

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "<b style='color: #0099ff;'>Name:</b> " . $key . "<br>";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]<br>";

									  // second level within a project
									  // (Sample output: https://api.serpwoo.com/#projects-keywords)
									    foreach($value_level_2 as $key_3 => $alert_array) {

												ksort($alert_array); //sorts by Alert ID

			  								  // third level within a project, start's querying details
											    foreach($alert_array as $alert_id => $keyword_data) {

				  								  //echo "3rd Level=[" . $$alert_id . "][" . $$keyword_data . "]<br>";
									
														$social_time = $JSONData['projects'][$project_id]['alerts'][$alert_id]['social_time'];
														$alert_text = $JSONData['projects'][$project_id]['alerts'][$alert_id]['text'];
														$alert_link = $JSONData['projects'][$project_id]['alerts'][$alert_id]['link'];

			  										  echo "<tr>";
													  echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $alert_id . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #ff0099;'>" . $social_time . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $alert_text . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $alert_link . "</span></td>";
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
			  echo "<b style='color: #0099ff;'>Problem. Error:</b> [<b style='color: #ff0000;'>" . $JSONData['error'] . "</b>]<br>";
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