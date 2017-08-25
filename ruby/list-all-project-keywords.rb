#!/usr/bin/ruby
#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
#
# This output is text format
#
# Last updated - Aug 24th, 2017 @ 21:46 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run Command: ruby list-all-project-keywords.rb
#

require 'net/http'
require 'uri'
require 'json'

  # Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
  API_key	= "API_KEY_HERE"
  Project_ID	= 0 #input your Project ID

    def open(url)
      Net::HTTP.get(URI.parse(url))
    end

  page_content = open("https://api.serpwoo.com/v1/projects/#{Project_ID}/keywords/?key=#{API_key}")
    
  parsed_projects = JSON.parse(page_content)['projects']
  
  puts "\n--"
  
    printf "%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs"
    printf "%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------"
  
    parsed_projects.each do |project_id, value|

      value.each do |json_obj, valuex|

          valuex.each do |field, valuey|

            printf "%-15s %-50s %-10.2f %-10s %-15s %-10.2fs %-15s %-15s %-15s %-40s\n", field, valuey['keyword'], valuey['Comp'], valuey['oci'], valuey['volume'], valuey['CPC']['usd']['amount'], valuey['creation_date'], valuey['SERP_data']['oldest_date'], valuey['SERP_data']['recent_date'], valuey['_links']['serps']

          end

      end

    end

  puts "--\n\n"