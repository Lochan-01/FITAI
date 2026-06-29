from fastapi import APIRouter, HTTPException
from pymongo.errors import ServerSelectionTimeoutError
from app.schemas import UserRegister, UserLogin
from app.database import users
from app.utils import hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(user: UserRegister):
    try:
        existing = await users.find_one(
            {"email": user.email}
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        await users.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password)
        })

        return {
            "message": "Registration Successful"
        }
    except ServerSelectionTimeoutError as exc:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please try again later."
        ) from exc


@router.post("/login")
async def login(user: UserLogin):
    try:
        existing = await users.find_one({"email": user.email})

        if existing is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if not verify_password(
            user.password,
            existing["password"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Wrong Password"
            )

        return {
            "message": "Login Successful",
            "user": {
                "name": existing["name"],
                "email": existing["email"]
            }
        }
    except ServerSelectionTimeoutError as exc:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please try again later."
        ) from exc