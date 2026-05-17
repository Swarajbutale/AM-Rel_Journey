from flask import Flask, render_template, jsonify, send_from_directory
import json, os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/memories/<chapter>')
def get_memories(chapter):
    with open('data/memories.json') as f:
        data = json.load(f)
    return jsonify(data.get(chapter, []))

@app.route('/static/memories/<path:filename>')
def serve_memory(filename):
    return send_from_directory('static/memories', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)