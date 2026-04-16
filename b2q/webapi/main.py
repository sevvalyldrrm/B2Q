from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "B2Q çalışıyor 🚀"}