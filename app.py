from flask import Flask, render_template, jsonify, request
import pandas as pd
import json
import webbrowser

civil_emp_df = {}
fields_list_civil_emp = []

app = Flask(
    import_name="Data Fetcher", static_folder="static", static_url_path="/static"
)


def read_data():
    global fields_list_civil_emp, civil_emp_df
    civil_emp_df = pd.read_csv("master-data/Civil-Emp.csv", header=3)
    fields_list_civil_emp = civil_emp_df.iloc[0].tolist()


@app.route("/Civil-employee-data", methods=["GET"])
def civil_emp_data():
    global fields_list_civil_emp
    return jsonify({"civil-fields": fields_list_civil_emp})


@app.route("/")
def homepage():
    return render_template("index.html")


@app.route("/return-selected-fields", methods=["POST"])
def return_selected_fields():
    data = json.loads(request.data.decode("utf-8"))
    print(data)
    try:
        extracted_df = civil_emp_df[data]
    except KeyError as e:
        raise ValueError(f"Error extracting columns: {e}")
    print(extracted_df)
    return jsonify({"message": "hi!"})


if __name__ == "__main__":
    read_data()
    webbrowser.open_new_tab("http://127.0.0.1:8000")
    app.run(port=8000)
