//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a project's Domains/URLs and outputs the Domain ID, Domain/URL, ORM Tag, Settings, Creation Date
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:44 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" ListAllProjectDomains.java
//
//	- OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
//	Compile Command: javac ListAllProjectDomains.java
//	Run Command: java ListAllProjectDomains
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
public class ListAllProjectDomains {

    public static void main(String[] args) {
        // write your code here

		// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
        String API_key = "API_KEY_HERE";
        String Project_ID = "0";		// Input your Project ID (has to be string)

        String output = getUrlContents("https://api.serpwoo.com/v1/projects/" + Project_ID + "/domains/?key=" + API_key);

        List<Row> table = new ArrayList<>(); // used to store final output

        ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

        try {

            Response response = mapper.readValue(output, Response.class);
            Iterator it = ((Map<String, Object>)((Map<String, Object>) ((Map<String, Object>)response.getOther().get("projects")).get(Project_ID)).get("domains")).entrySet().iterator();

            //iterate through each entry in projects element and add required fields to the row object
            while (it.hasNext()) {

                Map.Entry pair = (Map.Entry) it.next();

                String tagId = pair.getKey().toString();
                String tag =  ((Map<String, Object>) pair.getValue()).get("domain").toString();
                String orm =  ((Map<String, Object>) pair.getValue()).get("orm").toString();
                String creationDate =  ((Map<String, Object>) pair.getValue()).get("creation_date").toString();

                String setting;

                try {
                    setting = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("setting")).get("type").toString();
                } catch (Exception e) {
                    setting = "";
                }

                    table.add(new Row(tagId, tag, orm, setting, creationDate)); // insert row object into table

            }

            //sort the table
            Collections.sort(table);

            System.out.printf("\n--\n");

            System.out.printf("%-15s %-80s %-15s %-10s %-15s\n", "Domain ID", "Domain/URL", "ORM Tag", "Settings", "Creation Date");
            System.out.printf("%-15s %-80s %-15s %-10s %-15s\n", "---------", "----------", "-------", "--------", "-------------");

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
        private String tagId;
        private String tag;
        private String ORMTag;
        private String settings;
        private String creationDate;

        public Row(String tagId, String tag, String ORMTag, String settings, String creationDate) {
            this.tagId = tagId;
            this.tag = tag;
            this.ORMTag = ORMTag;
            this.settings = settings;
            this.creationDate = creationDate;
        }

        @Override
        public int compareTo(Row o) {
            try {
                return Integer.parseInt(this.tagId) -  Integer.parseInt(o.tagId);
            } catch (Exception e ){

                return 0;
            }

        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-15s %-80s %-15s %-10s %-15s\n", this.tagId, this.tag, this.ORMTag, this.settings, this.creationDate);
        }
    }


    // Jackson parser use this class to create objects from the json string
    static class Response {
        private String success;
        private String total;
        private String response_time;
        private String time;

        private Map<String, Object> other = new HashMap<String, Object>();


        public String getSuccess() {
            return success;
        }

        public void setSuccess(String success) {
            this.success = success;
        }

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


