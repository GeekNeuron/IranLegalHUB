#!/usr/bin/env python3
"""تعداد مواد (اصل/ماده/بند) هر قانون را حساب می‌کند و در data.js با کلید article_count می‌نویسد.
فقط ردیف‌های شماره‌دار شمرده می‌شوند (مقدمه و عنوان‌های بدون شماره و یادداشت‌های شکاف شمرده نمی‌شوند).
پس از هر تغییر در مواد قوانین اجرا شود: python3 tools/update_article_counts.py"""
import re, json, os
root = os.path.join(os.path.dirname(__file__), '..')
path = os.path.join(root, 'data.js')
s = open(path, encoding='utf-8').read()

def walk(n, out):
    out += n.get('articles', [])
    for x in n.get('subdivisions', []): walk(x, out)

def count(paths):
    c = 0
    for p in paths:
        j = json.load(open(os.path.join(root, p), encoding='utf-8')); o = []
        for n in j['divisions']: walk(n, o)
        for a in o:
            num = a.get('article_number')
            if num is None or a.get('entry_type'): continue
            if isinstance(num, int) or re.match(r'^\d+(\s|$)', str(num)): c += 1
    return c

starts = [(m.start(), m.group(1)) for m in re.finditer(r"^    '(tab-[a-z0-9-]+)': \{", s, re.M)]
bounds = [p for p, _ in starts] + [s.index('\n];') if '\n];' in s else len(s)]
# محدوده‌ی آخرین قانون تا پایان آبجکت lawManifest
end_manifest = s.index('\n};') if '\n};' in s else len(s)
bounds[-1] = end_manifest
out = s; shift = 0; total = 0
for (pos, key), nxt in zip(starts, bounds[1:]):
    blk = s[pos:nxt]
    paths = re.findall(r"path: '([^']+)'", blk)
    c = count(paths); total += c
    blk2 = re.sub(r"\n        article_count: \d+,", '', blk)
    blk2 = re.sub(r"(\n        article_word: '[^']*',)", r"\1\n        article_count: %d," % c, blk2, count=1)
    out = out[:pos + shift] + blk2 + out[nxt + shift:]
    shift += len(blk2) - len(blk)
open(path, 'w', encoding='utf-8').write(out)
print('laws:', len(starts), 'total counted rows:', total)
