# ============================================================
#  Rewrite the commit author/committer email to your GitHub
#  address and re-push, so Vercel will build the deployment.
#
#  Run from the project root:   .\fix-commit-email.ps1
# ============================================================

$Email = "sandunhmadhushan@gmail.com"
$Name  = "Sandun Madhushan"

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $GitArgs)
    Write-Host "  git $($GitArgs -join ' ')" -ForegroundColor DarkGray
    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "git failed (exit $LASTEXITCODE). Stopping." -ForegroundColor Red
        exit 1
    }
}

Write-Host "==> 1/5  Clearing stale git locks" -ForegroundColor Cyan
Remove-Item -Force -ErrorAction SilentlyContinue ".git\index.lock"
Get-ChildItem ".git\objects" -Recurse -Filter "tmp_obj_*" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "==> 2/5  Setting your real identity (global + this repo)" -ForegroundColor Cyan
Invoke-Git config --global user.name  $Name
Invoke-Git config --global user.email $Email
Invoke-Git config user.name  $Name
Invoke-Git config user.email $Email

Write-Host "==> 3/5  Rewriting the commit's author and committer" -ForegroundColor Cyan
# --reset-author rewrites BOTH author and committer to the config identity.
$env:GIT_COMMITTER_NAME  = $Name
$env:GIT_COMMITTER_EMAIL = $Email
Invoke-Git commit --amend --reset-author --no-edit

Write-Host "==> 4/5  Verifying" -ForegroundColor Cyan
$author = & git log -1 --pretty='%ae'
$committer = & git log -1 --pretty='%ce'
Write-Host "     author:    $author"
Write-Host "     committer: $committer"
if ($author -ne $Email -or $committer -ne $Email) {
    Write-Host "Email still wrong. Stopping before push." -ForegroundColor Red
    exit 1
}
Write-Host "     both correct" -ForegroundColor Green

Write-Host "==> 5/5  Force-pushing the corrected commit" -ForegroundColor Cyan
# Safe force: refuses if someone else pushed in the meantime.
Invoke-Git push --force-with-lease new-origin master

Write-Host ""
Write-Host "Done. Vercel should now pick up the new commit and build." -ForegroundColor Green
& git log -1 --pretty='%h  %an <%ae>%n%s'
