from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from auth import authenticate_user, create_access_token, get_current_user
from models import User, UserIn, EnergyData, Token
from database import users_db, energy_data_db

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=User)
def register(user: UserIn):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    users_db[user.username] = {
        "username": user.username,
        "hashed_password": user.password,
    }
    return User(username=user.username)

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")

@app.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/energy", response_model=EnergyData)
def submit_energy_data(data: EnergyData, user: User = Depends(get_current_user)):
    energy_data_db.append(data)
    return data

@app.get("/energy", response_model=list[EnergyData])
def get_energy_data(user: User = Depends(get_current_user)):
    return energy_data_db