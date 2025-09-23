#!/usr/bin/env python3
"""
Pre-push hook to check if pushes are being made during work hours.
Blocks remote pushes outside of 07:30-17:00 CET.

This script is intended to be used as a pre-push git hook.
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

def main():
    """Main function to check work hours."""
    current_time = get_current_cet_time()
    
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
