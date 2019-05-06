#!/usr/bin/ruby
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
#
# This output is text format
#
# Last updated - May, 6th @ 8:15 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: ruby keyword-volatility.rb
#

require 'net/http'
require 'uri'
require 'json'

  # Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
  API_key	= "API_KEY_HERE"
  Project_ID	= 0 #input your Project ID
  Keyword_ID	= 0 #input your Keyword ID

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/volatility/#{Project_ID}/#{Keyword_ID}/?key=#{API_key}")
    
  parsed_projects = JSON.parse(page_content)["#{Project_ID}"]
  
  puts "\n--"
  
    printf "%-15s %-20s\n", "Timestamp",  "Volatility %"
    printf "%-15s %-20s\n", "----------", "------------"
  
    parsed_projects.sort.each do |the_keyword, keyword_obj|

      keyword_obj.sort.reverse.each do |the_timestamp, timestamp_obj|

        timestamp_obj.sort.each do |the_volatility, volatility_value|

          if the_volatility == 'volatility'

              printf "%-20s %-20s\n", the_timestamp, volatility_value

            end

        end

      end

    end

  puts "--\n\n"