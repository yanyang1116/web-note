# web note

先做网页版，做的全一点，跑起来

## husky v8 的安装流程

1. 安装 @commitlint/cli、@commitlint/config-conventional、husky、lint-staged
2. 配置 commitlint.config.js、在 package.json 中配置 lint-staged 相关参数
3. 配置本目录命令: husky install 并运行（当然全局或者 npx 也可以）
4. npx husky add .husky/pre-commit "npm test" (npm test 预检测时会运行的脚本)
5. git add .husky/pre-commit git commit -m "把生成的内容提交"
6. npx husky add .husky/commit-msg 'npx --no -- commitlint --edit'（用 npx 生成 commitlint 文件）

此时，package.json 中不需要制定任何和 commit-msg 相关的内容，commit-msg 会根据 commitlint.config.js 运行
lint-staged 建议在 package.json 中指定
` "lint-staged": { "*.{js,jsx,ts,tsx}": [ "git add" ] }`

这个 git add 是为了下面这一些格式化，然后做的一个命令，如果不配合下面这些格式化，实际上没太大意义

husky TODO:

-   ts
-   eslint 格式化
-   prettierrc 格式化

`"prettier": "prettier --write ."` 这个命令在 `lint staged` 的时候应该写成 `"prettier": "prettier --write"` 只覆盖当前

es lint、ts lint、style lint TODO


## webpack https 调试 TODO
## 生产模式 dll，ts fork 优化 TODO
## 生产配置 TODO
## tsconfig 和目前 webpack 关系
## webpack 5 代理？？？
