#!/usr/bin/perl -w

#
# This code requests all of your projects' data in JSON format
#
# Last updated - Aug 15th, 2017 @ 13:43 AM EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#

	use strict;
	use warnings;
	
	use LWP::UserAgent; #You may need to install LWP::Protocol::https through cpan
	use JSON qw( decode_json );

	use utf8;
	use open ':std', ':encoding(UTF-8)';

	#outputs data in JSON format
    print "Content-type: application/json\n\n";

		# Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
			my $API_key = "EFBB5420-1644-3AB6-8239-30B3554D1085";
			my %JSON_DATA;
	
		#Pulls the S3 JSON file
			my $ua = new LWP::UserAgent;
			my $res = $ua->get('https://api.serpwoo.com/v1/projects/?key=' . $API_key);

			my $json_content = $res->decoded_content;
			
			my $error_occurred = 0;

				eval { %JSON_DATA = %{ decode_json($json_content) }; } or $error_occurred = 1;
				
				if ($error_occurred == 0) {
						print "$json_content\n\n";												
				}else {
						print "Something went wrong.\n\n";
						#print "$json_content";
				}
