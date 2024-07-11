from flask import Flask, render_template, jsonify, request, send_file
import pandas as pd
import json
import webbrowser

civil_emp_df = {}
fields_list_civil_emp = []
robotics_year1_stud_df = {}
fields_list_robotics_year1_df = []
robotics_year2_stud_df = {}
fields_list_robotics_year2_df = []
robotics_year3_stud_df = {}
fields_list_robotics_year3_df = []
robotics_year4_stud_df = {}
fields_list_robotics_year4_df = []
df_mapping = {}

app = Flask(
    import_name="Data Fetcher", static_folder="static", static_url_path="/static"
)


def read_data():
    global df_mapping, fields_list_civil_emp, civil_emp_df, fields_list_robotics_year1_df, robotics_year1_stud_df, fields_list_robotics_year2_df, robotics_year2_stud_df, robotics_year3_stud_df, fields_list_robotics_year3_df, fields_list_robotics_year4_df, robotics_year4_stud_df

    civil_emp_df = pd.read_csv("master-data/Civil-Emp.csv", header=4)
    fields_list_civil_emp = civil_emp_df.columns.tolist()
    robotics_year1_stud_df = pd.read_csv("master-data/Robotics-Year1.csv", header=2)
    fields_list_robotics_year1_df = robotics_year1_stud_df.columns.tolist()
    robotics_year2_stud_df = pd.read_csv("master-data/Robotics-Year2.csv", header=2)
    fields_list_robotics_year2_df = robotics_year2_stud_df.columns.tolist()
    robotics_year3_stud_df = pd.read_csv("master-data/Robotics-Year3.csv", header=2)
    fields_list_robotics_year3_df = robotics_year3_stud_df.columns.tolist()

    df_mapping = {
        "employee": {
            "Civil": civil_emp_df,
        },
        "student": {
            "year1": {"Robotics": robotics_year1_stud_df},
            "year2": {"Robotics": robotics_year2_stud_df},
            "year3": {"Robotics": robotics_year3_stud_df},
            "year4": {"Robotics": robotics_year4_stud_df},
        },
    }


@app.route("/Civil-employee-data", methods=["GET"])
def civil_emp_data():
    global fields_list_civil_emp
    return jsonify({"Civil-fields": fields_list_civil_emp})


@app.route("/Robotics-year1-student-data", methods=["GET"])
def robotics_year1_student_data():
    global fields_list_robotics_year1_df
    return jsonify({"Robotics-year1-fields": fields_list_robotics_year1_df})


@app.route("/Robotics-year2-student-data", methods=["GET"])
def robotics_year2_student_data():
    global fields_list_robotics_year2_df
    return jsonify({"Robotics-year2-fields": fields_list_robotics_year2_df})


@app.route("/Robotics-year3-student-data", methods=["GET"])
def robotics_year3_student_data():
    global fields_list_robotics_year3_df
    return jsonify({"Robotics-year3-fields": fields_list_robotics_year3_df})


@app.route("/Robotics-year4-student-data", methods=["GET"])
def robotics_year4_student_data():
    global fields_list_robotics_year3_df
    return jsonify({"Robotics-year4-fields": fields_list_robotics_year3_df})


@app.route("/")
def homepage():
    return render_template("index.html")


@app.route("/return-selected-fields", methods=["POST"])
def return_selected_fields():
    global fields_list_civil_emp, civil_emp_df, fields_list_robotics_year1_df, robotics_year1_stud_df, fields_list_robotics_year2_df, robotics_year2_stud_df, robotics_year3_stud_df, fields_list_robotics_year3_df, fields_list_robotics_year4_df, robotics_year4_stud_df
    data = json.loads(request.data.decode("utf-8"))
    selected_person_type = data.get("selectedPersonType")
    selected_branch = data.get("selectedBranch")
    selected_year = data.get("selectedYear")
    selected_fields = data.get("selectedFields")
    if selected_person_type == "employee":
        selected_df = df_mapping["employee"][selected_branch]
        extracted_df = selected_df[selected_fields]
    else:
        selected_df = df_mapping["student"][selected_year][selected_branch]
        extracted_df = selected_df[selected_fields]

    extracted_df.to_csv("./output-csv/output.csv", index=False)
    return send_file(
        path_or_file="./output-csv/output.csv",
        download_name="output.csv",
        as_attachment=True,
    )


if __name__ == "__main__":
    read_data()
    webbrowser.open_new_tab("http://127.0.0.1:8000")
    app.run(port=8000)
