//
//	GitHub: https://github.com/SERPWoo/API
//
//	This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
//	This output is text format
//
//	Last updated - Aug 30th, 2017 @ 10:40 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
//	Compile Command: javac ListAllProjectsData.java
//	Run Command: java ListAllProjectsData
//

import java.net.*;
import java.io.*;
import org.json.*;
 
public class ListAllProjectsData
{
  public static void main(String[] args)
  {
	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
  	String API_key = "API_KEY_HERE";

    String output  = getUrlContents("https://api.serpwoo.com/v1/projects/?key=" + API_key);
	
	
	JSONObject json = new JSONObject(output); // Convert text to object
	System.out.println(json.toString(4));
	
    //System.out.println(output);
  }

  private static String getUrlContents(String theUrl)
  {
    StringBuilder content = new StringBuilder();

    // many of these calls can throw exceptions, so i've just
    // wrapped them all in one try/catch statement.
    try
    {
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
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    return content.toString();
  }
}
