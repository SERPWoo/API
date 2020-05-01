//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a Keyword Volatility and outputs the Epoch Timestamp, Volatility %
//
//	This output is text format
//
//	Last updated - May 5th, 2019 @ 16:59 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	You might need to install curl: apt-get install libcurl4-openssl-dev
//
//	Compile command: gcc -ansi -pedantic -Wall -Werror -std=gnu99 -o keyword-volatility keyword-volatility.c -lm -lcurl
//	Run Command: ./keyword-volatility
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

		char* EpochTimeStamp = "";
		long int current_Volatility = 0;

		//int currentKeywords = 0;
		int selectedTotal = 0;
		int printedRowCount = 0;


int main(int argc, char** argv)
{

	json_char* json_objects;
    	json_value *json_data;

	// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
	char* API_key = "API_KEY_HERE";
	int Project_ID = 0; //Input your Project ID
	int Keyword_ID = 0; //Input your Keyword ID

	char* request_url = "https://api.serpwoo.com/v1";

	char final_request_URL[255];
	int the_statement;

	the_statement = snprintf(final_request_URL, 255, "%s/volatility/%d/%d/?key=%s", request_url, Project_ID, Keyword_ID, API_key);

		if (the_statement > sizeof(final_request_URL)) {
				//printf("Error: Something went wrong. Suppose to be 255 not [%ld]. Exiting.\n", sizeof(final_request_URL));
				exit (1);
		}else {
				//printf("\nURL to request: [%s]\n--\n", final_request_URL);
		}

	json_objects = handle_url(final_request_URL);

		if (json_objects) {
	        //printf("%s\n", json_objects);

	        	printf("\n--\n");

		        json_data = json_parse(json_objects, strlen(json_objects) );

		        process_value(json_data, 0, "");
		        printf("--\n\n");

		}


   json_value_free(json_data);
   return 0;
}


//////////////////////////////////////// JSON Functions
////////////////////////////////////////

//print to the display
static void List_Row(){

    if(printedRowCount == 0) {
        printf("%-15s %-20s\n", "Timestamp",   "Volatility %");
        printf("%-15s %-20s\n", "----------", "------------");
    }

    printedRowCount++;
	
    printf("%-20s %-15ld\n", EpochTimeStamp, current_Volatility);

    selectedTotal = 0;

    EpochTimeStamp = "";
    current_Volatility = 0;
}



static void process_object(json_value* value, int depth)
{
        int length, x;
        if (value == NULL) {
                return;
        }
        length = value->u.object.length;
        for (x = 0; x < length; x++) {

		   //printf("%-15d depth=[%d] // %s // %ld\n", selectedTotal, depth, value->u.object.values[x].name, value->u.object.values[x].value->u.integer);

                if(depth == 5) {
                            EpochTimeStamp = value->u.object.values[x].name;
                            //selectedTotal++;
		        }
				
				if(depth == 7 && strcmp(value->u.object.values[x].name, "volatility") == 0 ) {
                            current_Volatility = value->u.object.values[x].value->u.integer;
                            selectedTotal++;
                }

                if(selectedTotal == 1) { //corresponds with total amount of variables we are looking for
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