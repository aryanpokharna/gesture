'''
    This file will handle our typical Bottle requests and responses 
    You should not have anything beyond basic page loads, handling forms and 
    maybe some simple program logic
'''

# from turtle import pos
from unicodedata import name
from bottle import route, get, post, error, request, static_file, BaseRequest
import json

from flask import jsonify

import model

#-----------------------------------------------------------------------------
# Static file paths
#-----------------------------------------------------------------------------

# Allow image loading
@route('/img/<picture:path>')
def serve_pictures(picture):
    '''
        serve_pictures

        Serves images from static/img/

        :: picture :: A path to the requested picture

        Returns a static file object containing the requested picture
    '''
    return static_file(picture, root='static/img/')

#-----------------------------------------------------------------------------

# Allow CSS
@route('/css/<css:path>')
def serve_css(css):
    '''
        serve_css

        Serves css from static/css/

        :: css :: A path to the requested css

        Returns a static file object containing the requested css
    '''
    return static_file(css, root='static/css/')

#-----------------------------------------------------------------------------

# Allow javascript
@route('/js/<js:path>')
def serve_js(js):
    '''
        serve_js

        Serves js from static/js/

        :: js :: A path to the requested javascript

        Returns a static file object containing the requested javascript
    '''
    return static_file(js, root='static/js/')


@post('/endpoint')
def myEndpoint():
    pubKey = request.json.get('pubKey')
    username = request.json.get('username')
    password = request.json.get('password')
    return model.register_key_store(username, password, pubKey)

@get('/userKey/<username>')
def returnUserKey(username):
    return model.get_user_key(username)


@post('/encryptMessage')
def encryptEndpoint():
    # msg = request.json.get('message')
    encryptmsg = request.json.get('encrypt_message')
    #sessionKey = request.json.get('sessionKey')
    # print(msg, encryptmsg, "testing") ## -> after "encryptmsg" is not none any more, we would just store it to a .txt file on server
    #parsing through msg instead of encrypted msg just for now 
    # because encrypted msg is none 
    return model.store_encrypted_msg(encryptmsg)

@get('/decryptMessage')
def decryptEndpoint():
    data = model.return_encrypted_msg()
    #data = {'lastmsg' : encryptedMsg1, 'secondlast': encryptedMsg2}
    return data

#-----------------------------------------------------------------------------
# Pages
#-----------------------------------------------------------------------------

# Redirect to login
@get('/')
@get('/home')
def get_index():
    '''
        get_index
        
        Serves the index page
    '''
    return model.index()

#-----------------------------------------------------------------------------

# Display the login page
@get('/login')
def get_login_controller():
    '''
        get_login
        
        Serves the login page
    '''
    return model.login_form()

#-----------------------------------------------------------------------------

# Attempt the login
@post('/login')
def post_login():
    '''
        post_login
        
        Handles login attempts
        Expects a form containing 'username' and 'password' fields
    '''

    # Handle the form processing
    username = request.forms.get('username')
    password = request.forms.get('password')
    
    return model.login_check(username, password)

    # return model.handle_errors("incorrect details")



#-----------------------------------------------------------------------------

# Display the Register page
@get('/register')
def get_register_controller():
    '''
        get_register
        
        Serves the register page
    '''
    return model.register_form()

#-----------------------------------------------------------------------------

# Attempt the register
@post('/register')
def post_register():
    '''
        post_register
        
        Handles login attempts
        Expects a form containing 'username' and 'password' fields
    '''

    # Handle the form processing
    username = request.forms.get('username')
    password = request.forms.get('password')
    
    return model.register_store(username, password)


#-----------------------------------------------------------------------------

@get('/message')
def get_message():
    '''
        get_message
        
        Serves the message page
    '''
    return model.message()

#-----------------------------------------------------------------------------
@post('/message')
def post_message():
    '''
        post_message
        
        Handles message attempts.
    '''
    # Handle the form processing
    message = request.forms.get('message')
    return model.message()


#-----------------------------------------------------------------------------

@get('/about')
def get_about():
    '''
        get_about
        
        Serves the about page
    '''
    return model.about()
#-----------------------------------------------------------------------------

# Help with debugging
@post('/debug/<cmd:path>')
def post_debug(cmd):
    return model.debug(cmd)

#-----------------------------------------------------------------------------

# 404 errors, use the same trick for other types of errors
@error(404)
def error(error): 
    return model.handle_errors(error)
