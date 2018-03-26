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
    public void createTextFile(String fileName, String content, Promise promise)
    {
        try
        {
            File file = new File(getRootDir() + File.separator + fileName);
            if(file.exists()) file.delete();

            file.createNewFile();
            FileOutputStream os = new FileOutputStream(file);

            os.write(content.getBytes());
            os.flush();
            os.close();
        }
        catch(IOException e)
        {
            promise.reject("Error: Could not access file!");
        }
    }

    @ReactMethod
    public void deleteFile(String filename, Promise promise)
    {
        File file = new File(getRootDir() + File.separator + filename);
        if(!file.exists()) promise.resolve("File does not exist!");
        else
        {
            file.delete();
            promise.resolve("Success!");
        }
    }

    @ReactMethod
    public void getTextFileContent(String category, String filename, Promise promise)
    {
        File file = new File(getRootDir() + File.separator + category + File.separator + filename);
        if(!file.exists()) promise.reject("Error: no such file");
        else
        {
            try
            {
                Scanner in = new Scanner(file);
                promise.resolve(in.nextLine());
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
        jsonString.append("[");

        File cat = new File(getRootDir() + "/" + category);
        if (!cat.exists()) {
            promise.reject("Category doesn't exist");
        }

        File[] categoryFiles = cat.listFiles();
        for (File file : categoryFiles) {
            if (file.getName().endsWith(FILE_TYPE_AUDIO)) {
                jsonString.append(file.getAbsolutePath() + ",");
            }
        }

        //get rid of the trailing comma
        jsonString.deleteCharAt(jsonString.length() - 1);


        jsonString.append("]");
        promise.resolve(jsonString.toString());
    }


    @ReactMethod
    public void getAllCategories(Promise promise) {
        StringBuilder jsonString = new StringBuilder();
         jsonString.append("[ ");

         File root = new File(getRootDir());

         File[] filesInRoot = root.listFiles();
         for (File file : filesInRoot) {
             if (file.isDirectory()) {
                 jsonString.append("\"" + file.getName() + "\",");
             }
         }

         //get rid of the trailing comma
         jsonString.deleteCharAt(jsonString.length() - 1);

         jsonString.append("]");
         promise.resolve(jsonString.toString());
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
        moveMessage(fromCategory, toCategory, messageName, promise, FILE_TYPE_AUDIO);
        String temp = messageName.replace(FILE_TYPE_AUDIO, FILE_TYPE_TEXT);
        moveMessage(fromCategory, toCategory, temp, promise, FILE_TYPE_TEXT);
    }
    @ReactMethod
    public void moveMessage(String fromCategory, String toCategory,
            String messageName, Promise promise, String filetype) {

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
                promise.reject("Cannot move message to category that doesn't exist");
        }

        if (fromCategory == null) {
            // Message coming from root into a category
            oldFilePath = getRootDir() + File.separator + messageName;
        } else {
            oldFilePath = getRootDir() + File.separator + fromCategory + File.separator + messageName;
            if (!new File(getRootDir() + File.separator + fromCategory).exists())
                // If category to transfer message to exists...
                promise.reject("Cannot move message from category that doesn't exist");
        }

        // Checking to see if message actually exists
        if (!new File(oldFilePath).exists()) {
            promise.reject("Message to move doesn't exist" + oldFilePath);
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
            promise.reject("FileNotFoundException");
        } catch (IOException e) {
            promise.reject("IOException");
        }

        // delete the original file
        if (!new File(oldFilePath).delete())
            Log.d(TAG, "Unable to delete file: " + oldFilePath );

        promise.resolve("");
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
        if (!message.exists())
            promise.reject("File does not exist at: " + curPath);

        File newMessage = new File(newPath);
        if (newMessage.exists())
            promise.reject("File already has this name: " + newPath);

        if (!message.renameTo(newMessage))
            Log.e(TAG, "Unable to rename file");

        promise.resolve("");
    }


}
