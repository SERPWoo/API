#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests all of your projects and outputs their names, amount of keywords, and links to API query of keywords
#
# Last updated - Aug 22th, 2017 @ 18:07 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
#
# Run commpand: Rscript list-all-projects.r
#

library(jsonlite)

	API_Key = "API_KEY_HERE"

		json_reply <- fromJSON(paste0("https://api.serpwoo.com/v1/projects/?key=", API_Key))

		#names(json_reply$projects)

		cat("\n--\n")
		
		m<-lapply(
		        json_reply$projects, 
		        function(project_id) sprintf("Project Name: %-70s Total KWs: %-20s Link To KW: %s", project_id$name, project_id$total$keywords, project_id$'_links'$keywords)
		)

		m <- do.call(rbind, m)
		paste(m)

		cat("--\n\n")