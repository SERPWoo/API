#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
#
# Last updated - Aug 26th, 2017 @ 19:30 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run commpand: Rscript list-all-project-domains.r
#

	library(httr)
	library(jsonlite)

	options(width=1200)

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		API_Key = "API_KEY_HERE"
		Project_ID = 0            #input your Project ID

	url = paste0("https://api.serpwoo.com/v1/projects/", Project_ID, "/domains/")
	request <- GET(url, query=list(key=API_Key))
	#http_status(request)

		json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))$projects[[1]]

			# BIND API RESULTS TO DATAFRAME
			df <- data.frame(
			  `Domain ID` = as.integer(names(json_reply$domains)),
			  `Domain/URL` = vapply(json_reply$domains, function(item) item$domain, character(1), USE.NAMES=F),
			  `ORM Tag` = vapply(json_reply$domains, function(item) item$orm, integer(1), USE.NAMES=F),
			  `Setting` = as.character(sapply(json_reply$domains, function(item) ifelse(is.null(item$setting$type), NA, item$setting$type)), USE.NAMES=F),
			  `Creation Date` = vapply(json_reply$domains, function(item) item$creation_date, integer(1), USE.NAMES=F),
			  check.names = F, stringsAsFactors = F
			)

	# ORDER ID (ASC)
	df <- with(df, df[order(`Domain ID`), ])

	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F, na="")

	cat("--\n\n")



