@echo off
echo Deploying to ConnectAlgo.com...
echo ---------------------------------
git add .
git commit -m "Update from Antigravity"
git push origin main
echo ---------------------------------
echo Success! Changes pushed to GitHub.
echo Vercel will automatically update your site in 1-2 minutes.
pause
