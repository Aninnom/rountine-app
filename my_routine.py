import json

class Routine:
    def __init__(self, name : str, category : str, target_days : int = 21):
        self.name           = name
        self.done           = False
        self.streak         = 0
        self.category       = category
        self.target_days    = target_days
        

    def complete(self):
        self.done   = True
        self.streak += 1
        print(f"✅ '{self.name}' 완료! 연속 {self.streak}일")

    def to_dict(self) -> dict:
        return {
            "name" : self.name,
            "category" : self.category,
            "done" : self.done,
            "streak" : self.streak,
            "target_days" : self.target_days,
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        r = cls(data["name"], data["category"], data["target_days"])
        r.done = data["done"]
        r.streak = data["streak"]
        return r

    def days_left(self):
        return self.target_days - self.streak
        
    def __str__(self):
        status = "✔︎" if self.done else "◯"
        return f"[{status}] {self.name} ({self.streak}/{self.target_days}일)"

class WeeklyRoutine(Routine):
    def __init__(self, name, category, active_days: list):
        super().__init__(name, category)
        self.active_days = active_days
    
    def is_today_active(self, today: str) -> bool:
        return today in self.active_days
    
def save_routines(routines: list, path: str = "routines.json"):
    data = [r.to_dict() for r in routines]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"{len(routines)}개 루틴 저장 완료")

def load_routines(path: str = "routines.json") -> list:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return [Routine.from_dict(d) for d in data]
    except FileNotFoundError:
        print("저장된 루틴이 없어요. 새로 시작할게요!")
        return []
 
# 매 실행 시작할 때 — 새로 만들지 말고 파일에서 불러오기
routines = load_routines()  # 파일 있으면 불러오고, 없으면 빈 리스트

# 파일이 없는 첫 실행 때만 새로 추가
if not routines:
    routines.append(Routine("아침 러닝 30분", "운동"))

routines[0].complete()
save_routines(routines)  # 완료 후 다시 저장

print(routines[0].streak)
