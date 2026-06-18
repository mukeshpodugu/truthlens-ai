from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.schemas import User, UserCreate, UserLogin, UserResponse, Token, ActivityLog

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
        
    hashed_password = get_password_hash(user_in.password)
    
    # First user gets Admin role
    user_count = db.query(User).count()
    role = "admin" if user_count == 0 else "user"
    
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        role=role,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Activity Log
    log = ActivityLog(user_id=db_user.id, action=f"User registered with role: {role}")
    db.add(log)
    db.commit()
    
    return db_user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    
    # Activity Log
    log = ActivityLog(user_id=user.id, action="User logged in successfully")
    db.add(log)
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    
    # Simulated email sending
    log = ActivityLog(user_id=user.id, action="Password reset requested")
    db.add(log)
    db.commit()
    
    return {"status": "success", "message": f"Password reset email sent to {email} (Simulated)"}

@router.post("/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
        
    log = ActivityLog(user_id=user.id, action="Email verification completed")
    db.add(log)
    db.commit()
    
    return {"status": "success", "message": f"Email {email} verified successfully (Simulated)"}
