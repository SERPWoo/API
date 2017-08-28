//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
//
//	This output is text format
//
//	Last updated - Aug 27th, 2017 @ 22:03 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	You might need to install curl: apt-get install libcurl4-openssl-dev
//
//	Compile command: gcc -ansi -pedantic -Wall -Werror -std=gnu99 -o list-all-project-keywords list-all-project-keywords.c -lm -lcurl
//	Run Command: ./list-all-project-keywords
//
// References: https://stackoverflow.com/questions/23647438/how-to-parse-nested-json-object
// References: https://github.com/udp/json-parser
//

#include <stdio.h>
#include <curl/curl.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#include "json/json.h"
#include "json/json.c"


		// global data we'll need
		struct url_data {
		    size_t size;
		    char* data;
		};

//// List of functions - for curl
		size_t write_data(void *ptr, size_t size, size_t nmemb, struct url_data *data);
		char *handle_url(char* url);

//// List of functions - for JSON reading
		static void print_depth_shift(int depth);
		static void process_value(json_value* value, int depth, char* parentName);
		static void process_object(json_value* value, int depth);
		static void process_array(json_value* value, int depth);
		static void List_Row();

//// Variables
		int total_projects = 0;

        char* currentId = "";
        char* currentKeyword = "";
        char* currentKeyword_Comp = "";
        char* currentKeyword_OCI = "";
        char* currentKeyword_CPC_USD_Amount = "";
        char* currentKeyword_Links_SERPs = "";

        int currentKeyword_Volume = 0;
        int currentKeyword_Creation_Date = 0;
        int currentKeyword_SERP_data_oldest_date = 0;
        int currentKeyword_SERP_data_recent_date = 0;

        //int currentKeywords = 0;
        int selectedTotal = 0;
        int printedRowCount = 0;


int main(int argc, char** argv)
{

	    json_char* json_objects;
    	json_value *json_data;

		// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
		char* API_key = "API_KEY_HERE";
		int Project_ID = 0; //Input your Project ID

		char* request_url = "https://api.serpwoo.com/v1";

		char final_request_URL[255];
		int the_statement;

		the_statement = snprintf(final_request_URL, 255, "%s/projects/%d/keywords/?key=%s", request_url, Project_ID, API_key);

		if (the_statement > sizeof(final_request_URL)) {
				//printf("Error: Something went wrong. Suppose to be 255 not [%ld]. Exiting.\n", sizeof(final_request_URL));
				exit (1);
		}else {
				//printf("\nURL to request: [%s]\n--\n", final_request_URL);
		}

	    json_objects = handle_url(final_request_URL);

	    if(json_objects) {
	        //printf("%s\n", json_objects);

	        	printf("\n--\n");

		        json_data = json_parse(json_objects, strlen(json_objects) );

		        process_value(json_data, 0, "");

		        printf("\n--\n\n");

	    }


        json_value_free(json_data);
        return 0;
}


//////////////////////////////////////// JSON Functions
////////////////////////////////////////

//print to the display
static void List_Row(){

    if(printedRowCount == 0) {
        printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs");
        printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------");
    }

    printedRowCount++;
	
    printf("%-15s %-50s %-10s %-10s %-15d %-10s %-15d %-15d %-15d %-40s\n",currentId, currentKeyword, currentKeyword_Comp, currentKeyword_OCI, currentKeyword_Volume, currentKeyword_CPC_USD_Amount, currentKeyword_Creation_Date, currentKeyword_SERP_data_oldest_date, currentKeyword_SERP_data_recent_date, currentKeyword_Links_SERPs);
    selectedTotal = 0;

    currentId = "";
    currentKeyword = "";
    currentKeyword_Comp = "";
    currentKeyword_OCI = "";
    currentKeyword_Volume = 0;
    currentKeyword_CPC_USD_Amount = "";
    currentKeyword_Creation_Date = 0;
    currentKeyword_SERP_data_oldest_date = 0;
    currentKeyword_SERP_data_recent_date = 0;
    currentKeyword_Links_SERPs = "";
}



