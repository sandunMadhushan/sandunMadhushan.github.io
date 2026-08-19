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
- Replaced the original "Viewfinder" cursor (corner brackets that locked
  onto the full bounding box of whatever was hovered) with a "Signal"
  cursor: a small dot glued exactly to the pointer plus a trailing ring
  that only grows in place on hover, so it never jumps away from the
  pointer over large elements like the nav bar or a full project card.
- Cursor contrast no longer relies on mix-blend-mode: difference, which
  has a real failure mode near ~50% gray backgrounds (and inconsistent
  GPU/browser compositing on fast-moving fixed + will-change elements).
  The dot and ring are now a solid accent-color fill with a dark
  box-shadow halo, so they stay visible against any background or theme.

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
- Rebuilt the project listing on top of it as a uniform grid (every card
  the same aspect ratio, no bento asymmetry, no uneven gaps): image inside
  a rounded Card with a bottom gradient scrim for the number badge, cards
  lift with a soft shadow on hover -- no grayscale/color-filter hover and
  no "View" hover label, both disliked. Removed the duotone hover from the
  featured spread too, replaced with a clean scale + accent underline.
- Initial listing now shows 6 projects with a Load more / Show less
  button instead of dumping the full list at once.
- Project detail page: the sticky quick-actions bar (title + Live/GitHub/
  Blog links) is now inset to the same gutter and max-width as the rest of
  the page's content container, instead of spanning full-bleed edge to
  edge while scrolled.

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
