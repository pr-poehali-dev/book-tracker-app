import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для получения статистики чтения - общая статистика и по месяцам
    Args: event - dict с httpMethod, queryStringParameters
          context - object с атрибутами request_id, function_name
    Returns: HTTP response dict со статистикой чтения
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        cur.execute("""
            SELECT 
                COUNT(*) FILTER (WHERE status = 'read') as total_read,
                COUNT(*) FILTER (WHERE status = 'wishlist') as total_wishlist,
                COALESCE(SUM(pages) FILTER (WHERE status = 'read'), 0) as total_pages,
                COALESCE(AVG(rating) FILTER (WHERE rating IS NOT NULL), 0) as avg_rating
            FROM books
        """)
        
        overall_stats = cur.fetchone()
        
        cur.execute("""
            SELECT 
                EXTRACT(YEAR FROM created_at)::integer as year,
                EXTRACT(MONTH FROM created_at)::integer as month,
                COUNT(*)::integer as books_count,
                COALESCE(SUM(pages), 0)::integer as pages_count
            FROM books
            WHERE status = 'read'
            GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
            ORDER BY year DESC, month DESC
            LIMIT 12
        """)
        
        monthly_stats = cur.fetchall()
        
        cur.close()
        conn.close()
        
        result = {
            'overall': dict(overall_stats),
            'monthly': [dict(stat) for stat in monthly_stats]
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }