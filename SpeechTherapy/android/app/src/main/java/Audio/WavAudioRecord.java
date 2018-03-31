package Audio;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Environment;
import android.support.v4.content.ContextCompat;
import android.Manifest;

import FileManager.FileManager;

/*
*   class written by Bartosik Pawel to allow for saving files in a .wav format
*/


public class WavAudioRecord extends ReactContextBaseJavaModule {
    private static final int BPP = 16;
    private static final String TEMP_FILE_NAME = "temp_recording.raw";
    private static final int SAMPLERATE = 44100;
    private static final int CHANNELS = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_ENCODING = AudioFormat.ENCODING_PCM_16BIT;

    private AudioRecord recorder = null;
    private int bufferSize = 0;
    private Thread recordingThread = null;
    private boolean isRecording = false;
    private String filepath = null;

    private String output = null;

    public WavAudioRecord (ReactApplicationContext reactContext){
        super(reactContext);

        bufferSize = AudioRecord.getMinBufferSize(SAMPLERATE,
                CHANNELS, AUDIO_ENCODING) * 3;
        //get a size for the buffer

        filepath = FileManager.getRootDir();
        File file = new File(filepath);
        //access the recording folder

        if (!file.exists()) {
            file.mkdirs();
        }
        //if the file folder doesn't exist, create it
    }

    @Override
    public String getName() {
        return "WavAudioRecord";
    }

    @ReactMethod
    public void checkAuthorisation(Promise promise)
    {
        int status = ContextCompat.checkSelfPermission(getCurrentActivity(),
                Manifest.permission.RECORD_AUDIO);
        boolean test = status == PackageManager.PERMISSION_GRANTED;
        promise.resolve(test);
    }

    @ReactMethod
    public void setPath(String path) { output = path; }

    private String getFilenamePath() {
        File file = new File(filepath, output);
        if (file.exists())
            file.delete();
        //remove any possible existing file

        try {
            file.createNewFile();
        } catch (IOException e){
            e.printStackTrace();
        }


        return (file.getAbsolutePath());
    }

    private String getTempFilenamePath() {
        File tempFile = new File(filepath, TEMP_FILE_NAME);

        if(!tempFile.exists()) {
            try {
                tempFile.createNewFile();
            } catch (IOException e){
                e.printStackTrace();
            }
        }

        return (tempFile.getAbsolutePath());
    }

    @ReactMethod
    public void startRecording(Promise promise) {

        recorder = new AudioRecord(MediaRecorder.AudioSource.MIC,
                SAMPLERATE, CHANNELS,
                AUDIO_ENCODING, bufferSize);
        //create the recorder

        int i = recorder.getState();
        if (i == 1)
            recorder.startRecording();
        else
            promise.reject("Could not initialise recorder!");
        //make sure the recording is actually happening

        isRecording = true;
        //set the flag for active recording

        String filename = getTempFilenamePath();
        FileOutputStream os = null;

        try {
            os = new FileOutputStream(filename);
        } catch (FileNotFoundException e) {
            promise.reject("Could not create a file for the recording!");
        }
        final FileOutputStream finalOs = os;
        //setup a connection to the temp recording file

        recordingThread = new Thread(new Runnable() {
            @Override
            public void run() {
                recordAudioInFile(finalOs);
            }
        }, "AudioRecorder Thread");
        recordingThread.start();
        //start the actual recording in a different thread

        promise.resolve("");
        //report success in setting up the recorder
    }

    private void recordAudioInFile(FileOutputStream outputFile) {
        byte data[] = new byte[bufferSize];
        //make a buffer for the data

        int recordedData = 0;
        if (null != outputFile) {
            while (isRecording) {
                recordedData = recorder.read(data, 0, bufferSize);
                //read the next part

                if (AudioRecord.ERROR_INVALID_OPERATION != recordedData) {
                    try {
                        outputFile.write(data);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }//attempt to save the data in the file
            }

            try {
                outputFile.flush();
                outputFile.close();
            } catch (IOException e) {
                e.printStackTrace();
            }//cleanup after the recording
        }
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        if (null != recorder) {
            isRecording = false;
            //clear the recording flag

            int i = recorder.getState();
            if (i == 1)
                recorder.stop();
            else
                promise.reject("Error, could not stop the recorder!");
            recorder.release();
            //stop the recorder

            recorder = null;
            recordingThread = null;
            //cleanup recording resources
        }
        promise.resolve("");
    }

    @ReactMethod
    public void saveRecording(Promise promise)
    {
        boolean canSave = !(output == null) && !isRecording;
        //make sure there is a file path you can save under, and that the recorder is currently idle

        if(canSave)
        {
            copyWaveFile(getTempFilenamePath(), getFilenamePath());
            deleteTempFile();
            output = null;
        }
        //save the file

        promise.resolve(canSave);
    }

    @ReactMethod
    public void checkForFile(Promise promise)
    {
        File file = new File(filepath, output);
        promise.resolve(file.exists());
    }

    private void deleteTempFile() {
        File file = new File(getTempFilenamePath());
        file.delete();
    }

    private void copyWaveFile(String inFilename, String outFilename) {
        FileInputStream in = null;
        FileOutputStream out = null;
        long totalAudioLen = 0;
        long totalDataLen = totalAudioLen + 36;
        long longSampleRate = SAMPLERATE;
        int channels = ((CHANNELS == AudioFormat.CHANNEL_IN_MONO) ? 1
                : 2);
        long byteRate = BPP * SAMPLERATE * channels / 8;

        byte[] data = new byte[bufferSize];
        //prepare info for the file

        try {
            in = new FileInputStream(inFilename);
            out = new FileOutputStream(outFilename);
            totalAudioLen = in.getChannel().size();
            totalDataLen = totalAudioLen + 36;
            //open the streams to the raw file as well as the proper file

            WriteWaveFileHeader(out, totalAudioLen, totalDataLen,
                    longSampleRate, channels, byteRate);
            //write the wav format header to the file

            while (in.read(data) != -1) {
                out.write(data);
            }
            out.flush();
            //move the data from the raw file to the proper file

            in.close();
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void WriteWaveFileHeader(FileOutputStream out, long totalAudioLen,
                                     long totalDataLen, long longSampleRate, int channels, long byteRate)
            throws IOException {

        ByteBuffer header = ByteBuffer.allocate(44);

        header.order(ByteOrder.LITTLE_ENDIAN);

        header.put("RIFF".getBytes());
        header.putInt((int)totalDataLen);
        header.put("WAVEfmt ".getBytes());
        header.put(new byte[]{16, 0, 0, 0, 1, 0, (byte) channels, 0});
        header.putInt((int) longSampleRate);
        header.putInt((int) byteRate);
        header.put((byte) (((CHANNELS == AudioFormat.CHANNEL_IN_MONO) ? 1 : 2) * 16 / 8));
        header.put(new byte[]{0, BPP, 0});
        header.put("data".getBytes());
        header.putInt((int) totalAudioLen);

        out.write(header.array(), 0, 44);
    }
}
