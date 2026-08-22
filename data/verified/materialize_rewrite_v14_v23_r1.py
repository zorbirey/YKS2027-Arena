from pathlib import Path
import base64, gzip, hashlib, json

HERE = Path(__file__).resolve().parent
SRC = HERE / "rewrite_v14_v23_r1_500.json.gz.b64"
DST = HERE / "rewrite_v14_v23_r1_500.json"
EXPECTED_RAW_SHA256 = "7b274dc10d8753e33cf6fb06138b3da30c808d6b51e76eb2582cd6b3eb77f56e"
EXPECTED_GZIP_SHA256 = "2fe796e6ddf4363c2d8bf4c1949e321137715a7636d047c14f4edd32ba79adf9"

encoded = SRC.read_text(encoding="utf-8").strip()
gz = base64.b64decode(encoded)
assert hashlib.sha256(gz).hexdigest() == EXPECTED_GZIP_SHA256
raw = gzip.decompress(gz)
assert hashlib.sha256(raw).hexdigest() == EXPECTED_RAW_SHA256
bank = json.loads(raw.decode("utf-8"))
assert bank["questionCount"] == 500
assert len(bank["questions"]) == 500
assert len({q["id"] for q in bank["questions"]}) == 500
DST.write_bytes(raw)
print(f"Wrote {DST.name}: {len(bank['questions'])} questions")
