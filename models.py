from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Routine(Base):
    __tablename__ = "routines"

    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String)
    done    = Column(Boolean, default=False)