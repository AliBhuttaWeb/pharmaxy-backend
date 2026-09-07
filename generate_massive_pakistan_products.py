import json

new_products = [
    # Analgesics & Antipyretics
    {"name": "Panadol", "genericName": "Paracetamol", "formula": "Paracetamol BP", "strength": "500mg", "packQuantity": 100, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Tablet"},
    {"name": "Calpol", "genericName": "Paracetamol", "formula": "Paracetamol BP", "strength": "120mg/5ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Syrup"},
    {"name": "Disprin", "genericName": "Aspirin", "formula": "Acetylsalicylic Acid", "strength": "300mg", "packQuantity": 100, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "Reckitt", "dosageForm": "Tablet"},
    {"name": "Synflex", "genericName": "Naproxen", "formula": "Naproxen Sodium", "strength": "550mg", "packQuantity": 20, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "Martin Dow", "dosageForm": "Tablet"},
    {"name": "Nuberol Forte", "genericName": "Paracetamol + Orphenadrine", "formula": "Paracetamol + Orphenadrine Citrate", "strength": "650mg/50mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "The Searle Company", "dosageForm": "Tablet"},
    {"name": "Voltral", "genericName": "Diclofenac", "formula": "Diclofenac Sodium", "strength": "50mg", "packQuantity": 20, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "Novartis Pakistan", "dosageForm": "Tablet"},
    {"name": "Dicloran", "genericName": "Diclofenac", "formula": "Diclofenac Potassium", "strength": "50mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "SAMI Pharmaceuticals", "dosageForm": "Tablet"},
    
    # Antibiotics
    {"name": "Velosef", "genericName": "Cephradine", "formula": "Cephradine BP", "strength": "500mg", "packQuantity": 12, "packUnit": "Capsules", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Capsule"},
    {"name": "Cefspan", "genericName": "Cefixime", "formula": "Cefixime Trihydrate", "strength": "400mg", "packQuantity": 5, "packUnit": "Capsules", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Martin Dow", "dosageForm": "Capsule"},
    {"name": "Klaricid", "genericName": "Clarithromycin", "formula": "Clarithromycin", "strength": "250mg", "packQuantity": 10, "packUnit": "Tablets", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Tablet"},
    {"name": "Klaricid", "genericName": "Clarithromycin", "formula": "Clarithromycin", "strength": "500mg", "packQuantity": 10, "packUnit": "Tablets", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Tablet"},
    {"name": "Flagyl", "genericName": "Metronidazole", "formula": "Metronidazole BP", "strength": "400mg", "packQuantity": 200, "packUnit": "Tablets", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Sanofi Pakistan", "dosageForm": "Tablet"},
    {"name": "Flagyl Suspension", "genericName": "Metronidazole", "formula": "Metronidazole Benzoyl", "strength": "200mg/5ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Sanofi Pakistan", "dosageForm": "Suspension"},
    {"name": "Dalacin C", "genericName": "Clindamycin", "formula": "Clindamycin Phosphate", "strength": "300mg", "packQuantity": 10, "packUnit": "Capsules", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Pfizer Pakistan", "dosageForm": "Capsule"},
    {"name": "Ceporex", "genericName": "Cephalexin", "formula": "Cephalexin BP", "strength": "500mg", "packQuantity": 20, "packUnit": "Capsules", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Capsule"},
    {"name": "Moxiget", "genericName": "Moxifloxacin", "formula": "Moxifloxacin HCl", "strength": "400mg", "packQuantity": 5, "packUnit": "Tablets", "productType": "Medicine", "category": "Antibiotics", "manufacturer": "Getz Pharma", "dosageForm": "Tablet"},
    
    # Cough, Cold & Antiallergics
    {"name": "Telfast", "genericName": "Fexofenadine", "formula": "Fexofenadine HCl", "strength": "120mg", "packQuantity": 10, "packUnit": "Tablets", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "Sanofi Pakistan", "dosageForm": "Tablet"},
    {"name": "Kestine", "genericName": "Ebastine", "formula": "Ebastine", "strength": "10mg", "packQuantity": 10, "packUnit": "Tablets", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "Highnoon Laboratories", "dosageForm": "Tablet"},
    {"name": "Piriton", "genericName": "Chlorpheniramine", "formula": "Chlorphenamine Maleate", "strength": "4mg", "packQuantity": 100, "packUnit": "Tablets", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Tablet"},
    {"name": "Hydryllin", "genericName": "Aminophylline + Diphenhydramine", "formula": "Aminophylline + Diphenhydramine", "strength": "120ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "The Searle Company", "dosageForm": "Syrup"},
    {"name": "Acefyl Cough", "genericName": "Diphenhydramine + Ammonium", "formula": "Diphenhydramine HCl + Ammonium Chloride", "strength": "120ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Syrup"},
    {"name": "Pulmonol", "genericName": "Dextromethorphan + Chlorpheniramine", "formula": "Dextromethorphan + Chlorpheniramine", "strength": "120ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "The Searle Company", "dosageForm": "Syrup"},
    {"name": "Myteka", "genericName": "Montelukast", "formula": "Montelukast Sodium", "strength": "10mg", "packQuantity": 14, "packUnit": "Tablets", "productType": "Medicine", "category": "Cold & Flu", "manufacturer": "Hilton Pharma", "dosageForm": "Tablet"},

    # Gastrointestinal
    {"name": "Gastrosec", "genericName": "Omeprazole", "formula": "Omeprazole", "strength": "20mg", "packQuantity": 14, "packUnit": "Capsules", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Highnoon Laboratories", "dosageForm": "Capsule"},
    {"name": "Novidam", "genericName": "Domperidone", "formula": "Domperidone Maleate", "strength": "10mg", "packQuantity": 50, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "SAMI Pharmaceuticals", "dosageForm": "Tablet"}, # actually Motilium is better, let's use Motilium
    {"name": "Motilium", "genericName": "Domperidone", "formula": "Domperidone Maleate", "strength": "10mg", "packQuantity": 50, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Johnson & Johnson", "dosageForm": "Tablet"},
    {"name": "Eno", "genericName": "Antacid", "formula": "Sodium Bicarbonate + Citric Acid", "strength": "5g", "packQuantity": 6, "packUnit": "Sachets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Haleon", "dosageForm": "Powder"},
    {"name": "Entamizole", "genericName": "Diloxanide + Metronidazole", "formula": "Diloxanide Furoate + Metronidazole", "strength": "250mg/200mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Tablet"},
    {"name": "Entamizole DS", "genericName": "Diloxanide + Metronidazole", "formula": "Diloxanide Furoate + Metronidazole", "strength": "500mg/400mg", "packQuantity": 15, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Tablet"},
    {"name": "Spasler P", "genericName": "Hyoscine + Paracetamol", "formula": "Hyoscine Butylbromide + Paracetamol", "strength": "10mg/500mg", "packQuantity": 20, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Martin Dow", "dosageForm": "Tablet"},
    {"name": "Buscopan", "genericName": "Hyoscine Butylbromide", "formula": "Hyoscine Butylbromide", "strength": "10mg", "packQuantity": 100, "packUnit": "Tablets", "productType": "Medicine", "category": "Gastrointestinal", "manufacturer": "Sanofi Pakistan", "dosageForm": "Tablet"},

    # Cardiovascular & Diabetes
    {"name": "Tenormin", "genericName": "Atenolol", "formula": "Atenolol BP", "strength": "50mg", "packQuantity": 14, "packUnit": "Tablets", "productType": "Medicine", "category": "Cardiac Care", "manufacturer": "AstraZeneca", "dosageForm": "Tablet"},
    {"name": "Inderal", "genericName": "Propranolol", "formula": "Propranolol HCl", "strength": "10mg", "packQuantity": 50, "packUnit": "Tablets", "productType": "Medicine", "category": "Cardiac Care", "manufacturer": "AstraZeneca", "dosageForm": "Tablet"},
    {"name": "Lipitor", "genericName": "Atorvastatin", "formula": "Atorvastatin Calcium", "strength": "20mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Medicine", "category": "Cardiac Care", "manufacturer": "Pfizer Pakistan", "dosageForm": "Tablet"},
    {"name": "Cardura", "genericName": "Doxazosin", "formula": "Doxazosin Mesylate", "strength": "2mg", "packQuantity": 14, "packUnit": "Tablets", "productType": "Medicine", "category": "Cardiac Care", "manufacturer": "Pfizer Pakistan", "dosageForm": "Tablet"},
    {"name": "Diamicron MR", "genericName": "Gliclazide", "formula": "Gliclazide MR", "strength": "30mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Medicine", "category": "Diabetes Care", "manufacturer": "Servier", "dosageForm": "Tablet"},
    {"name": "Mixtard 30", "genericName": "Insulin", "formula": "Biphasic Isophane Insulin", "strength": "100IU/ml", "packQuantity": 1, "packUnit": "Vial", "productType": "Medicine", "category": "Diabetes Care", "manufacturer": "Novartis Pakistan", "dosageForm": "Injection"},

    # Dermatology & Topical
    {"name": "Polyderm", "genericName": "Polymyxin B + Bacitracin", "formula": "Polymyxin B + Bacitracin", "strength": "20g", "packQuantity": 1, "packUnit": "Tube", "productType": "Medicine", "category": "Dermatology", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Cream"},
    {"name": "Hydrozole", "genericName": "Hydrocortisone + Clotrimazole", "formula": "Hydrocortisone + Clotrimazole", "strength": "10g", "packQuantity": 1, "packUnit": "Tube", "productType": "Medicine", "category": "Dermatology", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Cream"},
    {"name": "Dermovate", "genericName": "Clobetasol", "formula": "Clobetasol Propionate", "strength": "0.05%", "packQuantity": 1, "packUnit": "Tube", "productType": "Medicine", "category": "Dermatology", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Ointment"},
    {"name": "Canesten", "genericName": "Clotrimazole", "formula": "Clotrimazole", "strength": "1%", "packQuantity": 1, "packUnit": "Tube", "productType": "Medicine", "category": "Dermatology", "manufacturer": "Bayer Pakistan", "dosageForm": "Cream"},
    {"name": "Voltral Emulgel", "genericName": "Diclofenac", "formula": "Diclofenac Diethylamine", "strength": "1%", "packQuantity": 1, "packUnit": "Tube", "productType": "Medicine", "category": "Pain Relief", "manufacturer": "Novartis Pakistan", "dosageForm": "Gel"},

    # Vitamins, Supplements & Herbal
    {"name": "Calsan Chewable", "genericName": "Calcium Carbonate", "formula": "Calcium Carbonate", "strength": "500mg", "packQuantity": 30, "packUnit": "Tablets", "productType": "Supplement", "category": "Vitamins", "manufacturer": "Novartis Pakistan", "dosageForm": "Tablet"},
    {"name": "Fefol Vit", "genericName": "Iron + Folic Acid + Vitamins", "formula": "Dried Ferrous Sulphate + Folic Acid + Vitamins", "strength": "Standard", "packQuantity": 30, "packUnit": "Capsules", "productType": "Supplement", "category": "Vitamins", "manufacturer": "GlaxoSmithKline Pakistan", "dosageForm": "Capsule"},
    {"name": "SurFex", "genericName": "Multivitamin", "formula": "Multivitamin + Iron", "strength": "Standard", "packQuantity": 30, "packUnit": "Tablets", "productType": "Supplement", "category": "Vitamins", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Tablet"},
    {"name": "Vidaylin", "genericName": "Multivitamin", "formula": "Multivitamin drops", "strength": "15ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Supplement", "category": "Vitamins", "manufacturer": "Abbott Laboratories Pakistan", "dosageForm": "Drops"},
    {"name": "Optisource", "genericName": "Nutritional Supplement", "formula": "Protein + Vitamins", "strength": "400g", "packQuantity": 1, "packUnit": "Tin", "productType": "Supplement", "category": "Protein Supplements", "manufacturer": "Nestle", "dosageForm": "Powder"},
    {"name": "Qarshi Jam-e-Shirin", "genericName": "Herbal Syrup", "formula": "Natural Herbal Extracts", "strength": "800ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Food & Beverage", "category": "Beverages", "manufacturer": "Qarshi", "dosageForm": "Syrup"},
    {"name": "Johar Joshanda Zinc", "genericName": "Herbal Tea + Zinc", "formula": "Herbal Extract + Zinc", "strength": "Standard", "packQuantity": 30, "packUnit": "Sachets", "productType": "Supplement", "category": "Cold & Flu", "manufacturer": "Qarshi", "dosageForm": "Sachet"},
    {"name": "Rooh Afza GO", "genericName": "Herbal Drink", "formula": "Herbal Extract", "strength": "250ml", "packQuantity": 1, "packUnit": "Can", "productType": "Food & Beverage", "category": "Beverages", "manufacturer": "Hamdard", "dosageForm": "Liquid"},

    # Other Essentials
    {"name": "Pyodine", "genericName": "Povidone Iodine", "formula": "Povidone Iodine 10%", "strength": "60ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Surgical Item", "category": "Surgical Supplies", "manufacturer": "Brookes Pharma", "dosageForm": "Liquid"},
    {"name": "Dettol Antiseptic", "genericName": "Chloroxylenol", "formula": "Chloroxylenol 4.8%", "strength": "100ml", "packQuantity": 1, "packUnit": "Bottle", "productType": "Personal Care", "category": "Bath & Hygiene", "manufacturer": "Reckitt", "dosageForm": "Liquid"},
    {"name": "Aqua", "genericName": "Water for Injection", "formula": "Sterile Water", "strength": "5ml", "packQuantity": 100, "packUnit": "Ampoules", "productType": "Surgical Item", "category": "Surgical Supplies", "manufacturer": "SAMI Pharmaceuticals", "dosageForm": "Injection"}
]

# We might have introduced Brookes Pharma. Let's add it dynamically to manufacturers if not exists in the list.

with open('prisma/data/products.json', 'r') as f:
    data = json.load(f)

# Keep track of existing
existing_names = {p['name'].lower() for p in data['products']}
added = 0

for p in new_products:
    if p['name'].lower() not in existing_names:
        data['products'].append(p)
        existing_names.add(p['name'].lower())
        added += 1

with open('prisma/data/products.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {added} highly common Pakistani products.")
