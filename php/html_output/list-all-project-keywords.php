<?php
//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
//
// This output is HTML code
//
// Last updated - Aug 30th, 2017 @ 11:07 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//

	//outputs data in text/html format
		header('Content-type: text/html');

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		$API_key = "API_KEY_HERE";
		$Project_ID = 0;	//input your Project ID

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

		html_css_style();

			//if this query was even successful or not - ALWAYS check this this = 1
			if ($JSONData['success'] == 1) {

  			  echo "<table>\n<tr><th>Keyword ID</th><th>Keyword</th><th>PPC Comp</th><th>OCI</th><th>Search Volume</th><th>CPC (USD)</th><th>Created Date</th><th>Oldest Date</th><th>Recent Date</th><th>Link To SERPs</th></tr>\n";

					foreach ($JSONData as $key => $jsons_data) {
					  //echo "<b style='color: #0099ff;'>Name:</b> " . $key . "<br>";
							
							 if ($key == 'projects') {

								 //first level within a project - gets the project ID from the key
							    foreach($jsons_data as $project_id => $value_level_2) {

									  //echo "Project_ID=[" . $project_id . "]<br>";

									  // second level within a project
									  // (Sample output: https://api.serpwoo.com/#projects-keywords)
									    foreach($value_level_2 as $key_3 => $keyword_array) {

												ksort($keyword_array); //sorts by keyword ID

			  								  // third level within a project, start's querying details
											    foreach($keyword_array as $keyword_id => $keyword_data) {

				  								  //echo "3rd Level=[" . $keyword_id . "][" . $keyword_data . "]<br>";
									
														$keyword = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['keyword'];
														$ppc_comp = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['Comp'];
														$ppc_comp = ($ppc_comp * 100) . "%";														
														$oci = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['oci'];
														$volume = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['volume'];
														$CPC_USD = sprintf("%.2f", $JSONData['projects'][$project_id]['keywords'][$keyword_id]['CPC']['usd']['amount']);
														$creation_date = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['creation_date'];
														$SERP_oldest = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['SERP_data']['oldest_date'];
														$SERP_recent = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['SERP_data']['recent_date'];
														$SERP_link = $JSONData['projects'][$project_id]['keywords'][$keyword_id]['_links']['serps'];

			  										  echo "<tr>";
													  echo "<td style='text-align: center;'><span style='color: #0099ff;'>" . $keyword_id . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #ff0099;'>" . $keyword . "</span></td>";
													  echo "<td style='text-align: center;'><span style='color: #666666;'>" . $ppc_comp . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $oci . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $volume . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #009900;'>" . $CPC_USD . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $creation_date . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $SERP_oldest . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #666666;'>" . $SERP_recent . "</span></td>";
													  echo "<td style='text-align: left;'><span style='color: #0000ff;'>" . $SERP_link . "</span></td>";
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