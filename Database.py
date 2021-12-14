import os
import pymysql
from dotenv import load_dotenv

class Database():
    def __init__(self):
        db = self.connect()
        cursor = db.cursor()

        with open("schema.sql", 'r') as f:
            sqls = [x for x in f.read().split(";") if x != '']

        for sql in sqls:
            cursor.execute(sql)
        db.commit()
        db.close()
        print("DATABASE READY")
    
    def connect(self):
        load_dotenv()
        DATABASE_HOST = os.getenv('DATABASE_HOST')
        DATABASE_PORT = int(os.getenv('DATABASE_PORT'))
        # DATABASE_DB = os.getenv('DATABASE_DB')
        DATABASE_USER = os.getenv('DATABASE_USER')
        DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
        db = pymysql.connect(
                host=DATABASE_HOST,
                port=DATABASE_PORT,
                # db=DATABASE_DB,
                user=DATABASE_USER,
                passwd=DATABASE_PASSWORD,
                charset='utf8mb4'
        )
        return db

    def insert_one(self, table, row):
        # print(list)
        db = self.connect()
        cursor = db.cursor()
        sql = '''
            DESCRIBE user;
        '''
        cursor.execute(sql)
        res = cursor.fetchall()
        db.commit()
        db.close()

