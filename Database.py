import os
import pymysql
from dotenv import load_dotenv

class Database():
    def __init__(self, user_name):
        db = self.connect_init()
        cursor = db.cursor()

        with open("schema.sql", 'r') as f:
            sqls = [x for x in f.read().split(";") if x != '']

        for sql in sqls:
            cursor.execute(sql)

        self.user_id = self.get_user_id(user_name)

        db.commit()
        db.close()

        print("DATABASE READY")
        print(f"USER : {user_name}")
    
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
    
    def get_user_id(self, user_name):
        db = self.connect()
        cursor = db.cursor()
        user_id_sql = f'''
            SELECT id FROM user
            WHERE name = "{user_name}";
        '''
        cursor.execute(user_id_sql)
        res = cursor.fetchone()
        if not res:
            sql = f'''
                INSERT INTO user
                (name, email)
                VALUES
                ("{user_name}", "{user_name}@test.com")
            '''
            cursor.execute(sql)
            db.commit()
            return cursor.lastrowid
        db.close()
        return res[0]

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
        return res[0]

    def get_song_id(self, song_href):
        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            SELECT id FROM song
            WHERE href = "{song_href}"
        '''
        cursor.execute(sql)
        res = cursor.fetchone()
        db.close()
        return res[0]

    def update_song(self, BGM_data):
        db = self.connect()
        cursor = db.cursor()

        total_BGM = [y for x in BGM_data.values() for y in x['items']]
        total_BGM = list(dict.fromkeys(total_BGM))
        print(f"Crawled BGM count: {len(total_BGM)}")

        sql = f'''
            SELECT href FROM song
        '''
        cursor.execute(sql)
        check = [x[0] for x in cursor.fetchall()]
        insert = [x for x in total_BGM if x[2] not in check]
        deleted = [x for x in check if x not in [y[2] for y in total_BGM]]
        print(f"Before BGM count: {len(check)}")
        print(f"New BGM count: {len(insert)}")
        print(f"Deleted BGM count: {len(deleted)}")

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
        print("Table song updated")
        print("=======================")

    def update_list(self, BGM_data):
        keys = (k for k in BGM_data.keys())
        values = (v['href'] for v in BGM_data.values())
        print(f"Crawled list count: {len(BGM_data.keys())}")
        list_items = list(zip(keys, values))

        db = self.connect()
        cursor = db.cursor()
        sql = f'''
            SELECT name, href FROM list
        '''
        cursor.execute(sql)
        exist = [(x[0], x[1]) for x in cursor.fetchall()]
        insert = [(x[0], x[1]) for x in list_items if x[1] not in [y[1] for y in exist]]
        deleted = [x for x in exist if x[1] not in [y[1] for y in list_items]]

        insert_count = 0
        for item in insert:
            sql = f'''
                INSERT INTO list
                (name, href, user_id)
                VALUES
                ("{item[0]}", "{item[1]}", {self.user_id});
            '''
            print(f"{item[0]} ({item[1]}): inserted")
            cursor.execute(sql)    
            insert_count += 1
        
        deleted_count = 0
        for item in deleted:
            sql = f'''
                UPDATE list
                SET deleted = 1
                WHERE href = "{item[1]}"
                AND deleted = 0
            '''
            print(f"{item[0]} ({item[1]}): deleted")
            cursor.execute(sql)
            deleted_count += 1

        db.commit()
        db.close()  
        print(f"Inserted list count: {insert_count}")
        print(f"Deleted list count: {deleted_count}")
        print("Table list updated")
        print("=======================")

    def update_song_list(self, BGM_data):
        for list in BGM_data.keys():
            list_id = self.get_list_id(list)
            crawled_songs = [x[2] for x in BGM_data[list]['items']]
            db = self.connect()
            cursor = db.cursor()
            sql = f'''
                SELECT song.href FROM song_list
                JOIN song ON song_list.song_id = song.id
                JOIN list ON song_list.list_id = list.id
                WHERE list.id = {list_id}
            '''
            cursor.execute(sql)
            exist_songs = [x[0] for x in cursor.fetchall()]
            insert_songs = [x for x in crawled_songs if x not in exist_songs]
            print(f"{list} : {len(insert_songs)} songs added")
            for song_href in insert_songs:
                song_id = self.get_song_id(song_href)
                print(song_id, list_id)
                sql = f'''
                    INSERT INTO song_list
                    (song_id, list_id)
                    VALUES
                    ({song_id}, {list_id});
                '''
                cursor.execute(sql)
            db.commit()
            db.close()
