# # Quiz : https://colab.research.google.com/drive/1C3Ta8Ux1OJDi2LcTs9AYpkUY3YNT5tAk?usp=sharing
# # FER : https://colab.research.google.com/drive/1qaDcC6syp2QhA_jNgxZjWbwQMZN0fhdj?usp=sharing
# # Speech : https://colab.research.google.com/drive/1GizpDW_nvJogsA3vrdp4C7QU0i-zOma9?usp=sharing

import base64
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import joblib
import tensorflow as tf
import pandas as pd
import numpy as np
from skimage import io
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import rembg
import numpy as np
from PIL import Image
from tensorflow.keras.models import Sequential, model_from_json
import pickle
import librosa
import numpy as np
from werkzeug.utils import secure_filename
import os
import io
import wave
import soundfile as sf
from pydub import AudioSegment

import numpy as np
import librosa
from tensorflow.keras.models import model_from_json
import sounddevice as sd
import scipy.io.wavfile as wavfile 
import librosa
import numpy as np
import pickle
import json
import openpyxl
from win32com import client
import win32com
from socket import gethostname
#import email
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import json
import pythoncom

import  jpype
import  asposecells
jpype.startJVM()
from asposecells.api import Workbook




app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'




# Function & Variables required for image processing
model_path = "O:\\Projects\\ML\\Depression Screening\\fer_model\\content\\model\\saved_model.pb"
# model = tf.saved_model.load(model_path)
model = load_model("O:\\Projects\\ML\\Depression Screening\\fer_model.h5")
objects = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

def remBG(file_name):
    input_image = Image.open(file_name)
    input_array = np.array(input_image)
    output_array = rembg.remove(input_array)
    output_image = Image.fromarray(output_array)
    output_image = output_image.convert('RGB')
    output_image.save(file_name, format='JPEG')


# Functions & Variables required for audio processing
duration = 4
samplerate = 48000
audio_path = "O:\\Projects\\ML\\Depression Screening\\my_recording.wav"
# audio_path = "O:\\Projects\\ML\\Depression Screening\\speech_model\\happy.wav"
model_path = "O:\\Projects\\ML\\Depression Screening\\speech_model\\CNN_model.json"
weights_path = "O:\\Projects\\ML\\Depression Screening\\speech_model\\CNN_model_weights.h5"
# emotions1={1:'Neutral', 2:'Calm', 3:'Happy', 4:'Sad', 5:'Angry', 6:'Fear', 7:'Disgust',8:'Surprise'}

scaler2 = pickle.load(open('O:\\Projects\\ML\\Depression Screening\\speech_model\\scaler2.pickle', 'rb'))
encoder2 = pickle.load(open('O:\\Projects\\ML\\Depression Screening\\speech_model\\encoder2.pickle', 'rb'))

def record_audio(duration, samplerate):
    print("Recording....4 Sec")
    recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1)
    sd.wait()
    print("Done")
    return recording

def preprocess_n_save(recording, sr):
    mono_recording = np.squeeze(recording) # mono signal
    # Ensure recording length (2376 samples)
    target_length = sr * duration
    if len(mono_recording) < target_length:
        # padding it with zeros if short in length
        padding_length = target_length - len(mono_recording)
        mono_recording = np.pad(mono_recording, (0, padding_length), mode='constant')
    elif len(mono_recording) > target_length:
        # trim if longer
        mono_recording = mono_recording[:target_length]
    filename = "my_recording.wav"
    wavfile.write(filename, samplerate, mono_recording)

