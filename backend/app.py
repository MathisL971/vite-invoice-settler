from flask import Flask, jsonify, request
from flask_cors import CORS
import win32com.client
import pythoncom
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='/')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# FOR SELECT QUERIES
def query_database(query, table):
    pythoncom.CoInitialize()

    try:
        conn = win32com.client.Dispatch('ADODB.Connection')

        provider = 'Provider=PCSOFT.HFSQL'
        ds = 'Data Source=localhost:' + os.getenv('HFSQL_PORT')
        db = 'Initial Catalog=' + os.getenv('HFSQL_DB')
        creds = 'User ID=' + os.getenv('HFSQL_USER') + ';Password=' + os.getenv('HFSQL_PASSWORD')
        ex_props = 'Extended Properties="Password=' + table + ':' + os.getenv('HFSQL_TABLE_PASSWORD') + '"'

        conn.Open(provider + ';' + ds + ';' + db + ';' + creds + ';' + ex_props)

        rs = win32com.client.Dispatch('ADODB.Recordset')

        rs.Open(query, conn)

        results = []
        while not rs.EOF:
            record = {field.Name: field.Value for field in rs.Fields}
            results.append(record)
            rs.MoveNext()

        rs.Close()
        conn.Close()

        return results
    finally:
        pythoncom.CoUninitialize()

# FOR INSERT, UPDATE, DELETE QUERIES
def execute_database(query, table):
    pythoncom.CoInitialize()

    try:
        conn = win32com.client.Dispatch('ADODB.Connection')

        provider = 'Provider=PCSOFT.HFSQL'
        ds = 'Data Source=localhost:' + os.getenv('HFSQL_PORT')
        db = 'Initial Catalog=' + os.getenv('HFSQL_DB')
        creds = 'User ID=' + os.getenv('HFSQL_USER') + ';Password=' + os.getenv('HFSQL_PASSWORD')
        ex_props = 'Extended Properties="Password=' + table + ':' + os.getenv('HFSQL_TABLE_PASSWORD') + '"'

        conn.Open(provider + ';' + ds + ';' + db + ';' + creds + ';' + ex_props)

        conn.Execute(query)

        conn.Close()
    finally:
        pythoncom.CoUninitialize()

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/api/invoices', methods=['GET'])
def invoices():
    table = 'Invoice'
    query = 'SELECT InvoiceID, TotalAmount, Balance FROM ' + table
    results = query_database(query, table)
    return jsonify(results)

@app.route('/api/invoices/<int:invoice_id>', methods=['GET'])
def invoice(invoice_id):
    table = 'Invoice'
    query = 'SELECT InvoiceID, TotalAmount, Balance FROM ' + table + ' WHERE InvoiceID = ' + str(invoice_id)
    results = query_database(query, table)

    if len(results) == 0:
        return jsonify(None), 404
    
    return jsonify(results[0])

@app.route('/api/invoices/<int:invoice_id>', methods=['PATCH'])
def update_invoice(invoice_id):
    table = 'Invoice'
    # For each field in the request, build a SET statement
    statement = 'UPDATE ' + table
    update_fields = ', '.join([f"{key} = %s" for key in request.json.keys()])
    statement += f" SET {update_fields}"
    statement += f" WHERE InvoiceID = {invoice_id}"
    values = list(request.json.values())
    query = statement % tuple(values)
    results = execute_database(query, table)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
