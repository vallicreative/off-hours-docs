# Off Hours Docs — Content Audit

Audit date: 2026-05-06. Audited against `index.html` after the dark mode removal commit. Line numbers reference the post-removal file (1,875 lines).

This is a diff report only. No prose has been rewritten. The user reviews this, then we do rewrites in a second pass.

## Global findings

These show up across many pages and are not repeated below for every occurrence.

1. **Account vs. seller / marketplace.** The docs use "account" everywhere as a generic billing unit and as a synonym for "Amazon Advertising profile." The current app distinguishes:
   - **Seller** = the billable unit ($149/mo each).
   - **Marketplace** = a region under a seller (US, CA, MX, etc.). Free under the same seller.
   - **Attribution Profile** = a separate concept, listed in its own section, excluded from billing.

   Anywhere that says "account" needs review. In demos and counts, "Accounts: 4" should likely be split into "Sellers: N · Marketplaces: M" or similar. In the Connect flow, "import advertising profiles" needs to be reframed in terms of sellers and the marketplaces that come with them.

2. **Pricing model is inverted.** The Billing page and the FAQ explicitly tell readers "one brand in both US and CA marketplaces is two accounts" and "each active profile is billed at your plan rate per month." The current model is the opposite: marketplaces under one seller are free; only sellers count. This is the single biggest content correction needed.

3. **Stripe Customer Portal is unmentioned.** No page references the portal, the `trial_ends_at` countdown, the `subscription_status` lifecycle (`active`, `trialing`, `past_due`, `canceled_period_ended`), or the recovery CTAs ("Update payment method", "Resubscribe"). Billing and FAQ both need this.

4. **Read-only / subdued mutation states are unmentioned.** Nothing tells the reader that BillingPicker hides and rule mutation surfaces dim with tooltips during `past_due` or `canceled_period_ended`. Belongs on Billing and probably referenced briefly on Dashboard.

5. **URLs.** All in-doc URLs that point to dashboard pages still use the implicit `/dashboard/*` style. Doc references should switch to root-level: `/accounts`, `/settings`, `/settings#billing`. Old links 308-redirect, but example URLs should use the new paths. Also: nothing references the new topbar account dropdown grouping (sellers with marketplace counts + separate Attribution Profiles section).

6. **Em dashes in prose.** The standing rule bans em and en dashes in prose, but the existing copy is full of them across every page (intro, quickstart, connect, dayparting, budget, event, performance, dashboard, insights, changelog, team, billing, FAQ). Pass 2 should sweep them out as part of the rewrites.

7. **Search index out of sync.** `searchIndex` (lines 1447-1462) has page summaries that mirror the stale copy ("per Amazon Ads account flat", etc.). Whatever changes in the page bodies needs to be mirrored in the search index keywords or search will surface stale terminology.

8. **API Reference tab is non-functional.** Line 414's `<button class="ntab" id="tab-api" onclick="switchTab('api')">API Reference</button>` toggles a class but there is no `page-api` content. `switchTab` just flips the active state on the tab buttons (lines 1606-1611). Either remove the button, hide it behind a flag, or build the content. Needs human review.

9. **Fictional client names.** "Parkway Home", "Harbor Kitchen", "Northlane Goods" appear in screenshots and prose. They read as fictional and align with the brand voice; flagging only because the standing rule says "no real client names." Confirm none of these match a real customer before pass 2.

---

## Sidebar and topbar — lines 402-446

