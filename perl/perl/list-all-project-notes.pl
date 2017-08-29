#!/usr/bin/perl -w
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 16:52 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: perl list-all-projects-notes.pl

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
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/' . $Project_ID . '/notes/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;
			my $note_timestamp;
			my $note_type;
			my $note_message;
			my $creation_date;
			my $last_updated;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {

					# Always check for success = 1
					if ($JSON_DATA{'success'} == 1){

						print "\n--\n";
					    printf "%-25s %-15s %-10s %-80s\n", "Note ID", "Timestamp", "Type", "Note";
					    printf "%-25s %-15s %-10s %-80s\n", "-------", "---------", "----", "----";

							foreach my $note_id (sort {$a cmp $b} keys %{$JSON_DATA{'projects'}{$Project_ID}{'notes'}}) {

								$note_timestamp = $JSON_DATA{'projects'}{$Project_ID}{'notes'}{$note_id}{'note'}{'timestamp'};
								$note_type = $JSON_DATA{'projects'}{$Project_ID}{'notes'}{$note_id}{'type'};
								$note_message = $JSON_DATA{'projects'}{$Project_ID}{'notes'}{$note_id}{'note'}{'message'};
								
								
									    printf "%-25s %-15s %-10s %-80s\n", $note_id, $note_timestamp, $note_type, $note_message;

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
