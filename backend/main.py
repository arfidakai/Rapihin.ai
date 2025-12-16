from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn
import os
from datetime import datetime, timedelta
from pathlib import Path
import shutil

# Import our custom modules
from app.document_formatter import DocumentFormatter
from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import (
    create_user, get_user_by_email, save_format_history, get_user_history
)

app = FastAPI(
    title="Rapihin.ai API",
    description="API for automatic thesis and academic document formatting",
    version="1.0.0"
)

# CORS configuration
dev_ports = [
    os.getenv("FRONTEND_PORT", "5173"),
    "5174",  # common alternate when 5173 is busy
    "3000",
]
allowed_origins = set()
for port in dev_ports:
    allowed_origins.add(f"http://localhost:{port}")
    allowed_origins.add(f"http://127.0.0.1:{port}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Rapihin.ai API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Authentication endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserRegister):
    """Register a new user"""
    # Check if user already exists
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = hash_password(user.password)
    new_user = create_user(user.email, hashed_password, user.full_name)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "full_name": new_user["full_name"]
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    """Login user"""
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "email": db_user["email"],
            "full_name": db_user["full_name"]
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"]
    }

# Document formatting endpoint
@app.post("/format-docx/")
async def format_document(
    file: UploadFile = File(...),
    document_type: str = Form("Academic Papers"),
    university: str = Form("National Standard"),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Upload and format a Word document according to academic standards.
    
    - **file**: The .doc or .docx file to format
    - **document_type**: Type of document (Academic Papers, Thesis, Internship Report, Dissertation)
    - **university**: University template (National Standard, ITB, UI, UGM)
    """
    
    # Validate file type
    if not (file.filename.endswith('.doc') or file.filename.endswith('.docx')):
        raise HTTPException(status_code=400, detail="Only .doc or .docx files are allowed")
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    original_filename = file.filename
    input_filename = f"{timestamp}_{original_filename}"
    input_path = UPLOAD_DIR / input_filename
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Format document
        formatter = DocumentFormatter()
        output_path = formatter.format_document(
            input_path=str(input_path),
            document_type=document_type,
            university=university
        )
        
        # Save to history if user is logged in
        if current_user:
            save_format_history(
                user_id=current_user["id"],
                original_filename=original_filename,
                document_type=document_type,
                university=university
            )
        
        # Return formatted file
        return FileResponse(
            path=output_path,
            filename=f"formatted_{original_filename}",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            background=None
        )
    
    except Exception as e:
        # Clean up files on error
        if input_path.exists():
            input_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error formatting document: {str(e)}")
    
    finally:
        # Clean up input file after processing
        if input_path.exists():
            try:
                input_path.unlink()
            except:
                pass

# History endpoint
@app.get("/api/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    """Get user's formatting history"""
    history = get_user_history(current_user["id"])
    return {"history": history}

# Template info endpoint
@app.get("/api/templates")
async def get_templates():
    """Get available templates and document types"""
    return {
        "document_types": [
            "Academic Papers",
            "Thesis",
            "Internship Report",
            "Dissertation"
        ],
        "universities": [
            {
                "name": "National Standard",
                "description": "Standard formatting for Indonesian academic documents"
            },
            {
                "name": "ITB",
                "description": "Institut Teknologi Bandung template"
            },
            {
                "name": "UI",
                "description": "Universitas Indonesia template"
            },
            {
                "name": "UGM",
                "description": "Universitas Gadjah Mada template"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
