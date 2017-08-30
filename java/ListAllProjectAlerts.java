//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a project's Alerts and outputs the Alert ID, Social Timestamp, Alert Text, Alert Link
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:45 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" ListAllProjectAlerts.java
//
//	- OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
//	Compile Command: javac ListAllProjectAlerts.java
//	Run Command: java ListAllProjectAlerts
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
public class ListAllProjectAlerts {

    public static void main(String[] args) {

			// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
            String API_key = "API_KEY_HERE";
            String Project_ID = "0";		// Input your Project ID (has to be string)

            String output = getUrlContents("https://api.serpwoo.com/v1/projects/" + Project_ID + "/alerts/?key=" + API_key);

            List<Row> table = new ArrayList<>(); // used to store final output

            ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

            try {

                Response response = mapper.readValue(output, Response.class);
                Iterator it = ((Map<String, Object>) response.getOther().get("projects")).entrySet().iterator();

                //iterate through each entry in projects element and add required fields to the row object
                while (it.hasNext()) {

                    Map.Entry pair = (Map.Entry) it.next();
                    
                    //String alert_id = pair.getKey().toString();
                    Map<String, Object> alerts = (Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("alerts");
                    
                    Iterator innerIterator = alerts.entrySet().iterator();

                    // iterate the result set
                    while (innerIterator.hasNext()) {

                        Map.Entry innerPair = (Map.Entry)innerIterator.next();
                        String alert_id = innerPair.getKey().toString();

                        String social_time = ((Map<String, Object>)innerPair.getValue()).get("social_time").toString();
                        String text = ((Map<String, Object>)innerPair.getValue()).get("text").toString();
                        String link = ((Map<String, Object>)innerPair.getValue()).get("link").toString();


                        table.add(new Row(alert_id, social_time, text, link)); // insert row object into table
                    }
                    
                }

                //sort the table
                Collections.sort(table);

                System.out.printf("\n--\n");

                System.out.printf("%-15s %-20s %-100s %-90s\n", "Alert ID", "Social Timestamp", "Alert Text", "Alert Link");
                System.out.printf("%-15s %-20s %-100s %-90s\n", "--------", "----------------", "----------", "----------");
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
        private String alert_id; // ascending order
        private String social_time;
        private String text;
        private String link;

        public Row(String alert_id, String social_time, String text, String link) {
            this.alert_id = alert_id;
            this.social_time = social_time;
            this.text = text;
            this.link = link;
        }

        // this method is used for sorting objects
        @Override
        public int compareTo(Row o) {

            try {
                return Integer.parseInt(this.alert_id) - Integer.parseInt(o.alert_id);
            } catch (Exception e) {

            }
            return 0;
        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-15s %-20s %-100s %-90s\n", this.alert_id, this.social_time, this.text, this.link);
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


