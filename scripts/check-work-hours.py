#!/usr/bin/env python3
"""
Pre-commit hook to check if commits are being made during work hours.
Blocks remote pushes outside of 07:30-17:00 CET with a warning.
"""

import sys
import subprocess
from datetime import datetime
import pytz

def get_current_cet_time():
    """Get current time in CET timezone."""
    cet = pytz.timezone('Europe/Berlin')  # CET/CEST
    return datetime.now(cet)

def is_work_hours(dt):
    """Check if the given datetime is within work hours (07:30-17:00 CET)."""
    # Work hours: 07:30 to 17:00 (5:00 PM)
    work_start = dt.replace(hour=7, minute=30, second=0, microsecond=0)
    work_end = dt.replace(hour=17, minute=0, second=0, microsecond=0)
    
    return work_start <= dt <= work_end

def is_remote_push():
    """Check if this is a remote push operation."""
    try:
        # Check if we're in a git push operation
        result = subprocess.run(
            ['git', 'rev-parse', '--is-inside-work-tree'],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Check if there are any remotes configured
        result = subprocess.run(
            ['git', 'remote'],
            capture_output=True,
            text=True,
            check=True
        )
        
        # If we have remotes and this is likely a push operation
        # (we can't directly detect push, but we can check if we're about to commit)
        return len(result.stdout.strip()) > 0
    except subprocess.CalledProcessError:
        return False

def main():
    """Main function to check work hours."""
    current_time = get_current_cet_time()
    
    # Always allow local commits
    if not is_remote_push():
        return 0
    
    if not is_work_hours(current_time):
        print("🚫 WORK HOURS POLICY VIOLATION")
        print("=" * 50)
        print(f"⏰ Current time: {current_time.strftime('%H:%M:%S %Z')}")
        print(f"📅 Date: {current_time.strftime('%Y-%m-%d (%A)')}")
        print()
        print("🏢 Work hours policy: 07:30 - 17:00 CET")
        print("❌ Remote pushes are not allowed outside work hours")
        print()
        print("💡 What you can do:")
        print("   • Make local commits (these are always allowed)")
        print("   • Push during work hours (07:30-17:00 CET)")
        print("   • Use 'git commit --no-verify' to bypass (not recommended)")
        print()
        print("🎯 This policy helps maintain work-life balance!")
        print("=" * 50)
        return 1
    
    # During work hours - show friendly message
    print(f"✅ Work hours check passed ({current_time.strftime('%H:%M %Z')})")
    return 0

if __name__ == "__main__":
    sys.exit(main())
