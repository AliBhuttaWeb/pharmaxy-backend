import re

file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()

# Just look for }, without trailing comma before it, and replace with , },
content = re.sub(r"description:\s*'([^']+)'\s*\}", r"description: '\1', }", content)

with open(file, 'w') as f:
    f.write(content)

file2 = 'prisma/seeds/dosage-forms.seed.ts'
with open(file2, 'r') as f:
    content = f.read()
content = re.sub(r"description:\s*'([^']+)'\s*\}", r"description: '\1', }", content)
with open(file2, 'w') as f:
    f.write(content)
