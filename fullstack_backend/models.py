from pydantic import BaseModel
from typing import Optional

class UserIn(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str

class EnergyData(BaseModel):
    timestamp: str
    source: str
    consumption: float
    generation: float