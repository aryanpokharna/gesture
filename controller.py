'''
    This file will handle our typical Bottle requests and responses 
    You should not have anything beyond basic page loads, handling forms and 
    maybe some simple program logic
'''

from bottle import route, get, post, error, request, static_file

import model
import hashlib

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

    if ((len(username) <= 0) or (len(password) <= 0)):
        pass # error: incorrect details
    else:
        # Call the appropriate method
        salt = 'QxLUF1bgIAdeQX'
        salted_string = password+salt
        hashed_pwd = hashlib.sha256(salted_string.encode('utf-8')).hexdigest()
        return model.login_check(username, hashed_pwd)
    return model.handle_errors("incorrect details")



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
    salt = 'QxLUF1bgIAdeQX'
    username = request.forms.get('username')
    password = request.forms.get('password')
<<<<<<< HEAD
    # password needs to be hashed and salted from front-end js file 
    
    # Call the appropriate method
    return model.register_check(username, password)
=======

    # Front-End Username & Password Requirement Checking
    if (len(username) <= 0) and (len(password) <= 0):
        pass # error: incorrect details
    else:
        salted_string = password+salt
        hashed_pwd = hashlib.sha256(salted_string.encode('utf-8')).hexdigest()

        # Call the appropriate method
        return model.register_store(username, hashed_pwd, salt)

    return model.handle_errors("incorrect details")
>>>>>>> 6caab9d16b10991f1c4a2499077ce5ff4613bf54

#-----------------------------------------------------------------------------

@get('/message')
def get_message():
    '''
        get_message
        
        Serves the message page
    '''
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
