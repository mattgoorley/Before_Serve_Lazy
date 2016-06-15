#!/usr/bin/python
activate_this = '/var/www/Before_Serve_Lazy/env/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/Before_Serve_Lazy/")

from Before_Serve_Lazy import app_front as application
application.secret_key = 'its_a_secret'
