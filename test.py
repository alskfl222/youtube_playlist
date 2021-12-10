import os
import time
# import datetime
import multiprocessing
# import pymysql

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
os.environ['WDM_LOG_LEVEL'] = '0'
YOUTUBE_CHANNEL = '날림v'

def init_driver():
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    options.add_argument("--log-level=3")
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_window_size(1280, 1024)
    return driver

def infinite_scroll(driver, SCROLL_PAUSE_TIME=2):
    time.sleep(SCROLL_PAUSE_TIME)

    while True:
        last_height = driver.execute_script("return document.documentElement.scrollHeight")
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")

        time.sleep(SCROLL_PAUSE_TIME)

        new_height = driver.execute_script("return document.documentElement.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

def get_BGM_lists(YOUTUBE_CHANNEL):
    driver = init_driver()
    driver.get(f'https://www.youtube.com/c/{YOUTUBE_CHANNEL}/playlists?view=1&sort=dd&shelf_id=0')
    infinite_scroll(driver)

    playlists = driver.find_elements(By.CSS_SELECTOR, '#items > ytd-grid-playlist-renderer')
    BGM_lists_info = [x.find_element(By.CSS_SELECTOR, '#video-title') for x in playlists
                if any(word in x.find_element(By.CSS_SELECTOR, '#video-title').text for word in ['BGM'])]

    BGM_lists = { x.text: x.get_attribute("href").split('=')[-1] for x in BGM_lists_info }
    driver.quit()

    return { k: v for k, v in sorted(BGM_lists.items(), key=lambda item: item[0])}

def get_list_items(BGM_list):
    total = []
    driver = init_driver()
    driver.get('https://www.youtube.com/playlist?list='+BGM_list[1])
    infinite_scroll(driver)

    videos = driver.find_elements(By.CSS_SELECTOR, '#meta')[:-1]
    rows = [(x.text.split("\n")[0],
            x.text.split("\n")[1],
            x.find_element(By.CSS_SELECTOR, '#video-title').get_attribute("href").split('&')[0].split('=')[1])
            for x in videos]
    total.extend(rows)
    driver.quit()
    return total

def get_BGM_data(BGM_lists, workers=8):
    p = multiprocessing.Pool(workers)
    BGM_total = []
    works = p.imap_async(get_list_items, BGM_lists.items())
    BGM_total = works.get()
    p.close()
    p.join()
    
    # return total_BGM