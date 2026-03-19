from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "루틴 나무 서버 작동 중"}

@app.get("/routines")
def get_routines():
    return ["아침 조깅", "독서", "물 마시기"]