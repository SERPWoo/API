#!/usr/bin/perl -w

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects and outputs their ID, names, amount of keywords,
# and direct links to API query of keywords (DO NOT DISPLAY THIS PUBLICALLY SINCE YOUR API KEY IS WITHIN THE SOURCE CODE)
#
# This output is HTML code, so it should probably be ran as CGI or something
#
# Last updated - Aug 21th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#

	use strict;
	use warnings;
	
	use LWP::UserAgent; #You may need to install LWP::Protocol::https through cpan
	use JSON qw( decode_json );

	use utf8;
	use open ':std', ':encoding(UTF-8)';

	#outputs data in JSON format
    print "Content-type: text/html\n\n";

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
			my $API_key = "API_KEY_HERE";
			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $link_to_keywords_list_for_project;
			my $total_keywords_in_project;

			html_css_style();

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

							print "<table>\n<tr><th>Project ID</th><th>Name</th><th>Total Keywords</th><th>Link to Keywords</th></tr>\n";

							foreach my $project_id (sort {$a <=> $b} keys %{$JSON_DATA{'projects'}}) {
								
								foreach my $key (sort {$a cmp $b} keys %{$JSON_DATA{'projects'}{$project_id}}) {

									$link_to_keywords_list_for_project = $JSON_DATA{'projects'}{$project_id}{'_links'}{'keywords'};
									$total_keywords_in_project = $JSON_DATA{'projects'}{$project_id}{'total'}{'keywords'};

									
									if ($key eq "name") {

											print "<tr>";
											print "<td style='text-align: center;'><span style='color: #0099ff;'>" . $project_id . "</span></td>";
											print "<td style='text-align: left;'><span style='color: #ff0099;'>" . $JSON_DATA{'projects'}{$project_id}{$key} . "</span></td>";
											print "<td style='text-align: center;'><span style='color: #009900;'>" . $total_keywords_in_project . "</span></td>";
											print "<td style='text-align: left;'><a href='https://api.serpwoo.com" . $link_to_keywords_list_for_project . "?key=" . $API_key . "'>" . $link_to_keywords_list_for_project . "</a></td>";
											print "</tr>\n";

										
									}
									
								}

							}

							print "</table>\n";

					}else {
						#Something went wrong, outputs message
						print "<b style='color: #0099ff;'>Problem. Error:</b> [<b style='color: #ff0000;'>" . $JSON_DATA{'error'} . "</b>]<br>";
					}
					
				}else {
						print "Something went VERY wrong.\n\n";
						#print "$json_content";
				}


	  		  print "\n\t</body></html>\n";



################################################################################
################################################################################

			# Styles this faux html ouput
			sub html_css_style () {

print "<!DOCTYPE html>
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
