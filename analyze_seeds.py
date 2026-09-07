import json
import re

def extract_names_from_ts(filepath):
    names = set()
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            # Match { name: 'Something' } or { name: "Something" }
            matches = re.findall(r"name\s*:\s*['\"]([^'\"]+)['\"]", content)
            names.update(matches)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return names

with open('prisma/data/products.json', 'r') as f:
    products = json.load(f)['products']

prod_manufacturers = set(p.get('manufacturer') for p in products if p.get('manufacturer'))
prod_types = set(p.get('productType') for p in products if p.get('productType'))
prod_categories = set(p.get('category') for p in products if p.get('category'))
prod_dosage_forms = set(p.get('dosageForm') for p in products if p.get('dosageForm'))

seed_manufacturers = extract_names_from_ts('prisma/seeds/manufacturers.seed.ts')
seed_types = extract_names_from_ts('prisma/seeds/product-types.seed.ts')
seed_categories = extract_names_from_ts('prisma/seeds/retail-categories.seed.ts')
seed_dosage_forms = extract_names_from_ts('prisma/seeds/dosage-forms.seed.ts')

print("Missing Manufacturers:")
for m in prod_manufacturers - seed_manufacturers:
    print(f"  - {m}")
    
print("\nMissing Product Types:")
for t in prod_types - seed_types:
    print(f"  - {t}")
    
print("\nMissing Retail Categories:")
for c in prod_categories - seed_categories:
    print(f"  - {c}")
    
print("\nMissing Dosage Forms:")
for d in prod_dosage_forms - seed_dosage_forms:
    print(f"  - {d}")

