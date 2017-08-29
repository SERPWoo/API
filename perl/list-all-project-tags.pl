#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
#
# This output is text format
#
# Last updated - Aug 29th, 2017 @ 13:58 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects-tags.pl

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
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/' . $Project_ID . '/tags/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $tag;
			my $orm_tag;
			my $settings_type;
			my $creation_date;
			my $last_updated;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-15s %-80s %-15s %-10s %-15s %-15s\n", "Tag ID", "Tag", "ORM Tag", "Settings", "Creation Date", "Last Update";
					    printf "%-15s %-80s %-15s %-10s %-15s %-15s\n", "------", "---", "-------", "--------", "-------------", "-----------";

							foreach my $tag_id (sort {$a <=> $b} keys %{$JSON_DATA{'projects'}{$Project_ID}{'tags'}}) {

								$tag = $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'tag'};
								$orm_tag = $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'orm'};

								if (defined $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'setting'}{'type'}) {
										$settings_type = $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'setting'}{'type'};
								}else {
										$settings_type = "(n/a)";
								}
								
								$creation_date = $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'creation_date'};

								if (defined $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'last_updated'}) {
										$last_updated = $JSON_DATA{'projects'}{$Project_ID}{'tags'}{$tag_id}{'last_updated'};
								}else {
										$last_updated = $creation_date;
								}
								
								
									    printf "%-15s %-80s %-15s %-10s %-15s %-15s\n", $tag_id, $tag, $orm_tag, $settings_type, $creation_date, $last_updated;

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
