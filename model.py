'''
    Our Model class
    This should control the actual "logic" of your website
    And nicely abstracts away the program logic from your page loading
    It should exist as a separate layer to any database or data structure that you might be using
    Nothing here should be stateful, if it's stateful let the database handle it
'''
from sys import breakpointhook
from pandas import read_hdf
# from rsa import PublicKey
import view
import hashlib
import secrets


#db = sql.SQLDatabase("test.db")
#db.database_setup()

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
        err_str = "Incorrect Username or Password"
    else:

        with open('userDetails.txt') as f:

            username_database = f.readlines()
            for line in username_database:
                array = line.split(",")
                if array[0] == username: # Match in Username

                    salted_password = password + array[2].strip() # Entered Password + Previously Stored Salt
                    hashed_pwd = hashlib.sha256(salted_password.encode('utf-8')).hexdigest()

                    if array[1] == hashed_pwd: # Password Entered is Correct
                        return page_view("message", name=username)
                        
                else: # Password Entered is Incorrect or No Match in Username
                    err_str = "Incorrect Username or Password"

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
        return page_view("invalid", reason="Incorrect Length of Username or Password")
        # return handle_errors(reason="Incorrect Length of Username or Password")
        # return page_view("handle_errors", reason="Incorrect Length of Username or Password")
    elif usernameExists(username):
        return page_view("invalid", reason="Username Already Exists")
        # return handle_errors("Username Already Exists")
        # return page_view("handle_errors", reason="Username Already Exists")
    else:
        salt = secrets.token_hex(32)
        salted_string = password+salt
        hashed_pwd = hashlib.sha256(salted_string.encode('utf-8')).hexdigest()

        # Appending to .txt file
        user_info = open("userDetails.txt", "a")
        user_info.write(username + "," + hashed_pwd + "," + salt + "\n")
        user_info.close()

    return page_view("login")

def register_key_store(username, password, publicKey):
    # idea - this seperately writes the username and public key to a new file
    # since no 2 user can have the same username, it is unique and will respond the necessary key

    ## check username and password is not empty ##
    if ((len(username) <= 0) and (len(password) <= 0)):        
        return    
    user_keys = open("userKeys.txt", "a")
    user_keys.write(username + "," + publicKey)
    user_keys.close()
    return 

def get_user_key(username):
    user_keys = open("userKeys.txt", "r")
    totalFile = user_keys.readlines()
    user_keys.close()
    i = 0
    while i < len(totalFile):
        values = totalFile[i].split(",")
        if values[0] == username:
            pk = totalFile[i+1].rstrip() + totalFile[i+2].rstrip() + totalFile[i+3].rstrip() + totalFile[i+4].rstrip() + totalFile[i+5].rstrip() + totalFile[i+6].rstrip() + totalFile[i+7].rstrip()
            break
    i+=10
    return {"PublicKey" : pk}

def store_encrypted_msg(message):
    if len(message) == 0:
        return page_view("invalid", reason="Cannot send message of zero length")
    else:
        msgFile = open("AliceBob.txt", "a")
        msgFile.write(message+"\n")
        msgFile.close()
    
    return page_view("message")


def return_encrypted_msg():
    # get the last appended message from the file 
    msgFile = open("AliceBob.txt", "r")
    messageArray = msgFile.readlines()
    msgFile.close()
    size = len(messageArray)
    lastMessage = messageArray[size-1]
    secondLast = messageArray[size-2]
    encryptedData = {'lastmsg': lastMessage, 'secondlast': secondLast}
    return encryptedData

def usernameExists(username):
    with open('userDetails.txt') as f:
        username_database = f.readlines()
        for line in username_database:
            array = line.split(",")
            if array[0] == username: # Match in Username 
                return True
    return False


#-----------------------------------------------------------------------------
# Salt Generator
#-----------------------------------------------------------------------------

# def salt():
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
    return page_view("about")

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

#-----------------------------------------------------------------------------
# Message
#-----------------------------------------------------------------------------

def store_message(message):
    '''
        message
        Returns the view for the message page
    '''
    if len(message) == 0:
        return page_view("invalid", reason="Cannot send message of zero length")
    else:
        ABConvo = open("AliceBob.txt", "a")
        ABConvo.write(message + "\n")
        ABConvo.close()
        return page_view("message")