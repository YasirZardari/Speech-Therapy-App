package FileManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;


public class FileManager extends ReactContextBaseJavaModule {

    private static final String ROOT_DIR = "/MessageBank";
    private final String TAG = "FileManager";
    private final String FILE_TYPE = ".wav";
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

    @ReactMethod
    public static String getRootDir() {
        return Environment.getExternalStorageDirectory() + ROOT_DIR;
    }

    @ReactMethod
    public void createCategory(String name) throws CategoryAlreadyExistsException{

        File newCat = new File(getRootDir() + File.separator + name);

        if (newCat.exists())
            throw new CategoryAlreadyExistsException(ROOT_DIR + File.separator + name);

        if (newCat.mkdirs()) Log.d(TAG, "New Category: " + name);
        else  Log.d(TAG, "Unable to create category " + name);
    }

    @ReactMethod
    public void deleteCategory(String categoryName) throws CategoryDoesNotExistException {

        File cat = new File(getRootDir() + File.separator + categoryName);
        if (!cat.exists())
            throw new CategoryDoesNotExistException("Category doesn't exist:" + categoryName);

        File[] messagesInCategory = cat.listFiles();
        for (File message : messagesInCategory) {
            if (message.getName().endsWith(FILE_TYPE)) {
                try {
                    // Move the message from within the category to the root folder
                    moveMessageToRootFromCategory(categoryName, message.getName());
                } catch (IOException e) {
                    Log.e(TAG,
                            "Unable to move file during delete of:" + categoryName);
                }
            }
        }

        // Deleting the category folder
        if (!cat.delete())
            Log.e(TAG, "Unable to delete category folder");

    }

    @ReactMethod
    public ArrayList<String> getAllCategories() {
        ArrayList<String> categories = new ArrayList<String>();
        File root = new File(getRootDir());

        File[] filesInRoot = root.listFiles();
        for (File file :  filesInRoot) {
            if (file.isDirectory()) {
                categories.add(file.getName());
            }
        }

        return categories;
    }

    @ReactMethod
    public void moveMessageToRootFromCategory(String fromCategory, String messageName)
            throws IOException, CategoryDoesNotExistException {
        moveMessageToCategoryFromCategory(fromCategory, null, messageName);
    }

    @ReactMethod
    public void moveMessageToCategoryFromRoot(String toCategory, String messageName)
            throws  IOException, CategoryDoesNotExistException {
        moveMessageToCategoryFromCategory(null, toCategory, messageName);
    }

    @ReactMethod
    public void moveMessageToCategoryFromCategory(String fromCategory, String toCategory, String messageName)
            throws IOException, CategoryDoesNotExistException {

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
                throw new CategoryDoesNotExistException("Cannot move message to category that doesn't exist");
        }

        if (fromCategory == null) {
            // Message coming from root into a category
            oldFilePath = getRootDir() + File.separator + messageName;
        } else {
            oldFilePath = getRootDir() + File.separator + fromCategory + File.separator + messageName;
            if (!new File(getRootDir() + File.separator + fromCategory).exists())
                // If category to transfer message to exists...
                throw new CategoryDoesNotExistException("Cannot move message from category that doesn't exist");
        }

        // Checking to see if message actually exists
        if (!new File(oldFilePath).exists()) {
            throw new IOException("Message to move doesn't exist" + oldFilePath);
        }

        // If there already is a file @ new file path
        if (new File(newFilePath).exists()) {
            // Append a -copy onto the file name to prevent 2 files with same name
            newFilePath = newFilePath.replace(FILE_TYPE, "-copy" + FILE_TYPE);
        }

        InputStream in = new FileInputStream(oldFilePath);
        OutputStream out = new FileOutputStream(newFilePath);

        byte[] buffer = new byte[BUF_SIZE];
        int read;

        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }

        in.close();

        // write the output file
        out.flush();
        out.close();

        // delete the original file
        if (!new File(oldFilePath).delete())
            Log.d(TAG, "Unable to delete file: " + oldFilePath );
    }

    @ReactMethod
    public void renameMessageInRoot(String curMessageName, String newMessageName)
            throws IOException {
        renameMessageInCategory(null, curMessageName, newMessageName);
    }

    @ReactMethod
    public void renameMessageInCategory(String categoryName, String curMessageName, String newMessageName)
            throws IOException {

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
            throw new IOException("File does not exist at: " + curPath);

        File newMessage = new File(newPath);
        if (newMessage.exists())
            throw new IOException("File already has this name: " + newPath);

        if (!message.renameTo(newMessage))
            Log.e(TAG, "Unable to rename file");

    }


    class CategoryAlreadyExistsException extends Exception {
        public CategoryAlreadyExistsException () {}
        public CategoryAlreadyExistsException (String message) {
            super(message);
        }
    }

    class CategoryDoesNotExistException extends Exception {
        public CategoryDoesNotExistException () {}
        public CategoryDoesNotExistException (String message) {
            super(message);
        }
    }

}