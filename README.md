![banner](https://i.imgur.com/y0WEtMM.png)
# Porko Meeting Platform 
* Run an interactive meeting, focus group or quiz
* Collect user responses, reactions and commentaries
* Access summary & analytics on past meetings
* Easily add new event using built-in constructor
* Manage existing events
### [TRY NOW](https://cerealsdwarf.online/)

## Quick Start 

1. [Enter the website](https://cerealsdwarf.online/)
2. Click "I AM HOST"
3. Under the event title ('Expert opinion on AI' ) click "Run" 
4. Click button "START", copy meeting url and share it to viewers
5. Control the question display using buttons in the bottom left part of UI 
6. Click "User profile" (navigation bar) and explore meeting's
data using "Details" and "Summary" buttons 

Host screen | Viewer screen
:-------------------------:|:-------------------------:
![host-control-panel](https://i.imgur.com/3C5d0WW.gif) | ![viewer-screen](https://i.imgur.com/5fwAg0y.gif)

## Website test tutorial

#### Test accounts with data:
| Login         | Password      | 
| ------------- |:-------------:| 
| host@mail.com | 123456   | 
| host2@mail.com| 123456   |
| host3@mail.com| 123456   |

+ Recommended to invite at least two users to test host-viewer interaction
+ Bigger number of viewers, responses and reactions is highly advised for more accurate presentation of Porko's usability  
+ Since the test account is shared among multiple users, its 
meeting data might be erased or altered by another user 
+ For more complete experience, tester can register new account and add own event - access will be restricted to this user only

## Structure Chart

![structure](https://i.imgur.com/wPmJ1DP.png)

* Server-side logic is written in Node.js including such packages/frameworks as: 
  * Express 
  * Socket.IO
  * Mongoose
  * jsonwebtoken
* Online meeting usability is mostly performed through the WebSocket protocol, including screen sharing, viewer comments exchange, reactions and bot actions
* Data is stored in document format and sent into MongoDB Atlas. The input format is controlled on two levels: TypeScript interfaces used for the client-side and Mongoose schemas
* Text data, such as commentaries and meeting questions, is processed using Python libraries.
  * Python code is executed as a child process only upon certain events. It loads DB records, process them and stores the result in the DB as well. Later it can be accessed by a specific API call
  * Server accepts and processes both English and traditional Chinese characters. The input is cleansed and filtered using jieba, stopwordsiso, pandas and numpy. In some cases, translated into English and back to Chinese using deep_translator package
  * WordCloud keywords represent the most frequently used words in viewers' commentaries for a given meeting and avaible on the meeting dashboard
  * Meeting keywords are derived using pre-trained Spacy model (en_core_web_md) that evaluates word's weight according to its semantics
* User profile and host control panel are protected from unauthorized usage. Private webpages can be accessed only by passing auth context (React). Sensitive operations, such as meeting deletion, are followed by extra layer of authorization.  
![preview](https://i.imgur.com/fiWqrlx.png)
* The client-side is developed with React, allowing webpage content to dynamically re-render upon updates, minimizing refreshes and enhancing the user experience