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

        self.get_table_info()

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
                string += f'{i}, '
        else:
            for i in iterable:
                if isinstance(i, int):
                    string += f'{i}, '
                else:
                    string += f'"{i}", '
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
        table_info = {}
        tables = [x[0] for x in cursor.fetchall()]
        for table in tables:
            sql = f'''
                DESCRIBE {table};
            '''
            cursor.execute(sql)
            res = cursor.fetchall()
            field1 = [x[0] for x in res if x[3] != 'MUL' and x[4] == None and x[5] == '']
            field2 = [x[0] for x in res if x[3] == 'MUL']
            table_info[table] = (field1, field2)
        self.table_info = table_info
        db.close()
        return table_info

    def create_list(self, list_item):
        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            SELECT * FROM list
            WHERE name = "{list_item['name']}"
            OR href = "{list_item['href']}"
        '''
        cursor.execute(sql)
        res = cursor.fetchone()
        if res:
            print("Already exists list")
            return
        field = [*list_item.keys(), 'user_id']
        value = [*list_item.values(), self.user_id]
        sql = f'''
            INSERT INTO list
            {self.make_string('field', field)}
            VALUES
            {self.make_string('value', value)};
        '''
        cursor.execute(sql)
        db.commit()
        db.close()
        self.list_id = cursor.lastrowid
        return self.list_id
    
    def get_list_id(self, list_name):
        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            SELECT id FROM list
            WHERE name = "{list_name}"
        '''
        cursor.execute(sql)
        res = cursor.fetchone()
        db.close()
        self.list_id = res[0]
        return self.list_id

    def update_songs(self, BGM_data):
        db = self.connect()
        cursor = db.cursor()

        total_BGM = [y for x in BGM_data.values() for y in x['items']]
        total_BGM = list(dict.fromkeys(total_BGM))

        sql = f'''
            SELECT href FROM song
        '''
        cursor.execute(sql)
        check = [x[0] for x in cursor.fetchall()]
        insert = [x for x in total_BGM if x[2] not in check]
        deleted = [x for x in check if x not in [y[2] for y in total_BGM]]

        print(insert, deleted)

        for song in insert:
            sql = f'''
                INSERT INTO song
                (name, uploader, href)
                VALUES
                {song};
            '''
            cursor.execute(sql)

        for song in deleted:
            sql = f'''
                UPDATE song
                SET deleted = 1
                WHERE href = "{song[2]}"
            '''
            cursor.execute(sql)


        db.commit()
        db.close()
