# -*- coding: utf-8 -*-
"""تبدیل متن استخراج‌شده‌ی اختبار (خروجی mhtml_extract) به ساختار JSON برنامه.
استفاده: from ekhtebar_parse import parse_file, normalize"""
import re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from mhtml_extract import extract
P2L = str.maketrans('۰۱۲۳۴۵۶۷۸۹', '0123456789')
LEVELS = {'کتاب': 0, 'باب': 1, 'بخش': 1, 'فصل': 2, 'مبحث': 3, 'گفتار': 4, 'قسمت': 4}
N = r'[\d۰-۹]+'
ART_RE = re.compile(r'^ماده\s*(' + N + r')\s*(?:[-–—ـ:.]\s*)?(مکرر(?:\s*' + N + r')?)?\s*(?:[-–—ـ:.]\s*|(?=\())(.*)$|^ماده\s*(' + N + r')\s*(مکرر(?:\s*' + N + r')?)?\s*$')
HEAD_RE = re.compile(r'^(کتاب|باب|بخش|فصل|مبحث|گفتار|قسمت)\s+\S+.*?[-–:].+$')
STOP_RE = re.compile(r'^(قانون فوق مشتمل|تازه‌های قوانین|برچسب|کپی لینک|مستندات مرتبط|دانلود پی دی اف)')

def normalize(t):
    t = t.replace('ي', 'ی').replace('ك', 'ک').replace('ى', 'ی').replace('ـ', '')
    t = re.sub('[\u064E\u064F\u0650\u0652]', '', t)
    t = re.sub(r'(?<![\u0621-\u06cc])(ن?می) (?=[\u0621-\u06cc])', lambda m: m.group(1) + '\u200c', t)
    t = re.sub(r'^(\([^)]{0,60}\))\s*[-–—ـ]\s*', r'\1 ', t)
    t = re.sub(r'[ \t]{2,}', ' ', t)
    return t.strip()

LENIENT = False
def parse_lines(lines, wiki=False):
    start = next((i for i, l in enumerate(lines) if ART_RE.match(l) or HEAD_RE.match(l)), 0)
    root, stack = [], []   # stack: list of (level, node)
    cur = None; last = 0; skipped = []
    def new_div(line):
        lv = LEVELS[line.split()[0]]
        node = {'type': line.split()[0], 'title': normalize(line), 'articles': [], 'subdivisions': []}
        while stack and stack[-1][0] >= lv: stack.pop()
        (stack[-1][1]['subdivisions'] if stack else root).append(node)
        stack.append((lv, node)); return node
    node = None
    for l in lines[start:]:
        if STOP_RE.match(l): break
        l = re.sub(r'^(ماده\s*[\d۰-۹]+)[\u200c\s]+(?=[-–—ـ:.])', r'\1', l)
        m = ART_RE.match(l)
        if m:
            num = (m.group(1) or m.group(4)).translate(P2L); mk = m.group(2) or m.group(5)
            n = int(num)
            ok = (mk and n >= last) or (last < n <= last + (12 if LENIENT else 1)) or (last == 0 and n >= 1)
            if ok:
                label = num + ((' ' + normalize(mk).translate(P2L)) if mk else '')
                cur = {'article_number': int(num) if not mk else label, 'text': normalize(m.group(3) or '')}
                if node is None: node = new_div('بخش اول- مواد')
                node['articles'].append(cur)
                if not mk: last = n
                continue
            skipped.append(l[:60])
        if HEAD_RE.match(l) and len(l) < 120:
            node = new_div(l); cur = None; continue
        if cur is not None:
            cur['text'] = (cur['text'] + '\n' + normalize(l)).strip()
    def clean(n):
        if n['articles'] and n['subdivisions']:
            n['subdivisions'].insert(0, {'type': 'بخش', 'title': 'مواد عمومی', 'articles': n['articles'], 'subdivisions': []}); n['articles'] = []
        if not n['articles']: del n['articles']
        if not n['subdivisions']: del n['subdivisions']
        for s in n.get('subdivisions', []): clean(s)
    for n in root: clean(n)
    return root, last, skipped

def parse_file(path, wiki=False):
    return parse_lines(extract(path, wiki), wiki)
