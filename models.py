from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Routine(Base):
    __tablename__ = "routines"

    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String)
    done    = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # 누구의 루틴인지