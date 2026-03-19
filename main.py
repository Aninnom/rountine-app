from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RoutineCreate(BaseModel):
    name: str

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "루틴 나무 서버 작동 중"}

@app.get("/routines")
def get_routines(db: Session = Depends(get_db)):
    return db.query(models.Routine).all()

@app.post("/routines")
def add_routine(routine: RoutineCreate, db: Session = Depends(get_db)):
    db_routine = models.Routine(name=routine.name)
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine