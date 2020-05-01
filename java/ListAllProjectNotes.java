//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a project's Notes and outputs the Note ID, Note Timestamp, Note Type, Note Message
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:42 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" ListAllProjectNotes.java
//
//	- OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
//	Compile Command: javac ListAllProjectNotes.java
//	Run Command: java ListAllProjectNotes
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
public class ListAllProjectNotes {

    public static void main(String[] args) {

		// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
        String API_key = "API_KEY_HERE";
        String Project_ID = "0";	// Input your Project ID (has to be string)

        String output = getUrlContents("https://api.serpwoo.com/v1/projects/" + Project_ID + "/notes/?key=" + API_key);

        List<Row> table = new ArrayList<>(); // used to store final output

        ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

        try {

            Response response = mapper.readValue(output, Response.class);
            Iterator it = ((Map<String, Object>)((Map<String, Object>) ((Map<String, Object>)response.getOther().get("projects")).get(Project_ID)).get("notes")).entrySet().iterator();

            //iterate through each entry in projects element and add required fields to the row object
            while (it.hasNext()) {

                Map.Entry pair = (Map.Entry) it.next();

                String noteId = pair.getKey().toString();
                String type =  ((Map<String, Object>) pair.getValue()).get("type").toString();
                String timestamp = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("note")).get("timestamp").toString();
                String note = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("note")).get("message").toString();

                table.add(new Row(noteId, timestamp, type, note));

            }

            //sort the table
            Collections.sort(table);

            System.out.printf("\n--\n");

            System.out.printf("%-25s %-15s %-10s %-80s\n", "Note ID", "Timestamp", "Type", "Note");
            System.out.printf("%-25s %-15s %-10s %-80s\n", "-------", "---------", "----", "----");
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
        private String noteId; // ascending order
        private String timestamp;
        private String type;
        private String note;

        public Row(String noteId, String timestamp, String type, String note) {
            this.noteId = noteId;
            this.timestamp = timestamp;
            this.type = type;
            this.note = note;
        }

        // this method is used for sorting objects
        @Override
        public int compareTo(Row o) {

            try {
                return this.noteId.compareTo(o.noteId);
            } catch (Exception e) {

            }
            return 0;
        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-25s %-15s %-10s %-80s\n", this.noteId, this.timestamp, this.type, this.note);
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


