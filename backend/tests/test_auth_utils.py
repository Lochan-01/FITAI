from app.utils import hash_password, verify_password


def test_hash_and_verify_long_password():
    password = "a" * 100
    hashed = hash_password(password)

    assert hashed is not None
    assert verify_password(password, hashed)
