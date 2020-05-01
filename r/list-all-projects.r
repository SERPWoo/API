#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
#
# Last updated - Aug 26th, 2017 @ 19:25 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run command: Rscript list-all-projects.r
#

	library(httr)
	library(jsonlite)

	options(width=1200)

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		API_Key = "API_KEY_HERE"

	url = paste0("https://api.serpwoo.com/v1/projects/")
	request <- GET(url, query=list(key=API_Key))
	#http_status(request)

		json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))$projects

# BIND API RESULTS TO DATAFRAME
	df <- data.frame(
	         `Project ID` = as.integer(names(json_reply)),
	         `Project Name` = vapply(json_reply, function(item) item$name, character(1), USE.NAMES=F),
	         `Total Keywords` = vapply(json_reply, function(item) item$total$keywords, numeric(1), USE.NAMES=F),
	         `Link to Keywords` = vapply(json_reply, function(item) item$'_links'$keywords, character(1), USE.NAMES=F),
	         check.names = F, stringsAsFactors = F
	      )

	# ORDER PROJECT ID (ASC)
	df <- with(df, df[order(`Project ID`), ])

	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F)

	cat("--\n\n")
