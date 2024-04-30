# from .userschema import user_schema
#
# message_schema = {
#     'sender': {
#         'type': 'String',
#         'ref': user_schema,
#         'required': True
#     },
#     'receiver': {
#         'type': 'String',
#         'ref': user_schema,
#         'required': True
#     },
#     'message': {
#         'type': 'String',
#     },
#     'file': {
#         'filename': {
#             'type': 'String',
#             'required': lambda x: x['file'] is not None
#         },
#         'filetype': {
#             'type': 'String',
#             'required': lambda x: x['file'] is not None
#         },
#         'fileurl': {
#             'type': 'String',
#             'required': lambda x: x['file'] is not None
#         }
#     },
#     'timestamps': True
# }
from .userschema import user_schema

message_schema = {
    'sender': {
        'type': 'String',
        'ref': user_schema,
    },
    'receiver': {
        'type': 'String',
        'ref': user_schema,
    },
    'message': {
        'type': 'String',
    },
    'file': {
        'type': 'dict',
        'schema': {
            'filename': {
                'type': 'String',
                'required': False
            },
            'filetype': {
                'type': 'String',
                'required': False
            },
            'fileurl': {
                'type': 'String',
                'required': False
            }
        },
        'required': False
    },
    'timestamps': True
}