static void process_object(json_value* value, int depth)
{
        int length, x;
        if (value == NULL) {
                return;
        }
        length = value->u.object.length;
        for (x = 0; x < length; x++) {

		    //printf("%-15d depth=[%d] // %s\n", selectedTotal, depth, value->u.object.values[x].name);

                if(depth == 7) {
                            currentId = value->u.object.values[x].name;
                            selectedTotal++;
						    //printf("currentId = %-15d %-15s\n", selectedTotal, currentId);
		        }
				
				if(depth == 9 && strcmp(value->u.object.values[x].name, "keyword") == 0 ) {
                            currentKeyword = value->u.object.values[x].value->u.string.ptr;
                            selectedTotal++;
						    //printf("currentKeyword %-15d %-15s\n", selectedTotal, currentKeyword);
                }
				
				if(depth == 9 && strcmp(value->u.object.values[x].name, "Comp") == 0 ) {
                            currentKeyword_Comp = value->u.object.values[x].value->u.string.ptr;
                            selectedTotal++;
						    //printf("currentKeyword_Comp %-15d %-15s\n", selectedTotal, currentKeyword_Comp);
                }

				if(depth == 9 && strcmp(value->u.object.values[x].name, "oci") == 0 ) {
                            currentKeyword_OCI = value->u.object.values[x].value->u.string.ptr;
                            selectedTotal++;
						    //printf("currentKeyword_OCI %-15d %-15s\n", selectedTotal, currentKeyword_OCI);
                }				

				if(depth == 9 && strcmp(value->u.object.values[x].name, "volume") == 0 ) {
                            currentKeyword_Volume = value->u.object.values[x].value->u.integer;
                            selectedTotal++;
						    //printf("currentKeyword_Volume %-15d %-15d\n", selectedTotal, currentKeyword_Volume);
                }				

				if(depth == 9 && strcmp(value->u.object.values[x].name, "creation_date") == 0 ) {
                            currentKeyword_Creation_Date = value->u.object.values[x].value->u.integer;
                            selectedTotal++;
						    //printf("currentKeyword_Creation_Date %-15d %-15d\n", selectedTotal, currentKeyword_Creation_Date);
                }				

				if(depth == 11 && strcmp(value->u.object.values[x].name, "oldest_date") == 0 ) {
                            currentKeyword_SERP_data_oldest_date = value->u.object.values[x].value->u.integer;
                            selectedTotal++;
						    //printf("currentKeyword_SERP_data_oldest_date %-15d %-15d\n", selectedTotal, currentKeyword_SERP_data_oldest_date);
                }				

				if(depth == 11 && strcmp(value->u.object.values[x].name, "recent_date") == 0 ) {
                            currentKeyword_SERP_data_recent_date = value->u.object.values[x].value->u.integer;
                            selectedTotal++;
						    //printf("currentKeyword_SERP_data_recent_date %-15d %-15d\n", selectedTotal, currentKeyword_SERP_data_recent_date);
                }				

				if(depth == 11 && strcmp(value->u.object.values[x].name, "serps") == 0 ) {
                            currentKeyword_Links_SERPs = value->u.object.values[x].value->u.string.ptr;
                            selectedTotal++;
						    //printf("currentKeyword_Links_SERPs %-15d %-15s\n", selectedTotal, currentKeyword_Links_SERPs);
                }	

				if(depth == 13 && strcmp(value->u.object.values[x].name, "amount") == 0 ) {
                            currentKeyword_CPC_USD_Amount = value->u.object.values[x].value->u.string.ptr;
                            selectedTotal++;
						    //printf("currentKeyword_CPC_USD_Amount %-15d %-15s\n", selectedTotal, currentKeyword_CPC_USD_Amount);
                }				

                if(selectedTotal == 10) { //corresponds with total amount of variables we are looking for
                    List_Row();
                }

                process_value(value->u.object.values[x].value, depth+1, value->u.object.values[x].name );

        }
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// JSON Processing
////////////////////////////////////////


static void process_array(json_value* value, int depth)
{
        int length, x;
        if (value == NULL) {
                return;
        }
        length = value->u.array.length;
        //printf("array\n");
        for (x = 0; x < length; x++) {
                process_value(value->u.array.values[x], depth, "array_element");
        }
}

static void process_value(json_value* value, int depth, char* parentName)
{
        //int j;
        if (value == NULL) {
                return;
        }
        if (value->type != json_object) {
                print_depth_shift(depth);
        }
        switch (value->type) {
            	case json_null:
						break;
                case json_none:
						break;
                case json_object:
                        process_object(value, depth+1);
                        break;
                case json_array:
                        process_array(value, depth+1);
                        break;
                case json_integer:
						break;
                case json_double:
						break;
                case json_string:
						break;
                case json_boolean:
						break;
        }
}

static void print_depth_shift(int depth)
{
        int j;
        for (j=0; j < depth; j++) {
				//printf(" ");
        }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// CURL Functions
////////////////////////////////////////

size_t write_data(void *ptr, size_t size, size_t nmemb, struct url_data *data) {
    size_t index = data->size;
    size_t n = (size * nmemb);
    char* tmp;

    data->size += (size * nmemb);

#ifdef DEBUG
    fprintf(stderr, "data at %p size=%ld nmemb=%ld\n", ptr, size, nmemb);
#endif
    tmp = realloc(data->data, data->size + 1); /* +1 for '\0' */

    if(tmp) {
        data->data = tmp;
    } else {
        if(data->data) {
            free(data->data);
        }
        fprintf(stderr, "Failed to allocate memory.\n");
        return 0;
    }

    memcpy((data->data + index), ptr, n);
    data->data[data->size] = '\0';

    return size * nmemb;
}

char *handle_url(char* url) {
    CURL *curl;

    struct url_data data;
    data.size = 0;
    data.data = malloc(4096); /* reasonable size initial buffer */
    if(NULL == data.data) {
        fprintf(stderr, "Failed to allocate memory.\n");
        return NULL;
    }

    data.data[0] = '\0';

    CURLcode res;

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &data);
        res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
                fprintf(stderr, "curl_easy_perform() failed: %s\n",
                        curl_easy_strerror(res));
        }

        curl_easy_cleanup(curl);

    }
    return data.data;
}
