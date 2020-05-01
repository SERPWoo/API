//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests a project's keywords and outputs the Keyword ID, Keyword, PPC Comp, OCI, Volume, CPC (USD), created date, oldest date, recent date, Link To SERPs
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:43 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac -cp "lib/jackson-all-1.9.0.jar" ListAllProjectKeywords.java
//
//	- OR (if org.codehaus.jackson is within your Java CLASSPATH already) -
//
//	Compile Command: javac ListAllProjectKeywords.java
//	Run Command: ListAllProjectKeywords
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
public class ListAllProjectKeywords {

    public static void main(String[] args) {
        // write your code here

		// Get your API Key here: https://www.serpwoo.com/q/api/ (should be logged in)
        String API_key = "API_KEY_HERE";
        String Project_ID = "0";		// Input your Project ID (has to be string)

        String output = getUrlContents("https://api.serpwoo.com/v1/projects/" + Project_ID + "/keywords/?key=" + API_key);

        List<Row> table = new ArrayList<>(); // used to store final output

        ObjectMapper mapper = new ObjectMapper(); // Jackson mapper

        try {

            Response response = mapper.readValue(output, Response.class);
            Iterator it = ((Map<String, Object>)((Map<String, Object>) ((Map<String, Object>)response.getOther().get("projects")).get(Project_ID)).get("keywords")).entrySet().iterator();

            //iterate through each entry in projects element and add required fields to the row object
            while (it.hasNext()) {

                Map.Entry pair = (Map.Entry) it.next();

                String KeywordID = pair.getKey().toString();
                String Keyword =  ((Map<String, Object>) pair.getValue()).get("keyword").toString();
                String Comp =  ((Map<String, Object>) pair.getValue()).get("Comp").toString();
                String Oci =  ((Map<String, Object>) pair.getValue()).get("oci").toString();
                String Volume =  ((Map<String, Object>) pair.getValue()).get("volume").toString();
                String CPCusdamount =  ((Map<String,Object>) ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("CPC")).get("usd")).get("amount").toString();
                String CreationDate =  ((Map<String, Object>) pair.getValue()).get("creation_date").toString();
                String SERPoldestdate = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("SERP_data")).get("oldest_date").toString();
                String SERPrecentdate = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("SERP_data")).get("recent_date").toString();
                String LinkToSERPs = ((Map<String,Object>) ((Map<String, Object>) pair.getValue()).get("_links")).get("serps").toString();

                String setting;

                    table.add(new Row(KeywordID, Keyword, Comp, Oci, Volume, CPCusdamount, CreationDate, SERPoldestdate, SERPrecentdate, LinkToSERPs)); // insert row object into table

            }

            //sort the table
            Collections.sort(table);

            System.out.printf("\n--\n");

            System.out.printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "Keyword ID", "Keyword", "PPC Comp", "OCI", "Search Volume", "CPC (USD)", "Created Date", "Oldest Date", "Recent Date", "Link To SERPs");
            System.out.printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", "----------", "-------", "--------", "---", "-------------", "---------", "------------", "-----------", "-----------", "-------------");

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
        private String KeywordID;
        private String Keyword;
        private String Comp;
        private String Oci;
        private String Volume;
        private String CPCusdamount;
        private String CreationDate;
        private String SERPoldestdate;
        private String SERPrecentdate;
        private String LinkToSERPs;

        public Row(String KeywordID, String Keyword, String Comp, String Oci, String Volume, String CPCusdamount, String CreationDate, String SERPoldestdate, String SERPrecentdate, String LinkToSERPs) {
            this.KeywordID = KeywordID;
            this.Keyword = Keyword;
            this.Comp = Comp;
            this.Oci = Oci;
            this.Volume = Volume;
            this.CPCusdamount = CPCusdamount;
            this.CreationDate = CreationDate;
            this.SERPoldestdate = SERPoldestdate;
            this.SERPrecentdate = SERPrecentdate;
            this.LinkToSERPs = LinkToSERPs;
        }

        @Override
        public int compareTo(Row o) {
            try {
                return Integer.parseInt(this.KeywordID) -  Integer.parseInt(o.KeywordID);
            } catch (Exception e ){

                return 0;
            }

        }

        // print object to the terminal
        public void printRow() {

            System.out.printf("%-15s %-50s %-10s %-10s %-15s %-10s %-15s %-15s %-15s %-40s\n", this.KeywordID, this.Keyword, this.Comp, this.Oci, this.Volume, this.CPCusdamount, this.CreationDate, this.SERPoldestdate, this.SERPrecentdate, this.LinkToSERPs);
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


