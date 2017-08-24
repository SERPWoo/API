//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects' data in JSON format
//
// Last updated - Aug 24th, 2017 @ 15:25 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// Compile Command: javac ListAllProjectsData.java
// Run Command: java ListAllProjectsData
//

import java.net.*;
import java.io.*;

/**
 * A complete Java class that demonstrates how to read content (text) from a URL
 * using the Java URL and URLConnection classes.
 * @author alvin alexander, alvinalexander.com
 */
 
public class ListAllProjectsData
{
  public static void main(String[] args)
  {
  	String API_key = "API_KEY_HERE";
    String output  = getUrlContents("https://api.serpwoo.com/v1/projects/?key=" + API_key);
    System.out.println(output);
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
