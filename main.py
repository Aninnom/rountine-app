from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from passlib.context import CryptContext
from jose import jwt
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://rountine-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 비밀번호 암호화 설정
pwd_context = CryptContext(schemes=["bcrypt"])

# JWT 설정
SECRET_KEY = "루틴나무시크릿키"
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 입력 데이터 형태
class UserCreate(BaseModel):
    username: str
    password: str

class RoutineCreate(BaseModel):
    name: str

# 회원가입
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디예요")
    hashed_pw = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, password=hashed_pw)
    db.add(db_user)
    db.commit()
    return {"message": "회원가입 완료"}

# 로그인
@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 틀렸어요")
    token = jwt.encode({"user_id": db_user.id}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}

# 토큰에서 유저 꺼내기
def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("user_id")
    return db.query(models.User).filter(models.User.id == user_id).first()

# 루틴 조회 — 내 루틴만
@app.get("/routines")
def get_routines(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    return db.query(models.Routine).filter(models.Routine.user_id == user.id).all()

# 루틴 추가
@app.post("/routines")
def add_routine(routine: RoutineCreate, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    db_routine = models.Routine(name=routine.name, user_id=user.id)
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