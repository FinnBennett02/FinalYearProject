import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app import app
from backend.db.database import Base, get_db

# Use a separate in-memory SQLite database for tests
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)


def test_register_new_user():
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["username"] == "testuser"


def test_register_duplicate_email():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    })
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "differentuser",
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_valid_credentials():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
