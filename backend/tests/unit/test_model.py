import pytest
from datetime import datetime
from app.models.users import User
from app.models.organizations import Organization
from app.models.events import Event
from app.models.participations import Participation
from app.models.badges import Badge
from app.models.user_badges import UserBadge

# test for user model
@pytest.fixture(scope="module")
def new_user():
    """Fixture that returns a new User instance"""
    data = {
        "id": "userId",
        "name": "Eugene",
        "email": "eugene@example.com",
        "username": "yugene",
        "phone_number": 712345678,
        "password": "secret123",
        "role": "organization"  
    }

    user = User(
        id = data.get("id"),
        name=data.get("name"),
        email=data.get("email"),
        username=data.get("username"),
        phone_number=data.get("phone_number"),
        role=data.get("role")
    )
    user.set_password(data.get("password"))
    return user


def test_new_user_fields(new_user):
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the name, email, username, phone_number, password, and role fields are defined correctly
    """
    assert new_user.name == "Eugene"
    assert new_user.email == "eugene@example.com"
    assert new_user.username == "yugene"
    assert new_user.phone_number == 712345678
    assert new_user.role == "organization"
    assert new_user.password != "secret123"  # this passowrd should be the hashed one
    assert new_user.check_password("secret123")

# test for org model
@pytest.fixture(scope="module")
def new_organization(new_user):
    """Fixture that returns a new Organization instance linked to the user"""
    org = Organization(
        owner_id=new_user.id,
        name="TechAid Foundation",
        description="A nonprofit organization focused on volunteer-driven community projects.",
        contact_email="contact@techaid.org",
        website="https://techaid.org",
        address="Nairobi, Kenya",
        phone="+254712345678",
        
    )
    return org


def test_new_organization_fields(new_organization, new_user):
    """
    GIVEN an Organization model
    WHEN a new Organization is created
    THEN check that all fields are defined correctly
    """
    org = new_organization
    assert org.owner_id == new_user.id
    assert org.name == "TechAid Foundation"
    assert org.description.startswith("A nonprofit organization")
    assert org.contact_email == "contact@techaid.org"
    assert org.website == "https://techaid.org"
    assert org.address == "Nairobi, Kenya"
    assert org.phone == "+254712345678"
   

    assert str(org) == "<Organization TechAid Foundation>"


def test_organization_user_relationship(new_organization):
    """
    GIVEN an Organization model related to a User
    WHEN accessing the owner relationship
    THEN it should link correctly (mocked)
    """

    assert hasattr(new_organization, "owner_id")
    assert new_organization.owner_id is not None
