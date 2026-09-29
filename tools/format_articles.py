# -*- coding: utf-8 -*-
"""
منظم‌سازی متن مواد: بندهای شماره‌دار (۱- ۲- ...)، بندهای حرفی (الف- ب- ...) و تبصره‌ها
هر کدام در خط جداگانه قرار می‌گیرند. فقط فاصله‌ها به «خط جدید» تبدیل می‌شوند و هیچ کلمه‌ای تغییر نمی‌کند.

استفاده:
    python3 tools/format_articles.py            # اجرا روی همه‌ی فایل‌های laws/**/*.json
    python3 tools/format_articles.py --dry      # فقط گزارش، بدون نوشتن
    python3 tools/format_articles.py file.json  # فقط یک فایل
"""
import glob, json, re, sys, os

DIG = '0-9۰-۹'
P2L = str.maketrans('۰۱۲۳۴۵۶۷۸۹', '0123456789')

# ترتیب‌های رایج بندهای حرفی در قوانین ایران
ORDER_A = ['الف', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی']
ORDER_B = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی', 'ک', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ']
LETTER_RE = r'(الف|ب|پ|ت|ث|ج|چ|ح|خ|د|ذ|ر|ز|ژ|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ک|گ|ل|م|ن|و|هـ|ه|ی)'

BOUNDARY_BEFORE_FIRST = set(':؛.!؟)')
STOP_WORDS_BEFORE_NUM = ('تبصره', 'ماده', 'مواد', 'بند', 'بندهای', 'اصل', 'فقره', 'فقرات', 'شماره', 'تبصره‌های', 'جزء', 'قسمت', 'مصوب', 'سال', 'مورخ')

NUM_RE = re.compile(r'(?<![' + DIG + r'/.\-–(])([' + DIG + r']{1,2})\s*([\-–)\.])(?=\s|[^\s' + DIG + r'])')
LET_RE = re.compile(r'(?<![\u0600-\u06ff\u200c(])' + LETTER_RE + r'\s*(?:\([^)]{0,45}\))?\s*([\-–)])(?=\s|[\u0600-\u06ff])')
TAB_RE = re.compile(r'(?<=[.؛:!؟)])\s+(?=تبصره\s*(?:[' + DIG + r']+)?\s*(?:\([^)]{0,45}\))?\s*[\-–:])')


def prev_nonspace(s, i):
    j = i - 1
    while j >= 0 and s[j].isspace():
        j -= 1
    return j


def prev_word(s, i):
    j = prev_nonspace(s, i)
    k = j
    while k >= 0 and not s[k].isspace():
        k -= 1
    return s[k + 1:j + 1]


MARKER_TAIL_RE = re.compile(r'(?:تبصره\s*[' + DIG + r']*|' + LETTER_RE + r'|[' + DIG + r']{1,2})\s*(?:\([^)]{0,45}\))?\s*[\-–)]\s*$')


def boundary_ok(line, m):
    """آیا پیش از این نشانه، مرز جمله/عنوان/نشانه‌ی دیگری هست؟"""
    j = prev_nonspace(line, m.start())
    if j < 0 or line[j] in BOUNDARY_BEFORE_FIRST:
        return True
    return bool(MARKER_TAIL_RE.search(line[:j + 1]))


def chain_breaks(line, matches, value_of, is_next, is_first, first_ok):
    """فهرست‌های پشت‌سرهم (یک یا چند فهرست در یک خط) را پیدا می‌کند."""
    result = []
    i, n = 0, len(matches)
    while i < n:
        m = matches[i]
        if not first_ok(m):
            i += 1
            continue
        chain, cur, k = [m], value_of(m), i + 1
        while k < n:
            m2 = matches[k]
            v2 = value_of(m2)
            if is_first(v2) and first_ok(m2):
                break                      # فهرست تازه‌ای شروع شده
            if is_next(cur, v2):
                chain.append(m2)
                cur = v2
            k += 1
        if len(chain) >= 2:
            result.extend(chain)
            i = k
        else:
            i += 1
    return result


def num_breaks(line):
    ms = list(NUM_RE.finditer(line))
    ms = [m for m in ms if prev_word(line, m.start()) not in STOP_WORDS_BEFORE_NUM]
    val = lambda m: int(m.group(1).translate(P2L))
    def first_ok(m):
        if val(m) == 1:
            return boundary_ok(line, m)
        # فهرست‌هایی که از عددی غیر از ۱ شروع می‌شوند (مثلاً ۶-، ۸-)
        j = prev_nonspace(line, m.start())
        return j < 0 or line[j] in '.؛'
    return chain_breaks(line, ms, val, lambda a, b: a < b <= a + 2, lambda v: v == 1, first_ok)


def let_breaks(line):
    ms = list(LET_RE.finditer(line))
    norm = lambda m: 'ه' if m.group(1) == 'هـ' else m.group(1)
    def is_next(a, b):
        for order in (ORDER_A, ORDER_B):
            if a in order and b in order and order.index(b) == order.index(a) + 1:
                return True
        return False
    return chain_breaks(line, ms, norm, is_next, lambda v: v == 'الف', lambda m: norm(m) == 'الف' and boundary_ok(line, m))


def format_line(line):
    positions = set()
    for m in num_breaks(line) + let_breaks(line):
        positions.add(m.start())
    for m in TAB_RE.finditer(line):
        positions.add(m.end())          # ابتدای «تبصره»
    if not positions:
        return line
    out, last = [], 0
    for p in sorted(positions):
        seg = line[last:p].rstrip()
        if seg:
            out.append(seg)
        last = p
    out.append(line[last:].lstrip())
    return '\n'.join(x.strip() for x in out if x.strip())


def format_text(text):
    if not isinstance(text, str) or not text:
        return text
    lines = text.split('\n')
    return '\n'.join(format_line(l) for l in lines)


def walk(o, stats):
    if isinstance(o, dict):
        for k, v in list(o.items()):
            if k in ('text', 'description') and isinstance(v, str):
                new = format_text(v)
                stats['total'] += 1
                if new != v:
                    stats['changed'] += 1
                    o[k] = new
            else:
                walk(v, stats)
    elif isinstance(o, list):
        for v in o:
            walk(v, stats)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry' in sys.argv
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    files = args or sorted(glob.glob(os.path.join(base, 'laws', '**', '*.json'), recursive=True))
    tot = {'total': 0, 'changed': 0}
    for f in files:
        d = json.load(open(f, encoding='utf-8'))
        st = {'total': 0, 'changed': 0}
        walk(d, st)
        tot['total'] += st['total']; tot['changed'] += st['changed']
        print(f"{os.path.basename(f):55s} {st['changed']:4d} / {st['total']}")
        if not dry and st['changed']:
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(d, fh, ensure_ascii=False, indent=2)
                fh.write('\n')
    print('TOTAL changed:', tot['changed'], 'of', tot['total'])


if __name__ == '__main__':
    main()
