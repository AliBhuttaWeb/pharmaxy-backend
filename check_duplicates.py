import json

with open('prisma/data/products.json', 'r') as f:
    products = json.load(f)['products']

names = {}
duplicates = []
for p in products:
    name = p['name'].lower()
    if name in names:
        duplicates.append((p['name'], p['manufacturer']))
    names[name] = p

if duplicates:
    print("Found duplicates:")
    for d in duplicates:
        print(f"  - {d[0]} ({d[1]})")
else:
    print("No duplicates found.")
