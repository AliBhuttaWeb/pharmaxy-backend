import json

with open('prisma/data/products.json', 'r') as f:
    products = json.load(f)['products']

print(f"Total products: {len(products)}")
