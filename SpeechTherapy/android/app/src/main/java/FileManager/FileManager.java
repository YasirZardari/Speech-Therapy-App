package FileManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.os.Environment;
import android.util.Log;

import java.io.FileNotFoundException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Scanner;

/*
*   class written by Mel Arthurs and Bartosik Pawel to interface between react native and android API
*/


public class FileManager extends ReactContextBaseJavaModule {

    private static final String ROOT_DIR = "/MessageBank";
    private final String TAG = "FileManager";
    private final String FILE_TYPE_AUDIO = ".wav";
    private final String FILE_TYPE_TEXT = ".txt";
    private final int BUF_SIZE = 1024;

    // Constructor
    public FileManager(ReactApplicationContext reactContext) {
        super(reactContext);

        File rootDir = new File(getRootDir());

        if (!rootDir.exists()) {
            if (rootDir.mkdirs())
                Log.d(TAG, "Created Root at: " + getRootDir());
            else
                Log.e(TAG, "Unable to create root");
        }

    }

    @Override
    public String getName(){
        return "FileManager";
    }

    @ReactMethod
    public static String getRootDir() {
        return Environment.getExternalStorageDirectory() + ROOT_DIR;
    }

    @ReactMethod
    public void createCategory(String name, Promise promise) {

        File newCat = new File(getRootDir() + File.separator + name);

        if (newCat.exists())
            promise.reject("CategoryAlreadyExistsException" + ROOT_DIR + File.separator + name);

        if (newCat.mkdirs()) Log.d(TAG, "New Category: " + name);
        else  Log.d(TAG, "Unable to create category " + name);

        promise.resolve("");
    }

    @ReactMethod
    public void deleteCategory(String categoryName, Promise promise) {

        File cat = new File(getRootDir() + File.separator + categoryName);
        if (!cat.exists())
           promise.reject("Category doesn't exist:" + categoryName);

        File[] messagesInCategory = cat.listFiles();
        for (File message : messagesInCategory) {
            if (message.getName().endsWith(FILE_TYPE_AUDIO) || message.getName().endsWith(FILE_TYPE_TEXT)) {

                // Move the message from within the category to the root folder
                moveMessageToRootFromCategory(categoryName, message.getName(), promise);

            }
        }

        // Deleting the category folder
        if (!cat.delete())
            Log.e(TAG, "Unable to delete category folder");

        promise.resolve("");
    }

    @ReactMethod
    public void createTextFileInRoot(String filename, String content, Promise promise)
    {
        createTextFile(null, filename, content, promise);
    }

    @ReactMethod
    public void createTextFile(String category, String filename, String content, Promise promise)
    {
        try
        {
            String filepath = (category == null)? getRootDir() + File.separator + filename : getRootDir() + File.separator + category + File.separator + filename;
            //check if the file is being created in root category

            File file = new File(filepath);
            if(file.exists()) file.delete();
            //if the file already exists, delete it so it can be overwritten

            file.createNewFile();
            FileOutputStream os = new FileOutputStream(file);
            //open a stream to the file

            os.write(content.getBytes());
            os.flush();
            os.close();
            //write the content
        }
        catch(IOException e)
        {
            promise.reject("Error: Could not access file!");
        }
    }

    @ReactMethod
    public void deleteFileInRoot(String filename, Promise promise)
    {
        deleteFile(null, filename, promise);
    }

    @ReactMethod
    public void deleteFile(String category, String filename, Promise promise)
    {
        String filepath = (category == null)? getRootDir() + File.separator + filename : getRootDir() + File.separator + category + File.separator + filename;
        //check if the file is in the root category

        File file = new File(filepath);
        if(!file.exists()) promise.resolve("File does not exist!");
        else
        {
            file.delete();
            promise.resolve("Success!");
            //if the file exists, delete it
        }
    }

    @ReactMethod
    public void getTextFileContentInRoot(String filename, Promise promise)
    {
        getTextFileContent(null, filename, promise);
    }

    @ReactMethod
    public void getTextFileContent(String category, String filename, Promise promise)
    {
        String filepath = (category == null)? getRootDir() + File.separator + filename : getRootDir() + File.separator + category + File.separator + filename;
        //check if the file is in the root category

        File file = new File(filepath);
        if(!file.exists()) promise.reject("Error: no such file");
        //if there is not file, return an error
        else
        {
            try
            {
                Scanner in = new Scanner(file);
                promise.resolve(in.nextLine());
                //read the file content
            }
            catch(FileNotFoundException e)
            {
                promise.reject("Error: could not find file!");
            }
        }
    }


    @ReactMethod
    public void getAllMessageFilePathFromCategory(String category, Promise promise) {

        StringBuilder jsonString = new StringBuilder();
        jsonString.append("[ ");
        //create a string builder for the json string

        File cat = new File(getRootDir() + "/" + category);
        //get the inspected cateory

        if (!cat.exists()) {
            promise.reject("Category doesn't exist");
            return;
        }
        //if the category doesn't exist, throw an error

        File[] categoryFiles = cat.listFiles();
        for (File file : categoryFiles) {
            if (file.getName().endsWith(FILE_TYPE_AUDIO)) {
                jsonString.append("\"" + file.getName() + "\",");
            }
        }
        //scan for matching files and add them to the string builder

        jsonString.deleteCharAt(jsonString.length() - 1);
        //get rid of the trailing comma


        jsonString.append("]");
        promise.resolve(jsonString.toString());

        return;
    }


