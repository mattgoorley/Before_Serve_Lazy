import os

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,'app_front.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir,'db_repository')

SECRET_KEY = 'its_a_secret'

WTF_CSRF_ENABLED = False
