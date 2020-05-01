#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
#
# This output is text format
#
# Last updated - May 5th, 2019 @ 20:05 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl keyword-volatility.pl

	use strict;
	use warnings;
	
	use LWP::UserAgent; #You may need to install LWP::Protocol::https through cpan
	use JSON qw( decode_json );

	use utf8;
	use open ':std', ':encoding(UTF-8)';

	#outputs data in JSON format

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
			my $API_key = "API_KEY_HERE";

			my $Project_ID = PROJECT_ID_HERE; #Integer, example = 12345
			my $Keyword_ID = KEYWORD_ID_HERE; #Integer, example = 456789

			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/volatility/' . $Project_ID . '/' . $Keyword_ID . '/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-20s %-15s\n", "Timestamp",  "Volatility %";
					    printf "%-20s %-15s\n", "----------", "------------";

							foreach my $timestamp (sort {$b <=> $a} keys %{ $JSON_DATA{$Project_ID}{$Keyword_ID} }) {

								my $the_volatility = $JSON_DATA{$Project_ID}{$Keyword_ID}{$timestamp}{'volatility'};
								
									    printf "%-20s %-15s\n", $timestamp, $the_volatility;

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
