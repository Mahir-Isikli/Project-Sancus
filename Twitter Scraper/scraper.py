import snscrape.modules.twitter as sntwitter
import pandas as pd
import re as re

# Created a list to append all tweet attributes(data)
attributes_container = []

# Using TwitterSearchScraper to scrape data and append tweets to list
for i,tweet in enumerate(sntwitter.TwitterSearchScraper('from:elonmusk').get_items()):
    if i>1000:
        break
    text = re.sub("@[^\s]+","",tweet.rawContent).replace("\n","").replace("  "," ").replace("  "," ")
    if len(text) < 25: continue
    attributes_container.append(text)
    
# Creating a dataframe from the tweets list above 
tweets_df = pd.DataFrame(attributes_container, columns=["Tweets"])


tweets_df.to_csv('tweets_elon.csv', encoding='utf-8',index=False)