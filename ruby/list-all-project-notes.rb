#!/usr/bin/ruby
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 21:46 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: ruby list-all-project-notes.rb
#

require 'net/http'
require 'uri'
require 'json'

  # Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
  API_key	= "API_KEY_HERE"
  Project_ID	= 0 #input your Project ID

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/projects/#{Project_ID}/notes/?key=#{API_key}")
    
  parsed_projects = JSON.parse(page_content)['projects']
  
  puts "\n--"
  
    printf "%-25s %-15s %-10s %-80s\n", "Note ID", "Timestamp", "Type", "Note"
    printf "%-25s %-15s %-10s %-80s\n", "-------", "---------", "----", "----"
  
    parsed_projects.each do |project_id, value|

      value.each do |json_obj, valuex|

          valuex.each do |field, valuey|

            printf "%-25s %-15s %-10s %-80s\n", field, valuey['note']['timestamp'], valuey['type'], valuey['note']['message']

          end

      end

    end

  puts "--\n\n"