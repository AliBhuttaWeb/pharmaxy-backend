file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()
if "Brookes Pharma" not in content:
    content = content.replace("] as const;", "    { name: 'Brookes Pharma', description: 'Pharmaceutical company in Pakistan.' },\n] as const;")
with open(file, 'w') as f:
    f.write(content)
