#!/usr/bin/env python3
 
from flask import Flask
from flask_cors import CORS
from flask_kerberos import init_kerberos
from flask_kerberos import requires_authentication
from flask_bootstrap import Bootstrap
import json
from datetime import datetime

import os

DEBUG=True

app = Flask(__name__)
Bootstrap(app)
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route('/public')
def about():
	timestamp = int(datetime.now().timestamp())
	data = {
		'data': "This is public information at timestamp: " + str(timestamp),
		"status": "success",
		"code": 200,
		"message": "OK"
  }
	return json.dumps(data)

@app.route('/protected')
@requires_authentication
def home(user):
  timestamp = int(datetime.now().timestamp())
  data = {
    'data': "💝 This is classified information specifically for " + user + " at timestamp: " + str(timestamp),
    "status": "success",
    "code": 200,
    "message": "OK"
  }
  return json.dumps(data)

if __name__ == '__main__':
	init_kerberos(app,service='host',hostname='server.insat.tn')
	app.run(host='0.0.0.0',port=8080)
