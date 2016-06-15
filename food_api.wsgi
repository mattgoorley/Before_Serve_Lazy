#!/usr/bin/python
activate_this = '/var/www/Before_Serve_Lazy/env/bin/activate_this.py'
with open(activate_this) as file_:
  exec(file_.read(), dict(__file__=activate_this))

import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/Before_Serve_Lazy/")

from food_api import food_api as application
application.secret_key = 'its_a_secret'
