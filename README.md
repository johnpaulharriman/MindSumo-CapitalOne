# johnpaulharriman.github.io (Deprecated with personal webiste)
For Capital One MindSumo Challenge

submission email: johnwpaulharriman@gmail.com

For Capital One MindSumo Challenge
Website Setup:

Login: The login page takes in two different inputs, username and password. A request is made to the api and if it returns successfully, it will change to the Main page.
Main page: All subscriptions are loaded immediately and display the most frequent posters based on my algorithm taking into account total frequency,  and frequency within the last month, the subscriptions with the highest gain of subscribers in one week, and other subscriptions that are randomly accessed.

Recommend page: The recommend page is similar to the main page in displaying information, but uses all user information to return recommended tags and podcasts based on the Pearson Correlation Coefficient. It also will display podcasts related to a user's most subscribed- to tags.

Search: The search page makes requests based on the search term the user provides. If a user sorts by relevance, the page will return what the api responds with. If a user sorts by popularity, it's by number of subscribers. If a user sorts by genre, then it will be based on the tags associated.

Important Algorithms/Functions:
Sorting: Most sorting was done in decreasing order based on certain aspect, e.g. subscribers, weights, etc. Since writing my own function would be inefficient compared to an already implemented one, I just used the built-in sort. My educated guess on complexity would be O(n log n) for time complexity.

Firebase: I wanted to be able to access all user info at a moment’s notice in order to perform the recommendation functions, and provide quicker results without having to send requests to the api on each load. The database holds detailed podcast info and user info  - which only includes tags as of now.

Proxy: Given the time constraints, I wanted to keep the API requests simple and my website lightweight and fast using github pages. I ran into some early difficulties processing the requests and found that requesting through a proxy server on a heroku app allowed me to make the request without the CORS problem a lot of other users seemed to be having.
Pearson Similarity and Recommendation system: The recommendation system is based on the Pearson correlation coefficient, which is a measure of linear correlation between two variables. I used the number of instances of a tag to gather the information. Complexity for the entire system is O (n^2).

Frequency: I sorted the frequency to show on the top of the main page in two different ways. One was based on the frequency the podcast upload based on the last month and the other was the total frequency of the podcast's lifetime. I assigned weights with a higher weight based on the last month's frequency and a less solower weight with the all- time frequency, assumingsince a users would probably looks at the website more than once a year. The complexity for these two algorithms are both O(n) where n is the number of episodes in a podcast.

Reflection/What to Improve On:

Given more time and resources, I would improve on a couple key aspects of the website. API requests take a significant amount of time in order for the page to load, but there isn't much that I can do to improve on that aspect other than handling my ajax requests differently. The UI/UX is not always ideal in it's appearance and I would like things to look more polished and complete. One of the biggest problems I had was creating my own database. In order for the recommendation function to work the best, it needs a lot more users than the two that I set up.
If I had more time, I would like to establish a neural network with the frequency rates being adjusted. I took a very human approach to the weights, but I know that it could be solved differently.


