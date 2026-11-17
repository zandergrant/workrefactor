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
  let baselineShell = null;
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
    const shell = await page.evaluate(() => {
      const header = document.querySelector('header.site-header');
      const brand = header?.querySelector('.brand-name');
      const nav = header?.querySelector('.desktop-nav');
      const footer = document.querySelector('footer.site-footer');
      if (!header || !brand || !nav || !footer) return null;
      const box = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
      return {header:box(header),brand:box(brand),nav:box(nav),
        footerLinks:footer.querySelectorAll('a').length,
        brandText:brand.textContent.trim().replace(/\\s+/g,'').toLowerCase(),
        links:[...nav.querySelectorAll('a')].map(a=>a.getAttribute('href'))};
    });
    check(!!shell, `${width}px ${path}: shared header/footer missing`);
    if (shell) {
      check(shell.brandText === 'howworkruns', `${width}px ${path}: inconsistent brand`);
      check(shell.footerLinks >= 5, `${width}px ${path}: footer incomplete`);
      if (!baselineShell) baselineShell = shell;
      else {
        for (const key of ['header','brand','nav']) {
          for (const field of ['x','y','width','height']) {
            check(Math.abs(shell[key][field]-baselineShell[key][field])<=1.5,
              `${width}px ${path}: ${key} ${field} shifted from homepage`);
          }
        }
        check(JSON.stringify(shell.links) === JSON.stringify(baselineShell.links),
          `${width}px ${path}: navigation destinations differ`);
      }
    }
    const overflow = result.scroll - result.viewport;
    console.log(`${width}px ${path} | H1 ${result.h1} | overflow ${overflow}px | bannerButton ${result.primary || 'n/a'}`);
    check(result.css, `${width}px ${path}: shared CSS not loaded`);
    check(result.h1 === 1, `${width}px ${path}: expected one main H1, got ${result.h1}`);
    check(overflow <= 5, `${width}px ${path}: horizontal overflow by ${overflow}px`);
    if (result.primary) check(result.primary === 'rgb(255, 255, 255)', `${width}px ${path}: banner button not white (${result.primary})`);

    if (path === '/' && width === 1440) {
      const visual = await page.evaluate(() => {
        const hero = document.querySelector('.home-hero');
        const inner = hero?.querySelector('.hero-inner');
        const headline = hero?.querySelector('h1');
        const animation = hero?.querySelector('.hero-system');
        const section = document.querySelector('.selected-work-section .section-heading');
        const eyebrow = section?.querySelector('.eyebrow');
        const title = section?.querySelector('h2');
        if (!hero || !inner || !headline || !animation || !section || !eyebrow || !title) return null;
        const rect = el => el.getBoundingClientRect();
        const center = el => rect(el).left + rect(el).width / 2;
        return {
          heroHeight: rect(hero).height,
          viewportHeight: window.innerHeight,
          headlineAnimationCenterDelta: Math.abs(center(headline) - center(animation)),
          labelTitleLeftDelta: Math.abs(rect(eyebrow).left - rect(title).left),
          labelFontSize: parseFloat(getComputedStyle(eyebrow).fontSize),
          labelAboveTitle: rect(eyebrow).bottom < rect(title).top,
          animationVisible: rect(animation).width > 300 && rect(animation).height > 80,
          heroCentered: getComputedStyle(inner).textAlign === 'center'
        };
      });
      check(!!visual, 'Homepage composition elements missing');
      if (visual) {
        console.log('Homepage visual composition: ' + JSON.stringify(visual));
        check(visual.heroHeight <= visual.viewportHeight * 1.15, 'Homepage hero extends too far below the fold');
        check(visual.headlineAnimationCenterDelta <= 35, 'Hero headline and animation are not centered together');
        check(visual.heroCentered, 'Hero text is not centered');
        check(visual.labelTitleLeftDelta <= 8, 'Selected work label is misaligned with title');
        check(visual.labelFontSize >= 15, 'Selected work label is too small');
        check(visual.labelAboveTitle, 'Selected work label should appear above title');
        check(visual.animationVisible, 'Homepage hero animation is missing or too small');
      }
    }

    if (path === '/' || path === '/contact/') {
      const layout = await page.evaluate(() => {
        const rect = el => el.getBoundingClientRect();
        const label = document.querySelector(pathname() === '/' ? '.selected-work-section .eyebrow' : '.project-sidebar .eyebrow');
        function pathname() { return location.pathname; }
        const services = [...document.querySelectorAll('.services-section .service-row')];
        const guides = [...document.querySelectorAll('#guides .guide-grid > .friction-card')];
        return {
          labelSize: label ? parseFloat(getComputedStyle(label).fontSize) : null,
          serviceRows: services.map(el => Math.round(rect(el).top)),
          guideRows: guides.map(el => Math.round(rect(el).top)),
          serviceWidths: services.map(el => Math.round(rect(el).width)),
          guideWidths: guides.map(el => Math.round(rect(el).width))
        };
      });
      check(layout.labelSize >= (width === 390 ? 15 : 16), `${width}px ${path}: section label is too small (${layout.labelSize})`);
      if (path === '/' && width === 1440) {
        check(layout.serviceRows.length === 3 && new Set(layout.serviceRows).size === 1, 'Desktop services must share one row');
        check(layout.guideRows.length === 6 && new Set(layout.guideRows).size === 2 && layout.guideRows[0] === layout.guideRows[2] && layout.guideRows[3] === layout.guideRows[5], 'Desktop guides must form two rows of three');
        check(Math.max(...layout.serviceWidths) - Math.min(...layout.serviceWidths) <= 2, 'Service widths are uneven');
        check(Math.max(...layout.guideWidths) - Math.min(...layout.guideWidths) <= 2, 'Guide widths are uneven');
      }
      if (path === '/' && width === 390) {
        check(layout.serviceRows.length === 3 && new Set(layout.serviceRows).size === 3, 'Mobile services must stack');
        check(layout.guideRows.length === 6 && new Set(layout.guideRows).size === 6, 'Mobile guides must stack');
      }
    }

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
