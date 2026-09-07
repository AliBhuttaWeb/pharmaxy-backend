import re

file = 'prisma/seeds/manufacturers.seed.ts'
with open(file, 'r') as f:
    content = f.read()

content = content.replace(", }", "}")
content = content.replace(", }", "}")
content = content.replace(", }", "}")

with open(file, 'w') as f:
    f.write(content)
