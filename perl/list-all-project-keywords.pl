#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects-keywords.pl

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
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/' . $Project_ID . '/keywords/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $keyword;
			my $ppc_comp;
			my $oci;
			my $volume;
			my $CPC_USD;
			my $creation_date;
			my $SERP_oldest;
			my $SERP_recent;
			my $SERP_link;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs";
					    printf "%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------";

							foreach my $keyword_id (sort {$a <=> $b} keys %{$JSON_DATA{'projects'}{$Project_ID}{'keywords'}}) {

								$keyword = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'keyword'};
								$ppc_comp = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'Comp'};
								$ppc_comp = ($ppc_comp * 100) . "\%";
								$oci = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'oci'};
								$volume = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'volume'};
								$CPC_USD = sprintf("%.2f", $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'CPC'}{'usd'}{'amount'});
								$creation_date = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'creation_date'};
								$SERP_oldest = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'SERP_data'}{'oldest_date'};
								$SERP_recent = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'SERP_data'}{'recent_date'};
								$SERP_link = $JSON_DATA{'projects'}{$Project_ID}{'keywords'}{$keyword_id}{'_links'}{'serps'};
								
									    printf "%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", $keyword_id, $keyword, $ppc_comp, $oci, $volume, $CPC_USD, $creation_date, $SERP_oldest, $SERP_recent, $SERP_link;

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
