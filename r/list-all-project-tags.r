#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Tags (Domains/URLs) and outputs the Tag ID, Tag, ORM Tag, Settings, Creation Date, Last_Updated
#
# Last updated - Aug 26th, 2017 @ 19:27 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run command: Rscript list-all-project-tags.r
#

	library(httr)
	library(jsonlite)

		options(width=1200)

	# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	API_Key = "API_KEY_HERE"
	Project_ID = 0 #input your Project ID

		url = paste0("https://api.serpwoo.com/v1/projects/", Project_ID, "/tags/")
		request <- GET(url, query=list(key=API_Key))


	json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))$projects[[1]]$tags

	# BIND API RESULTS TO DATAFRAME
	df <- data.frame(
	  `Tag ID` = as.integer(names(json_reply)),
	  `Tag` = vapply(json_reply, function(item) item$tag, character(1), USE.NAMES=F),
	  `ORM Tag` = vapply(json_reply, function(item) item$orm, integer(1), USE.NAMES=F),
	  `Settings` = sapply(json_reply, function(item) ifelse(is.null(item$setting$type), NA, item$setting$type), USE.NAMES=F),
	  `Creation Date` = vapply(json_reply, function(item) item$creation_date, integer(1), USE.NAMES=F),
	  `Last Update` = vapply(json_reply, function(item) item$last_updated, integer(1), USE.NAMES=F),
	  check.names = F, stringsAsFactors = F
	)
                           
	# ORDER PROJECT ID (ASC)
	df <- with(df, df[order(`Tag ID`), ])


	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F, na="")

	cat("--\n\n")



