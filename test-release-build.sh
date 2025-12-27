#!/bin/bash

# 本地测试 release.yml 构建流程的脚本
# 使用方法: ./test-release-build.sh

set -e  # 遇到错误立即退出

echo "=========================================="
echo "Testing Release Build Process Locally"
echo "=========================================="
echo ""

# 检查是否在项目根目录
if [ ! -f "rush.json" ]; then
    echo "错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 设置环境变量（与 release.yml 保持一致）
export NODE_OPTIONS="--max_old_space_size=4096"
export NO_EMIT_ON_ERROR="true"

echo "环境变量设置:"
echo "  NODE_OPTIONS: $NODE_OPTIONS"
echo "  NO_EMIT_ON_ERROR: $NO_EMIT_ON_ERROR"
echo ""

# 检查 rush 是否已安装
if ! command -v rush &> /dev/null; then
    echo "Rush 未安装，正在安装..."
    node common/scripts/install-run-rush.js install --bypass-policy
else
    echo "Rush 已安装"
fi

echo ""
echo "=========================================="
echo "开始构建所有标记为 package 的包"
echo "=========================================="
echo ""

# 运行构建，并将输出保存到文件
LOG_FILE="build-test.log"
echo "构建日志将保存到: $LOG_FILE"
echo ""

# 运行构建命令（与 release.yml 保持一致）
# 设置环境变量确保错误信息完整输出（与 release.yml 中的 run 块保持一致）
export NODE_OPTIONS="--max_old_space_size=4096"
export NO_EMIT_ON_ERROR="true"
node common/scripts/install-run-rush.js build --only tag:package 2>&1 | tee "$LOG_FILE" || {
    BUILD_EXIT_CODE=$?
    echo ""
    echo "=========================================="
    echo "构建失败 (退出码: $BUILD_EXIT_CODE)"
    echo "=========================================="
    echo ""
    echo "=== Build failed, showing last 1000 lines of $LOG_FILE ==="
    echo "----------------------------------------"
    tail -n 1000 "$LOG_FILE"
    echo ""
    echo "=== Full error details ==="
    # 尝试从日志中提取错误信息（与 release.yml 保持一致）
    grep -A 50 "TypeScript Compilation Errors" "$LOG_FILE" || true
    grep -A 50 "Build Error" "$LOG_FILE" || true
    
    # 搜索失败信息
    if grep -q "FAILURE" "$LOG_FILE"; then
        echo "找到失败信息:"
        echo "----------------------------------------"
        grep -B 5 -A 20 "FAILURE" "$LOG_FILE" || true
        echo ""
    fi
    
    echo "完整日志文件: $LOG_FILE"
    exit $BUILD_EXIT_CODE
}

echo ""
echo "=========================================="
echo "构建成功！"
echo "=========================================="
echo ""

