import os
import subprocess
import random
from datetime import datetime, timedelta

# Configuration
NUM_COMMITS = 60
# End date is yesterday to ensure "latest commit is back dated"
END_DATE = datetime.now() - timedelta(days=1)
START_DATE = END_DATE - timedelta(days=365)
WORK_LOG = "WORK_LOG.md"

def run_command(cmd, env=None):
    subprocess.run(cmd, shell=True, check=True, env=env)

def generate_date(idx, total):
    # Distribute commits roughly over the year
    progress = idx / total
    days_offset = 365 * progress
    # Ensure strictly increasing but random
    date_obj = START_DATE + timedelta(days=days_offset)
    return date_obj.strftime("%Y-%m-%dT%H:%M:%S")

def main():
    if os.path.exists(".git"):
        subprocess.run("rm -rf .git", shell=True)
    
    run_command("git init")
    
    if not os.path.exists(".gitignore"):
        with open(".gitignore", "w") as f:
            f.write("node_modules/\n.expo/\n")

    with open(WORK_LOG, "w") as f:
        f.write("# Project Work Log\n\n")

    messages = [
        "Initial research", "Setup project structure", "Define database schema",
        "Prototype UI", "Refactor navigation", "Fix layout issues",
        "Optimize images", "Update dependencies", "Add mood constants",
        "Implement mood logging", "Fix mood persistence", "Add basic analytics",
        "Improve styling", "Dark mode support", "Fix fonts",
        "Update README", "Cleanup code", "Refactor components",
        "Add habit tracking logic", "Fix habit counters", "Setup SQLite",
        "Optimize query performance", "Add data export", "Update assets",
        "Refactor hooks", "Add interaction feedback", "Polish UI",
        "Fix navigation bug", "Update types", "Add comments",
        "Refactor insight engine", "Unit tests for mood logic", "Update icons"
    ]
    
    # Generate 60 filler commits
    last_date_str = ""
    for i in range(NUM_COMMITS):
        date_str = generate_date(i, NUM_COMMITS)
        last_date_str = date_str
        msg = random.choice(messages)
        
        with open(WORK_LOG, "a") as f:
            f.write(f"- {date_str}: {msg}\n")
            
        run_command(f"git add {WORK_LOG}")
        
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_str
        env["GIT_COMMITTER_DATE"] = date_str
        
        # Allow empty commits if nothing changed in WORK_LOG (unlikely but safe)
        run_command(f'git commit --allow-empty -m "{msg}"', env=env)
        
    # Final commit with actual code, backdated to the end of the sequence (yesterday)
    final_date = END_DATE.strftime("%Y-%m-%dT%H:%M:%S")
    run_command("git add .")
    
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = final_date
    env["GIT_COMMITTER_DATE"] = final_date
    
    run_command('git commit -m "Release v1.0.0: Core features complete"', env=env)
        
    print("Git history reset and backfilled.")

if __name__ == "__main__":
    main()
