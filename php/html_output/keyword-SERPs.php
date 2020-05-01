<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
// This output is HTML code
//
// Last updated - Aug 30th, 2017 @ 11:12 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//

	//outputs data in text/html format
		header('Content-type: text/html');

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;	//input your Project ID
		$Keyword_ID = 0;	//input your Keyword ID

		$requestURL = "https://api.serpwoo.com/v1/serps/" . $Project_ID . "/" . $Keyword_ID . "/?key=" . $API_key;


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

  			  echo "<table>\n<tr><th>Timestamp</th><th>Rank</th><th>Type</th><th>Title</th><th>URL</th></tr>\n";

					foreach ($JSONData as $key => $jsons_data) {
					  						
						if ($key == $Keyword_ID) {

						  	//echo "<b style='color: #0099ff;'>KEYWORD ID:</b> " . $key . "<br>";
							
							krsort($jsons_data); //sorts by timestamp of SERP
							
							    foreach($jsons_data as $serp_timestamp => $value_level_2) {
									
									  //echo "a_keyword_id=[" . $serp_timestamp . "][" . $value_level_2 . "]<br>";

									    foreach($value_level_2 as $key_3 => $time_array) {
										  
												if ($key_3 == "results") {
												
															ksort($time_array); //sorts by rank

														    foreach($time_array as $rank => $json_obj) {

				  	  	  									  //echo "rank=[" . $rank . "][" . $json_obj['type'] . "]<br>";

																	$type = $JSONData[$key][$serp_timestamp]['results'][$rank]['type'];
																	$title = $JSONData[$key][$serp_timestamp]['results'][$rank]['title'];
																	$url = $JSONData[$key][$serp_timestamp]['results'][$rank]['url'];

																		echo "<tr>";
																		echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $serp_timestamp . "</span></td>";
																		echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $rank . "</span></td>";
																		echo "<td style='text-align: left;'><span style='color: #666666;'>" . $type . "</span></td>";
																		echo "<td style='text-align: left;'><span style='color: #666666;'>" . $title . "</span></td>";
																		echo "<td style='text-align: left;'><span style='color: #ff0099;'>" . $url . "</span></td>";
																		echo "</tr>\n";

															}
												
												}
										 
										}
							    }
								
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