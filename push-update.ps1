# Commit the current work and push it to the new repo.
$ErrorActionPreference = "Continue"

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $GitArgs)
    Write-Host "  git $($GitArgs -join ' ')" -ForegroundColor DarkGray
    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "git failed (exit $LASTEXITCODE). Stopping." -ForegroundColor Red
        exit 1
    }
}

Remove-Item -Force -ErrorAction SilentlyContinue ".git\index.lock"
Get-ChildItem ".git\objects" -Recurse -Filter "tmp_obj_*" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

Invoke-Git config user.name  "Sandun Madhushan"
Invoke-Git config user.email "sandunhmadhushan@gmail.com"
Invoke-Git add -A

$staged = (& git diff --cached --name-only | Measure-Object -Line).Lines
if ($staged -eq 0) { Write-Host "Nothing to commit." -ForegroundColor Yellow; exit 0 }
Write-Host "  $staged file(s) staged" -ForegroundColor Green

$msg = @"
Fix cursor/nav positioning bug, remove text-reveal skew, redesign footer + projects

Nav / custom cursor
- The page-transition wrapper (PageFade, a framer-motion div) animates y and
  scale, which keeps a non-none transform on it at all times. Any
  position:fixed descendant of a transformed ancestor is contained by that
  ancestor instead of the viewport -- and SiteNav's fixed header was
  rendered inside PageFade on every page, so the header was never truly
  viewport-fixed. Moved <SiteNav /> outside <PageFade> on all six pages
  (home, about, contact, projects, project detail, skills) so it is a
  sibling of the transformed wrapper, not a descendant.
- Rebuilt the custom cursor as a "Viewfinder": idle crosshair inside four
  corner brackets that snap onto whatever is hovered. The native cursor is
  only hidden after the reticle is confirmed drawn on first pointermove, so
  a failure path can never leave zero visible cursor.

Text reveal
- Removed the skewY(6deg) added to the reveal-mask / RevealText transform --
  disliked, so it's gone from both the CSS and the GSAP tween target.
- reveal-mask now carries a small padding-block buffer (with matching
  negative margin-block to cancel its footprint) so serif ascenders and
  descenders are never clipped by the overflow:hidden mask, mid-reveal or
  at rest.

Footer
- Replaced the static 13rem "Sandun Madhushan" wordmark with a much smaller
  signature band: a soft layered radial-gradient glow behind the name
  (inspired by ambient-gradient sites like Aura), and a new GravityText
  component where each letter is pulled toward the pointer with a falloff,
  released with an elastic spring on pointer-leave. Gated behind an
  IntersectionObserver so the per-letter pointermove tracking only runs
  while the footer is actually in view.

Projects page
- Added a real shadcn/ui Card primitive (src/components/ui/card.tsx,
  standard Card/CardHeader/CardTitle/CardContent/CardFooter shape, restyled
  onto this site's own surface/on-surface tokens instead of shadcn's
  generic --card variables).
- Rebuilt the project listing as a bento-style card grid on top of it:
  every fourth card spans two columns as a wide short tile to break the
  rhythm, image sits inside a rounded Card with a bottom gradient scrim
  for the number badge, cards lift with a soft shadow on hover (no
  grayscale/color-filter hover, which was disliked twice over).

Perf
- VelocityMarquee no longer allocates a new gsap.to tween on every
  ScrollTrigger update (was creating one per animation frame); velocity is
  now a plain decayed value read once per tick.
"@
$msg | Out-File -FilePath ".git\COMMIT_MSG_TMP" -Encoding utf8
Invoke-Git commit -F ".git\COMMIT_MSG_TMP"
Remove-Item -Force -ErrorAction SilentlyContinue ".git\COMMIT_MSG_TMP"

Invoke-Git push new-origin master
Write-Host ""
Write-Host "Pushed. Vercel will redeploy." -ForegroundColor Green
& git log --oneline -1
