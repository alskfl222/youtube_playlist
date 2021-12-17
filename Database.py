import os
import pymysql
from dotenv import load_dotenv

class Database():
    def __init__(self, user):
        db = self.connect_init()
        cursor = db.cursor()

        with open("schema.sql", 'r') as f:
            sqls = [x for x in f.read().split(";") if x != '']

        for sql in sqls:
            cursor.execute(sql)

        user_id_sql = f'''
            SELECT * FROM user
            WHERE name = "{user}";
        '''
        cursor.execute(user_id_sql)
        res = cursor.fetchone()
        self.user_id = res[0]

        db.commit()
        db.close()

        print("DATABASE READY")
        print(f"USER : {user}")
    
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

    def get_table_info(self):
        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            SHOW tables;
        '''
        cursor.execute(sql)
        info = {}
        tables = [x[0] for x in cursor.fetchall()]
        for table in tables:
            sql = f'''
                DESCRIBE {table};
            '''
            cursor.execute(sql)
            res = cursor.fetchall()
            field1 = [x[0] for x in res if x[3] != 'MUL' and x[4] == None and x[5] == '']
            field2 = [x[0] for x in res if x[3] == 'MUL']
            info[table] = (field1, field2)
        print(info)
        db.commit()
        db.close()

    def insert_one(self, table, item):
        db = self.connect()
        cursor = db.cursor()
        field = item.keys()
        value = item.values()
        sql = f'''
            INSERT INTO {table}
            {self.make_string('field', field)}
            VALUES
            {self.make_string('value', value)};
        '''
        cursor.execute(sql)
        res = cursor.fetchall()
        db.commit()
        db.close()
        return res

    def insert_many(self, table, list):
        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            DESCRIBE {table};
        '''
        cursor.execute(sql)
        res = cursor.fetchall()
        field1 = [x[0] for x in res if x[3] != 'MUL' and x[4] == None and x[5] == '']
        field2 = [x[0] for x in res if x[3] == 'MUL']
        print(field1, field2)
        # for item in list:
        #     field = item.keys()
        #     value = item.values()
        #     sql = f'''
        #         INSERT INTO {table}
        #         {self.make_string('field', field)}
        #         VALUES
        #         {self.make_string('value', value)};
        #     '''
        #     cursor.execute(sql)
        # res = cursor.fetchall()
        db.commit()
        db.close()
        # return res