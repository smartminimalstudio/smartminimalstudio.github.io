from pathlib import Path
import hashlib, json, zipfile
root = Path(__file__).resolve().parents[1]
source = root / 'docs'
out = root / 'build'
out.mkdir(exist_ok=True)
files = sorted(p for p in source.rglob('*') if p.is_file() and not p.name.startswith('.'))
for p in files:
    if p.suffix.lower() in {'.stl', '.3mf', '.fcstd', '.step', '.stp', '.zip', '.pdf', '.glb', '.gltf'}:
        raise SystemExit(f'Paid or geometry asset must not be published: {p}')
    if p.stat().st_size > 25 * 1024 * 1024:
        raise SystemExit(f'Asset exceeds Pages limit: {p}')
archive = out / 'smartminimalstudio-pages.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, p.relative_to(source).as_posix())
audit = {'files':len(files),'archive_bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'source':'docs','host':'Cloudflare Pages','no_paid_geometry':True}
(out / 'package-audit.json').write_text(json.dumps(audit, indent=2))
print(json.dumps(audit))
