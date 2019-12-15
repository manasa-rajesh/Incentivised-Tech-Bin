from flask import Flask, request, Response
import jsonpickle
import numpy as np
import cv2
from flask_pymongo import PyMongo
import FaceRecognition
from werkzeug.datastructures import ImmutableMultiDict

# Initialize the Flask application
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://192.168.43.31:27017/hackertech"
mongo = PyMongo(app)

# route http posts to this method
@app.route('/login', methods=['POST'])
def test():
    r = request
    # #online_users = mongo.db.users.find({"online": True})
    # # convert string of image data to uint8
    img = flask.request.files.get('image', '')
    name = detect(img);
    response = {'message': 'Person found', 'id': name }
    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype="application/json")

@app.route('/add', methods=['POST']);
def add():
    r = request;
    img = flask.request.files.get('image', '')
    name = detect(img);
    data = dict(request.form)
    update = mongo.db.users.findOneAndUpdate({"_id": name},{
        '$push': {
            'details': {
                'date':data['date'],
                'rewards': {
                    'metal': data['metal'],
                    'plastic': data['plastic'],
                    'glass': data['glass'],
                },
                'total': data['metal'] + data['plastic'] + data['glass']
            }
        }
    });
    updateDustbin = mongo.db.dustbins.findOneAndUpdate({'_id': data['dustbin'] },{
        '$inc': {
            'weight.metal':data['metal'],
            'weight.plastic':data['plastic'],
            'weight.glass':data['glass'],  
            'total': data['metal'] + data['plastic'] + data['glass']
        }
    });
    response = {'message': 'Updated', 'success': True }
    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype="application/json")

app.run(host="0.0.0.0", port=5000)