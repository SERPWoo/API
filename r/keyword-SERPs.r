#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
#
# Last updated - Aug 26th, 2017 @ 19:23 EST (@ParfaitG https://github.com/ParfaitG)
#
# https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run command: Rscript keyword-SERPs.r
#

library(httr)
library(jsonlite)

options(width=1200)

		# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
		API_Key = "API_KEY_HERE"
		Project_ID = 0    #input your Project ID
		Keyword_ID = 0    #input your Keyword ID

	url = paste0("https://api.serpwoo.com/v1/serps/", Project_ID, "/", Keyword_ID, "/")
	request <- GET(url, query=list(key=API_Key))
	#http_status(request)

		json_reply <- fromJSON(content(request, "text", encoding = "UTF-8"))[[paste(Keyword_ID)]]

	# BIND API NESTED RESULTS TO DATAFRAME LIST
	dfList <- mapply(function(j, n)
		  data.frame(
		    `Timestamp` = n,
		    #`Rank` = vapply(json_reply[[1]]$results, function(item) item$domain, character(1), USE.NAMES=F),
		    `Type` = vapply(j$results, function(item) item$type, character(1), USE.NAMES=F),
		    `Title` = vapply(j$results, function(item) item$title, character(1), USE.NAMES=F),
		    `URL` = vapply(j$results, function(item) item$url, character(1), USE.NAMES=F),
		    check.names = F, stringsAsFactors = F
		    )
	, json_reply, names(json_reply), SIMPLIFY=F)

	# ROWBIND ALL DFs 
	df <- do.call(rbind, dfList)

	# ADD RANK VARIABLE
	df$Rank <- mapply(function(t,r) gsub(paste0(t,"."), "", r), df$Timestamp, rownames(df))

	# ORDER ID (ASC) AND COLUMNS
	df <- with(df, df[order(`Timestamp`), ])[c("Timestamp", "Rank", "Type", "Title", "URL")]

	# OUTPUT CONTENT TO SCREEN
	cat("\n--\n")

		print(df, row.names=F, na="")

	cat("--\n\n")



