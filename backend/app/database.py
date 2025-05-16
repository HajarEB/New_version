from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from core.security import hash_password
from core.encryption import hash_lookup, encrypt


# Database setup
DATABASE_URL = "sqlite:///./hospital.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# create admin-user when database is initialized
def create_admin_user():
    from models.user import User
    from models.admin import Admin

    db: Session = SessionLocal()

    admin_user = db.query(User).filter(User.username_hash == hash_lookup('admin')).first()
    
    if not admin_user:
        username = 'admin'
        phone_number = '+212000000000'
        email = 'admin@admin.com'
        role = 'admin'
        new_user = User(
            username = encrypt(username),
            username_hash = hash_lookup(username),
            
            first_name = encrypt("Default"),
            last_name = encrypt("Admin"),
            
            hashed_password =  hash_password("admin"),
            
            phone_number =  encrypt(phone_number),
            phone_number_hash = hash_lookup(phone_number),
            
            email = encrypt(email),
            email_hash = hash_lookup(email),
            
            role = encrypt(role),
            role_hash = hash_lookup(role),
            
            is_valid = True
        )
        db.add(new_user)
        db.flush()

        new_admin = Admin(
            user_id = new_user.user_id,
            is_admin = True
        )
        db.add(new_admin)
        db.commit()
    db.close()

# Initialize database
def init_db():
    Base.metadata.create_all(bind=engine)  # Create tables
    create_admin_user()  # Ensure admin user exists
    
