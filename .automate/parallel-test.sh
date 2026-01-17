#!/bin/bash

# SAP EASY GO - 并行测试脚本
# 用途: 并行运行多个测试任务,模拟 Boris Cherny 的并行工作流
# 使用: ./.automate/parallel-test.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_task() {
    echo -e "${CYAN}[Task $1]${NC} $2"
}

# 创建日志目录
mkdir -p .automate/logs

# 清理旧日志
rm -f .automate/logs/*.log

log_info "启动并行测试..."
log_info "同时运行 5 个测试任务"
echo ""

# ============================================
# 并行任务定义
# ============================================

# Task 1: 后端单元测试
task1() {
    log_task "1" "后端单元测试"
    cd olora
    pnpm --filter @olora/backend test --passWithNoTests > ../.automate/logs/task1-backend-test.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "Task 1: 后端单元测试通过"
        return 0
    else
        log_error "Task 1: 后端单元测试失败"
        cat ../.automate/logs/task1-backend-test.log
        return 1
    fi
}

# Task 2: 前端类型检查
task2() {
    log_task "2" "前端类型检查"
    cd olora
    pnpm --filter @olora/web exec tsc --noEmit > ../.automate/logs/task2-frontend-types.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "Task 2: 前端类型检查通过"
        return 0
    else
        log_error "Task 2: 前端类型检查失败"
        cat ../.automate/logs/task2-frontend-types.log
        return 1
    fi
}

# Task 3: 后端类型检查
task3() {
    log_task "3" "后端类型检查"
    cd olora
    pnpm --filter @olora/backend exec tsc --noEmit > ../.automate/logs/task3-backend-types.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "Task 3: 后端类型检查通过"
        return 0
    else
        log_error "Task 3: 后端类型检查失败"
        cat ../.automate/logs/task3-backend-types.log
        return 1
    fi
}

# Task 4: ESLint 检查
task4() {
    log_task "4" "ESLint 代码检查"
    cd olora
    pnpm lint > ../.automate/logs/task4-eslint.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "Task 4: ESLint 检查通过"
        return 0
    else
        log_error "Task 4: ESLint 检查失败"
        cat ../.automate/logs/task4-eslint.log
        return 1
    fi
}

# Task 5: Prettier 检查
task5() {
    log_task "5" "Prettier 格式检查"
    cd olora
    pnpm exec prettier --check "apps/**/*.{ts,tsx,js,jsx}" > ../.automate/logs/task5-prettier.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "Task 5: Prettier 检查通过"
        return 0
    else
        log_error "Task 5: Prettier 格式不一致"
        return 1
    fi
}

# ============================================
# 并行执行
# ============================================

log_info "并行执行 5 个任务..."
echo ""

# 后台启动所有任务
task1 &
PID1=$!

task2 &
PID2=$!

task3 &
PID3=$!

task4 &
PID4=$!

task5 &
PID5=$!

# 等待所有任务完成
wait $PID1
RESULT1=$?

wait $PID2
RESULT2=$?

wait $PID3
RESULT3=$?

wait $PID4
RESULT4=$?

wait $PID5
RESULT5=$?

echo ""
echo "============================================"
log_info "并行测试完成"
echo "============================================"
echo ""

# 计算结果
TOTAL=5
PASSED=0

[ $RESULT1 -eq 0 ] && ((PASSED++))
[ $RESULT2 -eq 0 ] && ((PASSED++))
[ $RESULT3 -eq 0 ] && ((PASSED++))
[ $RESULT4 -eq 0 ] && ((PASSED++))
[ $RESULT5 -eq 0 ] && ((PASSED++))

echo "通过: $PASSED/$TOTAL"
echo ""

# 详细结果
echo "详细结果:"
[ $RESULT1 -eq 0 ] && log_success "Task 1: 后端单元测试" || log_error "Task 1: 后端单元测试"
[ $RESULT2 -eq 0 ] && log_success "Task 2: 前端类型检查" || log_error "Task 2: 前端类型检查"
[ $RESULT3 -eq 0 ] && log_success "Task 3: 后端类型检查" || log_error "Task 3: 后端类型检查"
[ $RESULT4 -eq 0 ] && log_success "Task 4: ESLint 检查" || log_error "Task 4: ESLint 检查"
[ $RESULT5 -eq 0 ] && log_success "Task 5: Prettier 检查" || log_error "Task 5: Prettier 检查"

echo ""

# 日志位置
log_info "详细日志位置: .automate/logs/"
echo ""

# 退出码
if [ $PASSED -eq $TOTAL ]; then
    log_success "所有测试通过! ✨"
    exit 0
else
    log_error "$((TOTAL - PASSED)) 个测试失败"
    exit 1
fi
