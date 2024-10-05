import os
import re
import sqlite3
from datetime import datetime
from subprocess import check_output, CalledProcessError
import logging
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Get the directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Set the path to CHANGELOG.md relative to the script location
changelog_path = os.path.join(script_dir, 'CHANGELOG.md')

def get_current_version() -> str:
    """
    Retrieve the current version from the CHANGELOG.md file.
    
    Returns:
        str: The current version number or "0.0.0" if not found.
    """
    try:
        with open(changelog_path, 'r') as f:
            content = f.read()
            match = re.search(r'## \[(\d+\.\d+\.\d+)\]', content)
            if match:
                version = match.group(1)
                logger.info(f"Current version found: {version}")
                return version
    except FileNotFoundError:
        logger.warning(f"CHANGELOG.md not found at {changelog_path}. A new one will be created.")
    except Exception as e:
        logger.error(f"Error reading CHANGELOG.md: {e}")
    
    logger.info("Defaulting to version 0.0.0")
    return "0.0.0"

def increment_version(version: str) -> str:
    """
    Increment the patch number of the given version.
    
    Args:
        version (str): The current version number.
    
    Returns:
        str: The incremented version number.
    """
    try:
        major, minor, patch = map(int, version.split('.'))
        new_version = f"{major}.{minor}.{patch + 1}"
        logger.info(f"Incremented version from {version} to {new_version}")
        return new_version
    except ValueError:
        logger.error(f"Invalid version format: {version}")
        return "0.0.1"

def get_commit_messages() -> List[str]:
    """
    Retrieve commit messages since the last version tag.
    
    Returns:
        List[str]: A list of commit messages.
    """
    try:
        current_version = get_current_version()
        logger.info(f"Fetching commit messages since version: {current_version}")

        all_tags = check_output(['git', 'tag']).decode().strip().split('\n')
        logger.debug(f"All tags: {all_tags}")

        if all_tags:
            if current_version in all_tags:
                logger.info(f"Found tag for version {current_version}")
                last_version_hash = check_output(['git', 'rev-list', '-n', '1', current_version]).decode().strip()
            else:
                logger.warning(f"No tag found for version {current_version}. Using latest tag.")
                latest_tag = all_tags[-1]
                last_version_hash = check_output(['git', 'rev-list', '-n', '1', latest_tag]).decode().strip()
            
            commit_messages = check_output(['git', 'log', f'{last_version_hash}..HEAD', '--pretty=format:%s']).decode().split('\n')
        else:
            logger.warning("No tags found. Getting all commit messages.")
            commit_messages = check_output(['git', 'log', '--pretty=format:%s']).decode().split('\n')

        logger.info(f"Retrieved {len(commit_messages)} commit messages")
        return commit_messages
    except CalledProcessError as e:
        logger.error(f"Error getting commit messages: {e}")
        return ["Error retrieving commit messages"]

def update_changelog(new_version: str, commit_messages: List[str]) -> None:
    """
    Update the CHANGELOG.md file with the new version and commit messages.
    
    Args:
        new_version (str): The new version number.
        commit_messages (List[str]): List of commit messages to add.
    """
    today = datetime.now().strftime("%Y-%m-%d")
    new_entry = f"""## [{new_version}] - {today}

### Added
{format_commit_messages(commit_messages)}

"""
    try:
        if os.path.exists(changelog_path):
            with open(changelog_path, 'r+') as f:
                content = f.read()
                f.seek(0, 0)
                f.write(new_entry + content)
            logger.info(f"Updated existing CHANGELOG.md with version {new_version}")
        else:
            with open(changelog_path, 'w') as f:
                f.write(new_entry)
            logger.info(f"Created new CHANGELOG.md with version {new_version}")
    except IOError as e:
        logger.error(f"Error updating CHANGELOG.md: {e}")

def format_commit_messages(messages: List[str]) -> str:
    """
    Format commit messages for the changelog.
    
    Args:
        messages (List[str]): List of commit messages.
    
    Returns:
        str: Formatted commit messages.
    """
    return "\n".join(f"- {msg}" for msg in messages if msg.strip())

def main() -> None:
    """
    Main function to orchestrate the changelog update process.
    """
    try:
        current_version = get_current_version()
        logger.info(f"Current version: {current_version}")
        
        new_version = increment_version(current_version)
        logger.info(f"New version: {new_version}")
        
        commit_messages = get_commit_messages()
        logger.debug(f"Commit messages: {commit_messages[:5]}...")  # Log first 5 messages
        
        update_changelog(new_version, commit_messages)
        logger.info(f"CHANGELOG.md updated successfully with version {new_version}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()