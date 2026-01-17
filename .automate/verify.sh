#!/bin/bash

# SAP EASY GO - 自动化验证脚本
# 用途: 验证代码质量、测试通过、构建成功
# 使用: ./.automate/verify.sh [--fast|--full]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# 检查模式
MODE=${1:-"--fast"}

log_info "开始自动化验证 (模式: $MODE)"
echo ""

# ============================================
# 1. 环境检查
# ============================================
log_info "Step 1/7: 检查开发环境..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_NODE_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE_VERSION" ]; then
    log_success "Node.js 版本: $NODE_VERSION (>= 18.0.0)"
else
    log_error "Node.js 版本过低: $NODE_VERSION (需要 >= 18.0.0)"
    exit 1
fi

# 检查 pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    log_success "pnpm 版本: $PNPM_VERSION"
else
    log_error "pnpm 未安装,请运行: npm install -g pnpm"
    exit 1
fi

# 检查 Docker
if command -v docker &> /dev/null; then
    log_success "Docker 已安装"
else
    log_warning "Docker 未安装,跳过服务检查"
fi

echo ""

# ============================================
# 2. 依赖检查
# ============================================
log_info "Step 2/7: 检查依赖安装..."

if [ ! -d "olora/node_modules" ]; then
    log_warning "依赖未安装,正在安装..."
    cd olora && pnpm install && cd ..
    log_success "依赖安装完成"
else
    log_success "依赖已安装"
fi

echo ""

# ============================================
# 3. Docker 服务检查
# ============================================
log_info "Step 3/7: 检查 Docker 服务..."

if command -v docker &> /dev/null; then
    # 检查 PostgreSQL
    if docker ps | grep -q postgres; then
        log_success "PostgreSQL 运行中"
    else
        log_warning "PostgreSQL 未运行"
        log_info "启动 Docker 服务..."
        cd olora && docker-compose up -d && cd ..
        sleep 5
        log_success "Docker 服务已启动"
    fi

    # 检查 Redis
    if docker ps | grep -q redis; then
        log_success "Redis 运行中"
    else
        log_warning "Redis 未运行"
    fi

    # 检查 Qdrant
    if docker ps | grep -q qdrant; then
        log_success "Qdrant 运行中"
    else
        log_warning "Qdrant 未运行 (可选)"
    fi
else
    log_warning "跳过 Docker 服务检查"
fi

echo ""

# ============================================
# 4. 代码质量检查
# ============================================
log_info "Step 4/7: 代码质量检查..."

cd olora

# ESLint 检查
log_info "运行 ESLint..."
if pnpm lint --quiet 2>&1 | grep -q "error"; then
    log_error "ESLint 检查失败"
    pnpm lint
    exit 1
else
    log_success "ESLint 检查通过"
fi

# Prettier 检查 (仅检查,不自动修复)
log_info "运行 Prettier..."
if pnpm exec prettier --check "apps/**/*.{ts,tsx,js,jsx}" --loglevel silent 2>/dev/null; then
    log_success "Prettier 检查通过"
else
    log_warning "Prettier 格式不一致,建议运行: pnpm format"
fi

cd ..

echo ""

# ============================================
# 5. 类型检查
# ============================================
log_info "Step 5/7: TypeScript 类型检查..."

cd olora

# 后端类型检查
log_info "检查后端类型..."
if pnpm --filter @olora/backend exec tsc --noEmit 2>&1 | grep -q "error TS"; then
    log_error "后端类型检查失败"
    pnpm --filter @olora/backend exec tsc --noEmit
    exit 1
else
    log_success "后端类型检查通过"
fi

# 前端类型检查
log_info "检查前端类型..."
if pnpm --filter @olora/web exec tsc --noEmit 2>&1 | grep -q "error TS"; then
    log_error "前端类型检查失败"
    pnpm --filter @olora/web exec tsc --noEmit
    exit 1
else
    log_success "前端类型检查通过"
fi

cd ..

echo ""

# ============================================
# 6. 单元测试
# ============================================
if [ "$MODE" = "--full" ]; then
    log_info "Step 6/7: 运行单元测试..."

    cd olora

    # 后端单元测试
    log_info "运行后端单元测试..."
    if pnpm --filter @olora/backend test --passWithNoTests --silent 2>&1 | grep -q "FAIL"; then
        log_error "后端单元测试失败"
        pnpm --filter @olora/backend test
        exit 1
    else
        log_success "后端单元测试通过"
    fi

    cd ..
else
    log_info "Step 6/7: 跳过单元测试 (使用 --full 运行完整测试)"
fi

echo ""

# ============================================
# 7. 构建验证
# ============================================
if [ "$MODE" = "--full" ]; then
    log_info "Step 7/7: 构建验证..."

    cd olora

    # 后端构建
    log_info "构建后端..."
    if pnpm --filter @olora/backend build 2>&1 | grep -q "error"; then
        log_error "后端构建失败"
        pnpm --filter @olora/backend build
        exit 1
    else
        log_success "后端构建成功"
    fi

    # 前端构建
    log_info "构建前端..."
    if pnpm --filter @olora/web build 2>&1 | grep -q "Error"; then
        log_error "前端构建失败"
        pnpm --filter @olora/web build
        exit 1
    else
        log_success "前端构建成功"
    fi

    cd ..
else
    log_info "Step 7/7: 跳过构建验证 (使用 --full 运行完整构建)"
fi

echo ""

# ============================================
# 总结
# ============================================
echo "============================================"
log_success "验证完成! ✨"
echo "============================================"
echo ""

if [ "$MODE" = "--fast" ]; then
    log_info "快速验证通过。运行完整验证: ./.automate/verify.sh --full"
else
    log_success "完整验证通过! 代码已准备好提交。"
fi

echo ""
