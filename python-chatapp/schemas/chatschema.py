from .userschema import user_schema
from .messageschema import message_schema
chat_schema = {
    'messages': {
     'message': {
         'type': str,
         'ref': message_schema,
     },
    'sender': {
        'type': 'ObjectId',
        'ref': user_schema,
    },
    'receiver': {
        'type': 'ObjectId',
        'ref': user_schema,
    }
    }
}
