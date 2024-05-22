from flask import Flask, render_template
import pandas as pd
import webbrowser

app = Flask(
    import_name="Data Fetcher", static_folder="static", static_url_path="/static"
)


def read_data():
    emp_df = pd.read_csv("master-data/Civil-Emp.csv")
    fields_list_civil_emp = emp_df.iloc[3].tolist()
    print(fields_list_civil_emp)


@app.route("/")
def homepage():
    return render_template("index.html")


if __name__ == "__main__":
    read_data()
    webbrowser.open_new_tab("http://127.0.0.1:8000")
    app.run(port=8000)
