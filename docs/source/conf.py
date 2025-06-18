"""Sphinx configuration for project documentation."""

import os
import sys
from datetime import datetime

# Add project to path
sys.path.insert(0, os.path.abspath("../../src"))

# Project information
project = "8760"
copyright = f"{datetime.now().year}, forkrul"
author = "forkrul"
release = "0.1.0"

# Extensions
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "sphinx.ext.intersphinx",
    "sphinx_autodoc_typehints",
    "sphinxcontrib.mermaid",
    "myst_parser",
]

# Mermaid configuration
mermaid_version = "10.6.1"
mermaid_init_js = """
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    themeVariables: {
        primaryColor: '#1f77b4',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7C0000',
        lineColor: '#F8B229',
        secondaryColor: '#006100',
        tertiaryColor: '#fff'
    }
});
"""

# MyST configuration
myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "tasklist",
]

# Autodoc configuration
autodoc_default_options = {
    "members": True,
    "member-order": "bysource",
    "special-members": "__init__",
    "undoc-members": True,
    "show-inheritance": True,
}

# Theme
html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "navigation_depth": 4,
    "collapse_navigation": False,
}

# Source suffix
source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}
