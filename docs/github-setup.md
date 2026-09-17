# GitHub setup

The repository is ready for GitHub and includes CI at `.github/workflows/ci.yml`. Do not commit `.env` files, API keys, access tokens, database volumes, `node_modules`, build output or virtual environments.

## Option A: GitHub CLI

Run these commands from the `khetha-ai-platform` directory:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initialise Khetha AI DHET platform"
gh auth login
gh repo create khetha-ai-platform --private --source=. --remote=origin --push
```

Change `--private` to `--public` only after DHET content, licensing and secrets have been reviewed.

## Option B: existing empty GitHub repository

Create an empty repository in GitHub without a generated README, then run:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initialise Khetha AI DHET platform"
git remote add origin https://github.com/YOUR-ORGANISATION/khetha-ai-platform.git
git push -u origin main
```

## Team workflow

```bash
git switch -c feature/short-description
# make and test the change
git add .
git commit -m "feat: describe the change"
git push -u origin feature/short-description
```

Open a pull request into `main`. The included CI checks the FastAPI tests, Python imports, TypeScript types and Android Expo export.

## Before public release

- Choose and add a software licence with the project owner.
- Replace demo catalogue records with authorised, versioned NCAP/DHET content.
- Configure branch protection and require CI approval.
- Store deployment secrets in GitHub Environments or the approved government secret manager.
- Enable dependency and secret scanning.
