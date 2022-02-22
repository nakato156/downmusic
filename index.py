from flask import Flask, render_template
from flask_cors import CORS
from api.api import api_DM


app = Flask(__name__)
CORS(app)
app.register_blueprint(api_DM)


@app.get("/")
def main():
    return render_template("index.html")


@app.get("/api")
def api():
    return render_template("api.html")


if __name__ == "__main__":
    app.run(debug=True)
