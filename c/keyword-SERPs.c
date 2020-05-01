//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
//	This output is text format
//
//	Last updated - Aug 28th, 2017 @ 16:28 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	You might need to install curl: apt-get install libcurl4-openssl-dev
//
//	Compile command: gcc -ansi -pedantic -Wall -Werror -std=gnu99 -o keyword-SERPs keyword-SERPs.c -lm -lcurl
//	Run Command: ./keyword-SERPs
//
// References: https://stackoverflow.com/questions/23647438/how-to-parse-nested-json-object
// References: https://github.com/udp/json-parser
//

#include <assert.h>
#include <curl/curl.h>
#include <stdio.h>
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
		int find_serp_timestamp_index (int current_timestamp);
		static int SORT_intcmp(const void *pa, const void *pb);
		static int SORT_unique_array(long long int *array, int size);

//// SERP Structure
		typedef struct {
	        char* title;
	        char* description;
	        char* url;
	        char* type;
		} serp_row;

		typedef struct {
			int rank;
	        serp_row serp;
		} ranking;

		typedef struct {
			//long long int timestamp;
			int total_rankings;
	        ranking rank[201]; //Max of 201 Rankings (Top #1-201 positions)
		} a_serp_day;

//// Variables
		char* currentTimestamp = "";
		int currentRank = 0;
		char* current_Title = "";
		char* current_URL = "";
		char* current_Description = "";
		char* current_Type = "";

        int selectedTotal = 0;
        int printedRowCount = 0;

		int the_index = 0;
		int SERP_DAYS_array_index = 0;
		long long int SERP_DAYS_array[4000] = {0};
		static a_serp_day SERP_DAYS[4000]; //This means it can only go back 4000 days (A little over 10 years)


////////////////////////////////////////////////////////////////////////////////
//// Main
		
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

		the_statement = snprintf(final_request_URL, 255, "%s/serps/%d/%d/?key=%s", request_url, Project_ID, Keyword_ID, API_key);

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

		        printf("%-15s %-10s %-15s %-80s %-80s\n", "Timestamp", "Rank", "Type", "Title", "URL");
		        printf("%-15s %-10s %-15s %-80s %-80s\n", "---------", "----", "----", "-----", "---");

		        process_value(json_data, 0, "");


				/* Sort array and make unique (removing duplicate days) */
				int b_size = sizeof(SERP_DAYS_array) / sizeof(SERP_DAYS_array[0]);
			   	qsort(SERP_DAYS_array, b_size, sizeof(SERP_DAYS_array[0]), SORT_intcmp);
			    b_size = SORT_unique_array(SERP_DAYS_array, b_size);


				//print out the SERP data
				int w, w2;
				for (w = 1; w < b_size; w++) {
	
					the_index = w;

					for (w2 = 1; w2 <= SERP_DAYS[the_index].total_rankings; w2++ ) {

							printf("%-15lld %-10d %-15s %-80s %-80s\n", SERP_DAYS_array[the_index], SERP_DAYS[the_index].rank[w2].rank, SERP_DAYS[the_index].rank[w2].serp.type, SERP_DAYS[the_index].rank[w2].serp.title, SERP_DAYS[the_index].rank[w2].serp.url);

					}
					
					printf("--\n");
	
				}


		        printf("--\n\n");

	    }


        json_value_free(json_data);
        return 0;
}


//////////////////////////////////////// JSON Functions
////////////////////////////////////////

static void process_object(json_value* value, int depth)
{
        int length, x;
		
        if (value == NULL) {
                return;
        }
        length = value->u.object.length;
        for (x = 0; x < length; x++) {

		    //printf("%-15d depth=[%d] // %s\n", selectedTotal, depth, value->u.object.values[x].name);

                if(depth == 3) {
							currentTimestamp = value->u.object.values[x].name;
                            selectedTotal = 0;
						    //printf("\n--\nNEW DAY = %-15d depth=[%d] // currentTimestamp=[%s]\n--\n", selectedTotal, depth, currentTimestamp);
						    //printf("\n--\n");
		        }

					if(depth == 7) {
	                            currentRank = atoi(value->u.object.values[x].name);
	                            //selectedTotal++;
	                }
				
						if(depth == 9 && strcmp(value->u.object.values[x].name, "title") == 0 ) {
		                            current_Title = value->u.object.values[x].value->u.string.ptr;
		                            selectedTotal++;
		                }

						if(depth == 9 && strcmp(value->u.object.values[x].name, "url") == 0 ) {
		                            current_URL = value->u.object.values[x].value->u.string.ptr;
		                            selectedTotal++;
		                }

						if(depth == 9 && strcmp(value->u.object.values[x].name, "description") == 0 ) {
		                            current_Description = value->u.object.values[x].value->u.string.ptr;
		                            selectedTotal++;
		                }

						if(depth == 9 && strcmp(value->u.object.values[x].name, "type") == 0 ) {
		                            current_Type = value->u.object.values[x].value->u.string.ptr;
		                            selectedTotal++;
		                }

                if(selectedTotal == 4) { //A single rank is done
					
					the_index = find_serp_timestamp_index (atoi(currentTimestamp));
					
					SERP_DAYS_array[the_index] = atoi(currentTimestamp);
					SERP_DAYS[the_index].total_rankings++;
					SERP_DAYS[the_index].rank[currentRank].rank = currentRank;
					SERP_DAYS[the_index].rank[currentRank].serp.type = current_Type;
					SERP_DAYS[the_index].rank[currentRank].serp.title = current_Title;
					SERP_DAYS[the_index].rank[currentRank].serp.url = current_URL;
					SERP_DAYS[the_index].rank[currentRank].serp.description = current_Description;
					
					//This is not sorted cause it's being processed live
					
					//printf("%-10d %-15lld%-10d%-10s%-135s%-80s\n", SERP_DAYS[the_index].total_rankings, SERP_DAYS_array[the_index], SERP_DAYS[the_index].rank[currentRank].rank, SERP_DAYS[the_index].rank[currentRank].serp.type, SERP_DAYS[the_index].rank[currentRank].serp.url, SERP_DAYS[the_index].rank[currentRank].serp.title);

					//
				    selectedTotal = 0;

					currentRank = 0;
					current_Title = "";
					current_URL = "";
					current_Description = "";
					current_Type = "";
					
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
//////////////////////////////////////// Find the SERP Timestamp Array's Index
////////////////////////////////////////

int find_serp_timestamp_index (int current_timestamp) {
	int w;

	for (w = 0; w <= SERP_DAYS_array_index; w++ ) {
		if (SERP_DAYS_array[w] == current_timestamp) {
			//printf("FOUND PROJECT_INDEX[%d]=[%d]\n", w, current_project_id);
			return w;
		}
	}

	//if it got this far, then no index was found, so create a new one
	SERP_DAYS_array_index++;
	SERP_DAYS_array[SERP_DAYS_array_index] = current_timestamp;
	
	return SERP_DAYS_array_index;
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// CURL Functions

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

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Sort Functions

static int SORT_intcmp(const void *pa, const void *pb)
{
    int a = *(int *)pa;
    int b = *(int *)pb;
    if (a > b)
        return +1;
    else if (a < b)
        return -1;
    else
        return 0;
}

static int SORT_unique_array(long long int *array, int size)
{
    int i;
    int last = 0;
    assert(size >= 0);
    if (size <= 0)
        return size;
    for (i = 1; i < size; i++)
    {
        if (array[i] != array[last])
            array[++last] = array[i];
    }
    return(last + 1);
}
