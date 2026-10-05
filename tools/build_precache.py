#!/usr/bin/env python3
"""فهرست همه‌ی فایل‌های متن قوانین را برای دانلود آفلاین می‌سازد (precache-laws.json).
پس از افزودن یا تغییر هر قانون این اسکریپت را اجرا کنید و عدد CACHE_NAME را در sw.js بالا ببرید."""
import re, json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = open(os.path.join(root, 'data.js'), encoding='utf-8').read()
paths = sorted(set(re.findall(r"path: '([^']+)'", data)))
extra = [p for p in ['guides/constitution_guide.json'] if os.path.exists(os.path.join(root, p))]
paths = [p for p in paths if os.path.exists(os.path.join(root, p))] + extra
json.dump(paths, open(os.path.join(root, 'precache-laws.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(paths), 'files listed')
