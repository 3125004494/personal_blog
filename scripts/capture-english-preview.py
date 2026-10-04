"""只读加载课设 Web 层，以隔离的合成数据启动作品集截图服务。"""
from pathlib import Path
import sys

SOURCE = Path(r"D:\GDUT\程序设计作业\课设作业\4494郑泽韩课设")
WORKSPACE = Path(__file__).resolve().parents[1]
DATA = WORKSPACE / ".cache" / "english-preview-data"
sys.dont_write_bytecode = True
sys.path.insert(0, str(SOURCE))
from web.app import create_app

DATA.mkdir(parents=True, exist_ok=True)
questions = [
    ("b()nana", "a"), ("w()ather", "e"), ("c()mputer", "o"),
    ("l()brary", "i"), ("st()dent", "u"), ("pr()ctice", "a"),
    ("kn()wledge", "o"), ("lang()age", "u"), ("scho()l", "o"),
    ("fr()end", "i"),
]
(DATA / "timu.txt").write_text(
    "题号\t题目\t答案\t分值\n" + "".join(
        f"{index}\t{text}\t{answer}\t10.00\n"
        for index, (text, answer) in enumerate(questions, 1)
    ), encoding="utf-8",
)
# 仅重置本脚本在作品集 .cache 内生成的演示记录，不读取原项目数据。
(DATA / "stu.txt").write_text("", encoding="utf-8")
app = create_app(DATA)
with app.test_client() as client:
    for index, correct_count in enumerate([5, 6, 7, 8, 9, 10, 9, 8], 1):
        payload = {
            "major": "示例专业", "classroom": "示例班级", "name": f"演示学生{index}",
            "answers": {
                str(num): answer if num <= correct_count else "z"
                for num, (_, answer) in enumerate(questions, 1)
            },
        }
        response = client.post("/api/attempts", json=payload)
        if response.status_code != 201:
            raise RuntimeError("合成答题记录生成失败")
    print("Isolated synthetic overview:", client.get("/api/overview").get_json(), flush=True)
app.run(host="127.0.0.1", port=5183, debug=False, use_reloader=False)
