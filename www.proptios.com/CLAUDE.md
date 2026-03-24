# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing/landing page for ProptiOS built with Hugo static site generator.

## Commands

```bash
hugo server        # Local development server
hugo               # Build static site (outputs to public/)
```

## Architecture

```
content/           # Markdown content pages
themes/aplio/      # Hugo theme
data/              # Data files for templates
layouts/           # Custom layout overrides
static/            # Static assets
archetypes/        # Content templates
```

## Configuration

- **Base URL**: https://proptios.com/
- **Theme**: aplio
- **Hugo version**: 0.145.0 (minimum 0.116.0)
- **Styling**: Tailwind CSS 3.4.7

## Deployment

Deployed via Vercel with Hugo build integration. Configuration in `vercel.json`.

## Related Services

- **Dashboard**: app.proptios.com
- **API**: api.pm.proptios.com
