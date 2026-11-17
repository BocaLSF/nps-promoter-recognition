# NPS Promoter · Daily Recognition Studio

用于每日认可收获 **NPS Promoter** 同事的可视化海报与控制台工具。

## 核心特性

- **首屏纯净 16:9 舞台**：打开页面即呈现 16:9 比例的认可海报，支持快捷键 `F` 全屏投屏展示，以及离线一键导出 `2560 × 1440` 高清 PNG 海报。
- **清亮包豪斯海报美学**：极简信息设计，海报仅呈现 `NPS PROMOTER`、日期、同事 Memoji 头像与名字，搭配明快包豪斯几何色块与描边硬阴影。
- **人数自适应排布**：1 人自动居中放大，2 至 3 人均衡舒展分布，4 人及以上自动单排或多排居中错落排布。
- **Anthropic × Claude Code 风格控制台**：向下滑动进入控制台，支持命令行式输入姓名、毫秒级检索匹配 Memoji 头像、切换配色主题与日期格式。
- **双通道 Memoji 素材匹配**：
  1. **网页拖拽入库**：在控制台右侧直接拖入 `姓名.png`，自动永久保存在浏览器本地 `IndexedDB`，并支持导出/恢复 `.json` 素材库备份。
  2. **本地文件夹读取**：将透明底 Memoji 放入仓库的 `memojis/` 文件夹（如 `memojis/Alex.png`），输入名字即可自动加载。

## 跨设备继续开发指南

1. 克隆仓库到本地：
   ```bash
   git clone <repo-url>
   cd nps-promoter-recognition
   ```
2. 直接在浏览器打开 `index.html`（或运行 `python3 -m http.server 8080`）即可实时修改 `src/` 下的样式与逻辑。
3. 若使用 **Claude Code** 继续迭代，直接在本目录运行 `claude`，会自动读取根目录下的 `CLAUDE.md` 获取全部设计约束与模块说明。
4. 修改完成后，如需重新生成单文件便携版 HTML：
   ```bash
   python3 scripts/build-standalone.py
   ```
