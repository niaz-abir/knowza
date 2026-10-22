"""Merge a.csv ... f.csv (columns: question, answer) into data/qa.json
Usage:  python scripts/csv_to_json.py path/to/folder_with_csvs
"""
import csv, glob, json, os, sys

folder = sys.argv[1] if len(sys.argv) > 1 else "."
rows = []
for f in sorted(glob.glob(os.path.join(folder, "*.csv"))):
    with open(f, newline="", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            q, a = (r.get("question") or "").strip(), (r.get("answer") or "").strip()
            if q and a:
                rows.append({"q": q, "a": a})

out = os.path.join(os.path.dirname(__file__), "..", "data", "qa.json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(rows, fh, ensure_ascii=False, separators=(",", ":"))
print(f"Wrote {len(rows)} rows -> data/qa.json")
