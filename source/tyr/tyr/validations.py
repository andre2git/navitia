from __future__ import absolute_import, print_function, unicode_literals, division
from datetime import datetime
import geojson
import json
import flask_restful

def datetime_format(value):
    """Parse a valid looking date in the format YYYYmmddTHHmmss"""

    return datetime.strptime(value, "%Y%m%dT%H%M%SZ")
