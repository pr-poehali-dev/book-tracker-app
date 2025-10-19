'''
Business: Searches for book information on the internet using Open Library API
Args: event - dict with httpMethod, queryStringParameters (q=search query)
      context - object with request_id, function_name attributes
Returns: HTTP response with book data or error
'''

import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {})
    query = params.get('q', '').strip()
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Query parameter "q" is required'}),
            'isBase64Encoded': False
        }
    
    encoded_query = urllib.parse.quote(query)
    url = f'https://openlibrary.org/search.json?q={encoded_query}&limit=10'
    
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'BookLibrary/1.0')
    
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    books: List[Dict[str, Any]] = []
    for doc in data.get('docs', [])[:10]:
        book_info = {
            'title': doc.get('title', 'Без названия'),
            'author': ', '.join(doc.get('author_name', ['Автор неизвестен'])),
            'year': doc.get('first_publish_year'),
            'cover': f"https://covers.openlibrary.org/b/id/{doc.get('cover_i', '')}-L.jpg" if doc.get('cover_i') else None,
            'pages': doc.get('number_of_pages_median'),
            'isbn': doc.get('isbn', [None])[0] if doc.get('isbn') else None,
        }
        books.append(book_info)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'books': books, 'total': len(books)}),
        'isBase64Encoded': False
    }
