"""Paste this at the END of your notebook (after training) and run it.
It writes model.json - download it and put it in knowza/data/model.json
"""
import json

sd = {k: v.detach().cpu() for k, v in model.state_dict().items()}
r = lambda t: [round(float(x), 4) for x in t.flatten().tolist()]

out = {
    "vocab": vocab,
    "V": len(vocab),
    "E": sd["embedding.weight"].shape[1],
    "H": sd["rnn.weight_hh_l0"].shape[0],
    "emb": r(sd["embedding.weight"]),
    "wih": r(sd["rnn.weight_ih_l0"]),
    "whh": r(sd["rnn.weight_hh_l0"]),
    "bih": r(sd["rnn.bias_ih_l0"]),
    "bhh": r(sd["rnn.bias_hh_l0"]),
    "fcw": r(sd["fc.weight"]),
    "fcb": r(sd["fc.bias"]),
}
with open("model.json", "w") as f:
    json.dump(out, f, separators=(",", ":"))

# also export the merged dataset so the app uses the same data
df[["question", "answer"]].rename(columns={"question": "q", "answer": "a"}).to_json(
    "qa.json", orient="records", force_ascii=False)
print("Saved model.json and qa.json")

# from google.colab import files; files.download("model.json"); files.download("qa.json")
