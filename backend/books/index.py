import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления книгами - получение, добавление, обновление книг
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с атрибутами request_id, function_name
    Returns: HTTP response dict с книгами или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        status_filter = event.get('queryStringParameters', {}).get('status') if event.get('queryStringParameters') else None
        
        if status_filter:
            cur.execute("SELECT * FROM books WHERE status = %s ORDER BY created_at DESC", (status_filter,))
        else:
            cur.execute("SELECT * FROM books ORDER BY created_at DESC")
        
        books = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps([dict(book) for book in books], default=str),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        title = body_data.get('title')
        author = body_data.get('author')
        status = body_data.get('status', 'wishlist')
        cover_url = body_data.get('cover_url')
        year = body_data.get('year')
        pages = body_data.get('pages')
        rating = body_data.get('rating')
        
        cur.execute(
            """
            INSERT INTO books (title, author, status, cover_url, year, pages, rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (title, author, status, cover_url, year, pages, rating)
        )
        
        new_book = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(dict(new_book), default=str),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        book_id = body_data.get('id')
        
        cur.execute(
            """
            UPDATE books 
            SET title = %s, author = %s, status = %s, cover_url = %s, 
                year = %s, pages = %s, rating = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
            """,
            (body_data.get('title'), body_data.get('author'), body_data.get('status'),
             body_data.get('cover_url'), body_data.get('year'), body_data.get('pages'),
             body_data.get('rating'), book_id)
        )
        
        updated_book = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(dict(updated_book) if updated_book else {}, default=str),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        book_id = params.get('id') if params else None
        
        cur.execute("DELETE FROM books WHERE id = %s", (book_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Book deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
