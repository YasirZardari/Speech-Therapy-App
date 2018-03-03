package Audio;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Environment;

/**
 * Created by s on 16/02/18.
 */

public class WavAudioRecord extends ReactContextBaseJavaModule {
    private static final int BPP = 16;
    private static final String RECORDER_FOLDER = "AudioRecorder";
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

        filepath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC).getAbsolutePath();
        File file = new File(filepath, RECORDER_FOLDER);
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
        if (tempFile.exists())
            tempFile.delete();
        //remove any possible remnants of previous recordings

        try {
            tempFile.createNewFile();
        } catch (IOException e){
            e.printStackTrace();
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

        copyWaveFile(getTempFilenamePath(), getFilenamePath());
        deleteTempFile();
        promise.resolve("");
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

        try {
            in = new FileInputStream(inFilename);
            out = new FileOutputStream(outFilename);
            totalAudioLen = in.getChannel().size();
            totalDataLen = totalAudioLen + 36;

            WriteWaveFileHeader(out, totalAudioLen, totalDataLen,
                    longSampleRate, channels, byteRate);

            while (in.read(data) != -1) {
                out.write(data);
            }
            out.flush();

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
        byte[] header = new byte[44];

        header[0] = 'R'; // RIFF/WAVE header
        header[1] = 'I';
        header[2] = 'F';
        header[3] = 'F';
        header[4] = (byte) (totalDataLen & 0xff);
        header[5] = (byte) ((totalDataLen >> 8) & 0xff);
        header[6] = (byte) ((totalDataLen >> 16) & 0xff);
        header[7] = (byte) ((totalDataLen >> 24) & 0xff);
        header[8] = 'W';
        header[9] = 'A';
        header[10] = 'V';
        header[11] = 'E';
        header[12] = 'f'; // 'fmt ' chunk
        header[13] = 'm';
        header[14] = 't';
        header[15] = ' ';
        header[16] = 16; // 4 bytes: size of 'fmt ' chunk
        header[17] = 0;
        header[18] = 0;
        header[19] = 0;
        header[20] = 1; // format = 1
        header[21] = 0;
        header[22] = (byte) channels;
        header[23] = 0;
        header[24] = (byte) (longSampleRate & 0xff);
        header[25] = (byte) ((longSampleRate >> 8) & 0xff);
        header[26] = (byte) ((longSampleRate >> 16) & 0xff);
        header[27] = (byte) ((longSampleRate >> 24) & 0xff);
        header[28] = (byte) (byteRate & 0xff);
        header[29] = (byte) ((byteRate >> 8) & 0xff);
        header[30] = (byte) ((byteRate >> 16) & 0xff);
        header[31] = (byte) ((byteRate >> 24) & 0xff);
        header[32] = (byte) (((CHANNELS == AudioFormat.CHANNEL_IN_MONO) ? 1
                : 2) * 16 / 8); // block align
        header[33] = 0;
        header[34] = BPP; // bits per sample
        header[35] = 0;
        header[36] = 'd';
        header[37] = 'a';
        header[38] = 't';
        header[39] = 'a';
        header[40] = (byte) (totalAudioLen & 0xff);
        header[41] = (byte) ((totalAudioLen >> 8) & 0xff);
        header[42] = (byte) ((totalAudioLen >> 16) & 0xff);
        header[43] = (byte) ((totalAudioLen >> 24) & 0xff);

        out.write(header, 0, 44);
    }
}
