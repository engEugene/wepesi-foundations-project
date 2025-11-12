from app.config.database import db
from app.models.badges import Badge
from app.models.user_badges import UserBadge
from app.models.users import User

def check_and_award_badges(user):
    """
    Check user's total volunteer hours and award badges accordingly.
    Badges are cumulative - user gets all badges they qualify for.
    """
    # Convert total_volunteer_hours to float for comparison
    total_hours = float(user.total_volunteer_hours) if user.total_volunteer_hours else 0
    
    # Define badge thresholds
    badge_thresholds = [
        {"name": "Beginner", "hours": 10},
        {"name": "Novice", "hours": 50},
        {"name": "Changemaker", "hours": 75},
        {"name": "Skillful Intern", "hours": 100},
        {"name": "Expert Intern", "hours": 300},
        {"name": "Elite Intern", "hours": 450},
    ]
    
    # Check each badge threshold
    for badge_info in badge_thresholds:
        if total_hours >= badge_info["hours"]:
            # Find the badge by name
            badge = Badge.query.filter_by(name=badge_info["name"]).first()
            
            if not badge:
                # Badge doesn't exist yet (should be created by seed script)
                continue
            
            # Check if user already has this badge
            existing_user_badge = UserBadge.query.filter_by(
                user_id=user.id,
                badge_id=badge.id
            ).first()
            
            # If user doesn't have this badge, award it
            if not existing_user_badge:
                user_badge = UserBadge(
                    user_id=user.id,
                    badge_id=badge.id
                )
                db.session.add(user_badge)
    
    # Commit all new badges
    db.session.commit()

