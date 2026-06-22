import { chromium } from 'playwright';
import { exec } from 'child_process';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const server = exec('npm run preview');
  await new Promise(r => setTimeout(r, 3000));
  
  try {
    await page.goto('http://localhost:4173');
    await page.waitForLoadState('networkidle');
    
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    console.log('Initial HTML class:', htmlClass);
    
    const toggleBtn = page.locator('button[aria-label="Toggle theme"]');
    await toggleBtn.click();
    await page.waitForTimeout(500);
    
    htmlClass = await page.evaluate(() => document.documentElement.className);
    console.log('HTML class after click:', htmlClass);
    
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    console.log('Body background color:', bodyBg);
    
    const storeState = await page.evaluate(() => window.localStorage.getItem('goalflow-storage'));
    console.log('LocalStorage State:', storeState);
    
  } catch(e) {
    console.error(e);
  } finally {
    server.kill();
    await browser.close();
  }
})();
