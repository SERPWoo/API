#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects-alerts.pl

	use strict;
	use warnings;
	
	use LWP::UserAgent; #You may need to install LWP::Protocol::https through cpan
	use JSON qw( decode_json );

	use utf8;
	use open ':std', ':encoding(UTF-8)';

	#outputs data in JSON format

		# Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
			my $API_key = "API_KEY_HERE";

			my $Project_ID = PROJECT_ID_HERE; #Integer, example = 12345


			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/' . $Project_ID . '/alerts/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $social_time;
			my $alert_text;
			my $alert_link;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-15s %-20s %-90s %-90s\n", "Alert ID", "Social Timestamp", "Alert Text", "Alert Link";
					    printf "%-15s %-20s %-90s %-90s\n", "--------", "----------------", "----------", "----------";

							foreach my $alert_id (sort {$b <=> $a} keys %{$JSON_DATA{'projects'}{$Project_ID}{'alerts'}}) {

								$social_time = $JSON_DATA{'projects'}{$Project_ID}{'alerts'}{$alert_id}{'social_time'};
								$alert_text = $JSON_DATA{'projects'}{$Project_ID}{'alerts'}{$alert_id}{'text'};
								$alert_link = $JSON_DATA{'projects'}{$Project_ID}{'alerts'}{$alert_id}{'link'};
								
									    printf "%-15s %-20s %-90s %-90s\n", $alert_id, $social_time, $alert_text, $alert_link;

							}


					}else {
						#Something went wrong, outputs message
						print "Problem. Error: " . $JSON_DATA{'error'} . "\n";
					}
					
				}else {
						print "Something went VERY wrong.\n\n";
						#print "$json_content";
				}

	  		  print "\n--\n";



################################################################################
################################################################################
