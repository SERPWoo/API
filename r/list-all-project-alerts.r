#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
#
# Last updated - Aug 26th, 2017 @ 19:32 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run command: Rscript list-all-project-alerts.r
#

	library(httr)
	library(jsonlite)

	options(width=1200)

		# Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		API_Key = "API_KEY_HERE"
		Project_ID = 0 #input your Project ID

	url = paste0("https://api.serpwoo.com/v1/projects/", Project_ID, "/alerts/")
	request <- GET(url, query=list(key=API_Key))
	#http_status(request)

		json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))$projects[[1]]$alerts

			# BIND API RESULTS TO DATAFRAME
			df <- data.frame(
			  `Alert ID` = as.integer(names(json_reply)),
			  `Social Timestamp` = vapply(json_reply, function(item) item$timestamp, integer(1), USE.NAMES=F),
			  `Alert Text` = vapply(json_reply, function(item) item$text, character(1), USE.NAMES=F),
			  `Alert Link` = vapply(json_reply, function(item) item$link, character(1), USE.NAMES=F),
			  check.names = F, stringsAsFactors = F
			)

	# ORDER ID (ASC)
	df <- with(df, df[order(`Alert ID`), ])

	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F)

	cat("--\n\n")