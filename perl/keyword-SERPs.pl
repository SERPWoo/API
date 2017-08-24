#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 16:52 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-SERPs-for-keyword.pl

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
			my $Keyword_ID = KEYWORD_ID_HERE; #Integer, example = 456789

			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/serps/' . $Project_ID . '/' . $Keyword_ID . '/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $rank;
			my $type;
			my $title;
			my $url;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-15s %-10s %-10s %-80s %-80s\n", "Timestamp", "Rank", "Type", "Title", "URL";
					    printf "%-15s %-10s %-10s %-80s %-80s\n", "---------", "----", "----", "-----", "---";

							foreach my $timestamp (sort {$b <=> $a} keys %{$JSON_DATA{$Keyword_ID}}) {

							    #printf "Timestamp: $timestamp\n\n";

									foreach my $rank (sort {$a <=> $b} keys %{$JSON_DATA{$Keyword_ID}{$timestamp}{'results'}}) {
										$type = $JSON_DATA{$Keyword_ID}{$timestamp}{'results'}{$rank}{'type'};
										$title = $JSON_DATA{$Keyword_ID}{$timestamp}{'results'}{$rank}{'title'};
										$url = $JSON_DATA{$Keyword_ID}{$timestamp}{'results'}{$rank}{'url'};
								
										    printf "%-15s %-10s %-10s %-80s %-80s\n", $timestamp, $rank, $type, $title, $url;
									}								

								    print "--\n";

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
