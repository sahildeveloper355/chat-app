user_schema = {
    '$jsonSchema': {
        'bsonType': 'object',
        'required': ['firstname', 'lastname', 'email', 'username', 'password'],
        'properties': {
            'firstname': {
                'bsonType': 'string',
                'required': True,
                'maxLength': 10,
            },
            'lastname': {
                'bsonType': 'string',
                'required': True,
                'maxLength': 10,
            },
            'email': {
                'bsonType': 'string',
                'required': True,
                'uniqueItems': True
            },
            'username': {
                'bsonType': 'string',
                'required': True,
                'uniqueItems': True
            },
            'password': {
                'bsonType': 'string',
                'required': True,
                'maxLength': 10,

            },
        }
    }
}
