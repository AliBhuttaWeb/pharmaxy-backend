import json

with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

for p in data['products']:
    if 'formula' in p:
        del p['formula']

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)
