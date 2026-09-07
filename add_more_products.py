import json

file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()

new_manufacturers = [
    "{ name: 'CCL Pharmaceuticals', description: 'Pakistani pharmaceutical company.', },",
    "{ name: 'Scilife Pharma', description: 'Pharmaceutical company in Pakistan.', },",
    "{ name: 'Bona Papa', description: 'Baby care manufacturer.', },",
    "{ name: 'Hayat Kimya', description: 'Manufacturer of Molfix diapers.', },"
]

for m in new_manufacturers:
    if m.split("'")[1] not in content:
        content = content.replace("] as const;", f"    {m}\n] as const;")

with open(file, 'w') as f:
    f.write(content)


with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

new_items = [
    {
      "name": "Sunny D",
      "genericName": "Vitamin D3",
      "strength": "200,000 IU",
      "packQuantity": 1,
      "packUnit": "Capsules",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Scilife Pharma",
      "dosageForm": "Softgel"
    },
    {
      "name": "Sunny D PRO",
      "genericName": "Vitamin D3",
      "strength": "200,000 IU",
      "packQuantity": 1,
      "packUnit": "Ampoules",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Scilife Pharma",
      "dosageForm": "Injection"
    },
    {
      "name": "Bona Papa Baby Diapers",
      "genericName": "Disposable Baby Diaper",
      "strength": "Size M",
      "packQuantity": 1,
      "packUnit": "Pack",
      "productType": "Baby Care",
      "category": "Baby Hygiene",
      "manufacturer": "Bona Papa",
      "dosageForm": "Other"
    },
    {
      "name": "Bona Papa Baby Diapers",
      "genericName": "Disposable Baby Diaper",
      "strength": "Size L",
      "packQuantity": 1,
      "packUnit": "Pack",
      "productType": "Baby Care",
      "category": "Baby Hygiene",
      "manufacturer": "Bona Papa",
      "dosageForm": "Other"
    },
    {
      "name": "Molfix Baby Diapers",
      "genericName": "Disposable Baby Diaper",
      "strength": "Size M",
      "packQuantity": 1,
      "packUnit": "Pack",
      "productType": "Baby Care",
      "category": "Baby Hygiene",
      "manufacturer": "Hayat Kimya",
      "dosageForm": "Other"
    },
    {
      "name": "Molfix Baby Diapers",
      "genericName": "Disposable Baby Diaper",
      "strength": "Size L",
      "packQuantity": 1,
      "packUnit": "Pack",
      "productType": "Baby Care",
      "category": "Baby Hygiene",
      "manufacturer": "Hayat Kimya",
      "dosageForm": "Other"
    },
    {
      "name": "Canbebe Baby Diapers",
      "genericName": "Disposable Baby Diaper",
      "strength": "Size M",
      "packQuantity": 1,
      "packUnit": "Pack",
      "productType": "Baby Care",
      "category": "Baby Hygiene",
      "manufacturer": "Ontex",
      "dosageForm": "Other"
    },
    {
      "name": "Kinza",
      "genericName": "Paracetamol",
      "strength": "500mg",
      "packQuantity": 100,
      "packUnit": "Tablets",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "CCL Pharmaceuticals",
      "dosageForm": "Tablet"
    }
]

# add Ontex
file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()
if "Ontex" not in content:
    content = content.replace("] as const;", "    { name: 'Ontex', description: 'Global hygiene solutions.', },\n] as const;")
with open(file, 'w') as f:
    f.write(content)

existing = {p['name'].lower() + p.get('strength', '').lower() for p in data['products']}

added = 0
for p in new_items:
    identifier = p['name'].lower() + p.get('strength', '').lower()
    if identifier not in existing:
        data['products'].append(p)
        existing.add(identifier)
        added += 1

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {added} products.")
