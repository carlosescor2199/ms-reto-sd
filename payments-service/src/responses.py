import json

class Resp:

    def __init__(self, data):
        self.__dict__ = json.loads(data)