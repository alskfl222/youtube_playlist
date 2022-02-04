from Crawling import Crawling
from Database import Database

crawl = Crawling()
BGM_data = crawl.get_BGM_data()

DB = Database('alskfl')
DB.update_song(BGM_data)
DB.update_list(BGM_data)
DB.update_song_list(BGM_data)