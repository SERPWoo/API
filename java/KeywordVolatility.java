// 
//  GitHub: https://github.com/SERPWoo/API
//  
//  The code request project volatility and output the date, timestamp and percentage volatility
// 
//  This output is text format
//
//	Last updated - Jul 22th, 2019 @ 7:20 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//  
//  Compile Command: javac -cp '.:./lib/json-simple-1.1.1.jar' KeywordVolatility.java
// 
//  Run command: java -cp '.:./lib/json-simple-1.1.1.jar' KeywordVolatility


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import java.sql.Timestamp;  

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@SuppressWarnings("unchecked")
public class KeywordVolatility 
{
    static String API_KEY = ""; // input your API key;
    static int Project_ID = 0; // input your Project ID
    static int Keyword_ID = 0; // input your Kewyword ID
    
    public static void main( String[] args )
    {
        String url = "https://api.serpwoo.com/v1/volatility/" + 
                String.valueOf(Project_ID) + 
                "/" + String.valueOf(Keyword_ID) + 
                "/?key="  + API_KEY;
        
        // make api call
        String result = getUrlContents( url );
        
        // print response
        printResponse( result ); 
    }
    
    private static void printResponse( String response )
    {
        // Json parser will parse json response
        JSONParser parser = new JSONParser();
        
        try
        {
            // parse response as object
            Object obj = parser.parse( response );
            
            JSONObject jsonObject = (JSONObject)obj;
            
            // get Json object with key Project_ID
            jsonObject = (JSONObject)(jsonObject.get(String.valueOf( Project_ID )) );
            // get Json object with key Keyword_ID
            jsonObject = (JSONObject)(jsonObject.get(String.valueOf(Keyword_ID)) );
            
            // TreeSet sorts content in accending order
            TreeSet<String> sortedTimestamp = new TreeSet( jsonObject.keySet() );
            
            // format timestamp into yyyy-MM-dd
            DateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            
            System.out.println( String.format(" %-10s  %-10s  %-10s", "Time", "Timestamp", "Volatility") );
            System.out.println( String.format(" %-10s  %-10s  %-10s", "----", "---------", "----------") );
        
            for( String timestamp : sortedTimestamp )
            {
                Timestamp ts=new Timestamp(Long.parseLong(timestamp) * 1000L );
                
                System.out.println( 
                        String.format(" %10s  %10s  %4s", 
                                f.format( ts.getTime() ), 
                                timestamp, 
                                ((JSONObject)jsonObject.get( timestamp )).get("volatility") + "%" ) 
                );
            }
        }
        catch ( ParseException e )
        {
            System.out.print("Error parsing response");
        }      
    }
    private static String getUrlContents(String theUrl) 
    {
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
            while ((line = bufferedReader.readLine()) != null) 
            {
                content.append(line + "\n");
            }
            
            bufferedReader.close();
        } catch (Exception e) 
        {
            e.printStackTrace();
        }
        
        return content.toString();
    }
}
