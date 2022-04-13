'''
    Our Model class
    This should control the actual "logic" of your website
    And nicely abstracts away the program logic from your page loading
    It should exist as a separate layer to any database or data structure that you might be using
    Nothing here should be stateful, if it's stateful let the database handle it
'''
from sys import breakpointhook
from pandas import read_hdf
import view
import random # For Salt Generation
import sql
import hashlib
import secrets


db = sql.SQLDatabase("test.db")
db.database_setup()

# Initialise our views, all arguments are defaults for the template
page_view = view.View()

#-----------------------------------------------------------------------------
# Index
#-----------------------------------------------------------------------------

def index():
    '''
        index
        Returns the view for the index
    '''
    return page_view("index")

#-----------------------------------------------------------------------------
# Login
#-----------------------------------------------------------------------------

def login_form():
    '''
        login_form
        Returns the view for the login_form
    '''
    return page_view("login")

#-----------------------------------------------------------------------------

# Check the login credentials
def login_check(username, password):
    '''
        login_check
        Checks usernames and passwords

        :: username :: The username
        :: password :: The password

        Returns either a view for valid credentials, or a view for invalid credentials
    '''

    err_str = "temporary error"


    if ((len(username) <= 0) or (len(password) <= 0)):
        err_str = "Incorrect Password"
    else:

        with open('userDetails.txt') as f:

            username_database = f.readlines()
            for line in username_database:
                array = line.split(",")
                if array[0] == username: # Match

                    # Hash entered Password + Salt
                    salted_password = password + array[2].strip()
                    hashed_pwd = hashlib.sha256(salted_password.encode('utf-8')).hexdigest()

                    if array[1] == hashed_pwd: # Correct Password
                        return page_view("message", name=username)
                    else:
                        err_str = "Incorrect Password"
                else:
                    err_str = "Incorrect Username"

    return page_view("invalid", reason=err_str)

#-----------------------------------------------------------------------------
# Register
#-----------------------------------------------------------------------------

def register_form():
    '''
        register_form
        Returns the view for the register_form
    '''
    return page_view("register")

#-----------------------------------------------------------------------------

# Check the register credentials and add them to the txt file if valid
def register_store(username, password):
    '''
        register_store
        Store usernames, hashed passwords and salt, which are valid entries 

        :: username :: The username
        :: password :: The password password

        Returns either a view for valid credentials, or a view for invalid credentials
    '''
    
    # Front-End Username & Password Requirement Checking
    if (len(username) <= 0) and (len(password) <= 0):
        return page_view("handle_errors", reason="incorrect details")
    else:
        salt = secrets.token_hex(32)
        salted_string = password+salt
        hashed_pwd = hashlib.sha256(salted_string.encode('utf-8')).hexdigest()

        # Appending to .txt file
        user_info = open("userDetails.txt", "a")
        user_info.write(username + "," + hashed_pwd + "," + salt + "\n")
        user_info.close()

    return page_view("login")

#-----------------------------------------------------------------------------
# Salt Generator
#-----------------------------------------------------------------------------

# def salt():
#     # ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
#     # salt = ''.join(random.choice(ALPHABET) for i in range(256))
#     salt = secrets.token_hex(32)
#     return salt

#-----------------------------------------------------------------------------
# About
#-----------------------------------------------------------------------------

def about():
    '''
        about
        Returns the view for the about page
    '''
    return page_view("about", "yeahnahnahyeah")



# # Returns a random string each time
# def about_garble():
#     '''
#         about_garble
#         Returns one of several strings for the about page
#     '''
#     garble = ["leverage agile frameworks to provide a robust synopsis for high level overviews.", 
#     "iterate approaches to corporate strategy and foster collaborative thinking to further the overall value proposition.",
#     "organically grow the holistic world view of disruptive innovation via workplace change management and empowerment.",
#     "bring to the table win-win survival strategies to ensure proactive and progressive competitive domination.",
#     "ensure the end of the day advancement, a new normal that has evolved from epistemic management approaches and is on the runway towards a streamlined cloud solution.",
#     "provide user generated content in real-time will have multiple touchpoints for offshoring."]
#     return garble[random.randint(0, len(garble) - 1)]

#-----------------------------------------------------------------------------
# Debug
#-----------------------------------------------------------------------------

def debug(cmd):
    try:
        return str(eval(cmd))
    except:
        pass


#-----------------------------------------------------------------------------
# 404
# Custom 404 error page
#-----------------------------------------------------------------------------

def handle_errors(error):
    error_type = error.status_line
    error_msg = error.body
    return page_view("error", error_type=error_type, error_msg=error_msg)

#-----------------------------------------------------------------------------
# Message
#-----------------------------------------------------------------------------

def message():
    '''
        message
        Returns the view for the message page
    '''
    return page_view("message")