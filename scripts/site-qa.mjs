// Browser smoke checks for the public static site; never submits inquiry data.
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const paths = [
  '/', '/contact/', '/contact/thanks/', '/resources/',
  '/friction-atlas/', '/friction-atlas/duplicate-data-entry/',
  '/workflow-automation-consulting/', '/business-systems/',
  '/resources/guides/spreadsheet-to-app/',
  '/work/operations-hub/', '/work/global-event-operations/',
  '/work/support-operations/', '/work-with-us/'
];
const viewportWidths = [390, 768, 1440];
const failures = [];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

function check(condition, message) { if (!condition) failures.push(message); }

for (const width of viewportWidths) {
  const context = await browser.newContext({
    viewport: { width, height: 850 },
    isMobile: width === 390,
    hasTouch: width === 390,
    deviceScaleFactor: 1
  });
  for (const path of paths) {
    const page = await context.newPage();
    const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
    check(response?.status() === 200, `${width}px ${path}: HTTP ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        viewport: root.clientWidth,
        scroll: root.scrollWidth,
        h1: document.querySelectorAll('main h1').length,
        css: [...document.styleSheets].some(sheet => sheet.href?.includes('/site-system.css')),
        primary: (() => {
          const selector = 'main .hero .button-primary, main .atlas-hero .atlas-main-link, main .consult-hero .button-primary';
          const button = document.querySelector(selector);
          return button ? getComputedStyle(button).backgroundColor : null;
        })(),
        title: document.title
      };
    });
    const overflow = result.scroll - result.viewport;
    console.log(`${width}px ${path} | H1 ${result.h1} | overflow ${overflow}px | bannerButton ${result.primary || 'n/a'}`);
    check(result.css, `${width}px ${path}: shared CSS not loaded`);
    check(result.h1 === 1, `${width}px ${path}: expected one main H1, got ${result.h1}`);
    check(overflow <= 5, `${width}px ${path}: horizontal overflow by ${overflow}px`);
    if (result.primary) check(result.primary === 'rgb(255, 255, 255)', `${width}px ${path}: banner button not white (${result.primary})`);

    if (path === '/contact/') {
      const contact = await page.evaluate(() => {
        const form = document.querySelector('form.project-form-simple');
        if (!form) return null;
        return {
          required: [...form.querySelectorAll('input[required],textarea[required]')].map(el => el.name).sort(),
          inputNames: [...form.querySelectorAll('input:not([type=hidden]),textarea')].map(el => el.name),
          action: form.action,
          redirect: form.querySelector('[name=_next]')?.value,
          submit: form.querySelector('button[type=submit]')?.textContent.trim(),
          labelsOk: [...form.querySelectorAll('input[required],textarea[required]')].every(el => !!form.querySelector('label[for="' + el.id + '"]')),
          submitBackground: getComputedStyle(form.querySelector('button[type=submit]')).backgroundColor
        };
      });
      check(!!contact, 'Contact form missing');
      if (contact) {
        check(contact.required.join(',') === 'email,message,name', 'Contact required fields changed: ' + contact.required.join(','));
        check(contact.action.startsWith('https://formsubmit.co/'), 'Contact form destination incorrect');
        check(contact.redirect === 'https://howworkruns.com/contact/thanks/', 'Contact confirmation redirect incorrect');
        check(contact.labelsOk, 'Some required contact fields are missing labels');
        check(contact.submitBackground !== 'rgb(255, 255, 255)', 'Contact submit button should be blue on light background');
        console.log('Contact form: ' + JSON.stringify(contact));
      }
    }

    if (width === 390 && path === '/') {
      const menu = page.locator('details.mobile-menu');
      if (await menu.count()) {
        await menu.locator('summary').click();
        check(await menu.evaluate(el => el.open), 'Mobile menu did not open');
        await menu.locator('summary').click();
      }
      const step = page.locator('.method-step').first();
      if (await step.count()) {
        await step.scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
        const reveal = await step.evaluate(el => ({
          present: el.classList.contains('hwr-reveal-pending'),
          visible: el.classList.contains('hwr-reveal-visible'),
          opacity: getComputedStyle(el).opacity
        }));
        console.log('Method-step reveal: ' + JSON.stringify(reveal));
        check(reveal.present && reveal.visible, 'Homepage method-step reveal did not run');
        check(Number(reveal.opacity) > 0.98, 'Homepage method-step remains transparent');
      }
    }
    await page.close();
  }
  await context.close();
}
await browser.close();

if (failures.length) {
  console.error('\nSITE QA FAILURES (' + failures.length + ')\n' + failures.map(x => '- ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('\nSite QA passed across ' + paths.length + ' pages and ' + viewportWidths.length + ' viewport widths.');
}
