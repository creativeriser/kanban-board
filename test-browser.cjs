const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Need a dev server running. Let's use vite preview.
  const { exec } = require('child_process');
  const server = exec('npm run preview');
  
  // Wait a bit for server to start
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    await page.goto('http://localhost:4173');
    await page.waitForLoadState('networkidle');
    
    // Check initial HTML classes
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    console.log('Initial HTML class:', htmlClass);
    
    // Click the toggle button in TopBar (it has aria-label="Toggle theme")
    const toggleBtn = page.locator('button[aria-label="Toggle theme"]');
    await toggleBtn.click();
    await page.waitForTimeout(100);
    
    htmlClass = await page.evaluate(() => document.documentElement.className);
    console.log('HTML class after click:', htmlClass);
    
    // Check background color of body
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    console.log('Body background color:', bodyBg);
    
  } catch(e) {
    console.error(e);
  } finally {
    server.kill();
    await browser.close();
  }
})();
