import os
import pymysql
from dotenv import load_dotenv

class Database():
    def __init__(self):
        db = self.connect_init()
        cursor = db.cursor()

        with open("schema.sql", 'r') as f:
            sqls = [x for x in f.read().split(";") if x != '']

        for sql in sqls:
            cursor.execute(sql)
        db.commit()
        db.close()
        print("DATABASE READY")
    
    def connect_init(self):
        load_dotenv()
        DATABASE_HOST = os.getenv('DATABASE_HOST')
        DATABASE_PORT = int(os.getenv('DATABASE_PORT'))
        DATABASE_DB = os.getenv('DATABASE_DB')
        DATABASE_USER = os.getenv('DATABASE_USER')
        DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
        db = pymysql.connect(
                host=DATABASE_HOST,
                port=DATABASE_PORT,
                user=DATABASE_USER,
                passwd=DATABASE_PASSWORD,
                charset='utf8mb4'
        )
        self.DATABASE_HOST = DATABASE_HOST
        self.DATABASE_PORT = DATABASE_PORT
        self.DATABASE_DB = DATABASE_DB
        self.DATABASE_USER = DATABASE_USER
        self.DATABASE_PASSWORD = DATABASE_PASSWORD
        return db

    def connect(self):
        load_dotenv()
        db = pymysql.connect(
                host=self.DATABASE_HOST,
                port=self.DATABASE_PORT,
                db=self.DATABASE_DB,
                user=self.DATABASE_USER,
                passwd=self.DATABASE_PASSWORD,
                charset='utf8mb4'
        )
        return db

    def make_string(self, type, iterable):
        string = '('
        if type == 'field':
            for i in iterable:
                string += i + ', '
        else:
            for i in iterable:
                string += '"'+ i + '", '
        string = string[:-2]
        string += ')'
        return string

    def insert_one(self, table, item):
        db = self.connect()
        cursor = db.cursor()
        field = item.keys()
        value = item.values()
        print(field, value)
        sql = f'''
            INSERT INTO {table}
            {self.make_string('field', field)}
            VALUES
            {self.make_string('value', value)};
        '''
        print(sql)
        cursor.execute(sql)
        res = cursor.fetchall()
        db.commit()
        db.close()
        return res

