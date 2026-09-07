import json

with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

for p in data['products']:
    if 'packUnit' not in p:
        df = p.get('dosageForm', '').lower()
        if df in ['syrup', 'suspension', 'drops', 'liquid', 'lotion']:
            p['packUnit'] = 'Bottle'
            p['packQuantity'] = 1
        elif df in ['tablet', 'capsule', 'softgel']:
            p['packUnit'] = df.capitalize() + 's'
            p['packQuantity'] = 10  # default guess
        elif df in ['cream', 'ointment', 'gel']:
            p['packUnit'] = 'Tube'
            p['packQuantity'] = 1
        elif df in ['powder', 'sachet']:
            p['packUnit'] = 'Sachet'
            p['packQuantity'] = 1
        else:
            p['packUnit'] = 'Pack'
            p['packQuantity'] = 1

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)
