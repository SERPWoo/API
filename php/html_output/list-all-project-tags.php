<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
//
// This output is HTML code
//
// Last updated - Aug 30th, 2017 @ 11:09 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//

	//outputs data in text/html format
		header('Content-type: text/html');

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;		//input your Project ID

		$requestURL = "https://api.serpwoo.com/v1/projects/" . $Project_ID . "/tags/?key=" . $API_key;

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

  			  echo "<table>\n<tr><th>Tag ID</th><th>Tag</th><th>ORM Tag</th><th>Settings</th><th>Creation Date</th><th>Last Update</th></tr>\n";

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "<b style='color: #0099ff;'>Name:</b> " . $key . "<br>";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]<br>";

									  // second level within a project
									    foreach($value_level_2 as $key_3 => $second_array) {

												ksort($second_array); //sorts by ID

			  								  // third level within a project, start's querying details
											    foreach($second_array as $id => $json_data) {

				  								  //echo "3rd Level=[" . $id . "][" . $json_data . "]<br>";
									
														$tag = $JSONData['projects'][$project_id]['tags'][$id]['tag'];
														$orm_tag = $JSONData['projects'][$project_id]['tags'][$id]['orm'];

														if (isset($JSONData['projects'][$project_id]['tags'][$id]['setting']['type'])){
															$settings_type = $JSONData['projects'][$project_id]['tags'][$id]['setting']['type'];
														}else {
															$settings_type = "";
														}

														$creation_date = $JSONData['projects'][$project_id]['tags'][$id]['creation_date'];

														if (isset($JSONData['projects'][$project_id]['tags'][$id]['last_updated'])){
															$last_updated = $JSONData['projects'][$project_id]['tags'][$id]['last_updated'];
														}else {
															$last_updated = "";
														}

			  										  echo "<tr>";
													  echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $id . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #ff0099;'>" . $tag . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $orm_tag . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $settings_type . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $creation_date . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $last_updated . "</span></td>";
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