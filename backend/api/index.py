import os
import sys

# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(__file__))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import FastAPI app
from app import app

# Export for Vercel
__all__ = ["app"]
