//
//
// Github: https://github.com/SERPWoo/API
//
// This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
// This output is text format (You'll need the "lib/jackson-all-1.9.0.jar" file)
//
// Last updated - Aug 28th, 2017 @ 1:07 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" ListAllProjects.java
//
// - OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
// Compile Command: javac ListAllProjects.java
// Run Command: java ListAllProjects
//
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
public class ListAllProjects {

    public static void main(String[] args) {

		// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
        String API_key = "API_KEY_HERE";
        String output = getUrlContents("https://api.serpwoo.com/v1/projects/?key=" + API_key);

        List<Row> table = new ArrayList<>(); // used to store final output

        ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

        try {

            Response response = mapper.readValue(output, Response.class);
            Iterator it = ((Map<String, Object>) response.getOther().get("projects")).entrySet().iterator();

            //iterate through each entry in projects element and add required fields to the row object
            while (it.hasNext()) {

                Map.Entry pair = (Map.Entry) it.next();
                Row row = new Row();

                row.setProjectId(pair.getKey().toString());
                row.setProjectName(((Map<String, Object>) pair.getValue()).get("name").toString());
                row.setTotalKeywords(((Map<String, Object>) ((Map<String, Object>) pair.getValue()).get("total")).get("keywords").toString());
                row.setLinkToKeywords(((Map<String, Object>) ((Map<String, Object>) pair.getValue()).get("_links")).get("keywords").toString());


                table.add(row); // insert row object into table
            }

            //sort the table
            Collections.sort(table);

            System.out.printf("%-15s%-70s%-20s%-70s\n","Project ID", "Project Name", "Total Keywords", "Link to Keywords");
            System.out.printf("%-15s%-70s%-20s%-70s\n","----------", "------------", "--------------", "----------------");
            Iterator iterator = table.iterator();

            // print the final output to the terminal
            while (iterator.hasNext()) {
                ((Row) iterator.next()).printRow();
            }


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
        private String projectId; // ascending order
        private String projectName;
        private String totalKeywords;
        private String linkToKeywords;

        public String getProjectId() {
            return projectId;
        }

        public void setProjectId(String projectId) {
            this.projectId = projectId;
        }

        public String getProjectName() {
            return projectName;
        }

        public void setProjectName(String projectName) {
            this.projectName = projectName;
        }

        public String getTotalKeywords() {
            return totalKeywords;
        }

        public void setTotalKeywords(String totalKeywords) {
            this.totalKeywords = totalKeywords;
        }

        public String getLinkToKeywords() {
            return linkToKeywords;
        }

        public void setLinkToKeywords(String linkToKeywords) {
            this.linkToKeywords = linkToKeywords;
        }

        // this method is used for sorting objects
        @Override
        public int compareTo(Row o) {

            try {
                return Integer.parseInt(this.projectId) - Integer.parseInt(o.projectId);
            } catch (Exception e) {

            }
            return 0;
        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-15s%-70s%-20s%-70s\n", this.projectId, this.projectName, this.totalKeywords, this.linkToKeywords);
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

        public String getTotal() {
            return total;
        }

        public void setTotal(String total) {
            this.total = total;
        }

        public String getResponse_time() {
            return response_time;
        }

        public void setResponse_time(String response_time) {
            this.response_time = response_time;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
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

