"""
Database Module
Simple JSON-based database for user management and history
For production, replace with PostgreSQL, MongoDB, etc.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, List

# Database file paths
DB_DIR = Path("database")
DB_DIR.mkdir(exist_ok=True)
USERS_DB = DB_DIR / "users.json"
HISTORY_DB = DB_DIR / "history.json"

# Initialize database files if they don't exist
if not USERS_DB.exists():
    with open(USERS_DB, 'w') as f:
        json.dump([], f)

if not HISTORY_DB.exists():
    with open(HISTORY_DB, 'w') as f:
        json.dump([], f)

def load_users() -> List[dict]:
    """Load users from database"""
    with open(USERS_DB, 'r') as f:
        return json.load(f)

def save_users(users: List[dict]):
    """Save users to database"""
    with open(USERS_DB, 'w') as f:
        json.dump(users, f, indent=2)

def load_history() -> List[dict]:
    """Load history from database"""
    with open(HISTORY_DB, 'r') as f:
        return json.load(f)

def save_history_data(history: List[dict]):
    """Save history to database"""
    with open(HISTORY_DB, 'w') as f:
        json.dump(history, f, indent=2)

# User operations
def create_user(email: str, hashed_password: str, full_name: str) -> dict:
    """Create a new user"""
    users = load_users()
    
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password": hashed_password,
        "full_name": full_name,
        "created_at": datetime.utcnow().isoformat()
    }
    
    users.append(user)
    save_users(users)
    
    return user

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email"""
    users = load_users()
    for user in users:
        if user["email"] == email:
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID"""
    users = load_users()
    for user in users:
        if user["id"] == user_id:
            return user
    return None

# History operations
def save_format_history(user_id: str, original_filename: str, document_type: str, university: str):
    """Save formatting history for a user"""
    history = load_history()
    
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "original_filename": original_filename,
        "document_type": document_type,
        "university": university,
        "formatted_at": datetime.utcnow().isoformat()
    }
    
    history.append(entry)
    save_history_data(history)
    
    return entry

def get_user_history(user_id: str, limit: int = 50) -> List[dict]:
    """Get formatting history for a user"""
    history = load_history()
    
    user_history = [
        entry for entry in history
        if entry["user_id"] == user_id
    ]
    
    # Sort by date (newest first)
    user_history.sort(key=lambda x: x["formatted_at"], reverse=True)
    
    return user_history[:limit]
