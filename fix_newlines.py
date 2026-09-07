import re

file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()

def replace_fn(match):
    name = match.group(1)
    desc = match.group(2)
    return f"{{\n        name: '{name}',\n        description: '{desc}',\n    }},"

# Match { name: '...', description: '...' },
content = re.sub(r"\{\s*name:\s*'([^']+)',\s*description:\s*'([^']+)'\s*\},?", replace_fn, content)

with open(file, 'w') as f:
    f.write(content)

file2 = 'prisma/seeds/dosage-forms.seed.ts'
with open(file2, 'r') as f:
    content = f.read()
content = re.sub(r"\{\s*name:\s*'([^']+)',\s*description:\s*'([^']+)'\s*\},?", replace_fn, content)
with open(file2, 'w') as f:
    f.write(content)
