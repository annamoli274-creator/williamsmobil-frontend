from pathlib import Path

p = Path('src/lib/products.ts')
text = p.read_text(encoding='utf-8')
count = text.count('category: "remorque"')
new = text.replace('category: "remorque"', 'category: "caravane"')
p.write_text(new, encoding='utf-8')
print(count)
