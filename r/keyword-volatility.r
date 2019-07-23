#!/usr/bin/env Rscript

#
# GitHub: https://github.com/SERPWoo/API
#
# This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
#
# Last updated - Jul 23rd, 2019 @ 8:07 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
#
# Run command: Rscript keyword-volatility.r
#

	library(jsonlite)
	library(httr)
	library(utils)

	# Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	API_Key = "API_KEY_HERE"
	Project_ID = 0 #input your Project ID
	Keyword_ID = 0 #input your Keyword ID

	url = paste0("https://api.serpwoo.com/v1/volatility/", Project_ID, "/", Keyword_ID, "/")
	get_data <- GET(url, query=list(key=API_Key))
	get_data_text <- content(get_data,"text")
	json_data <- fromJSON(get_data_text)

	total_observations <- json_data$total
	status <- json_data$success
	r_time <- json_data$response_time
	obs_time <- json_data$time
	info_json <- json_data$meta

		for (info in info_json){
		  for (record in info$keyword){
		    keyword <- record$kw
		  }
		}

		for (field in names(json_data)){
		  if(field != 'total'){
		    if(field != 'time'){
		      if(field != 'response_time'){
		        if(field != 'success'){
		          if(field != 'meta'){
		            first_field <- field
		          }
		        }
		      }
		    }
		  }
		}

	cat("\n--\n")

	all_data <- NULL
	cnt = 1
	data_set <- json_data[first_field]

		for (record in data_set){
		  id_no<-names(record)
		  for (instance in record){
		    timestamps <- names(instance)
		    for (data_subset in instance){
		      all_data[timestamps[cnt]] = data_subset[1]
		      cnt <- cnt+1
		    }
		  }
		}

	df <- NULL

		for (i in 1:total_observations){
		  this_timestamp = names(all_data)[i]
		  this_volatility = all_data[this_timestamp[1]]
		}

	df <- data.frame(all_data)
	df.t <- t(df)
	df2 <- cbind(df.t, names(all_data))
	colnames(df2) <- c("Volatility", "Timestamp")
	dataset <- NULL
	dataset$tstamp <- as.numeric(as.character(df2[,2]))
	dataset$vl <- paste(df2[,1],"%", sep =  "")
	dataset$date <- as.Date(as.POSIXct(dataset$tstamp, origin="1970-01-01"))
	df3 <- data.frame(dataset$date)
	df4 <- cbind(df3, dataset$tstamp, dataset$vl)
	colnames(df4) <- c('Date','Timestamp', 'Volatility')
	df5 <- df4[order(df4$Date),]
	row.names(df5) = NULL
	print(df5, row.names = FALSE)

	cat("--\n\n")