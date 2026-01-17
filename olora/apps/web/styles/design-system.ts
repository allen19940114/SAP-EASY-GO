// 🎨 OLORA 现代化玻璃质感设计系统
// AI科技风格 + 玻璃态设计 (Glassmorphism)

export const designSystem = {
  // 🌈 色彩系统 - AI科技渐变
  colors: {
    // 主色调 - 科技蓝紫渐变
    primary: {
      50: '#f0f4ff',
      100: '#e0eaff',
      200: '#c7d7fe',
      300: '#a4bbfc',
      400: '#8098f9',
      500: '#6366f1',  // 主色
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      glow: '0 0 30px rgba(102, 126, 234, 0.3)',
    },

    // 副色调 - 青色
    secondary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
    },

    // 强调色 - 紫红色
    accent: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      pink: '#f093fb',
      red: '#f5576c',
    },

    // 成功/警告/错误
    status: {
      success: '#10b981',
      successLight: '#d1fae5',
      warning: '#f59e0b',
      warningLight: '#fef3c7',
      error: '#ef4444',
      errorLight: '#fee2e2',
      info: '#3b82f6',
      infoLight: '#dbeafe',
    },

    // 中性色
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // 背景渐变
    background: {
      light: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      dark: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      mesh: `
        radial-gradient(at 40% 20%, rgba(102, 126, 234, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(118, 75, 162, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(0, 210, 255, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(240, 147, 251, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(102, 126, 234, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 100%, rgba(118, 75, 162, 0.15) 0px, transparent 50%)
      `,
    },
  },

  // 🪟 玻璃态效果
  glass: {
    // 标准玻璃卡片
    card: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    },

    // 深色玻璃
    cardDark: {
      background: 'rgba(17, 25, 40, 0.75)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.125)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },

    // 侧边栏玻璃
    sidebar: {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(25px) saturate(200%)',
      WebkitBackdropFilter: 'blur(25px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '4px 0 24px 0 rgba(31, 38, 135, 0.1)',
    },

    // 顶部栏玻璃
    header: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(15px) saturate(180%)',
      WebkitBackdropFilter: 'blur(15px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.08)',
    },

    // 输入框玻璃
    input: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.1)',
    },
  },

  // 🎭 阴影系统
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(102, 126, 234, 0.4)',
    glowHover: '0 0 30px rgba(102, 126, 234, 0.6)',
  },

  // 📏 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // 🔤 字体系统
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // 📐 圆角系统
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  // ⚡ 动画系统
  animations: {
    // 过渡时长
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },

    // 缓动函数
    easing: {
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // 关键帧动画
    keyframes: {
      fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
      slideIn: `
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `,
      pulse: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `,
      shimmer: `
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `,
      float: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `,
      glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
        }
      `,
    },
  },

  // 🎯 组件预设样式
  components: {
    // 按钮
    button: {
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.3)',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px 0 rgba(102, 126, 234, 0.5)',
        },
      },

      secondary: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        color: '#667eea',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ':hover': {
          background: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#667eea',
        },
      },

      ghost: {
        background: 'transparent',
        color: '#667eea',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ':hover': {
          background: 'rgba(102, 126, 234, 0.1)',
        },
      },
    },

    // 卡片
    card: {
      default: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
      },
    },

    // 输入框
    input: {
      default: {
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '16px',
        color: '#333',
        outline: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ':focus': {
          border: '1px solid #667eea',
          boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        },
      },
    },

    // 徽章
    badge: {
      success: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      },

      warning: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      },

      error: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      },

      info: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      },
    },
  },

  // 🌊 特效
  effects: {
    // 悬停发光
    hoverGlow: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ':hover': {
        boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)',
      },
    },

    // 脉冲动画
    pulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },

    // 浮动动画
    float: {
      animation: 'float 3s ease-in-out infinite',
    },

    // 闪烁效果
    shimmer: {
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite',
    },
  },
};

// 🎨 工具函数
export const utils = {
  // 创建玻璃态样式
  createGlass: (opacity = 0.7, blur = 20) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }),

  // 创建渐变背景
  createGradient: (color1: string, color2: string, deg = 135) =>
    `linear-gradient(${deg}deg, ${color1} 0%, ${color2} 100%)`,

  // 创建发光效果
  createGlow: (color: string, intensity = 0.4) =>
    `0 0 20px ${color.replace('rgb', 'rgba').replace(')', `, ${intensity})`)}`,

  // 响应式断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default designSystem;
