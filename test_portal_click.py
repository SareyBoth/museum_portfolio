import subprocess
from playwright.sync_api import sync_playwright
import time

server = subprocess.Popen("npx next start -p 3004", cwd=r"C:\Users\BeeNaa\Desktop\art_gallery", shell=True)
time.sleep(3)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: print("CONSOLE:", msg.text))
        page.goto("http://127.0.0.1:3004")
        time.sleep(2)
        
        # Check button text and click
        btn = page.locator("button:has-text('CENTER OLED SCREEN')")
        print("Button count:", btn.count())
        print("Clicking via JS evaluate...")
        page.evaluate("() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('CENTER OLED SCREEN')); if (b) b.click(); else console.log('Button not found'); }")
        
        for i in range(15):
            time.sleep(0.4)
            progress = page.evaluate("() => { const hud = document.querySelector('.bg-gradient-to-r'); return hud ? hud.style.width : 'no bar'; }")
            shell = page.evaluate("() => { const s = document.getElementById('top'); return s ? 'visible' : 'null'; }")
            print(f"Step {i}: progress bar = {progress}, shell = {shell}")
            if shell == 'visible':
                print("PortalShell is visible!")
                break
                
        browser.close()
finally:
    subprocess.run(f"taskkill /F /T /PID {server.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

