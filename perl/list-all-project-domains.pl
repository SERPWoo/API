#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
#
# This output is text format
#
# Last updated - Aug 29th, 2017 @ 13:58 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects-domains.pl

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


			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/' . $Project_ID . '/domains/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $domain;
			my $orm_tag;
			my $settings_type;
			my $creation_date;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-15s %-80s %-15s %-10s %-15s\n", "Domain ID", "Domain/URL", "ORM Tag", "Settings", "Creation Date";
					    printf "%-15s %-80s %-15s %-10s %-15s\n", "---------", "----------", "-------", "--------", "-------------";

							foreach my $domain_id (sort {$a <=> $b} keys %{$JSON_DATA{'projects'}{$Project_ID}{'domains'}}) {

								$domain = $JSON_DATA{'projects'}{$Project_ID}{'domains'}{$domain_id}{'domain'};
								$orm_tag = $JSON_DATA{'projects'}{$Project_ID}{'domains'}{$domain_id}{'orm'};
								if (defined $JSON_DATA{'projects'}{$Project_ID}{'domains'}{$domain_id}{'setting'}{'type'}) {
										$settings_type = $JSON_DATA{'projects'}{$Project_ID}{'domains'}{$domain_id}{'setting'}{'type'};
								}else {
									$settings_type = "(n/a)";
								}
								
								$creation_date = $JSON_DATA{'projects'}{$Project_ID}{'domains'}{$domain_id}{'creation_date'};
								
									    printf "%-15s %-80s %-15s %-10s %-15s\n", $domain_id, $domain, $orm_tag, $settings_type, $creation_date;

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
