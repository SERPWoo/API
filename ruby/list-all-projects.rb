#!/usr/bin/ruby
#
# This code requests all of your projects' data in JSON format
#
#  Last updated - Aug 20th, 2017 @ 17:58 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
#
# Run Command: ruby list-all-projects.rb

require 'net/http'
require 'uri'
require 'json'

  # Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
  API_key	= "API_KEY_HERE"

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/projects/?key=#{API_key}")
  
  parsed_projects = JSON.parse(page_content)['projects']
  
  #keys = parsed_projects.keys  
  #puts "#{keys}"
  
  #Print Result

  puts "\n--"
  
    printf "%-15s %-70s %-20s %-70s\n", "Project ID", "Project Name", "Total Keywords", "Link to Keywords"
    printf "%-15s %-70s %-20s %-70s\n", "----------", "------------", "--------------", "----------------"
  
    parsed_projects.each do |project_id, value|

        printf "%-15s %-70s %-20s %-70s\n", project_id, value['name'], value['total']['keywords'], value['_links']['keywords']

    end

  puts "--\n\n"
