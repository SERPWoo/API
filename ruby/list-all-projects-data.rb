#!/usr/bin/ruby
#
# This code requests all of your projects and outputs their ID, names, amount of keywords,
# and direct links to API query of keywords (DO NOT DISPLAY THIS PUBLICALLY SINCE YOUR API KEY IS WITHIN THE SOURCE CODE)
#
# This output is text format
#
# Last updated - Aug 20th, 2017 @ 10:52 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#

require 'net/http'
require 'uri'

  # Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
  API_key	= "API_KEY_HERE"

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/projects/?key=#{API_key}")

  #Print Result
  puts page_content