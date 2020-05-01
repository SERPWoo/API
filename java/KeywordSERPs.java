//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a Keyword's SERP Results and outputs the Timestamp, Rank, Type, Page Title, URL
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:46 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" KeywordSERPs.java
//
//	- OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
//	Compile Command: javac KeywordSERPs.java
//	Run Command: java KeywordSERPs
//

import org.codehaus.jackson.annotate.JsonAnyGetter;
import org.codehaus.jackson.annotate.JsonAnySetter;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

@SuppressWarnings("unchecked")
public class KeywordSERPs {

    public static void main(String[] args) {

			// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
            String API_key = "API_KEY_HERE";
            String Project_ID = "0";	// Input your Project ID (has to be string)
            String Keyword_ID = "0";	// Input your Keyword ID (has to be string)

            String output = getUrlContents("https://api.serpwoo.com/v1/serps/" + Project_ID + "/" + Keyword_ID + "/?key=" + API_key);

            List<Row> table = new ArrayList<>(); // used to store final output

            ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

            try {

                Response response = mapper.readValue(output, Response.class);
                Iterator it = ((Map<String, Object>) response.getOther().get(Keyword_ID)).entrySet().iterator();

                //iterate through each entry in projects element and add required fields to the row object
                while (it.hasNext()) {

                    Map.Entry pair = (Map.Entry) it.next();
                    
                    String timestamp = pair.getKey().toString();
                    Map<String, Object> results = (Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("results");
                    
                    Iterator innerIterator = results.entrySet().iterator();

                    // iterate the result set
                    while (innerIterator.hasNext()) {

                        Map.Entry innerPair = (Map.Entry)innerIterator.next();
                        String rank = innerPair.getKey().toString();

                        String type = ((Map<String, Object>)innerPair.getValue()).get("type").toString();
                        String title = ((Map<String, Object>)innerPair.getValue()).get("title").toString();
                        String url = ((Map<String, Object>)innerPair.getValue()).get("url").toString();


                        table.add(new Row(timestamp, rank, type, title, url )); // insert row object into table
                    }
                    
                }

                //sort the table
                Collections.sort(table);

                System.out.printf("\n--\n");

                System.out.printf("%-15s %-10s %-10s %-80s %-80s\n","Timestamp", "Rank", "Type", "Title", "URL");
                System.out.printf("%-15s %-10s %-10s %-80s %-80s\n","---------", "----", "----", "-----", "---");
                Iterator iterator = table.iterator();

                // print the final output to the terminal
                while (iterator.hasNext()) {
                    ((Row) iterator.next()).printRow();
                }

                System.out.printf("\n--\n");

            } catch (Exception e) {
                e.printStackTrace();
            }

        }

    private static String getUrlContents(String theUrl) {
        StringBuilder content = new StringBuilder();

        // many of these calls can throw exceptions, so i've just
        // wrapped them all in one try/catch statement.
        try {
            // create a url object
            URL url = new URL(theUrl);

            // create a urlconnection object
            URLConnection urlConnection = url.openConnection();

            // wrap the urlconnection in a bufferedreader
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));

            String line;

            // read from the urlconnection via the bufferedreader
            while ((line = bufferedReader.readLine()) != null) {
                content.append(line + "\n");
            }
            bufferedReader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return content.toString();
    }

    static class Row implements Comparable<Row> {
        private String timestamp; // ascending order
        private String rank;
        private String type;
        private String title;
        private String url;

        public Row(String timestamp, String rank, String type, String title, String url) {
            this.timestamp = timestamp;
            this.rank = rank;
            this.type = type;
            this.title = title;
            this.url = url;
        }

        // this method is used for sorting objects
        @Override
        public int compareTo(Row o) {

            try {
                if(this.timestamp.equals(o.timestamp)) {
                    return Integer.parseInt(this.rank) - Integer.parseInt(o.rank);
                }
                return Integer.parseInt(this.timestamp) - Integer.parseInt(o.timestamp);
            } catch (Exception e) {

            }
            return 0;
        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-15s %-10s %-10s %-80s %-80s\n", this.timestamp, this.rank, this.type, this.title, this.url);
        }
    }


    // Jackson parser use this class to create objects from the json string
    static class Response {
        private String success;
        private String total;
        private String response_time;
        private String time;

        private Map<String, Object> other = new HashMap<String, Object>();


        public Map<String, Object> getOther() {
            return other;
        }

        public void setOther(Map<String, Object> other) {
            this.other = other;
        }


        // any unknown properties will be mapped into the map named other through below methods
        @JsonAnyGetter
        public Map<String, Object> any() {
            return other;
        }

        @JsonAnySetter
        public void set(String name, Object value) {
            other.put(name, value);
        }
    }

}


