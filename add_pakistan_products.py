import json

new_products = [
    # Prescription Medicines & OTC (Pakistani/Common)
    {
      "name": "Panadol CF",
      "genericName": "Paracetamol + Caffeine",
      "strength": "500mg/65mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Panadol Extra",
      "genericName": "Paracetamol + Caffeine",
      "strength": "500mg/65mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Panadol Syrup",
      "genericName": "Paracetamol",
      "strength": "120mg/5ml",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Syrup"
    },
    {
      "name": "Brufen",
      "genericName": "Ibuprofen",
      "strength": "400mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Brufen DS",
      "genericName": "Ibuprofen",
      "strength": "200mg/5ml",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Suspension"
    },
    {
      "name": "Ponstan",
      "genericName": "Mefenamic Acid",
      "strength": "250mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "Pfizer Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Ponstan Forte",
      "genericName": "Mefenamic Acid",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "Pfizer Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Augmentin",
      "genericName": "Amoxicillin + Clavulanate",
      "strength": "625mg",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Augmentin",
      "genericName": "Amoxicillin + Clavulanate",
      "strength": "1g",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Novidat",
      "genericName": "Ciprofloxacin",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "SAMI Pharmaceuticals",
      "dosageForm": "Tablet"
    },
    {
      "name": "Leflox",
      "genericName": "Levofloxacin",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Tablet"
    },
    {
      "name": "Zetro",
      "genericName": "Azithromycin",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Tablet"
    },
    {
      "name": "Azomax",
      "genericName": "Azithromycin",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Antibiotics",
      "manufacturer": "Bosch Pharmaceuticals",
      "dosageForm": "Tablet"
    },
    {
      "name": "Softin",
      "genericName": "Loratadine",
      "strength": "10mg",
      "productType": "Medicine",
      "category": "Cold & Flu",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Tablet"
    },
    {
      "name": "Rigix",
      "genericName": "Cetirizine",
      "strength": "10mg",
      "productType": "Medicine",
      "category": "Cold & Flu",
      "manufacturer": "AGP Limited",
      "dosageForm": "Tablet"
    },
    {
      "name": "Arinac",
      "genericName": "Ibuprofen + Pseudoephedrine",
      "strength": "Combination",
      "productType": "Medicine",
      "category": "Cold & Flu",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Risek",
      "genericName": "Omeprazole",
      "strength": "40mg",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Capsule"
    },
    {
      "name": "Risek",
      "genericName": "Omeprazole",
      "strength": "20mg",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Capsule"
    },
    {
      "name": "Nexum",
      "genericName": "Esomeprazole",
      "strength": "40mg",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "AstraZeneca",
      "dosageForm": "Tablet"
    },
    {
      "name": "Gravinate",
      "genericName": "Dimenhydrinate",
      "strength": "50mg",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "The Searle Company",
      "dosageForm": "Tablet"
    },
    {
      "name": "Gaviscon",
      "genericName": "Sodium Alginate",
      "strength": "120ml",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "Reckitt",
      "dosageForm": "Syrup"
    },
    {
      "name": "Mucaine",
      "genericName": "Oxethazaine + Alumina + Magnesia",
      "strength": "120ml",
      "productType": "Medicine",
      "category": "Gastrointestinal",
      "manufacturer": "Wyeth", # wait, we don't have Wyeth, let's use Pfizer
      "dosageForm": "Syrup"
    },
    {
      "name": "Glucophage",
      "genericName": "Metformin",
      "strength": "500mg",
      "productType": "Medicine",
      "category": "Diabetes Care",
      "manufacturer": "Merck",
      "dosageForm": "Tablet"
    },
    {
      "name": "Getryl",
      "genericName": "Glimepiride",
      "strength": "2mg",
      "productType": "Medicine",
      "category": "Diabetes Care",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Tablet"
    },
    {
      "name": "Amaryl",
      "genericName": "Glimepiride",
      "strength": "2mg",
      "productType": "Medicine",
      "category": "Diabetes Care",
      "manufacturer": "Sanofi Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Concor",
      "genericName": "Bisoprolol",
      "strength": "5mg",
      "productType": "Medicine",
      "category": "Cardiac Care",
      "manufacturer": "Merck",
      "dosageForm": "Tablet"
    },
    {
      "name": "Lipget",
      "genericName": "Atorvastatin",
      "strength": "20mg",
      "productType": "Medicine",
      "category": "Cardiac Care",
      "manufacturer": "Getz Pharma",
      "dosageForm": "Tablet"
    },
    {
      "name": "Zestril",
      "genericName": "Lisinopril",
      "strength": "10mg",
      "productType": "Medicine",
      "category": "Cardiac Care",
      "manufacturer": "AstraZeneca",
      "dosageForm": "Tablet"
    },
    {
      "name": "Polyfax Eye Ointment",
      "genericName": "Polymyxin B + Bacitracin",
      "strength": "4g",
      "productType": "Medicine",
      "category": "Eye Care",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Ointment"
    },
    {
      "name": "Fucidin",
      "genericName": "Fusidic Acid",
      "strength": "2%",
      "productType": "Medicine",
      "category": "Dermatology",
      "manufacturer": "Leo Pharma",
      "dosageForm": "Cream"
    },
    {
      "name": "Betnovate",
      "genericName": "Betamethasone Valerate",
      "strength": "0.1%",
      "productType": "Medicine",
      "category": "Dermatology",
      "manufacturer": "GlaxoSmithKline Pakistan",
      "dosageForm": "Cream"
    },

    # Supplements, Herbal, Nutraceuticals
    {
      "name": "Surbex Z",
      "genericName": "Multivitamin + Zinc",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "CAC-1000 Plus",
      "genericName": "Calcium + Vitamin C + Vitamin D3 + B6",
      "strength": "1000mg",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Haleon",
      "dosageForm": "Tablet" # Actually effervescent tablet
    },
    {
      "name": "Calsan",
      "genericName": "Calcium Carbonate + Vitamin D3",
      "strength": "500mg/400IU",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Novartis Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Nutra-C",
      "genericName": "Vitamin C",
      "strength": "500mg",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Nutrifactor",
      "dosageForm": "Tablet"
    },
    {
      "name": "Vitamax Women",
      "genericName": "Multivitamin",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Nutrifactor",
      "dosageForm": "Tablet"
    },
    {
      "name": "Bonex-D",
      "genericName": "Calcium + Vitamin D3",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Nutrifactor",
      "dosageForm": "Tablet"
    },
    {
      "name": "Biotin Plus",
      "genericName": "Biotin + Folic Acid",
      "strength": "2500mcg",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Nutrifactor",
      "dosageForm": "Tablet"
    },
    {
      "name": "Herbiotics Pro Collagen",
      "genericName": "Collagen Peptides",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Herbiotics",
      "dosageForm": "Powder"
    },
    {
      "name": "Herbion Ivy Leaf Syrup",
      "genericName": "Ivy Leaf Extract",
      "strength": "120ml",
      "productType": "Supplement",
      "category": "Cold & Flu",
      "manufacturer": "Herbion Pakistan",
      "dosageForm": "Syrup"
    },
    {
      "name": "Insta-Link",
      "genericName": "Ivy Leaf + Thyme",
      "strength": "120ml",
      "productType": "Supplement",
      "category": "Cold & Flu",
      "manufacturer": "Herbion Pakistan",
      "dosageForm": "Syrup"
    },
    {
      "name": "Joshanda",
      "genericName": "Herbal Tea Extract",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Cold & Flu",
      "manufacturer": "Qarshi",
      "dosageForm": "Sachet"
    },
    {
      "name": "Johar Joshanda",
      "genericName": "Herbal Tea Extract",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Cold & Flu",
      "manufacturer": "Qarshi",
      "dosageForm": "Sachet"
    },
    {
      "name": "Safi",
      "genericName": "Herbal Blood Purifier",
      "strength": "175ml",
      "productType": "Supplement",
      "category": "Skin Care",
      "manufacturer": "Hamdard",
      "dosageForm": "Syrup"
    },
    {
      "name": "Carmina",
      "genericName": "Herbal Digestive Aid",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Gastrointestinal",
      "manufacturer": "Hamdard",
      "dosageForm": "Tablet"
    },
    {
      "name": "Ginkgo Biloba",
      "genericName": "Ginkgo Biloba Extract",
      "strength": "120mg",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Nutrifactor",
      "dosageForm": "Tablet"
    },
    {
      "name": "Folio",
      "genericName": "Folic Acid + Iodine",
      "strength": "400mcg",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Martin Dow",
      "dosageForm": "Tablet"
    },
    {
      "name": "Nims",
      "genericName": "Nimesulide",
      "strength": "100mg",
      "productType": "Medicine",
      "category": "Pain Relief",
      "manufacturer": "SAMI Pharmaceuticals",
      "dosageForm": "Tablet"
    },
    {
      "name": "Iberet Folic 500",
      "genericName": "Iron + Vitamin C + B-Complex",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Tablet"
    },
    {
      "name": "Sangobion",
      "genericName": "Iron + Multivitamin",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Martin Dow",
      "dosageForm": "Capsule"
    },
    {
      "name": "Centrum Lutein",
      "genericName": "Multivitamin + Lutein",
      "strength": "Standard",
      "productType": "Supplement",
      "category": "Vitamins",
      "manufacturer": "Haleon",
      "dosageForm": "Tablet"
    },
    {
      "name": "Ensure",
      "genericName": "Nutritional Supplement",
      "strength": "400g",
      "productType": "Supplement",
      "category": "Protein Supplements",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Powder"
    },
    {
      "name": "Glucerna",
      "genericName": "Diabetes Nutritional Formula",
      "strength": "400g",
      "productType": "Supplement",
      "category": "Protein Supplements",
      "manufacturer": "Abbott Laboratories Pakistan",
      "dosageForm": "Powder"
    }
]

with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

# Normalize Wyeth to Pfizer for Mucaine since Pfizer acquired Wyeth
for p in new_products:
    if p['manufacturer'] == 'Wyeth':
        p['manufacturer'] = 'Pfizer Pakistan'

# Add products but avoid exact duplicate names
existing_names = {p['name'].lower() for p in data['products']}
added_count = 0
for new_p in new_products:
    if new_p['name'].lower() not in existing_names:
        data['products'].append(new_p)
        added_count += 1
        existing_names.add(new_p['name'].lower())

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {added_count} products.")