### Stale / contradicts current app
- Line 414: `API Reference` tab is non-functional (see global #8). Needs human review.
- Line 428: sidebar entry "Connect Amazon account" reads as singular and account-centric. Suggest renaming to "Connect Amazon seller" (or just "Connect Amazon") to reflect seller hierarchy.
- Line 441: `<span class="sbadge">Agency</span>` on Team access. If the Agency tier still exists at a different price, fine. If pricing has consolidated to a single $149/seller plan, this badge is stale. Needs human review.

### Verified current
- Brand mark, search shortcut, "All systems operational" pill, "Marketing site" link, "Go to dashboard" CTA all read fine.
- `dashboard.off-hours.app` is the correct dashboard host.

---

## Introduction — lines 433-553

### Stale / contradicts current app
- Line 438: "Off Hours schedules and automates your Amazon Ads campaigns, hour by hour, across every account." "Account" should likely be "marketplace" (or "seller and marketplace"). Suggested: "...hour by hour, across every seller and marketplace you connect."
- Line 446: dashboard demo header "Your rules executed 142 actions across 4 accounts overnight." "4 accounts" doesn't reflect seller/marketplace split. Suggested: "across 2 sellers and 4 marketplaces" (or similar; needs human review for what the dashboard actually says now).
- Line 449: dashboard strip cell `Accounts` with value `4 healthy`. Same issue. Should probably be `Marketplaces` (or split into two cells: Sellers / Marketplaces). Needs human review for current dashboard layout.
- Line 458: "Every account starts with full access to all four rule types. No payment required to get started." Replace "Every account" with "Every seller" (or "Every signup"). The 14-day free-trial messaging itself is correct.
- Line 460: "Off Hours connects to your Amazon Ads account via the official Amazon Advertising API." Should probably reference seller(s) plural, or rephrase: "Off Hours connects to your Amazon Ads sellers via the official Amazon Advertising API."
- "Try the AI rule builder" demo (lines 511-530) and "Key concepts" table (lines 499-506) read fine in concept, no specific account/seller mismatch.

### Verified current
- 14-day free trial, no credit card: matches.
- Hourly check, 60-minute max execution lag: matches description in the FAQ.
- "Off Hours manages campaigns, not bids" warning (line 507): matches.
- AI rule builder live demo and chips: read fine.

---

## Quick start — lines 556-603

### Stale / contradicts current app
- Line 567: step 2 reads "click `Amazon Accounts` then `Connect account`. You will be redirected to Amazon to authorize Off Hours. Off Hours imports all active campaigns automatically." Three problems:
  1. The sidebar item is likely renamed to reflect sellers, not "Amazon Accounts."
  2. "Connect account" button label may have changed to "Connect seller" (needs human review).
  3. The flow should mention that all marketplaces under that seller come along automatically and that Attribution Profiles surface separately.
  Suggested rewrite needed; tagging needs human review on exact UI labels.
- Line 568: step 3 references "Dayparting" in the sidebar, then "Create rule." Verify the sidebar route still surfaces this directly versus going through `/accounts` first. Needs human review.
- Line 569: step 4 "Watch every action in the Activity feed on your dashboard." Fine, but should probably link to `/` or `/accounts` (the new dashboard root) rather than the implicit `/dashboard/*`. URL update only matters if any deep links exist; the prose itself is generic enough to leave.

### Verified current
- Line 566: "Go to `dashboard.off-hours.app/signup`. Enter your email and set a password. No credit card required, you start immediately on a 14-day free trial." Signup URL and trial behavior match the standing rules.
- "Pause all campaigns midnight to 6am on weekdays" recommended first rule: reads fine, no app-state contradiction.

---

## Connect Amazon account — lines 605-656

### Stale / contradicts current app
- Line 609: page heading "Connect your Amazon Ads account." Singular "account" reads stale. Suggested: "Connect your Amazon Ads seller" or "Connect Amazon."
- Line 622: step 1 "Click `Amazon Accounts` in the left sidebar. This shows all currently connected profiles and a button to add a new one." Needs the seller hierarchy reframing. Suggested: "Click `Sellers` (or `Accounts`, depending on current label) in the left sidebar. This shows your connected sellers grouped with their marketplaces." Needs human review for the exact sidebar label.
- Line 624: step 3 "Off Hours imports all advertising profiles associated with your account." Should be: "Off Hours imports the seller and all of its marketplaces. Attribution Profiles are imported separately and listed in their own section."
- Line 625: step 4 "Each imported profile has an `Active` toggle. Turn on the profiles you want Off Hours to manage. Inactive profiles are visible but no rules execute against them." Needs human review: does the active toggle still operate at the marketplace level under each seller? Or has it moved to the seller level? Replace "profile" with the right term once confirmed.
- Line 631: "Reconnecting an expired account ... find the expired profile, and click `Reconnect`." Replace "profile" with "marketplace" or "seller" depending on token granularity. Needs human review.
- Line 632: warning "Rules do not execute on expired accounts" reads stale generically. The behavior described (suspend rules until reconnected, log gaps) is probably still true but the wording should reflect seller/marketplace.

### Verified current
- OAuth flow (Off Hours never sees Amazon password): matches.
- `advertising::campaign_management` scope: matches stated scope, assuming app has not added or narrowed scopes.
- "Off Hours does not touch bids, keywords, or targeting": matches.

---

## Dayparting — lines 658-709

### Stale / contradicts current app
- Line 674: step 2 "Choose which campaigns this rule applies to, all campaigns in an account, a specific subset, or campaigns matching a naming pattern." "Account" here is loose. Suggested: "all campaigns in a marketplace, a specific subset..." Needs human review on whether the rule scope picker is per-marketplace, per-seller, or cross-seller.

### Verified current
- 7-by-24 grid, 168 hours: matches.
- Recommended starting schedule (weekdays 6am to midnight, weekends 7am to 11pm): no app-state conflict.
- Event-rule override behavior: matches the Event rules page.
- Heatmap demo: reads fine.

---

## Budget rules — lines 712-783

### Stale / contradicts current app
- No specific account/seller language to flag. Page is conceptual: percentage adjustments, weekend boost, layering caveat.
- Demo URL (line 721) `dashboard.off-hours.app → Budget Rules`: fine.

### Verified current
- "Restoration is automatic" on weekend boost: matches.
- Compounding warning when layering percentage adjustments: matches.

---

## Event rules — lines 785-883

### Stale / contradicts current app
- Line 856: step 2 "Times are in your account's timezone." Should be marketplace timezone (each marketplace is in a different region). Or seller-level timezone if that is the new model. Needs human review.

### Verified current
- Prime Day 48-hour example: reads fine.
- Auto-restore at end of event window: matches.
- Set up at least 7 days in advance: opinion content, no conflict.

---

## Performance rules — lines 886-983

### Stale / contradicts current app
- No specific account/seller language to flag in prose.
- Demo references "Harbor Kitchen" account (line 902); see global #9.
- Line 944-946: alert-only vs. alert + pause table reads fine.

### Verified current
- Prior-day data, not real-time: matches.
- Recommended ACOS thresholds (1.5x to 2x target): opinion, no conflict.
- Caution on auto-pause during Prime Day: matches stated philosophy.

---

## AI rule builder — lines 985-1039

### Stale / contradicts current app
- Line 998: example output references "all Sponsored Products daily budgets." Fine in itself, but verify the AI builder still surfaces the same confirm-before-activate pattern in the current UI. Likely unchanged. No edit needed.

### Verified current
- "Available on every rule page": matches.
- "What you type" examples: read fine, no app-state conflict.
- "Every field is editable before and after activation": matches stated philosophy.

---

## Dashboard — lines 1041-1110

### Stale / contradicts current app
- Line 1056: dashboard demo "Your rules executed 142 actions across 4 accounts overnight." Same as Intro: needs seller/marketplace split.
- Line 1059: strip cell `Accounts` with value `4 healthy`. Same issue.
- Line 1068: "expired Amazon account connection" example. Replace with "expired Amazon seller connection" or "expired marketplace connection" depending on where the OAuth lives now.
- Line 1086: "The global pause toggle is in the avatar menu at the top right. Turning it on suspends all rule execution for 24 hours." Verify global pause is still in the avatar menu in the current build, given the topbar account dropdown was reworked. Needs human review.
- **Missing entirely:** the topbar account dropdown grouping by seller with marketplace counts plus a separate Attribution Profiles section. This is one of the items the user explicitly called out. Either add a short subsection on the Dashboard page, or include it in the Connect Amazon page (or its own page). Needs human review on best placement.
- **Missing entirely:** any mention of read-only state during `past_due` or `canceled_period_ended`. The Dashboard should at minimum acknowledge that mutation surfaces are subdued and surface a recovery CTA. Could be a callout, or a row on the "Needs your attention" section.

### Verified current
- Hourly checks, 142 example actions, activity feed entries: read fine in shape.
- Heatmap section: matches Dayparting page.
- Upcoming panel: 7-day forward view, no conflict stated.

---

## Weekly insights — lines 1112-1166

### Stale / contradicts current app
- Line 1131-1134: insight examples reference "Northlane Goods", "Parkway Home campaigns", "Harbor Kitchen." If these are accounts in the old sense, update to reflect marketplaces under a seller (or swap to fictional seller names if seller is the new top-level entity).
- Line 1142: "To adjust notification preferences, go to `Settings` then `Notifications`." Settings now lives at root `/settings`. The sub-anchor is probably `/settings#notifications` (mirroring billing's `/settings#billing`). Needs human review for exact anchor.

### Verified current
- Monday 6am delivery: reads fine; verify timezone alignment under multi-marketplace sellers (separate question, not a content fix).
- Deferred spend formula (hours paused × 30-day average hourly spend): matches stated philosophy.
- "Conservative by design" rationale: opinion, no conflict.

---

## Change log — lines 1168-1232

### Stale / contradicts current app
- Line 1180: table row "Account: Which Amazon Ads profile the campaign belongs to." Should be "Seller and marketplace: which seller and which marketplace the campaign belongs to." This row should probably split into two rows or be reframed.
- Lines 1195-1199: activity demo entries label campaigns by fictional account name (Parkway Home, Northlane Goods, Harbor Kitchen). Update the labeling pattern to show seller plus marketplace, e.g. "Parkway Home · US."
- Line 1205: "Search campaigns, rules, accounts..." filter input. Replace "accounts" with "sellers, marketplaces."
- Line 1207: filter dropdown "All types ↓". Fine on its own, but if there is now a seller or marketplace filter, the filter list should mention it. Needs human review of current Change log filters.
- Line 1205 filter row also includes "Last 7 days ↓". Fine.

### Verified current
- Indefinite retention claim (line 1205-ish in prose): "Entries are retained indefinitely." Verify this still holds. Standing rule bans the word "forever," but "indefinitely" is allowed; flagging only for accuracy review.
- "Missed executions" recorded with reason: matches.

---

## Team access — lines 1234-1304

### Stale / contradicts current app
- Line 1239: "Pro plans support up to 3 members. Agency plans have no limit." Two issues:
  1. If the Pro vs. Agency split has collapsed into a single $149/seller tier, the description needs full rewrite.
  2. If team-member limits still differ by tier, confirm the numbers (3 vs. unlimited) and the tier names. Needs human review.
- Line 1248: demo URL "dashboard.off-hours.app → Settings → Team." URL pattern should now be `dashboard.off-hours.app/settings` then a Team tab. Update the breadcrumb text accordingly.
- Line 1259-1260: real-looking emails `alicia@vallicreative.com`, `erica@vallicreative.com`, `mike@vallicreative.com`. These are the user's company domain. Standing rule bans real client names but does not ban the user's own team. Flagging only for confirmation that this is intentional. If the demo is meant to feel third-party, swap to fictional emails.
- Line 1279: "Agency plans, unlimited team members" callout. Same concern as above; if Agency tier still exists at a discount, fine; if not, this callout needs to go.

### Verified current
- Roles table (Owner / Admin / Viewer) and capabilities: reads fine, no app-state conflict stated by user.
- Invitation flow (email, 7-day expiry): no conflict.

---

## Billing and plans — lines 1308-1384

This page needs the heaviest rewrite. Almost everything in it contradicts the current model.

### Stale / contradicts current app
- Line 1313: subtitle "Priced per Amazon Ads account, flat. No percentage of ad spend. No usage fees. No surprises." Replace "per Amazon Ads account" with "per seller. Marketplaces under the same seller are free."
- Line 1317: demo URL "dashboard.off-hours.app → Settings → Billing." Update to "dashboard.off-hours.app/settings#billing."
- Line 1323-1330: pricing card grid.
  - Free trial card (14 days, no card required): matches current ✓.
  - Pro card "Pro · Current plan, $149/mo/account, Up to 3 team members": needs rewrite. Per-account is wrong; should be per seller. "Pro" tier may no longer exist. Needs human review on whether the tier system has collapsed or just been renamed.
  - Agency card "Agency, From $134/mo, Unlimited members": same review needed. If Agency tier is gone, remove this card.
- Line 1342: "Next billing date May 27, 2026 · 1 account · $149.00." Replace "1 account" with "1 seller."
- Line 1344: "Manage billing →" link. Should mention this opens the Stripe Customer Portal (or just rephrase to "Manage in Stripe Customer Portal →"). Needs human review on label.
- Line 1349-1353: Plans table.
  - Pro row "$149 / month / account, Up to 3 team members per account": needs full rewrite to "per seller" pricing and team limits stated per seller (or per workspace) under the new model.
  - Agency row "From $134 / month / account, ... Contact us for volume pricing": "Contact us for volume pricing" probably stays; the per-account language must go. "Book a demo" is not present, good (matches standing rule).
  - Add a row or note for **annual** ($1,520/year per seller, the user spec).
- Line 1354: "Annual billing saves 15 percent" tip. Math checks out (149 × 12 = 1788; (1788 − 1520) / 1788 ≈ 15%). Keep this line, but reword "Pro and Agency plans are available on annual billing" to fit the new tier model.
- Line 1355: "What counts as one account" heading and the paragraph below it. Currently says "Three brands in the US marketplace is three accounts. One brand in both the US and CA marketplaces is two accounts." This is **inverted from the current model**. Correct version: "One seller is the billable unit. A seller can include multiple marketplaces (US, CA, MX, etc.) at no additional cost. Three brands sold from three separate sellers is three billable sellers, regardless of which marketplaces are connected." Suggested rewrite needed; reword the heading too: "What counts as one seller."
- Line 1357: "Adding and removing accounts ... Each new active profile adds one account to your billing at your plan rate, prorated for the remainder of the billing period." Inverted from current. Correct version: "Each new active seller adds one billing line at $149/mo, prorated. Adding additional marketplaces under a seller you already have does not change billing. Attribution Profiles are not billable."
- Line 1359: "Cancellation. Cancel any time from your billing settings. Your account remains active through the end of the current billing period. Rules stop executing after cancellation." Add: "Cancellation is handled in the Stripe Customer Portal. While you are in `canceled_period_ended` state, BillingPicker is hidden and a `Resubscribe` CTA appears in its place. While you are in `past_due`, an `Update payment method` CTA replaces the BillingPicker until the issue is resolved."
- **Missing entirely:** the trial countdown surface. Needs a paragraph: "During the 14-day trial, your dashboard shows days remaining (`trial_ends_at`). When the trial ends, the seller transitions to `active` (after a successful Stripe charge) or `past_due`. No card on file means rules continue but BillingPicker prompts you to add one before any charge."
- **Missing entirely:** Attribution Profiles excluded from billing. This is its own paragraph or a row in the "What counts as one seller" section.

### Verified current
- 14-day free trial, no card required: matches.
- $149/mo per seller (formerly "per account"): matches the dollar amount.
- $1,520/year annual: matches the user-provided spec, math validated against the 15% callout.
- "Email hello@off-hours.app. We respond within one business day": matches the stated tone elsewhere on the site.
- No "Book a demo" or "forever" copy on this page.

---

## FAQ — lines 1386-1437

### Stale / contradicts current app
- Line 1399: "Is there a free trial?" answer ends "...you can choose to upgrade to Pro ($149/month per account) or your rules stop executing and your data is retained." Two issues:
  1. Replace "$149/month per account" with "$149/month per seller, billed via Stripe."
  2. Mention that the upgrade flow is the Stripe Customer Portal (and no card on file at trial end transitions the seller to `past_due`, triggering the recovery CTA).
- Line 1414: "Can I connect multiple Amazon accounts? ... Each Amazon Advertising profile is one account in Off Hours. ... Each active profile is billed at your plan rate per month." This is the **inverted billing model** from the Billing page. Replace with: "Yes. You can connect multiple sellers, and each seller can include multiple marketplaces. Each seller is one billing line at $149/mo. Marketplaces under the same seller are free. Attribution Profiles are connected separately and are not billable."
- Line 1415: "What happens to my campaigns if I cancel?" answer says "Your data and rule configurations are retained for 90 days in case you want to reactivate." Verify the 90-day retention number against the current `subscription_status` lifecycle. Needs human review. Also add a line about the recovery CTA: "While in `canceled_period_ended`, you can `Resubscribe` from the dashboard and your rules and configurations resume immediately."
- Line 1416: "Can I get a refund?" answer "...within 7 days of your first charge..." Verify the 7-day window is current. Needs human review.
- Line 1417: "Do you offer volume pricing for agencies? ... The Agency plan starts at $134 per account per month." If the Agency tier is gone, this whole answer needs a rewrite. If it persists, replace "per account" with "per seller." Needs human review.

### Verified current
- "Setup takes about five minutes ... no onboarding call, no implementation work": matches the brand voice.
- "No technical knowledge required": matches.
- Hourly check / 60-minute lag: matches.
- Manual pause behavior (re-enabled at next scheduled time): matches.
- Rule layering with event-rule precedence: matches Event rules page.
- "Off Hours does not touch keyword bids, match types, placement modifiers, targeting": matches.
- "Off Hours does not store keyword-level data, bid history, or full performance reports": no conflict; verify Privacy Policy still backs this claim. Needs human review.

---

## API Reference tab — line 414

### Stale / contradicts current app
- The button exists but `switchTab('api')` (lines 1606-1611) only toggles the active class on the tab buttons. There is no `page-api` element. Either remove the button, hide it until the API content exists, or implement the page. Needs human review.

---

## Footers and small bits

### Stale / contradicts current app
- Every page has `pfoot` linking to `dashboard.off-hours.app/privacy` and `dashboard.off-hours.app/terms`. Verify these routes still exist on the dashboard host (they may have moved to `off-hours.app/privacy` on the marketing site, or to root-level on the dashboard). Needs human review.
- Copyright: "© 2026 Off Hours · A TCN Group product." Verify "TCN Group" attribution is still desired; user mentioned the product is part of Valli Creative. Needs human review.

### Verified current
- Standing-rules check on existing copy: no occurrences of "Book a demo," and no use of "forever" was found in prose.

---

## What I did not change

- No prose was rewritten.
- `index.html` was not modified during the audit (only Part 1's dark-mode removal touched it).
- This file (`docs-audit.md`) is committed as a working artifact for the pass-2 rewrite.
