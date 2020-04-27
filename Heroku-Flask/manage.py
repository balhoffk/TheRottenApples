import tra_functions as tralib
from flask import Flask, redirect, jsonify, render_template, Response, request
from flask_cors import CORS
import socket
import os.path

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

def read_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
@app.route("/home")
@app.route("/index")
def welcome(): 
    return render_template("index.html")

@app.route("/redirect")
def redirect():

    return welcome()

@app.route("/get")
def get():
	hostname = socket.gethostname()    
	IPAddr = socket.gethostbyname(hostname)    
	print("Your Computer Name is:" + hostname)    
	print("Your Computer IP Address is:" + IPAddr)    
	ipDetails = f"Flask application IP Deails are:\nhostname='{hostname}', IPAddr='{IPAddr}'"

	return jsonify(ipDetails)

@app.route('/t/<string:page_name>/')
def render_template_html(page_name):
    return render_template('%s.html' % page_name)

@app.route("/get_crime_count")
def get_crime_count():
    crime_count = {
        'Agg Assault':'19150',
        'Auto Theft':'37653',
        'Homicide':'704',
        'Burglary':'51268',
        'Larceny':'138845',
        'Robbery':'18227'
    }
    return jsonify(crime_count)

@app.route("/get_map_data")
def get_map_data():
    crime_count = {
        'x':[1,2,3,4,5,6,7,8,9],
        'y':[1,2,3,4,5,6,7,8,9]
    }
    return jsonify(crime_count)

@app.route('/get_file', methods=['GET'])
def get_file():
    '''
    examples:
        http://localhost:5000/get_file?filename=csv\birth.csv
        http://localhost:5000/get_file?filename=static_html\hello.html
    '''
    args = request.args

    file_name = ""
    for k, v in args.items():
        # arg_str = f"{k}: {v}"
        file_name = v
        break

    content = read_file(file_name)
    content_type = "text/" + file_name.split('.')[1]
    return Response(content, mimetype=content_type)

@app.route('/getdf', methods=['GET'])
def get_df():
    args = request.args

    key = ""
    for k, v in args.items():
        key = v
        break

    return tralib.read_df_from_mongo_as_json(key)

if __name__ == '__main__':
    app.run(debug=False)