def load_audio_model(model_path, weights_path):
    json_file = open(model_path, 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights(weights_path)
    return loaded_model

def preprocess_audio(audio_path):
    data, sr = librosa.load(audio_path, duration=2.5, offset=0.6)

    def zcr(data, frame_length, hop_length):
        zcr = librosa.feature.zero_crossing_rate(data, frame_length=frame_length, hop_length=hop_length)
        return np.squeeze(zcr)

    def rmse(data, frame_length=2048, hop_length=512):
        rmse = librosa.feature.rms(y=data, frame_length=frame_length, hop_length=hop_length)
        return np.squeeze(rmse)

    def mfcc(data, sr, frame_length=2048, hop_length=512, flatten=True):
        mfcc = librosa.feature.mfcc(y=data, sr=sr)
        return np.squeeze(mfcc.T) if not flatten else np.ravel(mfcc.T)

    def extract_features(data, sr=22050, frame_length=2048, hop_length=512):
        result = np.array([])
        result = np.hstack((result,
                            zcr(data, frame_length, hop_length),
                            rmse(data, frame_length, hop_length),
                            mfcc(data, sr, frame_length, hop_length)
                            ))
        return result

    features = extract_features(data)
    return features

def predict_emotion(model, features):
    features = np.expand_dims(features, axis=0)
    features = np.expand_dims(features, axis=2)
    prediction = model.predict(features)
    return prediction

audio_model = load_audio_model(model_path, weights_path)


def sendEmail(path_to_pdf, destination):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('your-mail-here', 'your-passkey-here')
    msg = MIMEMultipart()
    message = f"Computer generated report of Depression Screening Test\nSend from Hostname: {gethostname()}"
    msg['Subject'] = "Depression Screening Test Report"
    msg['From'] = 'your-mail-here'
    msg['To'] = destination
    msg.attach(MIMEText(message, "plain"))
    with open(path_to_pdf, "rb") as f:
        attach = MIMEApplication(f.read(),_subtype="pdf")
    attach.add_header('Content-Disposition','attachment',filename=str(path_to_pdf))
    msg.attach(attach)
    server.send_message(msg)


def sendReport(personal, quiz, img, aud, fin):
    print("Sending Email...")

    workbook = openpyxl.load_workbook("O:\\Projects\\ML\\Depression Screening\\report.xlsx")
    sheet = workbook.active

    sheet["C7"] = personal[0]
    sheet["C8"] = personal[1]
    sheet["C9"] = personal[2]
    sheet["C10"] = personal[3]

    sheet["H16"] = quiz

    sheet["H26"] = img[0]
    sheet["H27"] = img[1]
    sheet["H28"] = img[2]
    sheet["H29"] = img[3]
    sheet["H30"] = img[4]
    
    sheet["H18"] = aud[0]
    sheet["H19"] = aud[1]
    sheet["H20"] = aud[2]
    sheet["H21"] = aud[3]
    sheet["H22"] = aud[4]
    sheet["H23"] = aud[5]
    sheet["H24"] = aud[6]

    sheet["H32"] = fin

    workbook.save("temp.xlsx")


    # # excel = client.Dispatch("Excel.Application")
    # excel= client.Dispatch("Excel.Application",pythoncom.CoInitialize())
    # sheets = excel.Workbooks.Open("O:\\Projects\\ML\\Depression Screening\\temp.xlsx") 
    # work_sheets = sheets.Worksheets[0] 
    # work_sheets.ExportAsFixedFormat(0, "report.pdf")
    workbook = Workbook("O:\\Projects\\ML\\Depression Screening\\temp.xlsx")
    workbook.save("report.pdf")
    # jpype.shutdownJVM()
    sendEmail("report.pdf", personal[1])


@app.route('/mail', methods=['GET'])
@cross_origin()
def mail():
    print("\n\n")

    personalInfo= ["PQR", "omsveri0143@gmail.com", "20", "Male"]
    testScore= 0
    results = ["happy", "happy", "neutral"]
    audioResp = ["happy", "happy", "surprise"]
    badScore = 2

    sendReport(personal=personalInfo, quiz="Not depressed" if testScore==0 else "Depressed", img=results, aud=audioResp, fin="Depressed" if badScore>=4 else "Not depressed")

    return "Success"




@app.route('/upload', methods=['POST'])
@cross_origin()
def upload():
    print("\n\n")

    personalInfo =[]
    tempPer = json.loads(request.form.get('userInfo'))
    personalInfo.append(tempPer["name"])
    personalInfo.append( tempPer["email"])
    personalInfo.append(tempPer["age"])
    personalInfo.append("Male" if tempPer["gender"]=="1" else "Female")

    # Test : Precessing & Predicting
    responses = request.form.get('responses')    
    userInfo = list(request.form.get('userInfo').split(","))
    age=userInfo[2].split(":")[1][1:-1]
    gen=userInfo[3].split(":")[1][1:-2]

    responses = responses.replace("[", "")
    responses = responses.replace("]", "")
    responses = responses.replace("'", "")
    quizResponce = list(responses.split(",")) 
    quizResponce.insert(17, age)
    quizResponce.insert(18, gen)
    
    print("Quiz:", quizResponce)
    loaded_rf = joblib.load("O:\\Projects\\ML\\Depression Screening\\mod.joblib")
    quizResp = pd.DataFrame([quizResponce], columns=['phq1', 'phq2', 'phq3', 'phq4', 'phq5', 'phq6', 'phq7', 'phq8', 'phq9', 'phq10', 'phq11', 'phq12', 'phq13', 'phq14', 'phq15', 'phq16', 'phq17', 'age', 'sex', 'happiness.score'])
    testScore = int(loaded_rf.predict(quizResp)[0])


    # Audio : Precessing & Predicting 
    # if 'audio1' not in request.files or 'audio2' not in request.files or 'audio3' not in request.files:
    #     return jsonify({'error': 'No audio files found in request'}), 400    
    # audio_files = ['audio1', 'audio2', 'audio3']
    # uploaded_files = []
    # for audio_file in audio_files:
    #     file = request.files[audio_file]
    #     if file and allowed_file(file.filename):
    #         filename = secure_filename(file.filename)
    #         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    #         file.save(filepath)
    #         uploaded_files.append(filepath)
    #     else:
    #         return jsonify({'error': f'Invalid or missing {audio_file} file'}), 400

    audioResp =[]
    tempAud = json.loads(request.form.get('audioScore'))
    audioResp.append(tempAud["audio1"])
    audioResp.append(tempAud["audio2"])
    audioResp.append(tempAud["audio3"])
    audioResp.append(tempAud["audio4"])
    audioResp.append(tempAud["audio5"])
    audioResp.append(tempAud["audio6"])
    audioResp.append(tempAud["audio7"])
    # print(audioResp)
    # for audPath in uploaded_files:
    #     # ogg_file = open(audPath, "rb")
    #     # data = ogg_file.read()
    #     # recorder = wave.open("output.wav", 'wb')
    #     # recorder.setnchannels(2)
    #     # recorder.setsampwidth(2)
    #     # recorder.setframerate(44100)
    #     # recorder.writeframes(data)
    #     # ogg_file.close()
    #     # recorder.close()
    #     # audioResp.append(prediction("output.wav"))
    #     audioResp.append(prediction(audPath))


    # Image : Precessing & Predicting 
    imgList = []
    imgList.append(request.form.get('image0'))
    imgList.append(request.form.get('image1'))
    imgList.append(request.form.get('image2'))
    imgList.append(request.form.get('image3'))
    imgList.append(request.form.get('image4'))

    fileList = []
    # Save received images
    for i, img_data in enumerate(imgList):
        img_data = img_data.split(',')[1]
        img_binary = base64.b64decode(img_data)
        file_name = f"image_{i}.jpg"
        with open(file_name, 'wb') as f:
            f.write(img_binary)
        print(f"Image {i} saved as {file_name}")
        remBG(file_name)
        fileList.append(file_name)

    results = []
    # Predict image expression
    for file in fileList:
        img = image.load_img(file, grayscale=True, target_size=(48, 48))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis = 0)
        x /= 255
        custom = model.predict(x)
        x = np.array(x, 'float32')
        x = x.reshape([48, 48])
        m=0.000000000000000000001
        a=custom[0]
        for i in range(0,len(a)):
            if a[i]>m:
                m=a[i]
                ind=i
        print('Image Expression Prediction:',objects[ind])
        results.append(objects[ind])

    negative = ['angry', 'disgust', 'fear', 'sad']
    badScore =0
    maxImg = max(results)
    minAud = min(audioResp)
    if testScore==1:
        badScore += 4
    if maxImg in negative:
        badScore += 2
    if minAud in negative:
        badScore += 3
      

    # Final Responce
    response_data = {
        "testScore": "Well! Not depressed" if testScore==0 else "You're looking depressed, take care of yourself",
        "imagesMood": list(results),
        "audioScore" : list(audioResp),
        "overallScore": "Depressed" if badScore>=4 else "Not depressed"
    }
    print(response_data)

    sendReport(personal=personalInfo, quiz="Not depressed" if testScore==0 else "Depressed", img=results, aud=audioResp, fin="Depressed" if badScore>=4 else "Not depressed")

    return jsonify(response_data)




@app.route("/record", methods=['GET'])
@cross_origin()
def record1():
    my_recording = record_audio(duration, samplerate)
    preprocess_n_save(my_recording, samplerate)

    features = preprocess_audio(audio_path)
    prediction = predict_emotion(audio_model, features)
    # emotions=['Neutral', 'Calm', 'Happy', 'Sad', 'Angry', 'Fear', 'Disgust', 'Surprise']
    emotions = ['disgust', 'angry', 'surprise', 'fear', 'neutral', 'happy', 'sad']
    predicted_emotion = emotions[np.argmax(prediction)]

    print("Predicted Emotion:", predicted_emotion)
    
    return jsonify({"mood" : predicted_emotion})



if __name__ == '__main__':
    app.run(debug=True)
