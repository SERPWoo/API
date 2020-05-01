#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
#
# Last updated - Aug 26th, 2017 @ 19:30 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run command: Rscript list-all-project-keywords.r
#

	library(httr)
	library(jsonlite)

	options(width=1200)

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		API_Key = "API_KEY_HERE"
		Project_ID = 0 #input your Project ID

	url = paste0("https://api.serpwoo.com/v1/projects/", Project_ID, "/keywords/")
	request <- GET(url, query=list(key=API_Key))
	#http_status(request)

	json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))$projects[[1]]$keywords

			# BIND API RESULTS TO DATAFRAME
			df <- data.frame(
			  `Keyword ID` = as.integer(names(json_reply)),
			  `Keyword` = vapply(json_reply, function(item) item$keyword, character(1), USE.NAMES=F),
			  `PPC Comp` = vapply(json_reply, function(item) item$Comp, character(1), USE.NAMES=F),
			  `OCI` = vapply(json_reply, function(item) item$oci, character(1), USE.NAMES=F),
			  `Search Volume` = vapply(json_reply, function(item) item$volume, integer(1), USE.NAMES=F),
			  `CPC (USD)` = vapply(json_reply, function(item) item$CPC$usd$amount, character(1), USE.NAMES=F),
			  `Creation Date` = vapply(json_reply, function(item) item$creation_date, integer(1), USE.NAMES=F),
			  `Oldest Date` = vapply(json_reply, function(item) item$SERP_data$oldest_date, integer(1), USE.NAMES=F),
			  `Recent Date` = vapply(json_reply, function(item) item$SERP_data$recent_date, integer(1), USE.NAMES=F),
			  `Link to SERPs` = vapply(json_reply, function(item) item$'_links'$serps, character(1), USE.NAMES=F),
			  check.names = F, stringsAsFactors = F
			)

	# ORDER ID (ASC)
	df <- with(df, df[order(`Keyword ID`), ])

	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F)

	cat("--\n\n")



