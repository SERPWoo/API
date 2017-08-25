#!/usr/bin/ruby
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 21:46 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: ruby keyword-SERPs.rb
#

require 'net/http'
require 'uri'
require 'json'

  # Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
  API_key	= "API_KEY_HERE"
  Project_ID	= 0 #input your Project ID
  Keyword_ID	= 0 #input your Keyword ID

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/serps/#{Project_ID}/#{Keyword_ID}/?key=#{API_key}")
    
  parsed_projects = JSON.parse(page_content)["#{Keyword_ID}"]
  
  puts "\n--"
  
    printf "%-15s %-10s %-10s %-80s %-80s\n", "Timestamp", "Rank", "Type", "Title", "URL"
    printf "%-15s %-10s %-10s %-80s %-80s\n", "---------", "----", "----", "-----", "---"
  
    parsed_projects.sort.each do |timestamp, value|

      value.each do |json_obj, valuex|
                
        if json_obj == 'results'
          
          valuex = Hash[valuex.sort_by {|k,v| k.to_i }]
          
          valuex.each do |rank_id, valuey|

            printf "%-15s %-10s %-10s %-80s %-80s\n", timestamp, rank_id, valuey['type'], valuey['title'], valuey['url']

          end

        end

      end

    end

  puts "--\n\n"