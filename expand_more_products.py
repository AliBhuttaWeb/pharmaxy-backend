import json
import random

manufacturers = [
    "Getz Pharma", "The Searle Company", "Highnoon Laboratories", "AGP Limited",
    "Hilton Pharma", "Martin Dow", "GlaxoSmithKline Pakistan", "Pfizer Pakistan",
    "Abbott Laboratories Pakistan", "Sanofi Pakistan", "Bosch Pharmaceuticals",
    "SAMI Pharmaceuticals", "Barrett Hodgson Pakistan", "Ferozsons Laboratories",
    "Tabros Pharma", "Pharmevo", "OBS Pakistan", "Herbion Pakistan",
    "Bayer Pakistan", "Novartis Pakistan", "Johnson & Johnson", "Procter & Gamble",
    "AstraZeneca", "Reckitt", "Merck", "Allergan", "Servier", "Beiersdorf", "Leo Pharma",
    "Nestle", "Kimberly-Clark", "Hamdard", "Colgate-Palmolive", "Alcon", "Unilever",
    "Haleon", "Nutrifactor", "Herbiotics", "Qarshi", "Brookes Pharma"
]

# Let's define some templates
templates = [
    # Cefixime
    {"generic": "Cefixime", "type": "Medicine", "cat": "Antibiotics", "strength": "400mg", "form": "Capsule", "packQ": 5, "packU": "Capsules"},
    {"generic": "Cefixime", "type": "Medicine", "cat": "Antibiotics", "strength": "200mg/5ml", "form": "Suspension", "packQ": 1, "packU": "Bottle"},
    # Omeprazole
    {"generic": "Omeprazole", "type": "Medicine", "cat": "Gastrointestinal", "strength": "20mg", "form": "Capsule", "packQ": 14, "packU": "Capsules"},
    {"generic": "Omeprazole", "type": "Medicine", "cat": "Gastrointestinal", "strength": "40mg", "form": "Capsule", "packQ": 14, "packU": "Capsules"},
    # Paracetamol
    {"generic": "Paracetamol", "type": "Medicine", "cat": "Pain Relief", "strength": "500mg", "form": "Tablet", "packQ": 100, "packU": "Tablets"},
    {"generic": "Paracetamol", "type": "Medicine", "cat": "Pain Relief", "strength": "120mg/5ml", "form": "Syrup", "packQ": 1, "packU": "Bottle"},
    # Ibuprofen
    {"generic": "Ibuprofen", "type": "Medicine", "cat": "Pain Relief", "strength": "400mg", "form": "Tablet", "packQ": 50, "packU": "Tablets"},
    # Levofloxacin
    {"generic": "Levofloxacin", "type": "Medicine", "cat": "Antibiotics", "strength": "500mg", "form": "Tablet", "packQ": 10, "packU": "Tablets"},
    # Azithromycin
    {"generic": "Azithromycin", "type": "Medicine", "cat": "Antibiotics", "strength": "500mg", "form": "Tablet", "packQ": 6, "packU": "Tablets"},
    # Amoxicillin + Clavulanate
    {"generic": "Amoxicillin + Clavulanate", "type": "Medicine", "cat": "Antibiotics", "strength": "625mg", "form": "Tablet", "packQ": 10, "packU": "Tablets"},
    {"generic": "Amoxicillin + Clavulanate", "type": "Medicine", "cat": "Antibiotics", "strength": "1g", "form": "Tablet", "packQ": 10, "packU": "Tablets"},
    # Losartan
    {"generic": "Losartan", "type": "Medicine", "cat": "Cardiac Care", "strength": "50mg", "form": "Tablet", "packQ": 20, "packU": "Tablets"},
    # Amlodipine
    {"generic": "Amlodipine", "type": "Medicine", "cat": "Cardiac Care", "strength": "5mg", "form": "Tablet", "packQ": 20, "packU": "Tablets"},
    # Rosuvastatin
    {"generic": "Rosuvastatin", "type": "Medicine", "cat": "Cardiac Care", "strength": "10mg", "form": "Tablet", "packQ": 10, "packU": "Tablets"},
    # Esomeprazole
    {"generic": "Esomeprazole", "type": "Medicine", "cat": "Gastrointestinal", "strength": "40mg", "form": "Tablet", "packQ": 14, "packU": "Tablets"},
    # Diclofenac
    {"generic": "Diclofenac Potassium", "type": "Medicine", "cat": "Pain Relief", "strength": "50mg", "form": "Tablet", "packQ": 20, "packU": "Tablets"},
    # Fexofenadine
    {"generic": "Fexofenadine", "type": "Medicine", "cat": "Cold & Flu", "strength": "120mg", "form": "Tablet", "packQ": 10, "packU": "Tablets"},
    # Vitamin C
    {"generic": "Vitamin C", "type": "Supplement", "cat": "Vitamins", "strength": "500mg", "form": "Tablet", "packQ": 30, "packU": "Tablets"},
]

pharma_companies = [m for m in manufacturers if "Pharma" in m or "Laboratories" in m or "Limited" in m or "Company" in m]

# brand name prefixes and suffixes
prefixes = ["Cef", "Omni", "Levo", "Azi", "Moxi", "Zol", "Cardi", "Nova", "Max", "Pro", "Evo", "Bio", "Cure", "Gastro", "Epi"]
suffixes = ["span", "sec", "lox", "max", "get", "ral", "tin", "cef", "pril", "sartan", "xime", "prazole", "mol", "fen"]

with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

existing = {p['name'].lower() for p in data['products']}

new_items = []
for t in templates:
    # generate 15 brands for each template
    for _ in range(15):
        pfx = random.choice(prefixes)
        sfx = random.choice(suffixes)
        brand_name = f"{pfx}{sfx}"
        if random.random() > 0.5:
            brand_name += f" {t['strength']}"
            
        if brand_name.lower() in existing:
            continue
            
        existing.add(brand_name.lower())
        
        mfg = random.choice(pharma_companies)
        
        new_items.append({
            "name": brand_name,
            "genericName": t["generic"],
            "formula": t["generic"],
            "strength": t["strength"],
            "packQuantity": t["packQ"],
            "packUnit": t["packU"],
            "productType": t["type"],
            "category": t["cat"],
            "manufacturer": mfg,
            "dosageForm": t["form"]
        })

data['products'].extend(new_items)

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {len(new_items)} generated realistic brands.")
