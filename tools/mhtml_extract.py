#!/usr/bin/env python3
"""MHTML ذخیره‌شده‌ی اختبار را به متن خط‌به‌خط تبدیل می‌کند (بند ۹ دفتر تحویل).
استفاده: python3 mhtml_extract.py فایل [--wiki]"""
import re, sys, html as H
def extract(path, wiki=False):
    raw = open(path, 'rb').read()
    i = raw.find(b'<!DOCTYPE html'); i = i if i >= 0 else raw.lower().find(b'<html')
    j = raw.find(b'------MultipartBoundary', i)
    t = raw[i:j if j > 0 else None].decode('utf-8', 'replace')
    if t.count('=\r\n') > 50 or '=D8=' in t[:5000]:  # quoted-printable
        import quopri; t = quopri.decodestring(t.encode('latin1', 'ignore')).decode('utf-8', 'replace')
    m = re.search(r'class="entry-content', t) if not wiki else re.search(r'id="mw-content-text"', t)
    if m: t = t[m.start():]
    e = t.find('<!-- .entry-content')
    if e > 0: t = t[:e]
    t = re.sub(r'(?is)<(script|style|svg|nav)\b.*?</\1>', '', t)
    t = re.sub(r'(?is)<div[^>]*ez-toc[^>]*>.*?</div>', '', t)
    t = re.sub(r'(?i)<br\s*/?>', '\n', t)
    t = re.sub(r'(?i)</(p|div|li|tr|ul|ol|h[1-6]|table|dd|dt)>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    t = H.unescape(t).replace('\xa0', ' ')
    return [l.strip(' \t\u200c\u200f\u200e') for l in t.split('\n') if l.strip(' \t\u200c\u200f\u200e')]
if __name__ == '__main__':
    for l in extract(sys.argv[1], '--wiki' in sys.argv): print(l)
