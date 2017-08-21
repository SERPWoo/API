#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
#
# This output is text format
#
# Last updated - Aug 21th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects.pl

	use strict;
	use warnings;
	
	use LWP::UserAgent; #You may need to install LWP::Protocol::https through cpan
	use JSON qw( decode_json );

	use utf8;
	use open ':std', ':encoding(UTF-8)';

	#outputs data in JSON format

		# Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
			my $API_key = "API_KEY_HERE";
			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $name_of_project;
			my $total_keywords_in_project;
			my $link_to_keywords_list_for_project;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";

					    printf "%-15s %-70s %-20s %-70s\n", "Project ID", "Project Name", "Total Keywords", "Link to Keywords";
					    printf "%-15s %-70s %-20s %-70s\n", "----------", "------------", "--------------", "----------------";

							foreach my $project_id (sort {$a <=> $b} keys %{$JSON_DATA{'projects'}}) {

								$name_of_project = $JSON_DATA{'projects'}{$project_id}{'name'};
								$link_to_keywords_list_for_project = $JSON_DATA{'projects'}{$project_id}{'_links'}{'keywords'};
								$total_keywords_in_project = $JSON_DATA{'projects'}{$project_id}{'total'}{'keywords'};
								
									    #printf "%-15s %-70s %-20s %-70s\n", $project_id, $name_of_project, $total_keywords_in_project, $link_to_keywords_list_for_project . "?key=" . $API_key;
									    printf "%-15s %-70s %-20s %-70s\n", $project_id, $name_of_project, $total_keywords_in_project, $link_to_keywords_list_for_project;

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
