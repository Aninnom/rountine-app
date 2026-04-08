from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://rountine-app.vercel.app"
                   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RoutineCreate(BaseModel):
    name: str

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

# 루틴 삭제
@app.delete("/routines/{routine_id}")
def delete_routine(routine_id: int, db: Session = Depends(get_db)):
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    db.delete(routine)
    db.commit()
    return {"message": "삭제 완료"}

# 루틴 완료 체크
@app.patch("/routines/{routine_id}")
def toggle_routine(routine_id: int, db: Session = Depends(get_db)):
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    routine.done = not routine.done
    db.commit()
    db.refresh(routine)
    return routine