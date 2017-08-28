//
//	GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your project's data and outputs the JSON format
//
//  Last updated - Aug 27th, 2017 @ 14:08 PM EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//
// You might need to install curl: apt-get install libcurl4-openssl-dev
//
// Compile Command: gcc -ansi -pedantic -Wall -Werror -lm -std=gnu99 -o list-all-projects-data list-all-projects-data.c -lcurl */
//	Run Command: ./list-all-projects-data
//
//
//


#include <stdio.h>
#include <curl/curl.h>
#include <string.h>
#include <stdlib.h>

// global data we'll need
	struct url_data {
	    size_t size;
	    char* data;
	};

//// List of functions
	size_t write_data(void *ptr, size_t size, size_t nmemb, struct url_data *data);
	char *handle_url(char* url);



// Main function
int main(int argc, char* argv[]) {
    char* data;
	
	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	char* API_key = "API_KEY_HERE";

	char* request_url = "https://api.serpwoo.com/v1/projects/?key=";

	char final_request_URL[255];
	int the_statement;

	the_statement = snprintf(final_request_URL, 255, "%s%s", request_url, API_key);

	if (the_statement > sizeof(final_request_URL)) {
			//printf("Error: Something went wrong. Suppose to be 255 not [%ld]. Exiting.\n", sizeof(final_request_URL));
			exit (1);
	}else {
			//printf("\nURL to request: [%s]\n--\n", final_request_URL);				
	}
		
    data = handle_url(final_request_URL);

    if(data) {
        printf("%s\n", data);
        free(data);
    }

    return 0;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Functions
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