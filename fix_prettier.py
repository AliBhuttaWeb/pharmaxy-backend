import re

file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()

# find lines like: { name: '...', description: '...' },
# and add a trailing comma inside: { name: '...', description: '...', },
content = re.sub(r"(\{\s*name:\s*['\"][^'\"]+['\"],\s*description:\s*['\"][^'\"]+['\"])\s*\}", r"\1, }", content)

with open(file, 'w') as f:
    f.write(content)
