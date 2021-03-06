# Improved harmony search alghoritm online
> Modification of an existing desktop application to run it as a web service.

## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Libraries](#libraries)
* [Setup](#setup)
* [Features](#features)
* [Documentation](#documentation)
* [TODO](#todo)
* [Development](#development)
* [Status](#status)
* [Contact](#contact)

## General info
This service was created in order to learn new technology and gaining new experiences in front-end field. 

## Screenshots
<p align="center">
  <img src = "https://i.postimg.cc/Wpgs2nXc/Screenshot-1.png" width=350>
  <img src = "https://i.postimg.cc/4xNGQTZX/Screenshot-2.png" width=350>
  <img src = "https://i.postimg.cc/Qxqs7d26/Screenshot-3.png" width=350>
  <img src = "https://i.postimg.cc/VkG87HLn/Screenshot-4.png" width=350>
</p>
<p align="center">
  <img src = "https://i.postimg.cc/J0vXcQHL/Screenshot-5.png" width=200>
</p>

## Technologies
### Frontend
- JavaScript
- HTML
- CSS
- Vue.js - version 2.6.11
- Vuetify.js - version 2.3.8
### Backend
- Python - version 3.8.5
- Doxygen - version 1.8.20

## Libraries
### Frontend
- Vuex - version 3.5.1
- Vuelidate - version 0.7.5
- Vue Router - version 3.3.4
- Vue Plotly - version 1.0.0
- <del>Brotli Compression</del>
### Backend
- Flask - version 1.1.2
- Flask API - version 2.0
- Flask-CORS - version 3.0.8
- Numpy - version 1.19.1
- Waitress - version 1.4.4

## Setup
* Clone this repository `git clone https://github.com/albertlis/Improved-harmony-search-algorithm-online`
### Frontend
To run this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:
```bash
# Go into the repository
$ cd Improved-harmony-search-algorithm-online

# Install dependencies
$ npm install

# Run the app
$ npm start
```
### Backend
To run this application, you'll need [Python](https://www.python.org/downloads/) installed on your computer.
* Install Virtual Environment: `pip install virtualenv'
* Create Virtual Environment: `python -m venv venv-name`
* Activate Virtual Environment:
  - On Unix or MacOS, run: `source venv-name/bin/activate`
  - On Windows run: `venv-name\Scripts\activate.bat`
* Install necessary [libraries](#libraries): `pip install -r requirements.txt`
* Run application: `python main.py`

## Features
### Frontend
- Allow the user to select a parameters of algorithm
- Check the correctness of the data
- Show errors hints
- Make interactive contour plot
- Mobile support
- <del>Optimize page loading time</del>
### Backend
- Check if the introduced function is semantically correct
- Parse arguments from function and client
- Calculate minimum of function using improved harmony search algorithm
- Log basic informations like trace, number of iterations etc.
- Send JSON response with appropriate information and status code

## Documentation
#### Status: _in progress_
[Docs](https://albertlis.github.io/Improved-harmony-search-algorithm-online/)

## TODO
- Write unit tests
- Write a code documentation
- Write API documentation
- Move backend service from AWS EC2 instance to AWS Lambda

## Development
Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

* Fork the repo
* Create a new branch (`git checkout -b improve-feature`)
* Make the appropriate changes in the files
* Verify if they are correct
* Make Doxygen docstrings
* Generate Doxygen documentation (inside doc folder: `doxygen Doxyfile`)
* Add changes to reflect the changes made
* Commit changes
* Push to the branch (`git push origin improve-feature`)
* Create a Pull Request

## Status
Project is: _in progress_

## Contact
albert.lis.1996@gmail.com - feel free to contact me!
