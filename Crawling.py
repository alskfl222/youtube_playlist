import os
import time

import multiprocessing
# import pymysql

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
os.environ['WDM_LOG_LEVEL'] = '0'
YOUTUBE_CHANNEL = '날림v'

class Crawling():
    def __init__(self):
        YOUTUBE_CHANNEL = input()
        self.YOUTUBE_CHANNEL = YOUTUBE_CHANNEL

    def init_driver(self):
        service = Service(ChromeDriverManager().install())
        options = webdriver.ChromeOptions()
        options.add_argument("headless")
        options.add_argument("--log-level=3")
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_window_size(1280, 1024)
        return driver

    def infinite_scroll(self, driver, SCROLL_PAUSE_TIME=2):
        time.sleep(SCROLL_PAUSE_TIME)

        while True:
            last_height = driver.execute_script("return document.documentElement.scrollHeight")
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")

            time.sleep(SCROLL_PAUSE_TIME)

            new_height = driver.execute_script("return document.documentElement.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    def get_BGM_lists(self):
        driver = self.init_driver()
        driver.get(f'https://www.youtube.com/c/{self.YOUTUBE_CHANNEL}/playlists?view=1&sort=dd&shelf_id=0')
        self.infinite_scroll(driver)

        playlists = driver.find_elements(By.CSS_SELECTOR, '#items > ytd-grid-playlist-renderer')
        BGM_lists_info = [x.find_element(By.CSS_SELECTOR, '#video-title') for x in playlists
                    if any(word in x.find_element(By.CSS_SELECTOR, '#video-title').text for word in ['BGM'])]

        BGM_lists = { x.text: x.get_attribute("href").split('=')[-1] for x in BGM_lists_info }
        print(f"FIND {len(BGM_lists.keys())} lists in {self.YOUTUBE_CHANNEL} CHANNEL")
        driver.quit()

        return { k: v for k, v in sorted(BGM_lists.items(), key=lambda item: item[0])}

    def get_list_items(self, BGM_list):
        items = []
        driver = self.init_driver()
        driver.get('https://www.youtube.com/playlist?list='+BGM_list[1])
        self.infinite_scroll(driver)

        videos = driver.find_elements(By.CSS_SELECTOR, '#meta')[:-1]
        rows = [(x.text.split("\n")[0],
                x.text.split("\n")[1],
                x.find_element(By.CSS_SELECTOR, '#video-title').get_attribute("href").split('&')[0].split('=')[1])
                for x in videos]
        items.extend(rows)
        driver.quit()
        return items

    def get_BGM_data(self, workers=8):
        print("START crawling")
        start = time.time()
        BGM_lists = self.get_BGM_lists()
        p = multiprocessing.Pool(workers)
        works = p.map_async(self.get_list_items, BGM_lists.items())
        BGM_items = works.get()
        p.close()
        p.join()
        print("END crawling")
        BGM_data = { k : {'href' : v1, 'items': v2 } for k, v1, v2 
                    in zip(BGM_lists.keys(), BGM_lists.values(), BGM_items)}
        end = time.time()
        print(f"GET BGM Data from {self.YOUTUBE_CHANNEL} CHANNEL in {'{:.2f}s'.format(end - start)}")
        return BGM_data
