import json

def update_manufacturers():
    file = 'prisma/seeds/manufacturers.seed.ts'
    with open(file, 'r') as f:
        content = f.read()

    new_manufacturers = [
        "{ name: 'Allergan', description: 'Global pharmaceutical company.' },",
        "{ name: 'Servier', description: 'International pharmaceutical company.' },",
        "{ name: 'Beiersdorf', description: 'Multinational skin care company.' },",
        "{ name: 'Leo Pharma', description: 'Multinational pharmaceutical company.' },",
        "{ name: 'Nestle', description: 'Multinational food and drink processing conglomerate.' },",
        "{ name: 'Kimberly-Clark', description: 'Multinational personal care corporation.' },",
        "{ name: 'Hamdard', description: 'Herbal and unani medicine manufacturer in Pakistan.' },",
        "{ name: 'Colgate-Palmolive', description: 'Multinational consumer products company.' },",
        "{ name: 'Alcon', description: 'Global medical company specializing in eye care products.' },",
        "{ name: 'Unilever', description: 'Multinational consumer goods company.' },",
        "{ name: 'Haleon', description: 'Multinational consumer healthcare company.' },",
        "{ name: 'Nutrifactor', description: 'Leading nutraceutical company in Pakistan.' },",
        "{ name: 'Herbiotics', description: 'Nutritional supplements manufacturer in Pakistan.' },",
        "{ name: 'Qarshi', description: 'Leading natural products manufacturer in Pakistan.' },",
        "{ name: 'Safi', description: 'Herbal medicine.' },"
    ]
    
    # insert before "] as const;"
    for m in new_manufacturers:
        if m.split("'")[1] not in content:
            content = content.replace("] as const;", "    " + m + "\n] as const;")
            
    with open(file, 'w') as f:
        f.write(content)

def update_dosage_forms():
    file = 'prisma/seeds/dosage-forms.seed.ts'
    with open(file, 'r') as f:
        content = f.read()

    new_dosage_forms = [
        "{ name: 'Other', description: 'Other or miscellaneous dosage form' },",
        "{ name: 'Softgel', description: 'Soft gelatin capsule' },",
        "{ name: 'Liquid', description: 'Liquid form' },"
    ]
    
    for df in new_dosage_forms:
        if df.split("'")[1] not in content:
            content = content.replace("];", "    " + df + "\n];")
            
    with open(file, 'w') as f:
        f.write(content)

update_manufacturers()
update_dosage_forms()

print("Updated seeders.")
