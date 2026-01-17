const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'olora-jwt-secret-key-2025';
const SALT_ROUNDS = 10;

class AuthService {
  /**
   * 注册新用户
   */
  async register(data) {
    try {
      const { email, password, name } = data;

      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          message: '该邮箱已被注册',
        };
      }

      // Hash密码
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // 创建用户
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'user',
        },
      });

      // 生成JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: '注册失败: ' + error.message,
      };
    }
  }

  /**
   * 用户登录
   */
  async login(data) {
    try {
      const { email, password } = data;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: '用户不存在',
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: '账户已被停用',
        };
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: '密码错误',
        };
      }

      // 生成JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: '登录失败: ' + error.message,
      };
    }
  }

  /**
   * 验证JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

module.exports = new AuthService();
