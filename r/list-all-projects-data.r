#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects' data in JSON format
#
# Last updated - Aug 22th, 2017 @ 17:00 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run commpand: Rscript list-all-projects-data.r
#

	API_Key = "API_KEY_HERE"

		# Simply outputs ALL data (JSON format)
		json_data <- url.show(paste0("https://api.serpwoo.com/v1/projects/?key=", API_Key))

	print(json_data)
