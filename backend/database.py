# pip install mysql-connector-python
import mysql.connector
from mysql.connector import Error

db_config={
    "host":"localhost"
    ,"database":"todos_db"
    ,"username":"root"
    ,"password":"123456789"
}

def get_db():
    try:
        connection=mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
        return None
    except Error as e:
        print(f"Error in connecting to mysql db and derror is {e}")
        return None
