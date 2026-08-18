# Clears the Turbopack dev cache and restarts the dev server.
# The "module factory is not available" error is a stale-chunk problem:
# many files changed while the dev server was running, so the browser is
# holding chunk references that no longer exist.
Write-Host "==> Stopping any running dev server on this project" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -and $_.Path -like "*node*" } |
    ForEach-Object {
        try { $_.CloseMainWindow() | Out-Null } catch {}
    }

Write-Host "==> Removing .next" -ForegroundColor Cyan
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".next"

Write-Host "==> Starting dev server" -ForegroundColor Cyan
Write-Host "    Then hard-reload the browser: Ctrl+Shift+R" -ForegroundColor Yellow
npm run dev
