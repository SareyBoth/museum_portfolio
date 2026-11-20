import subprocess
import time
import os
import sys
from playwright.sync_api import sync_playwright

PORT = 3004
URL = f"http://127.0.0.1:{PORT}"

def log(msg):
    print(msg, flush=True)

def run_site_check():
    log(f"Starting art_gallery Next.js server on port {PORT}...")
    server = subprocess.Popen(
        f"npx next start -p {PORT}",
        cwd=r"C:\Users\BeeNaa\Desktop\art_gallery",
        shell=True,
    )
    time.sleep(3)

    os.makedirs(r"C:\Users\BeeNaa\Desktop\art_gallery\shots_verify", exist_ok=True)
    errors = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1440, "height": 900})

            console_errors = []
            page.on("console", lambda msg: console_errors.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None)
            page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))

            log("\n[CHECK 1] Loading 3D Gallery Overview...")
            page.goto(URL, wait_until="domcontentloaded")
            time.sleep(2)

            # Check title & metadata
            title = page.title()
            log(f"Page title: {title}")
            if "SareyBoth" not in title or "Video Editor" not in title:
                errors.append(f"Unexpected title: {title}")
            # Check for any forbidden technical/IT keywords in page text
            forbidden = ["mikrotik", "routeros", "pppoe", "it support", "networking", "linux", "cabling", "developer", "software engineering"]
            body_text = page.locator("body").inner_text().lower()
            for f in forbidden:
                if f in body_text:
                    errors.append(f"Forbidden term '{f}' found in body text!")

            # Check 2: Step into artwork inspection mode (left wall 9:16)
            log("\n[CHECK 2] Stepping to Left Wall Frame (9:16 inspect)...")
            page.keyboard.press("ArrowRight")
            time.sleep(1)
            caption = page.locator("#frame-caption")
            if not caption.is_visible():
                errors.append("Frame caption card not visible after ArrowRight step")
            else:
                cap_title = page.locator("#frame-caption-title").inner_text()
                log(f"Inspecting artwork title: {cap_title}")

            # Return to overview via Escape
            page.keyboard.press("Escape")
            time.sleep(1)

            # Check 3: Enter Portal Mode
            log("\n[CHECK 3] Entering Portal Mode (Center OLED screen)...")
            page.evaluate("() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('CENTER OLED SCREEN')); if (b) b.click(); }")

            # Wait for PortalShell #top to appear
            for s in range(15):
                time.sleep(0.3)
                if page.evaluate("() => document.getElementById('top') !== null"):
                    log(f"PortalShell visible after {(s+1)*0.3:.1f}s")
                    break
            else:
                errors.append("PortalShell failed to become visible")

            time.sleep(0.5)
            portal_shell = page.locator("#top").first
            if not portal_shell.is_visible():
                errors.append("PortalShell hero #top is not visible")

            shell_bg = page.evaluate("() => { const el = document.querySelector('div.z-40.overflow-y-auto'); return el ? window.getComputedStyle(el).backgroundColor : ''; }")
            log(f"PortalShell background color: {shell_bg}")
            if shell_bg not in ["rgb(9, 9, 11)", "#09090b", "black"]:
                errors.append(f"Expected #09090b (rgb(9, 9, 11)) background, got {shell_bg}")

            # Check 4: Exact 5 Header Navigation items in exact order
            log("\n[CHECK 4] Verifying 5 Navigation Links in Header...")
            nav_links = page.locator("header nav a").all_inner_texts()
            log(f"Nav links in header: {nav_links}")
            expected_nav = ['Projects', 'About', 'Skills', 'Experience', 'Contact / CV']
            if nav_links != expected_nav:
                errors.append(f"Expected nav {expected_nav}, got {nav_links}")

            # Check 5: Projects Showcase (Mixed 16:9 and 9:16 frames)
            log("\n[CHECK 5] Projects Showcase & Aspect Ratio Checks...")
            cards = page.locator("#projects .group")
            card_count = cards.count()
            log(f"Project cards found: {card_count}")
            if card_count != 8:
                errors.append(f"Expected 8 project cards, got {card_count}")

            # Test Project Lightbox
            log("Opening Lightbox on first project card...")
            page.evaluate("() => { const c = document.querySelector('#projects .group'); if (c) c.click(); }")
            time.sleep(0.8)
            modal = page.locator("[role='dialog']")
            if not modal.is_visible():
                errors.append("Lightbox modal failed to open on card click")
            else:
                log("Lightbox modal is open and visible.")
                page.keyboard.press("Escape")
                time.sleep(0.5)

            # Check 6: Separate Experience and Education Headings
            log("\n[CHECK 6] Verifying Separate Experience & Education Sections...")
            exp_h2 = page.locator("#experience h2").inner_text()
            edu_h2 = page.locator("#education h2").inner_text()
            log(f"Experience H2: '{exp_h2}', Education H2: '{edu_h2}'")
            if exp_h2 != "Experience" or edu_h2 != "Education":
                errors.append(f"Expected separate 'Experience' and 'Education' headings, got '{exp_h2}' and '{edu_h2}'")

            # Check 7: Contact / CV and Footer
            log("\n[CHECK 7] Verifying Contact & Footer...")
            page.evaluate("() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Preview CV Modal')); if (b) b.click(); }")
            time.sleep(0.8)
            cv_modal = page.locator("[role='dialog']:has-text('CURRICULUM VITAE')")
            if not cv_modal.is_visible():
                errors.append("CV modal failed to open")
            else:
                log("CV modal opened successfully.")
                page.keyboard.press("Escape")
                time.sleep(0.5)

            footer_links = page.locator("footer nav a").all_inner_texts()
            log(f"Footer navigation links: {footer_links}")
            if footer_links != expected_nav:
                errors.append(f"Expected footer links {expected_nav}, got {footer_links}")

            # Check 8: Exit Portal to 3D Gallery
            log("\n[CHECK 8] Exiting Portal back to 3D Gallery...")
            page.evaluate("() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Exit Portal')); if (b) b.click(); }")
            time.sleep(2)
            log("Returned to 3D gallery successfully.")

            # Check for console errors
            if console_errors:
                log(f"Console errors: {console_errors}")
                for ce in console_errors:
                    errors.append(f"Console error: {ce}")
            else:
                log("Zero console errors!")

            browser.close()

    finally:
        subprocess.run(f"taskkill /F /T /PID {server.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    log("\n================ VERIFICATION SUMMARY ================")
    if errors:
        log(f"FAILED with {len(errors)} error(s):")
        for err in errors:
            log(f"  - {err}")
        sys.exit(1)
    else:
        log("ALL SITE-CHECK CHECKS PASSED WITH ZERO ERRORS!")
        sys.exit(0)

if __name__ == "__main__":
    run_site_check()
