"""
Seed script to create badges in the database.
Run this once to populate the badges table.
"""
from app.app import create_app
from app.config.database import db
from app.models.badges import Badge
from datetime import datetime, timezone

def seed_badges():
    app = create_app()
    
    with app.app_context():
        # Define badges to create
        badges_data = [
            {
                "name": "Beginner",
                "description": "Earned after completing 10 volunteer hours. First steps in your volunteering journey.",
                "criteria": "10 hours",
                "image_url": "/images/badges/beginner.png"
            },
            {
                "name": "Novice",
                "description": "Earned after completing 50 volunteer hours. You're getting the hang of it!",
                "criteria": "50 hours",
                "image_url": "/images/badges/novice.png"
            },
            {
                "name": "Changemaker",
                "description": "Earned after completing 75 volunteer hours. Making a real difference in your community.",
                "criteria": "75 hours",
                "image_url": "/images/badges/changemaker.png"
            },
            {
                "name": "Skillful Intern",
                "description": "Earned after completing 100 volunteer hours. You've become a skilled volunteer.",
                "criteria": "100 hours",
                "image_url": "/images/badges/skillful-intern.png"
            },
            {
                "name": "Expert Intern",
                "description": "Earned after completing 300 volunteer hours. You're an expert at making an impact.",
                "criteria": "300 hours",
                "image_url": "/images/badges/expert-intern.png"
            },
            {
                "name": "Elite Intern",
                "description": "Earned after completing 450 volunteer hours. You've reached the elite level of volunteering.",
                "criteria": "450 hours",
                "image_url": "/images/badges/elite-intern.png"
            },
        ]
        
        # Check if badges already exist
        existing_badges = Badge.query.all()
        if existing_badges:
            print(f"Found {len(existing_badges)} existing badges. Skipping seed.")
            return
        
        # Create badges
        created_count = 0
        for badge_data in badges_data:
            # Check if badge with this name already exists
            existing = Badge.query.filter_by(name=badge_data["name"]).first()
            if existing:
                print(f"Badge '{badge_data['name']}' already exists. Skipping.")
                continue
            
            badge = Badge(
                name=badge_data["name"],
                description=badge_data["description"],
                criteria=badge_data["criteria"],
                image_url=badge_data["image_url"]
            )
            db.session.add(badge)
            created_count += 1
            print(f"Created badge: {badge_data['name']}")
        
        db.session.commit()
        print(f"\n✅ Successfully created {created_count} badges!")

if __name__ == "__main__":
    seed_badges()

