from Crawling import Crawling
from Database import Database

crawl = Crawling("날림v")
DB = Database('alskfl')

check = DB.check_log()
if check:
  print("ALREADY UPDATED")

else:
  BGM_data = crawl.get_BGM_data()
  DB.update_song(BGM_data)
  DB.update_list(BGM_data)
  DB.update_song_list(BGM_data)
  DB.record_log()