    @ReactMethod
    public void getAllCategories(Promise promise) {
        StringBuilder jsonString = new StringBuilder();

         jsonString.append("[ ");
         //create a string builder for the json string


         File root = new File(getRootDir());
         //get the root folder


         File[] filesInRoot = root.listFiles();
        //get all files existing in root

         for (File file : filesInRoot) {
             if (file.isDirectory()) {
                 jsonString.append("\"" + file.getName() + "\",");
             }
         }
         //scan the result for categories and append them to the string builder

         jsonString.deleteCharAt(jsonString.length() - 1);
         //get rid of the trailing comma

         jsonString.append("]");
         promise.resolve(jsonString.toString());
         //finalise and return the string
    }

    @ReactMethod
    public void moveMessageToRootFromCategory(String fromCategory, String messageName, Promise promise) {
        moveMessageToCategoryFromCategory(fromCategory, null, messageName, promise);
    }

    @ReactMethod
    public void moveMessageToCategoryFromRoot(String toCategory, String messageName, Promise promise) {
        moveMessageToCategoryFromCategory(null, toCategory, messageName, promise);
    }

    @ReactMethod
    public void moveMessageToCategoryFromCategory(String fromCategory, String toCategory,
            String messageName, Promise promise)
    {
        moveMessage(fromCategory, toCategory, messageName, FILE_TYPE_AUDIO, promise);
        String temp = messageName.replace(FILE_TYPE_AUDIO, FILE_TYPE_TEXT);
        //moveMessage(fromCategory, toCategory, temp, FILE_TYPE_TEXT, promise);
    }
    @ReactMethod
    public void moveMessage(String fromCategory, String toCategory,
            String messageName, String filetype, Promise promise) {

        String newFilePath;
        String oldFilePath;

        if (toCategory == null) {
            // Category not selected, root used instead
            newFilePath = getRootDir() + File.separator + messageName;
        } else {
            // Category selected
            newFilePath = getRootDir() + File.separator + toCategory + File.separator + messageName;
            if (!new File(getRootDir() + File.separator + toCategory).exists())
                // If category to transfer message to exists...
                promise.resolve("Cannot move message to category that doesn't exist");
                //return;
        }

        if (fromCategory == null) {
            // Message coming from root into a category
            oldFilePath = getRootDir() + File.separator + messageName;
        } else {
            oldFilePath = getRootDir() + File.separator + fromCategory + File.separator + messageName;
            if (!new File(getRootDir() + File.separator + fromCategory).exists())
                // If category to transfer message to exists...
                promise.resolve("Cannot move message from category that doesn't exist");
                //return;
        }

        // Checking to see if message actually exists
        if (!new File(oldFilePath).exists()) {
            promise.resolve("Message to move doesn't exist" + oldFilePath);
            //return;
        }

        // If there already is a file @ new file path
        if (new File(newFilePath).exists()) {
            // Append a -copy onto the file name to prevent 2 files with same name
            newFilePath = newFilePath.replace(filetype, "-copy" + filetype);
        }

        InputStream in;
        OutputStream out;
        try {
            in = new FileInputStream(oldFilePath);
            out = new FileOutputStream(newFilePath);

            byte[] buffer = new byte[BUF_SIZE];
            int read;

            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }

            in.close();

            // write the output file
            out.flush();
            out.close();
        } catch (FileNotFoundException e) {
            promise.resolve("FileNotFoundException");
            //return;
        } catch (IOException e) {
            promise.resolve("IOException");
            //return;
        }

        // delete the original file
        if (!new File(oldFilePath).delete())
            Log.d(TAG, "Unable to delete file: " + oldFilePath );

        promise.resolve("");
        //return;
    }

    @ReactMethod
    public void renameMessageInRoot(String curMessageName, String newMessageName, Promise promise) {
        renameMessageInCategory(null, curMessageName, newMessageName, promise);
    }

    @ReactMethod
    public void renameMessageInCategory(String categoryName, String curMessageName,
            String newMessageName, Promise promise) {

        String curPath;
        String newPath;

        if (categoryName == null) {
            curPath =  getRootDir() + File.separator + curMessageName;
            newPath = getRootDir() + File.separator + newMessageName;
        } else {
            curPath = getRootDir() + File.separator + categoryName + File.separator + curMessageName;
            newPath = getRootDir() + File.separator + categoryName + File.separator + newMessageName;
        }


        File message = new File(curPath);
        if (!message.exists()) {
          promise.reject("File does not exist at: " + curPath);
          return;
        }

        File newMessage = new File(newPath);
        if (newMessage.exists()) {
          promise.reject("File already has this name: " + newPath);
          return;
        }

        if (!message.renameTo(newMessage))
            Log.e(TAG, "Unable to rename file");

        promise.resolve("");
    }


}
