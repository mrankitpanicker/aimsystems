"""Write _src/AIM-website-content.md: overall context plus the full visible
text of every page, taken from the built HTML.   python3 _src/export_content.py"""
import os, re
from bs4 import BeautifulSoup, NavigableString, Comment

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PAGES = [('Home', '/', 'index.html'), ('Services', '/services', 'services.html'), ('Hire', '/hire', 'hire.html'),
         ('Platforms', '/products', 'products.html'), ('Work', '/work', 'work.html'), ('Engineering', '/engineering', 'engineering.html'),
         ('About', '/about', 'about.html'), ('Contact', '/contact', 'contact.html'), ('Privacy & Compliance', '/privacy', 'privacy.html')]
BLOCK = {'h1', 'h2', 'h3', 'h4', 'p', 'li', 'blockquote', 'figcaption', 'button', 'a', 'label', 'option', 'span', 'b', 'div'}


def clean(t):
    return re.sub(r'\s+', ' ', t).strip()


def walk(node, out):
    for el in node.children:
        if isinstance(el, NavigableString) or el.name is None:
            continue
        if not el.find(['div', 'p', 'h1', 'h2', 'h3', 'h4', 'li', 'ul', 'ol', 'section', 'article', 'figure', 'blockquote', 'form', 'select']) and el.name in ('div', 'span', 'figcaption', 'header'):
            t = clean(el.get_text(' '))
            if t: out.append(t)
            continue
        if el.name in ('script', 'style', 'svg', 'canvas', 'img', 'i', 'noscript') or el.get('aria-hidden') == 'true':
            continue
        if el.has_attr('hidden') and 'data-panel' not in el.attrs and 'data-tier' not in el.attrs:
            continue
        n = el.name
        if n in ('h1', 'h2', 'h3', 'h4'):
            out.append(('#' * (int(n[1]) + 1)) + ' ' + clean(el.get_text(' ')))
        elif n in ('p', 'blockquote', 'figcaption'):
            t = clean(el.get_text(' '))
            if t: out.append(('> ' if n == 'blockquote' else '') + t)
        elif n == 'li':
            t = clean(el.get_text(' '))
            if t: out.append('- ' + t)
        elif n in ('button', 'a') and not el.find(['h2', 'h3', 'p']):
            t = clean(el.get_text(' '))
            if t:
                href = el.get('href', '')
                out.append(f'[{t}]' + (f'({href})' if href.startswith('http') else '') + (' *(button)*' if n == 'button' else ''))
        elif n == 'select':
            out.append('Options: ' + ' · '.join(clean(o.get_text()) for o in el.find_all('option')))
        elif n in ('input', 'textarea') and el.get('placeholder'):
            out.append(f'*Field:* {el.get("placeholder")}')
        elif n == 'label' and not el.find(['input', 'select', 'textarea']):
            out.append('*' + clean(el.get_text(' ')) + '*')
        else:
            kids = [c for c in el.children if getattr(c, 'name', None)]
            own = clean(''.join(str(c) for c in el.children if isinstance(c, NavigableString) and not isinstance(c, Comment)))
            if not kids:
                if own: out.append(own)
            else:
                if own: out.append(own)
                walk(el, out)
    return out


def page_md(fn):
    soup = BeautifulSoup(open(os.path.join(ROOT, fn), encoding='utf-8'), 'html.parser')
    main = soup.find('main')
    for c in main.find_all(string=lambda x: isinstance(x, Comment)):
        c.extract()
    for el in main.select('[data-count]'):
        v = el['data-count']; n = float(v)
        el.string = el.get('data-prefix', '') + (f'{int(n):,}' if n.is_integer() else v) + el.get('data-suffix', '')
    lines, prev = [], None
    for l in walk(main, []):
        if l != prev: lines.append(l)
        prev = l
    return '\n\n'.join(lines)


CONTEXT = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content-context.md'), encoding='utf-8').read()
parts = [CONTEXT.rstrip(), '\n---\n\n# Full page text\n\nThe visible text of every page, in page order. Lines in square brackets are buttons and links. Animated widgets show their starting state; their other states follow where they are part of the page.']
for name, path, fn in PAGES:
    soup = BeautifulSoup(open(os.path.join(ROOT, fn), encoding='utf-8'), 'html.parser')
    title = clean(soup.title.get_text()); desc = soup.find('meta', attrs={'name': 'description'})['content']
    parts.append(f'\n---\n\n## Page: {name} (`{path}`)\n\n**Browser title:** {title}  \n**Search description:** {desc}\n\n' + page_md(fn))
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'AIM-website-content.md'), 'w', encoding='utf-8').write('\n'.join(parts) + '\n')
print('written')
